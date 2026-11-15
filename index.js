/**
 * Host half of the English writing trainer.
 *
 * The Client panel owns the topic bank and the learner's progress. This half owns
 * the only thing the browser cannot do by itself: one strict, rubric-bound model
 * call for feedback or for generating a fresh topic. It talks to the same provider
 * and model the current Agent uses, through `ctx.llm`.
 */
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

export const inject = ['llm', 'webServer']

const PREFIX = '/english-writing'
const BUILD = 'v1'
const REQUEST_TIMEOUT_MS = 150000

/* Training progress lives in a file under DSH_HOME, so it follows the machine
 * instead of the browser: the desktop window, a phone browser and a tunnel URL
 * that changes on every restart all read and write the same records. The
 * browser still keeps a localStorage copy as an offline cache (fast first
 * paint, and progress survives if this host is unreachable). */
const STATE_FILE = 'english-writing-state.json'
const STATE_MAX_BYTES = 2 * 1024 * 1024
const HISTORY_LIMIT = 80
const EXAM_LIMIT = 20
const TOPIC_LIMIT = 40

const KIND_LABEL = {
  big: '英语二大作文（图表作文，满分 15 分）',
  small: '英语二小作文（应用文，满分 10 分）',
  translation: '英语二翻译（英译汉，满分 15 分）',
}

const ITEM_LABEL = {
  'big-p1': '大作文第一段：图表描述',
  'big-p2': '大作文第二段：原因分析',
  'big-p3': '大作文第三段：评论建议',
  'small-p1': '小作文第一段：点明目的',
  'small-p2': '小作文第二段：展开细节',
  'small-p3': '小作文第三段：礼貌收尾',
  translation: '翻译：英译汉段落',
}

const SEGMENT_TASK = {
  'big-p1': '只写图表描述段：总体趋势 + 关键数据对比 + 一句过渡。不要分析原因，不要写建议。',
  'big-p2': '只写原因分析段：给出两个有说服力的原因，并用逻辑或事实支撑。不要重复描述图表。',
  'big-p3': '只写评论/建议/预测段：回扣主题，给出可操作建议或合理预测，收束全文。',
  'small-p1': '只写应用文开头段：说明写信/通知目的，交代必要背景，语气符合对象和场景。',
  'small-p2': '只写应用文主体段：把时间、地点、活动内容、要求等细节讲清楚，衔接自然。',
  'small-p3': '只写应用文结尾段：表达期待、感谢或歉意，礼貌收尾，不使用模板化空话堆砌。',
  translation: '翻译整段英文：先理解句群，再按中文表达习惯重组，注意长句拆分、被动语态和专有名词。',
}

const SYSTEM_EVALUATOR = `你是一位考研英语二阅卷组资深教师，长期参加写作与翻译评卷，熟悉《全国硕士研究生招生考试英语（二）考试大纲》的评分标准。
你的任务是严格、具体、可执行地批改学生的练习，而不是泛泛鼓励。
评分维度：
- 写作：内容要点是否完整、组织衔接是否清晰、语言是否准确、词汇与句式是否丰富、语域与格式是否得体。
- 翻译：理解是否准确、中文表达是否通顺、句间衔接是否自然、语言是否规范。
你必须只输出一个 JSON 对象。不要输出 Markdown 代码围栏，不要输出 JSON 之外的任何解释文字。
JSON 中的中文要自然、具体；引用学生原句时保持原样。`

const SYSTEM_TOPIC = `你是考研英语二命题教师。你熟悉英语二大作文（图表作文）、小作文（应用文）和翻译的命题规律。
你只输出一个 JSON 对象，不要输出 Markdown 代码围栏，不要输出 JSON 之外的任何文字。
题目必须原创、贴近真题风格、数据自洽、适合课堂训练，不得照抄任何现有真题原文。`

function json(res, status, body) {
  const text = JSON.stringify(body)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(text),
  })
  res.end(text)
}

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  if (chunks.length === 0) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    return {}
  }
}

function textOf(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function listOf(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === 'string' && item.trim()) : []
}

function statePath() {
  const home = process.env.DSH_HOME || join(homedir(), '.dsh')
  return join(home, STATE_FILE)
}

async function readState() {
  try {
    const raw = await readFile(statePath(), 'utf8')
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { state: null, updatedAt: 0 }
    return { state: parsed, updatedAt: Number(parsed.updatedAt) || 0 }
  } catch {
    /* no file yet, or unreadable: the browser cache is still the source */
    return { state: null, updatedAt: 0 }
  }
}

async function writeState(input) {
  const source = input && typeof input === 'object' ? input : {}
  const state = {
    version: 1,
    items: source.items && typeof source.items === 'object' ? source.items : {},
    history: Array.isArray(source.history) ? source.history.slice(0, HISTORY_LIMIT) : [],
    exams: Array.isArray(source.exams) ? source.exams.slice(0, EXAM_LIMIT) : [],
    customTopics: Array.isArray(source.customTopics) ? source.customTopics.slice(0, TOPIC_LIMIT) : [],
    updatedAt: Date.now(),
  }
  const text = JSON.stringify(state)
  if (Buffer.byteLength(text, 'utf8') > STATE_MAX_BYTES) {
    throw new Error('训练记录体积过大，未保存到磁盘。')
  }
  const target = statePath()
  await mkdir(dirname(target), { recursive: true })
  const tmp = `${target}.${process.pid}.tmp`
  await writeFile(tmp, text, 'utf8')
  await rename(tmp, target)
  return state
}

async function pickModel(ctx) {
  try {
    const selection = ctx.get('agentDefaultModel')?.currentSelection?.()
    if (selection && selection.provider && selection.model) {
      return { provider: selection.provider, model: selection.model }
    }
  } catch {
    /* fall through to the first registered route */
  }
  const providers = ctx.llm.listProviders()
  for (const provider of providers) {
    try {
      const models = await ctx.llm.listModels(provider.id)
      if (models.length > 0) return { provider: provider.id, model: models[0].id }
    } catch {
      /* try the next route */
    }
  }
  if (providers.length > 0) return { provider: providers[0].id, model: 'deepseek-flash' }
  throw new Error('当前 Profile 没有可用的模型路由，请先在设置中登录或配置模型。')
}

function extractJson(raw) {
  let text = String(raw || '').trim()
  if (!text) return null
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
  try {
    return JSON.parse(text)
  } catch {
    /* locate the outermost object below */
  }
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start >= 0 && end > start) {
    const slice = text.slice(start, end + 1)
    try {
      return JSON.parse(slice)
    } catch {
      /* give up; the Client will fall back to local diagnostics */
    }
  }
  return null
}

async function effortFor(ctx, provider, model) {
  try {
    const info = await ctx.llm.resolveModelInfo(provider, model)
    const efforts = info && info.reasoning && Array.isArray(info.reasoning.efforts) ? info.reasoning.efforts : []
    if (!efforts.length) return undefined
    const low = efforts.find((effort) => effort.id === 'low')
    return low ? low.id : efforts[0].id
  } catch {
    return undefined
  }
}

async function complete(ctx, system, user, maxTokens) {
  const { provider, model } = await pickModel(ctx)
  const reasoningEffort = await effortFor(ctx, provider, model)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  let raw = ''
  let blockText = ''
  let failure = null
  let finishKind = ''
  let usage = null
  try {
    const stream = ctx.llm.stream({
      provider,
      model,
      system,
      messages: [{ role: 'user', content: [{ type: 'text', text: user }] }],
      temperature: 0.2,
      ...(reasoningEffort ? { reasoningEffort } : {}),
      maxTokens: Math.max(maxTokens, 6000),
      signal: controller.signal,
    })
    for await (const chunk of stream) {
      if (chunk.type === 'text-delta') {
        raw += chunk.text
      } else if (chunk.type === 'block-end') {
        if (chunk.block && chunk.block.type === 'text') blockText += chunk.block.text
      } else if (chunk.type === 'usage') {
        usage = chunk.usage
      } else if (chunk.type === 'finish') {
        finishKind = chunk.reason.kind
        if (chunk.reason.kind === 'error' || chunk.reason.kind === 'aborted') {
          failure = chunk.reason.failure
        }
      }
    }
  } catch (error) {
    if (controller.signal.aborted) throw new Error('模型请求超时，请稍后重试。')
    throw error
  } finally {
    clearTimeout(timer)
  }
  if (failure) {
    throw new Error(`${failure.code || 'LLM_ERROR'}${failure.message ? `：${failure.message}` : ''}`)
  }
  const text = raw || blockText
  if (!text.trim()) {
    const used = usage ? `，输出 ${usage.outputTokens || 0} tokens` : ''
    throw new Error(
      `模型返回了空内容（finish=${finishKind || 'none'}${used}）。请稍后重试，或在设置中换一个模型。`,
    )
  }
  return { raw: text, parsed: extractJson(text), provider, model }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function roundHalf(value) {
  return Math.round(value * 2) / 2
}

function normalizeRubric(input, maxScore) {
  if (!Array.isArray(input)) return []
  return input
    .filter((row) => row && typeof row === 'object')
    .slice(0, 6)
    .map((row) => {
      const max = Number(row.max)
      const score = Number(row.score)
      return {
        criterion: textOf(row.criterion, '评分项'),
        score: Number.isFinite(score) ? clamp(score, 0, Number.isFinite(max) && max > 0 ? max : maxScore) : 0,
        max: Number.isFinite(max) && max > 0 ? max : Math.max(1, Math.round(maxScore / 4)),
        comment: textOf(row.comment),
      }
    })
}

function normalizeIssues(input) {
  if (!Array.isArray(input)) return []
  return input
    .filter((row) => row && typeof row === 'object')
    .slice(0, 8)
    .map((row) => ({
      quote: textOf(row.quote),
      problem: textOf(row.problem, '需要改进'),
      fix: textOf(row.fix, '按高分表达重写这一处。'),
    }))
}

function normalizeReusable(input) {
  if (!Array.isArray(input)) return []
  return input
    .filter((row) => row && typeof row === 'object')
    .slice(0, 8)
    .map((row) => ({
      expression: textOf(row.expression),
      meaning: textOf(row.meaning),
      usage: textOf(row.usage),
    }))
    .filter((row) => row.expression)
}

function normalizeSections(input) {
  if (!Array.isArray(input)) return []
  return input
    .filter((row) => row && typeof row === 'object')
    .slice(0, 6)
    .map((row) => ({
      part: textOf(row.part, '段落'),
      comment: textOf(row.comment),
    }))
}

function normalizeEvaluation(parsed, maxScore) {
  const rawScore = Number(parsed && parsed.score)
  const score = Number.isFinite(rawScore) ? roundHalf(clamp(rawScore, 0, maxScore)) : null
  const threshold = roundHalf(maxScore * 0.8)
  return {
    score,
    maxScore,
    threshold,
    highScore: score !== null && score >= threshold,
    band: textOf(parsed && parsed.band),
    summary: textOf(parsed && parsed.summary, '已完成批改。'),
    rubric: normalizeRubric(parsed && parsed.rubric, maxScore),
    strengths: listOf(parsed && parsed.strengths).slice(0, 6),
    issues: normalizeIssues(parsed && parsed.issues),
    revised: textOf(parsed && parsed.revised),
    reusable: normalizeReusable(parsed && parsed.reusable),
    sectionComments: normalizeSections(parsed && parsed.sectionComments),
    nextStep: textOf(parsed && parsed.nextStep),
  }
}

function topicBrief(topic) {
  const lines = []
  if (!topic || typeof topic !== 'object') return '（题目信息缺失）'
  if (topic.kindLabel) lines.push(`题型：${topic.kindLabel}`)
  if (topic.chartType) lines.push(`图表类型：${topic.chartType}`)
  if (topic.letterType) lines.push(`应用文类型：${topic.letterType}`)
  if (topic.year) lines.push(`年份：${topic.year}`)
  if (topic.titleZh) lines.push(`中文标题：${topic.titleZh}`)
  if (topic.title) lines.push(`英文标题：${topic.title}`)
  if (topic.directions) lines.push(`题目说明：${topic.directions}`)
  if (Array.isArray(topic.data) && topic.data.length) lines.push(`图表数据：${topic.data.join('；')}`)
  if (topic.scenario) lines.push(`情景：${topic.scenario}`)
  if (topic.recipient) lines.push(`写作对象：${topic.recipient}`)
  if (Array.isArray(topic.keyPoints) && topic.keyPoints.length) lines.push(`内容要点：${topic.keyPoints.join('；')}`)
  if (topic.passage) lines.push(`翻译原文：${topic.passage}`)
  if (Array.isArray(topic.referencePoints) && topic.referencePoints.length) {
    lines.push(`参考要点：${topic.referencePoints.join('；')}`)
  }
  return lines.join('\n')
}

function guidanceFor(topic, itemId) {
  if (!topic || typeof topic !== 'object' || !topic.guidance) return ''
  if (itemId === 'translation') return textOf(topic.guidance.translation)
  if (itemId === 'big-p1') return textOf(topic.guidance.p1)
  if (itemId === 'big-p2') return textOf(topic.guidance.p2)
  if (itemId === 'big-p3') return textOf(topic.guidance.p3)
  if (itemId === 'small-p1') return textOf(topic.guidance.p1)
  if (itemId === 'small-p2') return textOf(topic.guidance.p2)
  if (itemId === 'small-p3') return textOf(topic.guidance.p3)
  return ''
}

function segmentPrompt(body) {
  const itemId = textOf(body.itemId, 'big-p1')
  const kind = ['big', 'small', 'translation'].includes(body.kind) ? body.kind : 'big'
  const topic = body.topic
  const text = textOf(body.text)
  const attempt = Math.max(1, Number(body.attempt) || 1)
  const recent = Array.isArray(body.recentScores) ? body.recentScores.filter((n) => Number.isFinite(Number(n))).slice(-5) : []
  const maxScore = 10
  return `请批改一份考研英语二的分段练习。

【训练项目】${ITEM_LABEL[itemId] || itemId}
【题型】${KIND_LABEL[kind] || kind}
【本段任务】${SEGMENT_TASK[itemId] || '按题目要求完成本段。'}
【题目信息】
${topicBrief(topic)}
【本段专项提示】${guidanceFor(topic, itemId) || '无'}
【这是该项目的第 ${attempt} 次提交】${recent.length ? `最近有效得分：${recent.join('、')}` : '此前还没有有效得分。'}

【学生本段原文】
<<<
${text}
>>>

请按考研英语二的评分标准批改。分段练习采用 10 分制，高分线为 8 分。评分项建议为：内容达成 3 分、组织衔接 2 分、语言准确 3 分、词汇句式 2 分（翻译则为：理解 3 分、中文表达 3 分、衔接 2 分、语言规范 2 分）。
必须指出具体问题，并给出可直接替换的改法；改写段要保留学生原意，但达到 8 分以上水平。
只输出以下 JSON：
{
  "score": 0-10 的数字,
  "band": "例如：第五档 / 第四档",
  "summary": "一句话总评",
  "rubric": [{"criterion":"评分项","score":0,"max":0,"comment":"具体判断"}],
  "strengths": ["做得好的地方，最多 4 条"],
  "issues": [{"quote":"学生原句","problem":"问题","fix":"可直接替换的改法"}],
  "revised": "修改后的本段",
  "reusable": [{"expression":"可复用表达","meaning":"中文含义","usage":"适用场景"}],
  "nextStep": "换题后最该练的一个点"
}`
}

function fullPrompt(body) {
  const kind = ['big', 'small', 'translation'].includes(body.kind) ? body.kind : 'big'
  const maxScore = kind === 'small' ? 10 : 15
  const text = textOf(body.text)
  const topic = body.topic
  const dimensions =
    kind === 'translation'
      ? '理解准确 4 分、中文表达 4 分、衔接连贯 3 分、语言规范 4 分'
      : kind === 'small'
        ? '内容要点 4 分、格式与语域 2 分、语言准确 2 分、衔接与得体 2 分'
        : '内容完整性 5 分、组织衔接 4 分、语言准确 3 分、词汇句式 3 分'
  return `请按考研英语二整篇评分标准批改下面这份完整作答。

【题型】${KIND_LABEL[kind] || kind}
【题目信息】
${topicBrief(topic)}

【学生完整作答】
<<<
${text}
>>>

满分 ${maxScore} 分，高分线为 ${roundHalf(maxScore * 0.8)} 分。评分维度：${dimensions}。
请给出档次判断、逐段评价、具体语言问题、可执行的修改建议，以及一段达到高分水平的改写（可只改写最需要改的 2—3 个句子，但要在 revised 中说明）。
只输出以下 JSON：
{
  "score": 0-${maxScore} 的数字,
  "band": "例如：第五档（13—15 分）",
  "summary": "总体评价",
  "rubric": [{"criterion":"评分项","score":0,"max":0,"comment":"具体判断"}],
  "sectionComments": [{"part":"第一段","comment":"该段的具体评价"}],
  "strengths": ["优点，最多 4 条"],
  "issues": [{"quote":"学生原句","problem":"问题","fix":"可直接替换的改法"}],
  "revised": "改写示范或关键句改写",
  "reusable": [{"expression":"可复用表达","meaning":"中文含义","usage":"适用场景"}],
  "nextStep": "下一阶段最该补的一个点"
}`
}

async function evaluate(ctx, body) {
  const mode = body.mode === 'full' ? 'full' : 'segment'
  const kind = ['big', 'small', 'translation'].includes(body.kind) ? body.kind : 'big'
  const text = textOf(body.text)
  if (text.length < 10) throw new Error('作答内容太短，至少写一句话再提交。')
  if (text.length > 12000) throw new Error('作答内容过长，请控制在 12000 字符以内。')
  const maxScore = mode === 'full' ? (kind === 'small' ? 10 : 15) : 10
  const prompt = mode === 'full' ? fullPrompt(body) : segmentPrompt(body)
  const result = await complete(ctx, SYSTEM_EVALUATOR, prompt, mode === 'full' ? 3200 : 2400)
  return {
    mode,
    kind,
    maxScore,
    evaluation: result.parsed ? normalizeEvaluation(result.parsed, maxScore) : null,
    raw: result.parsed ? undefined : result.raw,
    model: `${result.provider}/${result.model}`,
  }
}

function numberList(value) {
  return Array.isArray(value)
    ? value
        .map((item) => {
          if (typeof item === 'number') return item
          const parsed = Number(String(item).replace(/[^0-9.-]/g, ''))
          return Number.isFinite(parsed) ? parsed : 0
        })
        .map((item) => (Number.isFinite(item) ? item : 0))
    : []
}

function normalizeChart(input) {
  if (!input || typeof input !== 'object') return undefined
  const type = ['bar', 'line', 'pie', 'table'].includes(input.type) ? input.type : 'bar'
  if (type === 'pie') {
    const labels = listOf(input.labels)
    const values = numberList(input.values)
    if (!labels.length || labels.length !== values.length) return undefined
    return { type: 'pie', labels, values, unit: textOf(input.unit, '%') }
  }
  if (type === 'table') {
    const columns = listOf(input.columns)
    const rows = Array.isArray(input.rows)
      ? input.rows
          .filter((row) => Array.isArray(row) && row.length)
          .map((row) => row.map((cell) => String(cell)))
      : []
    if (!columns.length || !rows.length) return undefined
    return { type: 'table', columns, rows }
  }
  const labels = listOf(input.labels)
  const series = Array.isArray(input.series)
    ? input.series
        .filter((row) => row && typeof row === 'object')
        .map((row, index) => ({
          name: textOf(row.name, `Series ${index + 1}`),
          values: numberList(row.values),
          unit: textOf(row.unit),
          axis: row.axis === 'right' ? 'right' : 'left',
        }))
        .filter((row) => row.values.length === labels.length)
    : []
  if (!labels.length || !series.length) return undefined
  return {
    type,
    labels,
    series,
    yLabel: textOf(input.yLabel),
    rightLabel: textOf(input.rightLabel),
  }
}

function normalizeGeneratedTopic(parsed, kind) {
  const base = {
    id: `ai-${Date.now().toString(36)}`,
    source: 'ai',
    kind,
    year: '',
    aiGenerated: true,
  }
  if (kind === 'translation') {
    return {
      ...base,
      title: textOf(parsed.title, 'Translation practice'),
      titleZh: textOf(parsed.titleZh, 'AI 生成翻译练习'),
      passage: textOf(parsed.passage),
      referencePoints: listOf(parsed.referencePoints).slice(0, 8),
      directions:
        textOf(parsed.directions) ||
        'Translate the following passage from English into Chinese. Write your translation on ANSWER SHEET 2.',
      guidance: {
        translation: textOf(parsed.guidance && parsed.guidance.translation, SEGMENT_TASK.translation),
      },
    }
  }
  if (kind === 'small') {
    return {
      ...base,
      title: textOf(parsed.title, 'A letter'),
      titleZh: textOf(parsed.titleZh, 'AI 生成小作文'),
      letterType: textOf(parsed.letterType, '建议信'),
      scenario: textOf(parsed.scenario),
      recipient: textOf(parsed.recipient, 'your friend'),
      keyPoints: listOf(parsed.keyPoints).slice(0, 6),
      directions:
        textOf(parsed.directions) ||
        'Write a letter in about 100 words. Do not sign your own name at the end of the letter. Use "Li Ming" instead.',
      guidance: {
        p1: textOf(parsed.guidance && parsed.guidance.p1, SEGMENT_TASK['small-p1']),
        p2: textOf(parsed.guidance && parsed.guidance.p2, SEGMENT_TASK['small-p2']),
        p3: textOf(parsed.guidance && parsed.guidance.p3, SEGMENT_TASK['small-p3']),
      },
    }
  }
  return {
    ...base,
    title: textOf(parsed.title, 'A chart'),
    titleZh: textOf(parsed.titleZh, 'AI 生成大作文'),
    chartType: textOf(parsed.chartType, '柱状图'),
    data: listOf(parsed.data).slice(0, 6),
    chart: normalizeChart(parsed.chart),
    directions:
      textOf(parsed.directions) ||
      'In this section, you are asked to write an essay based on the following chart. In your writing, you should 1) interpret the chart, and 2) give your comments. You should write at least 150 words.',
    guidance: {
      p1: textOf(parsed.guidance && parsed.guidance.p1, SEGMENT_TASK['big-p1']),
      p2: textOf(parsed.guidance && parsed.guidance.p2, SEGMENT_TASK['big-p2']),
      p3: textOf(parsed.guidance && parsed.guidance.p3, SEGMENT_TASK['big-p3']),
    },
  }
}

async function generateTopic(ctx, body) {
  const kind = ['big', 'small', 'translation'].includes(body.kind) ? body.kind : 'big'
  const avoid = listOf(body.avoid).slice(0, 12)
  const chartType = textOf(body.chartType)
  const prompt =
    kind === 'translation'
      ? `请生成一道考研英语二翻译练习题。原文约 130—150 个英文单词，题材为校园、社会、科技、环境、文化或生活，难度贴近英语二，不要照抄真题。只输出 JSON：
{
  "title": "English title",
  "titleZh": "中文标题",
  "passage": "英文原文，约 130—150 词",
  "referencePoints": ["评分参考要点 1", "评分参考要点 2", "长难句或关键表达"],
  "guidance": {"translation": "本题翻译提示"}
}`
      : kind === 'small'
        ? `请生成一道考研英语二小作文题。类型从建议信、邀请信、感谢信、道歉信、投诉信、通知、推荐信中选一个，情景真实，内容要点 3—4 个，不要照抄真题。只输出 JSON：
{
  "title": "English title",
  "titleZh": "中文标题",
  "letterType": "建议信",
  "scenario": "中文情景说明",
  "recipient": "写作对象",
  "keyPoints": ["要点 1", "要点 2", "要点 3"],
  "directions": "英文题目说明，含约 100 words 与 Li Ming 署名要求",
  "guidance": {"p1": "第一段写法", "p2": "第二段写法", "p3": "第三段写法"}
}`
        : `请生成一道考研英语二大作文题。图表类型优先 ${chartType || '柱状图、折线图、饼图中的一种'}，主题围绕中国经济、社会、教育、科技、环保或大学生生活，数据要自洽，不要照抄真题。只输出 JSON：
{
  "title": "English chart title",
  "titleZh": "中文标题",
  "chartType": "柱状图",
  "data": ["2019 年：……", "2021 年：……", "2023 年：……"],
  "chart": {
    "type": "bar",
    "labels": ["2019", "2021", "2023"],
    "series": [{"name": "比例", "values": [12, 35, 68], "unit": "%", "axis": "left"}],
    "yLabel": "比例（%）"
  },
  "directions": "英文题目说明，含 interpret the chart 与 give your comments，至少 150 words",
  "guidance": {"p1": "第一段写法", "p2": "第二段写法", "p3": "第三段写法"}
}
饼图请把 chart 写成 {"type":"pie","labels":[...],"values":[...],"unit":"%"}；折线图请把 type 写成 "line"，双轴时给 series 加 "axis":"right"。`
  const suffix = avoid.length ? `\n请避开这些已有题目：${avoid.join('；')}` : ''
  const result = await complete(ctx, SYSTEM_TOPIC, prompt + suffix, 1600)
  if (!result.parsed) throw new Error('题目生成结果不是合法 JSON，请重试。')
  return {
    topic: normalizeGeneratedTopic(result.parsed, kind),
    model: `${result.provider}/${result.model}`,
  }
}

async function handle(req, res, ctx) {
  const url = new URL(req.url || '/', 'http://127.0.0.1')
  const route = url.pathname.slice(url.pathname.startsWith(PREFIX) ? PREFIX.length : 0) || '/'
  const method = (req.method || 'GET').toUpperCase()

  try {
    if (route === '/health' && method === 'GET') {
      return json(res, 200, { ok: true, build: BUILD, prefix: PREFIX })
    }
    if (route === '/state' && method === 'GET') {
      const { state, updatedAt } = await readState()
      return json(res, 200, { ok: true, state, updatedAt })
    }
    if (route === '/state' && method === 'PUT') {
      const body = await readBody(req)
      const state = await writeState(body && body.state)
      return json(res, 200, { ok: true, updatedAt: state.updatedAt })
    }
    if (route === '/evaluate' && method === 'POST') {
      const body = await readBody(req)
      const payload = body && body.action === 'generate-topic' ? await generateTopic(ctx, body) : await evaluate(ctx, body)
      return json(res, 200, { ok: true, ...payload })
    }
    return json(res, 404, { ok: false, error: `未知接口 ${method} ${route}` })
  } catch (error) {
    return json(res, 502, { ok: false, error: String((error && error.message) || error) })
  }
}

export function apply(ctx) {
  ctx.effect(
    () => ctx.webServer.register({ kind: 'prefix', path: PREFIX, handler: (req, res) => handle(req, res, ctx) }),
    'english-writing-route',
  )
}
