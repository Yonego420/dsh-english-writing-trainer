window.__ModuleLoader__.load({
  id: 'dsh-english-writing-trainer',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useCallback, useEffect, useMemo, useRef, useState } = React

    const API = '/english-writing'
    const STORAGE_KEY = 'dsh.english-writing.v1'
    const DRAFT_KEY = 'dsh.english-writing.draft.v1'
    const STATE_API = API + '/state'
    const SYNC_DELAY_MS = 900

    /* ------------------------------------------------------------------ copy */

    const ZH = {
      'panel.title': '英语主观题训练',
      'panel.subtitle': '考研英语二 · 写作与翻译',
      'tab.train': '训练',
      'tab.exam': '综合检验',
      'tab.bank': '题库',
      'tab.history': '记录',
      'stat.items': '训练项目',
      'stat.attempts': '累计训练',
      'stat.avg': '平均得分率',
      'action.start': '开始训练',
      'action.back': '返回项目',
      'action.submit': '提交 AI 批改',
      'action.submitting': 'AI 批改中…',
      'action.nextTopic': '换一题继续',
      'action.changeTopic': '换题',
      'action.retry': '再写一版',
      'action.aiTopic': 'AI 出题',
      'action.aiTopicBusy': 'AI 出题中…',
      'action.copy': '复制',
      'action.practice': '去练这一段',
      'action.exam': '去综合检验',
      'action.reset': '清空全部记录',
      'action.confirmReset': '确认清空',
      'action.cancel': '取消',
      'action.refresh': '刷新',
      'label.topic': '题目',
      'label.task': '本段任务',
      'label.guidance': '写法提示',
      'label.answer': '你的作答',
      'label.feedback': 'AI 批改',
      'label.score': '得分',
      'label.rubric': '评分维度',
      'label.strengths': '做得好的地方',
      'label.issues': '具体问题与改法',
      'label.revised': '修改示范',
      'label.reusable': '可复用表达',
      'label.nextStep': '下一步',
      'label.freePractice': '自由训练',
      'label.best': '最高分',
      'label.local': '本地诊断',
      'label.ai': 'AI 批改',
      'label.noHistory': '还没有训练记录。先选一个项目，写下第一段。',
      'label.noTopics': '这个来源下暂时没有题目，试试 AI 出题。',
      'label.loading': '加载中…',
      'label.thinking': '正在按考研评分标准分析，通常需要 10—30 秒。',
      'label.error': '出错了',
      'label.sourceReal': '真题',
      'label.sourceAI': 'AI 题',
      'label.year': '年份',
      'label.words': '词',
      'label.chars': '字',
      'label.target': '目标',
      'label.part': '第',
      'label.passage': '翻译原文',
      'label.keyPoints': '内容要点',
      'label.scenario': '情景',
      'label.examReady': '可随时作答',
      'label.fullExam': '综合检验',
      'label.highThisTime': '本次得分达到 80% 以上，表现不错，可以继续换题巩固。',
      'label.lowThisTime': '本次得分低于 80%，建议按上面的改法再练一版。',
      'label.history': '训练记录',
      'label.exams': '综合检验记录',
      'label.clearConfirm': '确定要清空全部训练和综合检验记录吗？这个操作不可撤销。',
      'label.noExam': '还没有综合检验记录。',
      'label.timer': '建议用时',
      'label.bankAll': '全部',
      'label.bankBig': '大作文',
      'label.bankSmall': '小作文',
      'label.bankTrans': '翻译',
      'label.aiGenerated': 'AI 生成',
      'label.realNote': '真题 · 回忆整理',
      'label.model': '模型',
      'label.copyDone': '已复制',
      'label.copyFail': '复制失败，请手动选择',
      'label.tooShort': '内容还太短，再展开一点。',
      'label.examTooShort': '整篇作答太短，先完整写出来再提交。',
      'label.chooseTopic': '选择题目',
      'label.openBank': '浏览题库',
      'label.heroTitle': '把每一段，练到稳定高分',
      'label.heroDesc': '选项目 → 写一段 → AI 按考研英语二标准批改 → 换题继续。不限顺序，也不设通关门槛；想检验时直接做整篇。',
      'label.localNotice': 'AI 服务暂不可用，本次使用本地规则诊断；分数只作参考。',
      'label.retryAI': '重新请求 AI',
      'label.goExam': '去综合检验',
      'label.examIntro': '所有整篇检验均可直接开始，按考研英语二评分标准打分，给出档次、逐段评价和改写建议。',
      'label.examSelect': '选择检验项目',
      'label.examWrite': '完整作答',
      'label.examSubmit': '提交整篇检验',
      'label.examSubmitting': '整篇批改中…',
      'label.examResult': '整篇检验结果',
      'label.wordTarget': '建议',
    }

    const EN = {
      'panel.title': 'English writing trainer',
      'panel.subtitle': 'Postgraduate English II · Writing & translation',
      'tab.train': 'Practice',
      'tab.exam': 'Mock exam',
      'tab.bank': 'Topics',
      'tab.history': 'History',
      'stat.items': 'Practice items',
      'stat.attempts': 'Attempts',
      'stat.avg': 'Average',
      'action.start': 'Start',
      'action.back': 'Back',
      'action.submit': 'Get AI feedback',
      'action.submitting': 'Reviewing…',
      'action.nextTopic': 'Next topic',
      'action.changeTopic': 'Change topic',
      'action.retry': 'Rewrite',
      'action.aiTopic': 'Generate topic',
      'action.aiTopicBusy': 'Generating…',
      'action.copy': 'Copy',
      'action.practice': 'Practise this part',
      'action.exam': 'Mock exam',
      'action.reset': 'Clear all data',
      'action.confirmReset': 'Confirm clear',
      'action.cancel': 'Cancel',
      'action.refresh': 'Refresh',
      'label.topic': 'Topic',
      'label.task': 'Task',
      'label.guidance': 'Guidance',
      'label.answer': 'Your answer',
      'label.feedback': 'Feedback',
      'label.score': 'Score',
      'label.rubric': 'Rubric',
      'label.strengths': 'What works',
      'label.issues': 'Issues and fixes',
      'label.revised': 'Revised version',
      'label.reusable': 'Reusable language',
      'label.nextStep': 'Next step',
      'label.freePractice': 'Free practice',
      'label.best': 'Best',
      'label.local': 'Local check',
      'label.ai': 'AI feedback',
      'label.noHistory': 'No attempts yet. Pick a part and write your first paragraph.',
      'label.noTopics': 'No topics in this source. Try generating one.',
      'label.loading': 'Loading…',
      'label.thinking': 'Checking against the exam rubric. This usually takes 10–30 seconds.',
      'label.error': 'Something went wrong',
      'label.sourceReal': 'Past paper',
      'label.sourceAI': 'AI topic',
      'label.year': 'Year',
      'label.words': 'words',
      'label.chars': 'characters',
      'label.target': 'Target',
      'label.part': 'Part',
      'label.passage': 'Passage',
      'label.keyPoints': 'Key points',
      'label.scenario': 'Scenario',
      'label.examReady': 'Available now',
      'label.fullExam': 'Mock exam',
      'label.highThisTime': 'This attempt scored above 80%. Keep switching topics to consolidate.',
      'label.lowThisTime': 'This attempt scored below 80%. Use the feedback, revise, and try again.',
      'label.history': 'Practice history',
      'label.exams': 'Mock exams',
      'label.clearConfirm': 'Clear all practice and mock-exam records? This cannot be undone.',
      'label.noExam': 'No mock exam yet.',
      'label.timer': 'Suggested time',
      'label.bankAll': 'All',
      'label.bankBig': 'Big essay',
      'label.bankSmall': 'Short essay',
      'label.bankTrans': 'Translation',
      'label.aiGenerated': 'AI generated',
      'label.realNote': 'Past paper · recalled',
      'label.model': 'Model',
      'label.copyDone': 'Copied',
      'label.copyFail': 'Copy failed; select the text manually',
      'label.tooShort': 'Too short — develop it a little more.',
      'label.examTooShort': 'The full answer is too short. Write the whole piece first.',
      'label.chooseTopic': 'Choose a topic',
      'label.openBank': 'Browse topics',
      'label.heroTitle': 'Train every paragraph to a stable high score',
      'label.heroDesc': 'Pick a part, write it, get rubric-bound AI feedback, then switch topics. No fixed order and no mastery gate; take a full mock whenever you like.',
      'label.localNotice': 'AI is unavailable, so this result uses local rule-based diagnostics. Treat the score as a rough signal.',
      'label.retryAI': 'Ask AI again',
      'label.goExam': 'Go to mock exam',
      'label.examIntro': 'Every full mock is available immediately. It is scored against the English II rubric with a band, section comments and revision advice.',
      'label.examSelect': 'Choose a mock',
      'label.examWrite': 'Full answer',
      'label.examSubmit': 'Submit full essay',
      'label.examSubmitting': 'Marking the full paper…',
      'label.examResult': 'Mock exam result',
      'label.wordTarget': 'Target',
    }

    function makeT(ctx) {
      const dict = ctx && ctx.locale ? ctx.locale.bind('english-writing') : null
      return (key) => {
        if (dict) {
          const value = dict(key)
          if (value !== key) return value
        }
        return ZH[key] || key
      }
    }

    function useT(ctx) {
      const [, force] = React.useReducer((n) => n + 1, 0)
      useEffect(() => {
        if (!ctx || !ctx.locale) return undefined
        return ctx.locale.subscribe(force)
      }, [ctx])
      return makeT(ctx)
    }

    /* ------------------------------------------------------------------ items */

    const ITEMS = [
      {
        id: 'big-p1',
        kind: 'big',
        part: 1,
        group: 'big',
        title: '大作文 · 第一段',
        desc: '图表描述：总体趋势、关键数据、过渡句',
        glyph: 'chart',
        target: 60,
        targetText: '50—70 词',
      },
      {
        id: 'big-p2',
        kind: 'big',
        part: 2,
        group: 'big',
        title: '大作文 · 第二段',
        desc: '原因分析：两个原因，有逻辑、有支撑',
        glyph: 'bulb',
        target: 90,
        targetText: '80—100 词',
      },
      {
        id: 'big-p3',
        kind: 'big',
        part: 3,
        group: 'big',
        title: '大作文 · 第三段',
        desc: '评论建议：回扣主题，给出预测或建议',
        glyph: 'flag',
        target: 40,
        targetText: '30—50 词',
      },
      {
        id: 'small-p1',
        kind: 'small',
        part: 1,
        group: 'small',
        title: '小作文 · 第一段',
        desc: '点明写信目的，交代必要背景',
        glyph: 'mail',
        target: 35,
        targetText: '30—40 词',
      },
      {
        id: 'small-p2',
        kind: 'small',
        part: 2,
        group: 'small',
        title: '小作文 · 第二段',
        desc: '展开细节：时间、地点、内容、要求',
        glyph: 'list',
        target: 55,
        targetText: '50—60 词',
      },
      {
        id: 'small-p3',
        kind: 'small',
        part: 3,
        group: 'small',
        title: '小作文 · 第三段',
        desc: '表达期待、感谢或歉意，礼貌收尾',
        glyph: 'check',
        target: 25,
        targetText: '20—30 词',
      },
      {
        id: 'translation',
        kind: 'translation',
        part: 0,
        group: 'translation',
        title: '翻译 · 英译汉',
        desc: '整段翻译：理解、重组、中文表达',
        glyph: 'translate',
        target: 220,
        targetText: '约 220 字',
      },
    ]

    const ITEM_MAP = Object.fromEntries(ITEMS.map((item) => [item.id, item]))
    const GROUP_LABEL = { big: '大作文', small: '小作文', translation: '翻译' }
    const TARGETS = Object.fromEntries(ITEMS.map((item) => [item.id, item.target]))

    const BIG_DIRECTIONS =
      'In this section, you are asked to write an essay based on the following chart. In your writing, you should 1) interpret the chart, and 2) give your comments. You should write at least 150 words. Write your essay on ANSWER SHEET 2. (15 points)'
    const SMALL_DIRECTIONS =
      'Write a letter in about 100 words. Do not sign your own name at the end of the letter. Use "Li Ming" instead. Do not write the address. (10 points)'
    const TRANS_DIRECTIONS =
      'Translate the following passage from English into Chinese. Write your translation on ANSWER SHEET 2. (15 points)'

    const BIG_GUIDE = {
      p1: '先总述图表主题与总体趋势，再挑 2—3 个最关键的数据做对比，最后用一句过渡引出下文。不要在这一段分析原因。',
      p2: '给出两个原因，每个原因配一个事实、机制或例子；用 To begin with / In addition / Therefore 等衔接，避免只罗列观点。',
      p3: '回扣主题，给出建议、预测或评价；结尾要具体，避免空喊口号。',
    }

    const SMALL_GUIDE = {
      p1: '开门见山说明写信或通知目的，交代必要背景；语气要符合对象和场景。',
      p2: '把时间、地点、活动内容、要求等细节讲清楚；要点之间自然衔接，不要写成清单。',
      p3: '表达期待、感谢或歉意，礼貌收尾；避免模板化空话堆砌。',
    }

    /* --------------------------------------------------------------- topic bank */

    const TABLE_DIRECTIONS =
      'Write an essay based on the following table. In your writing, you should 1) describe the table, and 2) give your comments. You should write at least 150 words. Write your essay on ANSWER SHEET 2. (15 points)'

    const REAL_BIG = [
      {
        id: 'real-2010-big',
        source: 'real',
        year: 2010,
        kind: 'big',
        chartType: '柱状图',
        title: 'Mobile-phone subscriptions (2000–2008)',
        titleZh: '2000—2008 年发展中国家与发达国家的手机用户数量',
        data: [
          '2000 年：发展中国家与发达国家均约 5 亿',
          '2008 年：发展中国家约 40 亿，发达国家约 10 亿',
          '发展中国家增长约 7 倍，发达国家增长约 1 倍',
        ],
        directions: BIG_DIRECTIONS,
        note: '2010 年英语二大作文真题：柱状图对比发展中国家与发达国家的手机用户增长。',
        guidance: BIG_GUIDE,
      },
      {
        id: 'real-2011-big',
        source: 'real',
        year: 2011,
        kind: 'big',
        chartType: '柱状图',
        title: 'Market share of some brands in the domestic car market (2008–2009)',
        titleZh: '2008、2009 年国内轿车市场部分品牌市场份额示意图',
        data: [
          '2008 年：国产品牌约 26%，日系品牌约 35%，美系品牌约 12%',
          '2009 年：国产品牌约 32%，日系品牌约 26%，美系品牌约 13%',
          '国产品牌份额上升，日系品牌份额明显下降，美系品牌基本持平',
        ],
        directions: BIG_DIRECTIONS,
        note: '2011 年英语二大作文真题：柱状图比较国产品牌、日系品牌、美系品牌的市场份额变化。',
        guidance: BIG_GUIDE,
      },
      {
        id: 'real-2012-big',
        source: 'real',
        year: 2012,
        kind: 'big',
        chartType: '表格',
        title: 'A survey of employees’ job satisfaction',
        titleZh: '某公司员工工作满意度调查',
        data: [
          '≤40 岁：满意 16.7%，不清楚 50.0%，不满意 33.3%',
          '41—50 岁：满意 0.0%，不清楚 36.0%，不满意 64.0%',
          '>50 岁：满意 40.0%，不清楚 50.0%，不满意 10.0%',
        ],
        directions: TABLE_DIRECTIONS,
        note: '2012 年英语二大作文真题：表格按年龄组呈现员工工作满意度。',
        guidance: BIG_GUIDE,
      },
      {
        id: 'real-2013-big',
        source: 'real',
        year: 2013,
        kind: 'big',
        chartType: '柱状图',
        title: 'Part-time jobs among college students in four years',
        titleZh: '某高校学生兼职情况',
        data: [
          '大一：67.77%',
          '大二：71.13%',
          '大三：71.93%',
          '大四：88.24%',
        ],
        directions: BIG_DIRECTIONS,
        note: '2013 年英语二大作文真题：柱状图显示大学四年兼职比例持续上升。',
        guidance: BIG_GUIDE,
      },
      {
        id: 'real-2014-big',
        source: 'real',
        year: 2014,
        kind: 'big',
        chartType: '柱状图',
        title: 'China’s urban and rural population (1990–2010)',
        titleZh: '20 年间中国城镇人口与乡村人口变化图',
        data: [
          '1990 年：城镇 300 百万，乡村 834 百万',
          '2000 年：城镇 458 百万，乡村 807 百万',
          '2010 年：城镇 666 百万，乡村 674 百万',
        ],
        directions: BIG_DIRECTIONS,
        note: '2014 年英语二大作文真题：柱状图展示 20 年间中国城乡人口比重的变化。',
        guidance: BIG_GUIDE,
      },
      {
        id: 'real-2015-big',
        source: 'real',
        year: 2015,
        kind: 'big',
        chartType: '饼图',
        title: 'How residents in a city spent their Spring Festival holiday',
        titleZh: '我国某市居民春节假期花销比例',
        data: [
          '新年礼物：40%',
          '聚会吃饭：20%',
          '交通：20%',
          '其他：20%',
        ],
        directions: BIG_DIRECTIONS,
        note: '2015 年英语二大作文真题：饼图呈现春节假期消费结构。',
        guidance: BIG_GUIDE,
      },
      {
        id: 'real-2016-big',
        source: 'real',
        year: 2016,
        kind: 'big',
        chartType: '饼图',
        title: 'Purposes of college students’ travel',
        titleZh: '某高校学生旅游目的调查',
        data: [
          '欣赏风景：37%',
          '缓解压力：33%',
          '广交朋友：9%',
          '培养独立能力：6%',
          '其他：15%',
        ],
        directions: BIG_DIRECTIONS,
        note: '2016 年英语二大作文真题：饼图展示大学生旅游的主要目的。',
        guidance: BIG_GUIDE,
      },
      {
        id: 'real-2017-big',
        source: 'real',
        year: 2017,
        kind: 'big',
        chartType: '折线图',
        title: 'Museums and museum visitors in China (2013–2015)',
        titleZh: '2013—2015 年我国博物馆数量和参观人数',
        data: [
          '2013 年：博物馆约 4,200 家，参观约 6,500 十万人次',
          '2014 年：博物馆约 4,500 家，参观约 7,200 十万人次',
          '2015 年：博物馆约 4,700 家，参观约 7,800 十万人次',
        ],
        directions: BIG_DIRECTIONS,
        note: '2017 年英语二大作文真题：折线图展示博物馆数量与参观人数的同步增长。',
        guidance: BIG_GUIDE,
      },
      {
        id: 'real-2018-big',
        source: 'real',
        year: 2018,
        kind: 'big',
        chartType: '饼图',
        title: 'Factors consumers consider when choosing a restaurant (2017)',
        titleZh: '2017 年某市消费者选择餐厅时的关注因素',
        data: [
          '特色：36.30%',
          '其他：26.80%',
          '环境：23.80%',
          '价格：8.40%',
          '服务：4.70%',
        ],
        directions: BIG_DIRECTIONS,
        note: '2018 年英语二大作文真题：饼图呈现消费者选择餐厅时最看重的因素。',
        guidance: BIG_GUIDE,
      },
      {
        id: 'real-2019-big',
        source: 'real',
        year: 2019,
        kind: 'big',
        chartType: '柱状图',
        title: 'Where undergraduates went after graduation (2013 and 2018)',
        titleZh: '某高校 2013 年和 2018 年本科毕业生去向统计',
        data: [
          '就业：2013 年 68.1%，2018 年 60.7%',
          '升学：2013 年 26.3%，2018 年 34.0%',
          '创业：2013 年 1.3%，2018 年 2.6%',
        ],
        directions: BIG_DIRECTIONS,
        note: '2019 年英语二大作文真题：柱状图对比 2013 与 2018 年本科毕业生去向。',
        guidance: BIG_GUIDE,
      },
      {
        id: 'real-2020-big',
        source: 'real',
        year: 2020,
        kind: 'big',
        chartType: '饼图',
        title: 'Purposes of college students’ mobile reading',
        titleZh: '某高校学生手机阅读目的调查',
        data: [
          '学习知识：59.5%',
          '消磨时间：21.3%',
          '获取信息：17.0%',
          '其他：2.2%',
        ],
        directions: BIG_DIRECTIONS,
        note: '2020 年英语二大作文真题：饼图展示大学生手机阅读的主要目的。',
        guidance: BIG_GUIDE,
      },
    ]

    const AI_BIG = [
      {
        id: 'ai-big-1',
        source: 'ai',
        year: '',
        kind: 'big',
        chartType: '柱状图',
        title: 'Shared-bike trips in a Chinese city (2019–2024)',
        titleZh: '2019—2024 年某市共享单车骑行量',
        data: ['2019 年：1.2 亿次', '2021 年：2.4 亿次', '2024 年：3.6 亿次'],
        directions: BIG_DIRECTIONS,
        note: 'AI 生成：训练“持续上升 + 原因分析”的常规图表作文。',
        guidance: BIG_GUIDE,
      },
      {
        id: 'ai-big-2',
        source: 'ai',
        year: '',
        kind: 'big',
        chartType: '饼图',
        title: 'How college students spend their daily screen time',
        titleZh: '某高校学生每日屏幕时间分配',
        data: ['学习：35%', '社交：30%', '娱乐：25%', '其他：10%'],
        directions: BIG_DIRECTIONS,
        note: 'AI 生成：适合练“结构描述 + 利弊评论”。',
        guidance: BIG_GUIDE,
      },
      {
        id: 'ai-big-3',
        source: 'ai',
        year: '',
        kind: 'big',
        chartType: '折线图',
        title: 'China’s new energy vehicle exports (2018–2024)',
        titleZh: '2018—2024 年中国新能源汽车出口量',
        data: ['2018 年：约 10 万辆', '2021 年：约 55 万辆', '2024 年：约 180 万辆'],
        directions: BIG_DIRECTIONS,
        note: 'AI 生成：训练“倍数增长 + 产业升级”分析。',
        guidance: BIG_GUIDE,
      },
      {
        id: 'ai-big-4',
        source: 'ai',
        year: '',
        kind: 'big',
        chartType: '饼图',
        title: 'Frequency of physical exercise among city residents',
        titleZh: '某市居民体育锻炼频率调查',
        data: ['每周 3 次以上：28%', '每周 1—2 次：37%', '偶尔锻炼：25%', '几乎不锻炼：10%'],
        directions: BIG_DIRECTIONS,
        note: 'AI 生成：适合练“多数与少数对比 + 健康建议”。',
        guidance: BIG_GUIDE,
      },
      {
        id: 'ai-big-5',
        source: 'ai',
        year: '',
        kind: 'big',
        chartType: '柱状图',
        title: 'Number of AI-related companies in China (2016–2024)',
        titleZh: '2016—2024 年中国人工智能相关企业数量',
        data: ['2016 年：约 1.2 万家', '2020 年：约 4.5 万家', '2024 年：约 9.8 万家'],
        directions: BIG_DIRECTIONS,
        note: 'AI 生成：训练“科技发展 + 机遇与风险”双面评论。',
        guidance: BIG_GUIDE,
      },
      {
        id: 'ai-big-6',
        source: 'ai',
        year: '',
        kind: 'big',
        chartType: '饼图',
        title: 'Where graduates from a university went after graduation',
        titleZh: '某高校毕业生去向调查',
        data: ['直接就业：48%', '国内读研：30%', '出国深造：12%', '自主创业：10%'],
        directions: BIG_DIRECTIONS,
        note: 'AI 生成：适合练“多元选择 + 原因分析”。',
        guidance: BIG_GUIDE,
      },
      {
        id: 'ai-big-7',
        source: 'ai',
        year: '',
        kind: 'big',
        chartType: '折线图',
        title: 'China’s cross-border e-commerce transactions (2018–2024)',
        titleZh: '2018—2024 年中国跨境电商交易规模',
        data: ['2018 年：约 9 万亿元', '2021 年：约 14 万亿元', '2024 年：约 21 万亿元'],
        directions: BIG_DIRECTIONS,
        note: 'AI 生成：训练“经济类图表 + 全球化视角”。',
        guidance: BIG_GUIDE,
      },
      {
        id: 'ai-big-8',
        source: 'ai',
        year: '',
        kind: 'big',
        chartType: '柱状图',
        title: 'Residents’ participation in waste sorting in a city',
        titleZh: '某市居民垃圾分类参与率',
        data: ['2019 年：35%', '2021 年：58%', '2024 年：82%'],
        directions: BIG_DIRECTIONS,
        note: 'AI 生成：训练“政策效果 + 公众意识”分析。',
        guidance: BIG_GUIDE,
      },
    ]

    const REAL_SMALL = [
      {
        id: 'real-2010-small',
        source: 'real',
        year: 2010,
        kind: 'small',
        letterType: '感谢信',
        title: 'A thank-you letter to an American colleague',
        titleZh: '感谢美国同事的接待并欢迎对方来中国',
        scenario: '你作为中美文化交流项目成员刚从美国回来，写信给美国同事。',
        recipient: 'your American colleague',
        keyPoints: ['感谢对方热情接待', '欢迎对方在方便时访问中国'],
        directions:
          'You have just come back from the U.S. as a member of a Sino-American cultural exchange program. Write a letter to your American colleague to 1) express your thanks for his/her warm reception; 2) welcome him/her to visit China in due course. You should write about 100 words on ANSWER SHEET 2. Do not sign your own name at the end of the letter. Use “Zhang Wei” instead. Do not write your address. (10 points)',
        note: '2010 年英语二小作文真题：感谢信 + 邀请。',
        guidance: SMALL_GUIDE,
      },
      {
        id: 'real-2011-small',
        source: 'real',
        year: 2011,
        kind: 'small',
        letterType: '祝贺信',
        title: 'A letter to a cousin admitted to university',
        titleZh: '祝贺表弟/表妹考上大学并给出大学生活建议',
        scenario: '你的表弟/表妹李明刚被大学录取，你写信祝贺并给出建议。',
        recipient: 'your cousin Li Ming',
        keyPoints: ['祝贺对方被大学录取', '就如何准备大学生活提出建议'],
        directions:
          'Suppose your cousin Li Ming has just been admitted to a university. Write him/her a letter to 1) congratulate him/her, and 2) give him/her suggestions on how to get prepared for university life. You should write about 100 words on ANSWER SHEET 2. Do not sign your own name at the end of the letter. Use “Zhang Wei” instead. Do not write the address. (10 points)',
        note: '2011 年英语二小作文真题：祝贺 + 建议。',
        guidance: SMALL_GUIDE,
      },
      {
        id: 'real-2012-small',
        source: 'real',
        year: 2012,
        kind: 'small',
        letterType: '投诉信',
        title: 'A complaint about a faulty electronic dictionary',
        titleZh: '向网店客服投诉电子词典质量问题并要求解决',
        scenario: '你前几天从网店买了一台电子词典，发现有问题。',
        recipient: 'the customer service center of the online store',
        keyPoints: ['说明产品问题并提出投诉', '要求尽快解决'],
        directions:
          'Suppose you have found something wrong with the electronic dictionary that you bought from an online store the other day. Write an email to the customer service center to 1) make a complaint, and 2) demand a prompt solution. You should write about 100 words on ANSWER SHEET 2. Do not sign your own name at the end of the letter. Use “Zhang Wei” instead. Do not write the address. (10 points)',
        note: '2012 年英语二小作文真题：投诉信，事实与诉求要清楚。',
        guidance: SMALL_GUIDE,
      },
      {
        id: 'real-2013-small',
        source: 'real',
        year: 2013,
        kind: 'small',
        letterType: '通知',
        title: 'An email about a charity sale',
        titleZh: '通知同学慈善义卖详情并鼓励参与',
        scenario: '班级将为需要帮助的孩子举办慈善义卖，你写信通知同学。',
        recipient: 'your classmates',
        keyPoints: ['告知义卖的时间、地点和内容', '鼓励同学参加'],
        directions:
          'Suppose your class is to hold a charity sale for kids in need of help. Write your classmates an email to 1) inform them about the details, and 2) encourage them to participate. You should write about 100 words on ANSWER SHEET 2. Do not use your own name. Use “Li Ming” instead. Do not write your address. (10 points)',
        note: '2013 年英语二小作文真题：通知/邮件，信息要完整。',
        guidance: SMALL_GUIDE,
      },
      {
        id: 'real-2014-small',
        source: 'real',
        year: 2014,
        kind: 'small',
        letterType: '介绍信',
        title: 'An email to a future roommate',
        titleZh: '向未来室友介绍生活习惯并询问当地生活建议',
        scenario: '你即将出国留学，将与当地学生 John 合租公寓。',
        recipient: 'John, a local student',
        keyPoints: ['介绍自己的生活习惯', '询问在当地生活的建议'],
        directions:
          'Suppose you are going to study abroad and share an apartment with John, a local student. Write him an email to 1) tell him about your living habits, and 2) ask for advice about living there. You should write about 100 words on ANSWER SHEET 2. Do not use your own name. Use “Li Ming” instead. Do not write your address. (10 points)',
        note: '2014 年英语二小作文真题：介绍 + 咨询，语气友好。',
        guidance: SMALL_GUIDE,
      },
      {
        id: 'real-2015-small',
        source: 'real',
        year: 2015,
        kind: 'small',
        letterType: '通知',
        title: 'A notice for a summer camp volunteer recruitment',
        titleZh: '为高中生夏令营招募志愿者',
        scenario: '你所在大学将举办高中生夏令营，你负责写通知招募志愿者。',
        recipient: 'students of your university',
        keyPoints: ['简要介绍夏令营活动', '招募志愿者'],
        directions:
          'Suppose your university is going to host a summer camp for high school students. Write a notice to 1) briefly introduce the camp activities, and 2) call for volunteers. You should write about 100 words on ANSWER SHEET 2. Do not use your name or the name of your university. Do not write your address. (10 points)',
        note: '2015 年英语二小作文真题：通知，注意格式与招募信息。',
        guidance: SMALL_GUIDE,
      },
      {
        id: 'real-2016-small',
        source: 'real',
        year: 2016,
        kind: 'small',
        letterType: '回复信',
        title: 'A reply to a friend who congratulated you',
        titleZh: '回复朋友 Jack 的祝贺并给出翻译建议',
        scenario: '你赢得翻译比赛，朋友 Jack 来信祝贺并询问翻译建议。',
        recipient: 'your friend Jack',
        keyPoints: ['感谢对方的祝贺', '给出翻译学习或练习建议'],
        directions:
          'Suppose you won a translation contest and your friend, Jack, wrote an email to congratulate you and ask for advice on translation. Write him a reply to 1) thank him, and 2) give your advice. You should write about 100 words on ANSWER SHEET 2. Do not use your own name. Use “Li Ming” instead. Do not write your address. (10 points)',
        note: '2016 年英语二小作文真题：回复信，感谢 + 建议。',
        guidance: SMALL_GUIDE,
      },
      {
        id: 'real-2017-small',
        source: 'real',
        year: 2017,
        kind: 'small',
        letterType: '回复信',
        title: 'A reply to Professor Williams’ invitation',
        titleZh: '接受邀请并介绍中国文化讲座要点',
        scenario: 'Williams 教授邀请你给国际学生做一场中国文化讲座。',
        recipient: 'Professor Williams',
        keyPoints: ['接受邀请', '介绍讲座的主要要点'],
        directions:
          'Suppose you are invited by Professor Williams to give a presentation about Chinese culture to a group of international students. Write a reply to 1) accept the invitation, and 2) introduce the key points of your presentation. You should write about 100 words on ANSWER SHEET 2. Do not use your own name. Use “Li Ming” instead. Do not write your address. (10 points)',
        note: '2017 年英语二小作文真题：正式回复，接受 + 要点。',
        guidance: SMALL_GUIDE,
      },
      {
        id: 'real-2018-small',
        source: 'real',
        year: 2018,
        kind: 'small',
        letterType: '道歉信',
        title: 'An apology for cancelling a visit',
        titleZh: '因取消行程向 Smith 教授道歉并建议改期',
        scenario: '你不得不取消旅行计划，无法按约拜访 Smith 教授。',
        recipient: 'Professor Smith',
        keyPoints: ['道歉并解释情况', '建议未来见面'],
        directions:
          'Suppose you have to cancel your travel plan and will not be able to visit Professor Smith. Write him an email to 1) apologize and explain the situation, and 2) suggest a future meeting. You should write about 100 words on ANSWER SHEET 2. Do not use your own name. Use “Li Ming” instead. Do not write your address. (10 points)',
        note: '2018 年英语二小作文真题：道歉信，解释 + 补救。',
        guidance: SMALL_GUIDE,
      },
      {
        id: 'real-2019-small',
        source: 'real',
        year: 2019,
        kind: 'small',
        letterType: '建议信',
        title: 'An email about a debate on city traffic',
        titleZh: '就城市交通主题辩论向 Smith 教授提建议并说明安排',
        scenario: 'Smith 教授让你策划一场以城市交通为主题的辩论。',
        recipient: 'Professor Smith',
        keyPoints: ['提出具体辩题并说明理由', '告知你的安排'],
        directions:
          'Suppose Professor Smith asked you to plan a debate on the theme of city traffic. Write him an email to 1) suggest a specific topic with your reasons, and 2) tell him about your arrangements. You should write about 100 words on ANSWER SHEET 2. Do not use your own name. Use “Li Ming” instead. Do not write your address. (10 points)',
        note: '2019 年英语二小作文真题：建议 + 安排，注意逻辑顺序。',
        guidance: SMALL_GUIDE,
      },
      {
        id: 'real-2020-small',
        source: 'real',
        year: 2020,
        kind: 'small',
        letterType: '介绍信',
        title: 'An email about a tour of a historical site',
        titleZh: '向国际学生介绍历史景点并给出参观建议',
        scenario: '你正在为一批国际学生策划一次历史景点参观。',
        recipient: 'a group of international students',
        keyPoints: ['介绍景点', '给出参观建议'],
        directions:
          'Suppose you are planning a tour of a historical site for a group of international students. Write an email to 1) tell them about the site, and 2) give them some tips for the tour. Please write your answer on ANSWER SHEET 2. Do not use your own name, use “Li Ming” instead. (10 points)',
        note: '2020 年英语二小作文真题：介绍 + 建议。',
        guidance: SMALL_GUIDE,
      },
    ]

    const AI_SMALL = [
      {
        id: 'ai-small-1',
        source: 'ai',
        year: '',
        kind: 'small',
        letterType: '建议信',
        title: 'A suggestion about library opening hours',
        titleZh: '就图书馆开放时间向校方提建议',
        scenario: '期末复习期间，图书馆座位紧张、闭馆过早；你写信给图书馆负责人提出建议。',
        recipient: 'the library director',
        keyPoints: ['说明当前问题', '提出延长开放时间或增加座位的具体建议', '说明建议的益处'],
        directions: SMALL_DIRECTIONS,
        note: 'AI 生成：建议信，训练“问题—建议—效果”结构。',
        guidance: SMALL_GUIDE,
      },
      {
        id: 'ai-small-2',
        source: 'ai',
        year: '',
        kind: 'small',
        letterType: '感谢信',
        title: 'A thank-you letter to a professor',
        titleZh: '感谢教授写推荐信',
        scenario: '你申请研究生项目，教授为你写了推荐信；你写信表示感谢。',
        recipient: 'Professor Johnson',
        keyPoints: ['感谢对方抽时间写推荐信', '说明推荐信对你的帮助', '表达未来继续联系的愿望'],
        directions: SMALL_DIRECTIONS,
        note: 'AI 生成：正式感谢信，语域要得体。',
        guidance: SMALL_GUIDE,
      },
      {
        id: 'ai-small-3',
        source: 'ai',
        year: '',
        kind: 'small',
        letterType: '道歉信',
        title: 'An apology for missing a group meeting',
        titleZh: '为缺席小组会议道歉',
        scenario: '你因生病缺席了小组项目会议，写信向组员道歉并提出补救方案。',
        recipient: 'your group members',
        keyPoints: ['说明缺席事实与原因', '表达歉意', '提出补上工作的具体安排'],
        directions: SMALL_DIRECTIONS,
        note: 'AI 生成：道歉信，重点在补救方案。',
        guidance: SMALL_GUIDE,
      },
      {
        id: 'ai-small-4',
        source: 'ai',
        year: '',
        kind: 'small',
        letterType: '通知',
        title: 'A notice for a campus volunteer programme',
        titleZh: '校园志愿服务项目通知',
        scenario: '学校将开展社区支教志愿服务，你负责写通知招募志愿者。',
        recipient: 'all students',
        keyPoints: ['活动时间、地点与服务对象', '招募要求与报名方式', '志愿服务的意义'],
        directions: 'Write a notice in about 100 words. Do not sign your own name; use "Li Ming" instead. (10 points)',
        note: 'AI 生成：通知，注意格式与信息完整。',
        guidance: SMALL_GUIDE,
      },
      {
        id: 'ai-small-5',
        source: 'ai',
        year: '',
        kind: 'small',
        letterType: '推荐信',
        title: 'A recommendation of a language-learning app',
        titleZh: '推荐一款语言学习应用',
        scenario: '朋友想利用碎片时间学英语，你写信推荐一款应用。',
        recipient: 'your friend',
        keyPoints: ['应用名称与核心功能', '推荐理由', '使用建议'],
        directions: SMALL_DIRECTIONS,
        note: 'AI 生成：推荐信，功能与理由要对应。',
        guidance: SMALL_GUIDE,
      },
      {
        id: 'ai-small-6',
        source: 'ai',
        year: '',
        kind: 'small',
        letterType: '邀请信',
        title: 'An invitation to a city cycling event',
        titleZh: '邀请朋友参加城市骑行活动',
        scenario: '你所在的城市将举办绿色骑行活动，你写信邀请朋友一起参加。',
        recipient: 'your friend',
        keyPoints: ['活动时间、路线与集合地点', '活动内容与注意事项', '表达期待'],
        directions: SMALL_DIRECTIONS,
        note: 'AI 生成：邀请信，信息要具体到可执行。',
        guidance: SMALL_GUIDE,
      },
      {
        id: 'ai-small-7',
        source: 'ai',
        year: '',
        kind: 'small',
        letterType: '投诉信',
        title: 'A complaint about a delayed online order',
        titleZh: '投诉网购订单延迟',
        scenario: '你在网上下单的商品迟迟未到，客服也未给出明确答复；你写信投诉。',
        recipient: 'the customer service manager',
        keyPoints: ['订单信息与延迟事实', '沟通未果的经过', '明确诉求（发货、退款或补偿）'],
        directions: SMALL_DIRECTIONS,
        note: 'AI 生成：投诉信，事实清楚、诉求明确。',
        guidance: SMALL_GUIDE,
      },
      {
        id: 'ai-small-8',
        source: 'ai',
        year: '',
        kind: 'small',
        letterType: '咨询信',
        title: 'A letter asking about a summer course',
        titleZh: '咨询暑期课程',
        scenario: '你对某大学的暑期课程感兴趣，写信询问课程安排、费用和申请条件。',
        recipient: 'the course coordinator',
        keyPoints: ['说明你对课程的兴趣', '询问课程时间、费用与申请条件', '请求对方回复'],
        directions: SMALL_DIRECTIONS,
        note: 'AI 生成：咨询信，问题要具体、有条理。',
        guidance: SMALL_GUIDE,
      },
    ]

    const REAL_TRANSLATIONS = [
      {
        id: 'real-2010-trans',
        source: 'real',
        year: 2010,
        kind: 'translation',
        title: 'Sustainability and everyday choices',
        titleZh: '2010 年英译汉：承受力与日常选择',
        passage:
          '"Sustainability" has become a popular word these days, but to Ted Ning, the concept will always have personal meaning. Having endured a painful period of unsustainability in his own life made it clear to him that sustainability-oriented values must be expressed through everyday action and choice.\n\nNing recalls spending a confusing year in the late 1990s selling insurance. He\'d been through the dot-com boom and burst and, desperate for a job, signed on with a Boulder agency.\n\nIt didn\'t go well. "It was a really bad move because that\'s not my passion," says Ning, whose dilemma about the job translated, predictably, into a lack of sales. "I was miserable. I had so much anxiety that I would wake up in the middle of the night and stare at the ceiling. I had no money and needed the job. Everyone said, \'Just wait, you\'ll turn the corner, give it some time.\'"',
        referencePoints: [
          'sustainability 承受力；可持续性',
          'endure a painful period 经历一段痛苦时期',
          'sustainability-oriented values 以承受力为导向的价值观',
          'the dot-com boom and burst 互联网泡沫的繁荣与破灭',
          'turn the corner 情况好转',
        ],
        directions: TRANS_DIRECTIONS,
        note: '2010 年英语二翻译真题：注意引语、插入语和口语表达。',
        guidance: { translation: '先理清时间线；引语中的口语“turn the corner”要译得自然。' },
      },
      {
        id: 'real-2011-trans',
        source: 'real',
        year: 2011,
        kind: 'translation',
        title: 'The IT industry and greenhouse gases',
        titleZh: '2011 年英译汉：信息技术业与温室气体',
        passage:
          'Who would have thought that, globally, the IT industry produces about the same volume of greenhouse gases as the world\'s airlines do — roughly 2 percent of all CO2 emissions?\n\nMany everyday tasks take a surprising toll on the environment. A Google search can leak between 0.2 and 7.0 grams of CO2, depending on how many attempts are needed to get the "right" answer. To deliver results to its users quickly, then, Google has to maintain vast data centres around the world, packed with powerful computers. While producing large quantities of CO2, these computers emit a great deal of heat, so the centres need to be well air-conditioned, which uses even more energy.\n\nHowever, Google and other big tech providers monitor their efficiency closely and make improvements. Monitoring is the first step on the road to reduction, but there is much more to be done, and not just by big companies.',
        referencePoints: [
          'Who would have thought that... 谁会想到……',
          'take a toll on 对……造成损害',
          'depending on 取决于',
          'be packed with 配备着；挤满',
          'the first step on the road to reduction 减排的第一步',
        ],
        directions: TRANS_DIRECTIONS,
        note: '2011 年英语二翻译真题：注意反问句、数字和因果链。',
        guidance: { translation: '反问句可保留语气；which 从句要译成独立的因果关系。' },
      },
      {
        id: 'real-2012-trans',
        source: 'real',
        year: 2012,
        kind: 'translation',
        title: 'Migration and the brain drain',
        titleZh: '2012 年英译汉：移民与人才流失',
        passage:
          'When people in developing countries worry about migration, they are usually concerned at the prospect of their best and brightest departure to Silicon Valley or to hospitals and universities in the developed world. These are the kind of workers that countries like Britain, Canada and Australia try to attract by using immigration rules that privilege college graduates.\n\nLots of studies have found that well-educated people from developing countries are particularly likely to emigrate. A big survey of Indian households in 2004 found that nearly 40% of emigrants had more than a high-school education, compared with around 3.3% of all Indians over the age 25. This "brain drain" has long bothered policymakers in poor countries. They fear that it hurts their economies, depriving them of much-needed skilled workers who could have taught at their universities, worked in their hospitals and come up with clever new products for their factories to make.',
        referencePoints: [
          'the prospect of ……的前景',
          'the best and brightest 最优秀、最聪明的人才',
          'privilege college graduates 给予大学毕业生优惠',
          'brain drain 人才流失',
          'deprive...of... 使……失去……',
        ],
        directions: TRANS_DIRECTIONS,
        note: '2012 年英语二翻译真题：注意长定语从句和数据的对比。',
        guidance: { translation: '把 who could have... 的定语从句拆成中文短句，避免一逗到底。' },
      },
      {
        id: 'real-2013-trans',
        source: 'real',
        year: 2013,
        kind: 'translation',
        title: 'A powerful memory',
        titleZh: '2013 年英译汉：强大的记忆力',
        passage:
          'I can pick a date from the past 53 years and know instantly where I was, what happened in the news and even the day of the week. I\'ve been able to do this since I was four.\n\nI never feel overwhelmed with the amount of information my brain absorbs. My mind seems to be able to cope and the information is stored away neatly. When I think of a sad memory, I do what everybody does — try to put it to one side. I don\'t think it\'s harder for me just because my memory is clearer. Powerful memory doesn\'t make my emotions any more acute or vivid. I can recall the day my grandfather died and the sadness I felt when we went to the hospital the day before. I also remember that the musical play Hair opened on Broadway on the same day — they both just pop into my mind in the same way.',
        referencePoints: [
          'feel overwhelmed with 被……压得喘不过气',
          'store away neatly 整齐地储存起来',
          'put it to one side 把它放到一边',
          'acute or vivid 强烈或鲜明',
          'pop into my mind 突然出现在脑海中',
        ],
        directions: TRANS_DIRECTIONS,
        note: '2013 年英语二翻译真题：注意心理描写和破折号。',
        guidance: { translation: '保持第一人称的叙述语气；破折号后的解释可译为“也就是……”。' },
      },
      {
        id: 'real-2014-trans',
        source: 'real',
        year: 2014,
        kind: 'translation',
        title: 'Healthy optimism',
        titleZh: '2014 年英译汉：健康的乐观',
        passage:
          'Most people would define optimism as being endlessly happy, with a glass that\'s perpetually half full. But that\'s exactly the kind of false cheerfulness that positive psychologists wouldn\'t recommend. "Healthy optimism means being in touch with reality," says Tal Ben-Shahar, a Harvard professor. According to Ben-Shahar, realistic optimists are those who make the best of things that happen, but not those who believe everything happens for the best.\n\nBen-Shahar uses three optimistic exercises. When he feels down — say, after giving a bad lecture — he grants himself permission to be human. He reminds himself that not every lecture can be a Nobel winner; some will be less effective than others. Next is reconstruction. He analyzes the weak lecture, learning lessons for the future about what works and what doesn\'t. Finally, there is perspective, which involves acknowledging that in the grand scheme of life, one lecture really doesn\'t matter.',
        referencePoints: [
          'define...as... 把……定义为……',
          'perpetually half full 永远半满',
          'make the best of 充分利用；尽量做好',
          'grant oneself permission to be human 允许自己是个凡人',
          'in the grand scheme of life 在宏大的人生图景中',
        ],
        directions: TRANS_DIRECTIONS,
        note: '2014 年英语二翻译真题：注意定义句、引语和三个层次的并列。',
        guidance: { translation: '“a glass that\'s perpetually half full”可译成“永远觉得杯子里还有半杯水”。' },
      },
      {
        id: 'real-2015-trans',
        source: 'real',
        year: 2015,
        kind: 'translation',
        title: 'The well-travelled road effect',
        titleZh: '2015 年英译汉：熟路效应',
        passage:
          'Think about driving a route that\'s very familiar. It could be your commute to work, a trip into town or the way home. Whichever it is, you know every twist and turn like the back of your hand. On these sorts of trips it\'s easy to lose concentration on the driving and pay little attention to the passing scenery. The consequence is that you perceive that the trip has taken less time than it actually has.\n\nThis is the well-travelled road effect: People tend to underestimate the time it takes to travel a familiar route.\n\nThe effect is caused by the way we allocate our attention. When we travel down a well-known route, because we don\'t have to concentrate much, time seems to flow more quickly. And afterwards, when we come to think back on it, we can\'t remember the journey well because we didn\'t pay much attention to it. So we assume it was shorter.',
        referencePoints: [
          'every twist and turn 每一处弯道',
          'know...like the back of your hand 对……了如指掌',
          'lose concentration 走神；失去专注',
          'allocate our attention 分配注意力',
          'underestimate 低估',
        ],
        directions: TRANS_DIRECTIONS,
        note: '2015 年英语二翻译真题：注意定义句和因果解释。',
        guidance: { translation: '“the well-travelled road effect”可译为“熟路效应”，后面用冒号引出定义。' },
      },
      {
        id: 'real-2016-trans',
        source: 'real',
        year: 2016,
        kind: 'translation',
        title: 'Why supermarkets make us buy more',
        titleZh: '2016 年英译汉：超市为何让我们买得更多',
        passage:
          'The supermarket is designed to lure customers into spending as much time as possible within its doors. The reason for this is simple: The longer you stay in the store, the more stuff you\'ll see, and the more stuff you see, the more you\'ll buy. And supermarkets contain a lot of stuff. The average supermarket, according to the Food Marketing Institute, carries some 44,000 different items, and many carry tens of thousands more. The sheer volume of available choice is enough to send shoppers into a state of information overload. According to brain-scan experiments, the demands of so much decision-making quickly become too much for us. After about 40 minutes of shopping, most people stop struggling to be rationally selective, and instead begin shopping emotionally — which is the point at which we accumulate the 50 percent of stuff in our cart that we never intended buying.',
        referencePoints: [
          'lure...into... 诱使……进入……',
          'the longer...the more... 越……越……',
          'sheer volume 巨大的数量',
          'information overload 信息超负荷',
          'rationally selective 理性挑选',
        ],
        directions: TRANS_DIRECTIONS,
        note: '2016 年英语二翻译真题：注意“越……越……”结构和长句收尾。',
        guidance: { translation: '最后一句的 which 从句可拆成“也就是从这一刻起……”。' },
      },
      {
        id: 'real-2017-trans',
        source: 'real',
        year: 2017,
        kind: 'translation',
        title: 'Between fashion and publishing',
        titleZh: '2017 年英译汉：时尚与出版之间',
        passage:
          'My dream has always been to work somewhere in an area between fashion and publishing. Two years before graduating from secondary school, I took a sewing and design course thinking that I would move on to a fashion design course. However, during that course I realized I was not good enough in this area to compete with other creative personalities in the future, so I decided that it was not the right path for me. Before applying for university I told everyone that I would study journalism, because writing was, and still is, one of my favourite activities. But, to be honest, I said it, because I thought that fashion and me together was just a dream — I knew that no one could imagine me in the fashion industry at all! So I decided to look for some fashion-related courses that included writing. This is when I noticed the course "Fashion Media & Promotion."',
        referencePoints: [
          'somewhere in an area between... 在……之间的某个领域',
          'move on to 接着进入',
          'creative personalities 有创造力的人',
          'to be honest 说实话',
          'fashion-related courses 与时尚相关的课程',
        ],
        directions: TRANS_DIRECTIONS,
        note: '2017 年英语二翻译真题：注意叙事顺序和口语化插入语。',
        guidance: { translation: '“fashion and me together was just a dream”要译出“时尚与我结缘只是个梦”的语气。' },
      },
      {
        id: 'real-2018-trans',
        source: 'real',
        year: 2018,
        kind: 'translation',
        title: 'Bill Gates and reading',
        titleZh: '2018 年英译汉：比尔·盖茨与阅读',
        passage:
          'A fifth grader gets a homework assignment to select his future career path from a list of occupations. He ticks "astronaut" but quickly adds "scientist" to the list and selects it as well. The boy is convinced that if he reads enough, he can explore as many career paths as he likes. And so he reads — everything from encyclopedias to science fiction novels. He reads so passionately that his parents have to institute a "no reading policy" at the dinner table.\n\nThat boy was Bill Gates, and he hasn\'t stopped reading yet — not even after becoming one of the most successful people on the planet. Nowadays, his reading material has changed from science fiction and reference books: recently, he revealed that he reads at least 50 nonfiction books a year. Gates chooses nonfiction titles because they explain how the world works. "Each book opens up new avenues of knowledge to explore," Gates says.',
        referencePoints: [
          'be convinced that 确信',
          'as many...as he likes 尽可能多的……',
          'institute a policy 制定一项政策',
          'nonfiction books 非虚构类书籍',
          'open up new avenues of knowledge 开辟新的知识渠道',
        ],
        directions: TRANS_DIRECTIONS,
        note: '2018 年英语二翻译真题：注意“so...that...”和引语。',
        guidance: { translation: '“no reading policy”加引号，可译为“不读书政策”并保留引号。' },
      },
      {
        id: 'real-2019-trans',
        source: 'real',
        year: 2019,
        kind: 'translation',
        title: 'James Herriot and the writing game',
        titleZh: '2019 年英译汉：詹姆斯·赫里奥特与写作',
        passage:
          'It is easy to underestimate English writer James Herriot. He had such a pleasant, readable style that one might think that anyone could imitate it. How many times have I heard people say, "I could write a book. I just haven\'t the time." Easily said. Not so easily done. James Herriot, contrary to popular opinion, did not find it easy in his early days of, as he put it, "having a go at the writing game". While he obviously had an abundance of natural talent, the final, polished work that he gave to the world was the result of years of practicing, re-writing and reading. Like the majority of authors, he had to suffer many disappointments and rejections along the way, but these made him all the more determined to succeed. Everything he achieved in life was earned the hard way and his success in the literary field was no exception.',
        referencePoints: [
          'underestimate 低估',
          'a pleasant, readable style 令人愉快、可读性强的风格',
          'contrary to popular opinion 与普遍看法相反',
          'have a go at 尝试',
          'earn...the hard way 通过艰苦努力获得',
        ],
        directions: TRANS_DIRECTIONS,
        note: '2019 年英语二翻译真题：注意引语、插入语和“not so easily done”的省略。',
        guidance: { translation: '“Easily said. Not so easily done.”可译成“说起来容易，做起来难”。' },
      },
      {
        id: 'real-2020-trans',
        source: 'real',
        year: 2020,
        kind: 'translation',
        title: 'The gift of failure',
        titleZh: '2020 年英译汉：失败的馈赠',
        passage:
          'It\'s almost impossible to go through life without experiencing some kind of failure. But, the wonderful thing about failure is that it\'s entirely up to us to decide how to look at it.\n\nWe can choose to see failure as "the end of the world". Or, we can look at failure as the incredible learning experience that it often is. Every time we fail at something, we can choose to look for the lesson we\'re meant to learn. These lessons are very important; they\'re how we grow, and how we keep from making that same mistake again. Failures stop us only if we let them.\n\nFailure can also teach us things about ourselves that we would never have learned otherwise. For instance, failure can help you discover how strong a person you are. Failing at something can help you discover your truest friends, or help you find unexpected motivation to succeed.',
        referencePoints: [
          'go through life 度过一生',
          'be up to us 取决于我们',
          'the incredible learning experience 绝佳的学习经历',
          'keep from making the same mistake 避免再犯同样的错误',
          'unexpected motivation 意想不到的动力',
        ],
        directions: TRANS_DIRECTIONS,
        note: '2020 年英语二翻译真题：注意“up to us”和“only if we let them”。',
        guidance: { translation: '“Failures stop us only if we let them”可译成“只有我们自己放弃，失败才会击垮我们”。' },
      },
    ]

    const AI_TRANSLATIONS = [
      {
        id: 'trans-1',
        source: 'ai',
        year: '',
        kind: 'translation',
        title: 'Lifelong learning',
        titleZh: '终身学习',
        passage:
          'Until recently, most people assumed that education ended with a university degree. That assumption is now being challenged. In a world where technologies change faster than textbooks can be updated, the ability to learn new skills has become a basic survival skill. Employers increasingly value curiosity and adaptability over a fixed body of knowledge. Yet lifelong learning does not mean collecting certificates. It means staying alert to what one does not know, and being willing to ask questions at any age. The real test of an education is not how much a person remembers, but how well he or she keeps learning after the classroom door closes.',
        referencePoints: ['assume that... 假定……', 'be challenged 受到挑战', 'a fixed body of knowledge 固定的知识体系', 'stay alert to 对……保持警觉', 'The real test of... is not... but... 对……的真正检验不是……而是……'],
        directions: TRANS_DIRECTIONS,
        note: 'AI 生成：教育类翻译，注意长句拆分与“not...but...”结构。',
        guidance: { translation: '先抓主干，再处理定语从句；中文多用短句，避免一逗到底。' },
      },
      {
        id: 'trans-2',
        source: 'ai',
        year: '',
        kind: 'translation',
        title: 'Reading on screens',
        titleZh: '屏幕阅读',
        passage:
          'Reading on a screen has become second nature to many of us. A recent survey found that people now spend more time reading on phones than on paper. Yet speed is not the same as understanding. When we scroll, we tend to skim; when we skim, we remember less. Printed books slow us down, and that slowness may be their greatest advantage. The point is not to reject screens, but to choose the medium that suits the task. A novel may deserve paper; a news summary may be fine on a phone. What matters is that we read with attention, rather than merely consume words.',
        referencePoints: ['second nature 第二天性；习以为常', 'speed is not the same as understanding 速度不等于理解', 'tend to skim 倾向于略读', 'the medium that suits the task 适合任务的媒介', 'consume words 消费文字'],
        directions: TRANS_DIRECTIONS,
        note: 'AI 生成：阅读类翻译，注意对比结构与分号处理。',
        guidance: { translation: '分号处可拆成中文短句；“not...but...”要译出转折。' },
      },
      {
        id: 'trans-3',
        source: 'ai',
        year: '',
        kind: 'translation',
        title: 'Volunteering',
        titleZh: '志愿服务',
        passage:
          'Volunteering is often described as a gift to others, but those who do it know that the gift runs both ways. A student who spends Saturday mornings helping elderly residents learn to use smartphones may find that she has learned something about patience, memory and loneliness. She may also discover a career she had never considered. Critics say volunteering distracts young people from study and paid work. That view misses the point. A few hours a week can widen a young person’s world far more than another hour of screen time. What matters is commitment: showing up regularly, listening carefully, and doing small things well.',
        referencePoints: ['the gift runs both ways 馈赠是双向的', 'learn something about... 对……有所体会', 'distract...from... 使……分心', 'miss the point 没有抓住要点', 'commitment 投入；坚持'],
        directions: TRANS_DIRECTIONS,
        note: 'AI 生成：社会类翻译，注意定语从句与冒号后的并列。',
        guidance: { translation: '把“those who do it”译成“做过的人”；冒号后的三个动名词可保留排比。' },
      },
      {
        id: 'trans-4',
        source: 'ai',
        year: '',
        kind: 'translation',
        title: 'Artificial intelligence and work',
        titleZh: '人工智能与工作',
        passage:
          'Every major technology has produced both anxiety and opportunity, and artificial intelligence is no exception. It can write a first draft, diagnose an illness, or translate a contract in seconds. For workers, the question is not whether machines will take over entire jobs, but which tasks will be automated first. The answer is often the repetitive, rule-based parts of a job. That leaves the human parts—judgment, empathy, negotiation, and responsibility—more valuable than before. The sensible response is neither to ban the technology nor to pretend it will solve everything, but to redesign education and training so that people can work alongside it.',
        referencePoints: ['is no exception 也不例外', 'take over 接管', 'rule-based 基于规则的', 'empathy 共情', 'neither...nor... 既不……也不……'],
        directions: TRANS_DIRECTIONS,
        note: 'AI 生成：科技类翻译，注意插入语和双重否定。',
        guidance: { translation: '破折号内的并列可保留；neither...nor... 译成“既不应……也不应……”。' },
      },
      {
        id: 'trans-5',
        source: 'ai',
        year: '',
        kind: 'translation',
        title: 'Urban green space',
        titleZh: '城市绿地',
        passage:
          'City parks are sometimes treated as decoration, yet their value is far more practical. Trees cool streets in summer, absorb noise, and give children a place to run. A park can also bring together people who would otherwise never meet. Studies suggest that access to green space is linked to lower stress and better mental health. The challenge for city planners is not simply to build more parks, but to make them easy to reach. A small garden within a five-minute walk may do more for daily life than a large park on the edge of town.',
        referencePoints: ['be treated as 被视为', 'far more practical 实用得多', 'access to green space 接触绿地的机会', 'be linked to 与……相关', 'on the edge of town 在城市边缘'],
        directions: TRANS_DIRECTIONS,
        note: 'AI 生成：城市类翻译，注意比较结构和定语从句。',
        guidance: { translation: '“would otherwise never meet”可译成“本来可能永远不会相遇的人”。' },
      },
      {
        id: 'trans-6',
        source: 'ai',
        year: '',
        kind: 'translation',
        title: 'Sleep and learning',
        titleZh: '睡眠与学习',
        passage:
          'Students often sacrifice sleep to gain study time, as if the two were interchangeable. Research tells a different story. During sleep, the brain consolidates what has been learned during the day, moving information from short-term to long-term memory. A student who stays up all night may remember less than one who reviews for an hour and sleeps for eight. Sleep also affects mood, attention and creativity. The lesson is not that students should study less, but that they should treat sleep as part of study. A regular bedtime can be a more effective revision strategy than another cup of coffee.',
        referencePoints: ['sacrifice...to... 牺牲……以换取……', 'as if 仿佛', 'consolidate 巩固', 'stay up all night 熬夜', 'treat...as... 把……视为……'],
        directions: TRANS_DIRECTIONS,
        note: 'AI 生成：学习类翻译，注意比较级和表语从句。',
        guidance: { translation: '“The lesson is not that...but that...”译成“关键不是……而是……”。' },
      },
      {
        id: 'trans-7',
        source: 'ai',
        year: '',
        kind: 'translation',
        title: 'Museums as classrooms',
        titleZh: '博物馆作为课堂',
        passage:
          'Museums were once places where objects were kept and admired. Today many of them see themselves as classrooms without walls. They run workshops for schoolchildren, digital tours for people who cannot travel, and exhibitions that invite visitors to question what they see. This change has not been welcomed by everyone. Some critics worry that entertainment is replacing scholarship, and that visitors leave with images rather than understanding. The best museums show that the two can coexist. A well-designed exhibition does not simply display knowledge; it makes the visitor curious enough to look for more.',
        referencePoints: ['classrooms without walls 没有围墙的课堂', 'run workshops 举办工作坊', 'invite visitors to question 引导参观者质疑', 'scholarship 学术', 'coexist 共存'],
        directions: TRANS_DIRECTIONS,
        note: 'AI 生成：文化类翻译，注意并列宾语和宾语从句。',
        guidance: { translation: '“see themselves as...”译成“把自己视为……”；最后一句用“不仅……而且……”更顺。' },
      },
      {
        id: 'trans-8',
        source: 'ai',
        year: '',
        kind: 'translation',
        title: 'Remote work',
        titleZh: '远程办公',
        passage:
          'Remote work was once a privilege of a few freelancers. The pandemic turned it into an experiment for millions. Many workers report that they save commuting time and concentrate better at home. Others miss the casual conversations that produce new ideas. Managers, meanwhile, struggle to judge performance without seeing people work. The debate is often framed as office versus home, but the real question is how to combine the two. A hybrid arrangement can offer flexibility while preserving the human contact that teams need. What matters is not where work happens, but whether people have clarity, trust and the tools to do it well.',
        referencePoints: ['a privilege of... ……的特权', 'turn...into... 把……变成……', 'commuting time 通勤时间', 'frame...as... 把……框定为……', 'hybrid arrangement 混合安排'],
        directions: TRANS_DIRECTIONS,
        note: 'AI 生成：职场类翻译，注意对比和表语从句。',
        guidance: { translation: '“The debate is often framed as...”可译成“争论常被表述为……”。' },
      },
    ]

    const REAL_TOPICS = [...REAL_BIG, ...REAL_SMALL, ...REAL_TRANSLATIONS]
    const AI_TOPICS = [...AI_BIG, ...AI_SMALL, ...AI_TRANSLATIONS]
    const ALL_STATIC_TOPICS = [...REAL_TOPICS, ...AI_TOPICS]

    /**
     * Visual data for every chart-type writing topic. The unit and the exact
     * numbers stay in `data`; this object only feeds the SVG/table renderer.
     */
    const TOPIC_CHARTS = {
      'real-2010-big': {
        type: 'bar',
        labels: ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008'],
        series: [
          { name: 'Developing countries', values: [0.5, 0.6, 0.7, 0.9, 1.3, 1.8, 2.5, 3.3, 4.0], unit: 'billion' },
          { name: 'Developed countries', values: [0.5, 0.55, 0.6, 0.65, 0.7, 0.8, 0.85, 0.9, 1.0], unit: 'billion' },
        ],
        yLabel: 'subscription number (billion)',
      },
      'real-2011-big': {
        type: 'bar',
        labels: ['2008', '2009'],
        series: [
          { name: '国产品牌', values: [26, 32], unit: '%' },
          { name: '日系品牌', values: [35, 26], unit: '%' },
          { name: '美系品牌', values: [12, 13], unit: '%' },
        ],
        yLabel: 'market share (%)',
      },
      'real-2012-big': {
        type: 'table',
        columns: ['年龄组', '满意', '不清楚', '不满意'],
        rows: [
          ['≤40 岁', '16.7%', '50.0%', '33.3%'],
          ['41—50 岁', '0.0%', '36.0%', '64.0%'],
          ['>50 岁', '40.0%', '50.0%', '10.0%'],
        ],
      },
      'real-2013-big': {
        type: 'bar',
        labels: ['大一', '大二', '大三', '大四'],
        series: [{ name: '兼职比例', values: [67.77, 71.13, 71.93, 88.24], unit: '%' }],
        yLabel: 'percentage (%)',
      },
      'real-2014-big': {
        type: 'bar',
        labels: ['1990', '2000', '2010'],
        series: [
          { name: '城镇人口', values: [300, 458, 666], unit: 'million' },
          { name: '乡村人口', values: [834, 807, 674], unit: 'million' },
        ],
        yLabel: 'population (million)',
      },
      'real-2015-big': {
        type: 'pie',
        labels: ['新年礼物', '聚会吃饭', '交通', '其他'],
        values: [40, 20, 20, 20],
        unit: '%',
      },
      'real-2016-big': {
        type: 'pie',
        labels: ['欣赏风景', '缓解压力', '广交朋友', '培养独立能力', '其他'],
        values: [37, 33, 9, 6, 15],
        unit: '%',
      },
      'real-2017-big': {
        type: 'line',
        labels: ['2013', '2014', '2015'],
        series: [
          { name: '博物馆数量', values: [4200, 4500, 4700], unit: '家', axis: 'left' },
          { name: '参观人数', values: [6500, 7200, 7800], unit: '十万人次', axis: 'right' },
        ],
        yLabel: '博物馆数量（家）',
        rightLabel: '参观人数（十万人次）',
      },
      'real-2018-big': {
        type: 'pie',
        labels: ['特色', '其他', '环境', '价格', '服务'],
        values: [36.3, 26.8, 23.8, 8.4, 4.7],
        unit: '%',
      },
      'real-2019-big': {
        type: 'bar',
        labels: ['2013', '2018'],
        series: [
          { name: '就业', values: [68.1, 60.7], unit: '%' },
          { name: '升学', values: [26.3, 34.0], unit: '%' },
          { name: '创业', values: [1.3, 2.6], unit: '%' },
        ],
        yLabel: 'percentage (%)',
      },
      'real-2020-big': {
        type: 'pie',
        labels: ['学习知识', '消磨时间', '获取信息', '其他'],
        values: [59.5, 21.3, 17.0, 2.2],
        unit: '%',
      },
      'ai-big-1': {
        type: 'bar',
        labels: ['2019', '2021', '2024'],
        series: [{ name: '骑行量', values: [1.2, 2.4, 3.6], unit: '亿次' }],
        yLabel: '骑行量（亿次）',
      },
      'ai-big-2': {
        type: 'pie',
        labels: ['学习', '社交', '娱乐', '其他'],
        values: [35, 30, 25, 10],
        unit: '%',
      },
      'ai-big-3': {
        type: 'line',
        labels: ['2018', '2021', '2024'],
        series: [{ name: '出口量', values: [10, 55, 180], unit: '万辆' }],
        yLabel: '出口量（万辆）',
      },
      'ai-big-4': {
        type: 'pie',
        labels: ['每周 3 次以上', '每周 1—2 次', '偶尔锻炼', '几乎不锻炼'],
        values: [28, 37, 25, 10],
        unit: '%',
      },
      'ai-big-5': {
        type: 'bar',
        labels: ['2016', '2020', '2024'],
        series: [{ name: '企业数量', values: [1.2, 4.5, 9.8], unit: '万家' }],
        yLabel: '企业数量（万家）',
      },
      'ai-big-6': {
        type: 'pie',
        labels: ['直接就业', '国内读研', '出国深造', '自主创业'],
        values: [48, 30, 12, 10],
        unit: '%',
      },
      'ai-big-7': {
        type: 'line',
        labels: ['2018', '2021', '2024'],
        series: [{ name: '交易规模', values: [9, 14, 21], unit: '万亿元' }],
        yLabel: '交易规模（万亿元）',
      },
      'ai-big-8': {
        type: 'bar',
        labels: ['2019', '2021', '2024'],
        series: [{ name: '参与率', values: [35, 58, 82], unit: '%' }],
        yLabel: '参与率（%）',
      },
    }


    /* --------------------------------------------------------------- progress */

    function emptyItem() {
      return { best: 0, attempts: 0 }
    }

    function emptyItems() {
      const items = {}
      for (const item of ITEMS) items[item.id] = emptyItem()
      return items
    }

    function emptyState() {
      return { version: 1, items: emptyItems(), history: [], exams: [], customTopics: [], updatedAt: 0 }
    }

    function normalizeState(value) {
      const base = emptyState()
      if (!value || typeof value !== 'object') return base
      const items = { ...base.items }
      if (value.items && typeof value.items === 'object') {
        for (const item of ITEMS) {
          const src = value.items[item.id]
          if (!src || typeof src !== 'object') continue
          items[item.id] = {
            best: Math.max(0, Number(src.best) || 0),
            attempts: Math.max(0, Number(src.attempts) || 0),
          }
        }
      }
      return {
        version: 1,
        items,
        history: Array.isArray(value.history) ? value.history.slice(0, 80) : [],
        exams: Array.isArray(value.exams) ? value.exams.slice(0, 20) : [],
        customTopics: Array.isArray(value.customTopics) ? value.customTopics.slice(0, 40) : [],
        updatedAt: Number(value.updatedAt) || 0,
      }
    }

    /* Training records live on the host (shared by every device and every
     * tunnel URL); localStorage stays as an offline cache. The two are merged
     * on load by `updatedAt`, so the newest side wins instead of the browser
     * silently overwriting the file. */

    async function fetchHostState() {
      try {
        const res = await fetch(STATE_API, { headers: { accept: 'application/json' } })
        if (!res.ok) return { reachable: true, state: null }
        const body = await res.json()
        const state = body && body.ok && body.state ? normalizeState(body.state) : null
        return { reachable: true, state }
      } catch {
        /* host unreachable (offline, restarting, or an older host half):
         * report it so the caller does not mistake it for "no records yet"
         * and push a stale browser copy over a newer file. */
        return { reachable: false, state: null }
      }
    }

    async function pushHostState(state) {
      try {
        await fetch(STATE_API, {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ state }),
        })
        return true
      } catch {
        /* host unreachable: the localStorage copy keeps this session intact */
        return false
      }
    }

    function hasRecords(state) {
      if (!state) return false
      if (Array.isArray(state.history) && state.history.length > 0) return true
      if (Array.isArray(state.exams) && state.exams.length > 0) return true
      const items = state.items && typeof state.items === 'object' ? Object.values(state.items) : []
      return items.some((item) => item && (Number(item.attempts) > 0 || Number(item.best) > 0))
    }

    function loadState() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (!raw) return emptyState()
        return normalizeState(JSON.parse(raw))
      } catch {
        return emptyState()
      }
    }

    function saveState(state) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, updatedAt: Date.now() }))
      } catch {
        /* storage can be full or unavailable; the in-memory session still works */
      }
    }

    function loadDraft() {
      try {
        const raw = window.localStorage.getItem(DRAFT_KEY)
        return raw ? JSON.parse(raw) : null
      } catch {
        return null
      }
    }

    function patchDraft(patch) {
      try {
        const current = loadDraft() || {}
        window.localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ ...current, ...patch, savedAt: Date.now() }),
        )
      } catch {
        /* keep the in-memory state working even when storage is unavailable */
      }
    }

    function clearDraft() {
      try {
        window.localStorage.removeItem(DRAFT_KEY)
      } catch {
        /* ignore */
      }
    }

    /* ---------------------------------------------------------------- helpers */

    function countEnglishWords(text) {
      const matches = String(text || '').match(/[A-Za-z][A-Za-z'’-]*/g)
      return matches ? matches.length : 0
    }

    function countCjk(text) {
      const matches = String(text || '').match(/[\u4e00-\u9fff]/g)
      return matches ? matches.length : 0
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value))
    }

    function roundHalf(value) {
      return Math.round(value * 2) / 2
    }

    function topicById(state, id) {
      if (!id) return null
      return [...ALL_STATIC_TOPICS, ...(state.customTopics || [])].find((topic) => topic.id === id) || null
    }

    function topicsFor(state, kind, source) {
      const list = [...ALL_STATIC_TOPICS, ...(state.customTopics || [])]
      return list.filter((topic) => topic.kind === kind && topic.source === source)
    }

    function itemById(id) {
      return ITEM_MAP[id] || null
    }

    function kindLabel(kind) {
      return kind === 'big' ? '大作文' : kind === 'small' ? '小作文' : '翻译'
    }

    function formatDate(ts) {
      try {
        return new Date(ts).toLocaleString('zh-CN', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      } catch {
        return ''
      }
    }

    function scorePct(score, maxScore) {
      if (!Number.isFinite(Number(score)) || !Number.isFinite(Number(maxScore)) || Number(maxScore) <= 0) return 0
      return Math.round((Number(score) / Number(maxScore)) * 100)
    }

    function averageRate(history) {
      const graded = (history || []).filter(
        (entry) => entry.score !== null && entry.score !== undefined && Number.isFinite(Number(entry.score)),
      )
      if (!graded.length) return 0
      return Math.round(graded.reduce((sum, entry) => sum + scorePct(entry.score, entry.maxScore), 0) / graded.length)
    }

    function totalAttempts(state) {
      return ITEMS.reduce((sum, item) => sum + (Number(state.items[item.id] && state.items[item.id].attempts) || 0), 0)
    }

    async function getJson(url, init) {
      const response = await fetch(url, init)
      let data = null
      try {
        data = await response.json()
      } catch {
        data = null
      }
      if (!response.ok || !data || data.ok === false) {
        throw new Error((data && data.error) || 'HTTP ' + response.status)
      }
      return data
    }

    function postJson(url, body) {
      return getJson(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body || {}),
      })
    }

    function localTemplate(itemId) {
      const templates = {
        'big-p1':
          'The chart clearly illustrates the overall trend of ______. Specifically, the figure rose/fell from ______ to ______, while ______ remained relatively stable. This striking change deserves further analysis.',
        'big-p2':
          'Several factors may account for this trend. To begin with, ______, which directly contributes to ______. In addition, ______. Therefore, the phenomenon is best understood as the combined result of these forces.',
        'big-p3':
          'In conclusion, ______ is more than a temporary change. It is advisable that ______. Only in this way can we ______ in the years to come.',
        'small-p1':
          'I am writing to ______. The purpose of this letter is to ______, and I would like to provide the necessary details below.',
        'small-p2':
          'To begin with, ______. In addition, ______. It would be appreciated if you could ______ before ______.',
        'small-p3':
          'I would appreciate it if you could ______. I look forward to your reply. Thank you for your time and consideration.',
        translation:
          '本地模式无法生成参考译文。请对照原文逐句检查：主干是否译出、修饰关系是否清楚、中文是否按意群重新断句。',
      }
      if (itemId === 'big-full') {
        return [templates['big-p1'], templates['big-p2'], templates['big-p3']].join('\n\n')
      }
      if (itemId === 'small-full') {
        return [templates['small-p1'], templates['small-p2'], templates['small-p3']].join('\n\n')
      }
      return templates[itemId] || templates['big-p1']
    }

    const LOCAL_REUSE = {
      'big-p1': [
        { expression: 'The chart clearly illustrates the overall trend of ...', meaning: '图表清晰地展示了……的总体趋势', usage: '第一段首句，概括主题' },
        { expression: 'What stands out most is the sharp rise in ...', meaning: '最引人注目的是……的急剧上升', usage: '突出关键数据' },
        { expression: 'This striking change deserves further analysis.', meaning: '这一显著变化值得进一步分析', usage: '第一段末过渡句' },
      ],
      'big-p2': [
        { expression: 'Several factors may account for this trend.', meaning: '若干因素可以解释这一趋势', usage: '第二段首句' },
        { expression: 'To begin with, ...', meaning: '首先……', usage: '第一个原因' },
        { expression: 'Another factor that cannot be ignored is ...', meaning: '另一个不可忽视的因素是……', usage: '第二个原因' },
      ],
      'big-p3': [
        { expression: 'In conclusion, ...', meaning: '总之……', usage: '第三段首句' },
        { expression: 'It is advisable that ...', meaning: '建议……', usage: '提出建议' },
        { expression: 'Only in this way can we ...', meaning: '只有这样我们才能……', usage: '倒装收尾' },
      ],
      'small-p1': [
        { expression: 'I am writing to ...', meaning: '我写信是为了……', usage: '点明目的' },
        { expression: 'The purpose of this letter is to ...', meaning: '这封信的目的是……', usage: '正式说明来意' },
        { expression: 'I would like to ...', meaning: '我想……', usage: '礼貌表达意愿' },
      ],
      'small-p2': [
        { expression: 'To begin with, ...', meaning: '首先……', usage: '展开第一个要点' },
        { expression: 'In addition, ...', meaning: '此外……', usage: '补充第二个要点' },
        { expression: 'It would be appreciated if ...', meaning: '如果……将不胜感激', usage: '礼貌提出请求' },
      ],
      'small-p3': [
        { expression: 'I would appreciate it if you could ...', meaning: '如果您能……我将不胜感激', usage: '礼貌请求' },
        { expression: 'I look forward to your reply.', meaning: '期待您的回复', usage: '书信结尾' },
        { expression: 'Thank you for your time and consideration.', meaning: '感谢您的时间与考虑', usage: '正式收尾' },
      ],
      translation: [
        { expression: '值得注意的是……', meaning: 'It is worth noting that ...', usage: '引出重要信息' },
        { expression: '从长远来看……', meaning: 'In the long run, ...', usage: '表达趋势判断' },
        { expression: '这不仅……而且……', meaning: 'not only ... but also ...', usage: '处理并列递进' },
      ],
    }

    const NEXT_STEP = {
      'big-p1': '换题后先练“总体趋势 + 两个关键数据”的两句话开头，再补过渡句。',
      'big-p2': '换题后强迫自己写满两个原因，每个原因后面加一句解释或例子。',
      'big-p3': '换题后练“回扣主题 + 一条具体建议 + 倒装收尾”的三句结构。',
      'small-p1': '换题后先确定写信目的，再用一句话交代背景。',
      'small-p2': '换题后把三个要点写成三个有衔接的句子，而不是清单。',
      'small-p3': '换题后练“期待 + 感谢/歉意”的礼貌收尾，避免空话。',
      translation: '换题后先划出每句主干，再按中文意群重新断句。',
    }

    const LINKERS = [
      'however', 'therefore', 'moreover', 'furthermore', 'in addition', 'for example', 'for instance',
      'on the one hand', 'on the other hand', 'to begin with', 'in conclusion', 'as a result',
      'meanwhile', 'although', 'while', 'because', 'thus', 'first', 'second', 'finally', 'what is more',
    ]

    function localEvaluate(body) {
      const text = String(body.text || '').trim()
      const itemId = body.itemId || 'big-p1'
      const kind = body.kind || 'big'
      const mode = body.mode === 'full' ? 'full' : 'segment'
      const isTrans = kind === 'translation'
      const maxScore = Number(body.maxScore) || (mode === 'full' ? (kind === 'small' ? 10 : 15) : 10)
      const words = countEnglishWords(text)
      const chars = countCjk(text)
      const units = isTrans ? chars : words
      const target =
        mode === 'full'
          ? isTrans
            ? 260
            : kind === 'small'
              ? 100
              : 160
          : TARGETS[itemId] || 60
      const ratio = clamp(units / target, 0, 1.2)
      let score = mode === 'full' ? 5 + ratio * 6 : 4 + ratio * 4
      const lower = text.toLowerCase()
      const linkerHits = LINKERS.filter((word) => lower.includes(word)).length
      score += Math.min(1.2, linkerHits * 0.3)
      const sentences = text.split(/[.!?。！？]+/).filter((sentence) => sentence.trim().length > 0).length
      if (sentences >= 3) score += 0.3
      if (sentences >= 5) score += 0.2
      if (isTrans) {
        if (/[，。；：、]/.test(text)) score += 0.3
        if (chars >= target * 0.8) score += 0.2
      } else {
        if (itemId === 'big-p1' && /(chart|graph|figure|increase|decrease|rise|fall|grow|drop|percent|from .* to)/i.test(text)) score += 0.5
        if (itemId === 'big-p2' && /(reason|factor|because|due to|account for|contribute|result from)/i.test(text)) score += 0.5
        if (itemId === 'big-p3' && /(conclusion|therefore|suggest|should|future|only in this way|it is advisable)/i.test(text)) score += 0.5
        if (/\b(which|that|who|while|although|because|if|when)\b/i.test(text)) score += 0.3
      }
      score = roundHalf(clamp(score, 1, maxScore))
      const threshold = roundHalf(maxScore * 0.8)
      const highScore = score >= threshold

      const dimensions = isTrans
        ? [['理解准确', 0.3], ['中文表达', 0.3], ['衔接连贯', 0.2], ['语言规范', 0.2]]
        : mode === 'full'
          ? [['内容完整性', 0.35], ['组织衔接', 0.25], ['语言准确', 0.2], ['词汇句式', 0.2]]
          : [['内容达成', 0.3], ['组织衔接', 0.2], ['语言准确', 0.3], ['词汇句式', 0.2]]
      const rubric = dimensions.map(([criterion, weight]) => ({
        criterion,
        score: roundHalf(clamp(score * weight, 0, maxScore * weight)),
        max: roundHalf(maxScore * weight),
        comment:
          score >= threshold
            ? '达到高分线，继续保持。'
            : '还有提升空间，重点看下面的问题与改法。',
      }))

      const issues = []
      if (units < target * 0.75) {
        issues.push({
          quote: '',
          problem: `篇幅偏短：当前约 ${units} ${isTrans ? '字' : '词'}，目标约 ${target}。`,
          fix: isTrans ? '补出原文中省略的主语或逻辑关系，不要只译关键词。' : '增加一个具体细节或一句解释，把观点写完整。',
        })
      }
      if (linkerHits === 0) {
        issues.push({
          quote: '',
          problem: '句间缺少显性衔接，读起来像句子堆叠。',
          fix: '至少加入一处 To begin with / In addition / Therefore / However 等衔接。',
        })
      }
      if (!isTrans && itemId === 'big-p1' && !/(chart|graph|figure|increase|decrease|rise|fall|grow|drop|percent|from .* to)/i.test(text)) {
        issues.push({
          quote: '',
          problem: '第一段没有明确描述图表趋势或数据。',
          fix: '补一句 The chart shows that ... 和一句具体数据对比。',
        })
      }
      if (!isTrans && itemId === 'big-p2' && !/(reason|factor|because|due to|account for|contribute|result from)/i.test(text)) {
        issues.push({
          quote: '',
          problem: '第二段原因分析的语言标志不明显。',
          fix: '用 Several factors may account for ... / This is mainly because ... 引出原因。',
        })
      }
      if (!isTrans && itemId === 'big-p3' && !/(conclusion|therefore|suggest|should|future|only in this way|it is advisable)/i.test(text)) {
        issues.push({
          quote: '',
          problem: '第三段缺少明确的结论或建议。',
          fix: '用 In conclusion / It is advisable that ... 收束，并给出一个具体动作。',
        })
      }
      if (sentences <= 2 && units > 15) {
        issues.push({
          quote: '',
          problem: '句子数量偏少，信息可能挤在长句里。',
          fix: '把长句拆成 3—5 个意义清晰的句子，注意主谓一致。',
        })
      }
      if (isTrans && !/[，。；：、]/.test(text)) {
        issues.push({
          quote: '',
          problem: '中文标点使用不足，句群关系不清。',
          fix: '按意群使用逗号、分号或句号，避免英文式一逗到底。',
        })
      }
      if (issues.length === 0) {
        issues.push({
          quote: '',
          problem: '本地规则没有发现明显的结构性硬伤。',
          fix: '下一步重点是把表达写得更具体：每个抽象判断后补一个细节或例子。',
        })
      }

      return {
        score,
        maxScore,
        threshold,
        highScore,
        band: highScore ? '第五档（本地模拟）' : score >= maxScore * 0.6 ? '第四档（本地模拟）' : '第三档及以下（本地模拟）',
        summary: `本地规则诊断：约 ${units} ${isTrans ? '字' : '词'}，目标 ${target}；检测到 ${linkerHits} 处显性衔接。该结果不调用 AI，只用于模型不可用时的兜底。`,
        rubric,
        strengths: linkerHits > 0 ? [`使用了 ${linkerHits} 处衔接表达。`] : [],
        issues,
        revised: localTemplate(
          mode === 'full'
            ? kind === 'big'
              ? 'big-full'
              : kind === 'small'
                ? 'small-full'
                : 'translation'
            : itemId,
        ),
        reusable: LOCAL_REUSE[itemId] || LOCAL_REUSE['big-p1'],
        sectionComments: [],
        nextStep: NEXT_STEP[itemId] || NEXT_STEP['big-p1'],
        local: true,
      }
    }

    /* -------------------------------------------------------------------- css */

    const CSS = `
      .ew-root{display:flex;flex-direction:column;height:100%;min-height:0;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.55}
      .ew-top{flex:none;background:var(--dsw-alias-bg-layer-1);border-bottom:1px solid var(--dsw-alias-border-l1)}
      .ew-headRow{display:flex;align-items:center;gap:18px;padding:14px 22px 10px}
      .ew-brand{display:flex;align-items:center;gap:11px;min-width:0}
      .ew-logo{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;background:color-mix(in srgb,var(--dsw-alias-brand-primary) 13%,var(--dsw-alias-bg-layer-2));color:var(--dsw-alias-brand-primary);flex:none}
      .ew-title{margin:0;font-size:15px;font-weight:650;letter-spacing:.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .ew-sub{margin-top:2px;font-size:11.5px;color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .ew-headStats{display:flex;gap:8px;margin-left:auto;flex-wrap:wrap;justify-content:flex-end}
      .ew-statPill{display:flex;align-items:baseline;gap:5px;padding:4px 10px;border-radius:999px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);font-size:11px;color:var(--dsw-alias-label-secondary);white-space:nowrap}
      .ew-statPill b{font-size:12.5px;color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums}
      .ew-tabs{display:flex;gap:2px;padding:0 16px;overflow-x:auto}
      .ew-tab{position:relative;border:0;background:none;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12.5px;padding:8px 12px 9px;cursor:pointer;white-space:nowrap;border-radius:8px 8px 0 0}
      .ew-tab:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2)}
      .ew-tab.is-on{color:var(--dsw-alias-label-primary);font-weight:650}
      .ew-tab.is-on::after{content:"";position:absolute;left:10px;right:10px;bottom:-1px;height:2px;border-radius:2px;background:var(--dsw-alias-brand-primary)}
      .ew-scroll{flex:1;min-height:0;overflow:auto}
      .ew-wrap{max-width:1140px;margin:0 auto;padding:22px 26px 72px}
      .ew-hero{display:flex;gap:18px;align-items:stretch;margin-bottom:24px}
      .ew-heroText{flex:1;min-width:0;border:1px solid var(--dsw-alias-border-l1);border-radius:16px;padding:22px 24px;background:linear-gradient(135deg,color-mix(in srgb,var(--dsw-alias-brand-primary) 9%,var(--dsw-alias-bg-layer-1)),var(--dsw-alias-bg-layer-1) 62%)}
      .ew-heroKicker{font-size:11px;letter-spacing:.8px;color:var(--dsw-alias-brand-primary);font-weight:650;margin-bottom:7px}
      .ew-heroTitle{margin:0 0 8px;font-size:23px;letter-spacing:.2px;line-height:1.25}
      .ew-heroDesc{margin:0;max-width:680px;color:var(--dsw-alias-label-secondary);font-size:12.5px;line-height:1.7}
      .ew-heroActions{display:flex;gap:9px;margin-top:16px;flex-wrap:wrap}
      .ew-heroArt{width:196px;flex:none;border:1px solid var(--dsw-alias-border-l1);border-radius:16px;background:var(--dsw-alias-bg-layer-1);padding:16px;display:flex;flex-direction:column;justify-content:center;gap:10px}
      .ew-heroArtLabel{font-size:11px;letter-spacing:.5px;color:var(--dsw-alias-label-secondary)}
      .ew-heroArtNote{font-size:11px;color:var(--dsw-alias-label-secondary);line-height:1.5}
      .ew-section{margin-bottom:26px}
      .ew-sectionHead{display:flex;align-items:flex-end;gap:12px;margin-bottom:11px}
      .ew-sectionHead h2{margin:0;font-size:15px;font-weight:650}
      .ew-sectionHead p{margin:0;color:var(--dsw-alias-label-secondary);font-size:12px}
      .ew-sectionHead .ew-spacer{flex:1}
      .ew-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));gap:12px}
      .ew-item{position:relative;display:flex;flex-direction:column;gap:9px;text-align:left;padding:15px 16px 13px;border-radius:14px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:inherit;font:inherit;cursor:pointer;transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease}
      .ew-item:hover{transform:translateY(-1px);border-color:var(--dsw-alias-border-l2);box-shadow:0 4px 16px rgba(0,0,0,.05)}
      .ew-itemTop{display:flex;align-items:center;gap:10px}
      .ew-glyph{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;flex:none;background:color-mix(in srgb,var(--dsw-alias-brand-primary) 11%,var(--dsw-alias-bg-layer-2));color:var(--dsw-alias-brand-primary);font-size:12px;font-weight:700;letter-spacing:.3px}
      .ew-itemTitle{font-size:13.5px;font-weight:650;line-height:1.35}
      .ew-itemDesc{font-size:11.5px;color:var(--dsw-alias-label-secondary);min-height:34px}
      .ew-itemMeta{display:flex;align-items:center;gap:8px;margin-top:auto;padding-top:9px;border-top:1px dashed var(--dsw-alias-border-l1);font-size:11px;color:var(--dsw-alias-label-secondary)}
      .ew-badge{display:inline-flex;align-items:center;gap:4px;padding:1.5px 7px;border-radius:999px;font-size:10.5px;line-height:1.5;border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);white-space:nowrap}
      .ew-badgeGood{color:var(--dsw-alias-state-success-primary);border-color:color-mix(in srgb,var(--dsw-alias-state-success-primary) 55%,var(--dsw-alias-border-l1));background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 8%,transparent)}
      .ew-badgeWarn{color:var(--dsw-alias-state-warn-primary);border-color:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 55%,var(--dsw-alias-border-l1));background:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 8%,transparent)}
      .ew-badgeBrand{color:var(--dsw-alias-brand-primary);border-color:color-mix(in srgb,var(--dsw-alias-brand-primary) 45%,var(--dsw-alias-border-l1));background:color-mix(in srgb,var(--dsw-alias-brand-primary) 7%,transparent)}
      .ew-practice{display:grid;grid-template-columns:minmax(300px,.86fr) minmax(0,1.14fr);gap:18px;align-items:start}
      .ew-col{min-width:0;display:flex;flex-direction:column;gap:14px}
      .ew-card{border:1px solid var(--dsw-alias-border-l1);border-radius:14px;background:var(--dsw-alias-bg-layer-1);padding:16px 18px}
      .ew-cardHead{display:flex;align-items:center;gap:9px;margin-bottom:12px;flex-wrap:wrap}
      .ew-cardHead h3{margin:0;font-size:13.5px;font-weight:650}
      .ew-cardHead .ew-spacer{flex:1}
      .ew-link{border:0;background:none;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11.5px;cursor:pointer;padding:2px 4px;border-radius:5px}
      .ew-link:hover{color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-bg-layer-2)}
      .ew-topicTabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
      .ew-chip{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-secondary);font:inherit;font-size:11.5px;padding:4px 10px;border-radius:999px;cursor:pointer}
      .ew-chip:hover{border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary)}
      .ew-chip.is-on{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary);background:color-mix(in srgb,var(--dsw-alias-brand-primary) 8%,var(--dsw-alias-bg-base));font-weight:600}
      .ew-topicList{display:flex;flex-direction:column;gap:5px;max-height:174px;overflow:auto;padding-right:2px}
      .ew-topicItem{display:flex;align-items:flex-start;gap:8px;width:100%;text-align:left;border:1px solid transparent;background:none;color:inherit;font:inherit;font-size:11.5px;line-height:1.45;padding:6px 8px;border-radius:8px;cursor:pointer}
      .ew-topicItem:hover{background:var(--dsw-alias-bg-layer-2)}
      .ew-topicItem.is-on{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-border-l2)}
      .ew-topicItem b{flex:none;color:var(--dsw-alias-label-secondary);font-weight:600;font-variant-numeric:tabular-nums}
      .ew-topicItem span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .ew-promptTop{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:9px}
      .ew-promptTitle{margin:0 0 3px;font-size:15px;line-height:1.45}
      .ew-promptSub{margin:0 0 10px;font-size:12px;color:var(--dsw-alias-label-secondary);font-style:italic}
      .ew-directions{margin:0;padding:10px 12px;border-radius:9px;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l1);font-family:ui-serif,Georgia,"Times New Roman",serif;font-size:12.5px;line-height:1.65;color:var(--dsw-alias-label-primary)}
      .ew-data{margin:11px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:5px}
      .ew-data li{font-size:12px;color:var(--dsw-alias-label-secondary);padding-left:13px;position:relative}
      .ew-data li::before{content:"";position:absolute;left:2px;top:.62em;width:5px;height:5px;border-radius:50%;background:var(--dsw-alias-brand-primary);opacity:.7}
      .ew-keyPoints{margin:9px 0 0;padding-left:18px;font-size:12px;color:var(--dsw-alias-label-secondary)}
      .ew-keyPoints li{margin:2px 0}
      .ew-guidance{margin-top:11px;padding:10px 12px;border-left:2px solid var(--dsw-alias-brand-primary);background:color-mix(in srgb,var(--dsw-alias-brand-primary) 6%,var(--dsw-alias-bg-base));border-radius:0 8px 8px 0;font-size:12px;color:var(--dsw-alias-label-secondary);line-height:1.65}
      .ew-guidance b{color:var(--dsw-alias-label-primary);font-weight:650}
      .ew-passage{margin:11px 0 0;padding:12px 13px;border-radius:9px;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l1);font-family:ui-serif,Georgia,"Times New Roman",serif;font-size:13px;line-height:1.75;color:var(--dsw-alias-label-primary);white-space:pre-wrap}
      .ew-editorBar{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:8px}
      .ew-editorBar h3{margin:0;font-size:13.5px;font-weight:650}
      .ew-editorBar .ew-spacer{flex:1}
      .ew-count{font-size:11.5px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}
      .ew-count.is-low{color:var(--dsw-alias-state-warn-primary)}
      .ew-textarea{display:block;width:100%;min-height:270px;resize:vertical;box-sizing:border-box;padding:14px 15px;border-radius:11px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-family:ui-serif,Georgia,"Times New Roman",serif;font-size:14px;line-height:1.82;outline:none;transition:border-color .15s ease,box-shadow .15s ease}
      .ew-textarea:focus{border-color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--dsw-alias-brand-primary) 14%,transparent)}
      .ew-textarea::placeholder{color:var(--dsw-alias-state-idle-primary);font-family:inherit}
      .ew-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:11px}
      .ew-btn{font:inherit;font-size:12.5px;font-weight:600;padding:7px 15px;border-radius:8px;border:1px solid transparent;background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-bg-base);cursor:pointer;transition:opacity .15s ease,transform .15s ease}
      .ew-btn:hover:not(:disabled){opacity:.9}
      .ew-btn:active:not(:disabled){transform:translateY(1px)}
      .ew-btn:disabled{opacity:.45;cursor:default}
      .ew-btnGhost{background:transparent;color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-border-l2)}
      .ew-btnGhost:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2)}
      .ew-btnQuiet{background:transparent;color:var(--dsw-alias-label-secondary);border-color:transparent}
      .ew-btnQuiet:hover:not(:disabled){color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2)}
      .ew-btnSmall{font-size:11.5px;padding:4px 10px;border-radius:7px}
      .ew-error{margin:0 0 14px;padding:9px 12px;border-radius:9px;border:1px solid color-mix(in srgb,var(--dsw-alias-state-error-primary) 55%,var(--dsw-alias-border-l1));background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 7%,var(--dsw-alias-bg-layer-1));color:var(--dsw-alias-state-error-primary);font-size:12px}
      .ew-loading{display:flex;align-items:center;gap:10px;padding:16px;border-radius:11px;border:1px dashed var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-secondary);font-size:12.5px}
      .ew-spinner{width:16px;height:16px;border-radius:50%;border:2px solid var(--dsw-alias-border-l2);border-top-color:var(--dsw-alias-brand-primary);animation:ewspin .9s linear infinite;flex:none}
      @keyframes ewspin{to{transform:rotate(360deg)}}
      .ew-feedback{scroll-margin-top:14px}
      .ew-scoreRow{display:flex;align-items:center;gap:15px;padding-bottom:13px;border-bottom:1px solid var(--dsw-alias-border-l1);margin-bottom:13px}
      .ew-dial{width:74px;height:74px;border-radius:50%;display:grid;place-items:center;flex:none;position:relative}
      .ew-dialIn{width:58px;height:58px;border-radius:50%;background:var(--dsw-alias-bg-layer-1);display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1}
      .ew-dialIn b{font-size:19px;font-variant-numeric:tabular-nums}
      .ew-dialIn span{font-size:10px;color:var(--dsw-alias-label-secondary);margin-top:3px}
      .ew-feedbackMain{flex:1;min-width:0}
      .ew-feedbackTitle{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:3px;font-size:13.5px;font-weight:650}
      .ew-summary{margin:0;font-size:12.5px;line-height:1.65;color:var(--dsw-alias-label-secondary)}
      .ew-feedbackNote{margin:0 0 12px;padding:8px 10px;border-radius:8px;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l1);font-size:12px;color:var(--dsw-alias-label-secondary)}
      .ew-feedbackNote.is-good{color:var(--dsw-alias-state-success-primary);border-color:color-mix(in srgb,var(--dsw-alias-state-success-primary) 40%,var(--dsw-alias-border-l1));background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 7%,var(--dsw-alias-bg-base))}
      .ew-feedbackNote.is-warn{color:var(--dsw-alias-state-warn-primary);border-color:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 40%,var(--dsw-alias-border-l1));background:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 7%,var(--dsw-alias-bg-base))}
      .ew-subhead{display:flex;align-items:center;gap:6px;margin:15px 0 7px;font-size:11px;letter-spacing:.55px;color:var(--dsw-alias-label-secondary);font-weight:600}
      .ew-rubric{display:flex;flex-direction:column;gap:7px}
      .ew-rubricRow{display:grid;grid-template-columns:92px minmax(0,1fr) 44px;gap:9px;align-items:center;font-size:11.5px}
      .ew-rubricName{color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .ew-rubricBar{height:6px;border-radius:999px;background:var(--dsw-alias-bg-layer-2);overflow:hidden}
      .ew-rubricFill{height:100%;border-radius:999px;background:var(--dsw-alias-brand-primary);transition:width .45s ease}
      .ew-rubricScore{text-align:right;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}
      .ew-strengths{display:flex;gap:5px;flex-wrap:wrap}
      .ew-strength{font-size:11.5px;color:var(--dsw-alias-state-success-primary);background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 7%,transparent);border:1px solid color-mix(in srgb,var(--dsw-alias-state-success-primary) 35%,var(--dsw-alias-border-l1));border-radius:7px;padding:4px 8px;line-height:1.45}
      .ew-issues{display:flex;flex-direction:column;gap:8px}
      .ew-issue{border:1px solid var(--dsw-alias-border-l1);border-radius:9px;padding:9px 11px;background:var(--dsw-alias-bg-base)}
      .ew-issueQuote{margin:0 0 4px;font-family:ui-serif,Georgia,"Times New Roman",serif;font-size:12px;color:var(--dsw-alias-label-secondary);font-style:italic}
      .ew-issueProblem{margin:0;font-size:12px;line-height:1.55}
      .ew-issueFix{margin:5px 0 0;font-size:12px;line-height:1.55;color:var(--dsw-alias-state-success-primary)}
      .ew-issueFix b{font-weight:650}
      .ew-revised{margin:0;padding:11px 12px;border-radius:9px;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l1);font-family:ui-serif,Georgia,"Times New Roman",serif;font-size:13px;line-height:1.78;white-space:pre-wrap;color:var(--dsw-alias-label-primary)}
      .ew-reuse{display:flex;flex-direction:column;gap:7px}
      .ew-reuseRow{display:flex;gap:9px;align-items:flex-start;padding:8px 10px;border-radius:8px;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l1)}
      .ew-reuseText{flex:1;min-width:0}
      .ew-reuseExpr{font-family:ui-serif,Georgia,"Times New Roman",serif;font-size:12.5px;line-height:1.5}
      .ew-reuseMeta{font-size:11px;color:var(--dsw-alias-label-secondary);margin-top:2px;line-height:1.45}
      .ew-next{margin-top:13px;padding:10px 12px;border-radius:9px;background:color-mix(in srgb,var(--dsw-alias-brand-primary) 7%,var(--dsw-alias-bg-base));border:1px solid color-mix(in srgb,var(--dsw-alias-brand-primary) 30%,var(--dsw-alias-border-l1));font-size:12px;line-height:1.6}
      .ew-next b{color:var(--dsw-alias-brand-primary)}
      .ew-examGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-bottom:16px}
      .ew-examCard{text-align:left;padding:15px 16px;border-radius:13px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:inherit;font:inherit;cursor:pointer;display:flex;flex-direction:column;gap:7px;min-height:126px}
      .ew-examCard:hover{border-color:var(--dsw-alias-border-l2)}
      .ew-examCard.is-on{border-color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-brand-primary) 13%,transparent)}
      .ew-examCardTop{display:flex;align-items:center;gap:8px}
      .ew-examCardTitle{font-size:13.5px;font-weight:650}
      .ew-examCardDesc{font-size:11.5px;color:var(--dsw-alias-label-secondary);line-height:1.5;flex:1}
      .ew-bankFilters{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:13px}
      .ew-bankList{display:flex;flex-direction:column;gap:8px}
      .ew-bankCard{display:flex;align-items:flex-start;gap:12px;padding:12px 14px;border-radius:11px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}
      .ew-bankMain{flex:1;min-width:0}
      .ew-bankTitle{font-size:13px;font-weight:600;margin:0 0 2px;line-height:1.45}
      .ew-bankSub{font-size:11.5px;color:var(--dsw-alias-label-secondary);line-height:1.5}
      .ew-partBtns{display:flex;gap:4px;flex-wrap:wrap;margin-top:8px}
      .ew-empty{max-width:620px;padding:26px 24px;border:1px dashed var(--dsw-alias-border-l2);border-radius:13px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font-size:12.5px;line-height:1.7}
      .ew-empty h3{margin:0 0 6px;font-size:14px;color:var(--dsw-alias-label-primary)}
      .ew-history{display:flex;flex-direction:column;gap:8px}
      .ew-historyRow{border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1);overflow:hidden}
      .ew-historyHead{display:flex;align-items:center;gap:9px;width:100%;text-align:left;border:0;background:none;color:inherit;font:inherit;padding:10px 12px;cursor:pointer}
      .ew-historyHead:hover{background:var(--dsw-alias-bg-layer-2)}
      .ew-historyMain{flex:1;min-width:0}
      .ew-historyTitle{font-size:12.5px;font-weight:600;line-height:1.4}
      .ew-historyMeta{font-size:11px;color:var(--dsw-alias-label-secondary);margin-top:2px}
      .ew-historyScore{font-size:13px;font-weight:650;font-variant-numeric:tabular-nums;white-space:nowrap}
      .ew-historyBody{padding:0 12px 12px;border-top:1px dashed var(--dsw-alias-border-l1)}
      .ew-historyBody p{margin:9px 0 0;font-size:12px;color:var(--dsw-alias-label-secondary);line-height:1.65}
      .ew-answer{margin:0;padding:11px 12px;border-radius:9px;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l1);font-family:ui-serif,Georgia,"Times New Roman",serif;font-size:13px;line-height:1.78;white-space:pre-wrap;color:var(--dsw-alias-label-primary);max-height:340px;overflow:auto}
      .ew-archiveSummary{margin:9px 0 0;font-size:12.5px;line-height:1.65;color:var(--dsw-alias-label-secondary)}
      .ew-toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:60;padding:8px 15px;border-radius:999px;background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary);font-size:12px;box-shadow:0 8px 28px rgba(0,0,0,.18);animation:ewfade .18s ease-out}
      @keyframes ewfade{from{opacity:0;transform:translate(-50%,6px)}to{opacity:1;transform:translate(-50%,0)}}
      .ew-miniLabel{font-size:10.5px;letter-spacing:.5px;color:var(--dsw-alias-label-secondary);text-transform:uppercase}
      .ew-kbd{font-family:ui-monospace,Consolas,monospace;font-size:10.5px;border:1px solid var(--dsw-alias-border-l2);border-bottom-width:2px;border-radius:4px;padding:0 4px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-base)}
      .ew-chart{margin-top:12px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-base);padding:10px 12px 8px;overflow-x:auto;overflow-y:hidden}
      .ew-chartHead{font-size:10.5px;letter-spacing:.2px;color:var(--dsw-alias-label-secondary);margin-bottom:2px}
      .ew-chartUnit{color:var(--dsw-alias-label-secondary);opacity:.85}
      .ew-chartSvg{display:block;width:100%;min-width:420px;height:auto;max-height:300px}
      .ew-chartLegend{display:flex;gap:12px;flex-wrap:wrap;padding:2px 0 2px;font-size:10.5px;color:var(--dsw-alias-label-secondary)}
      .ew-legendItem{display:inline-flex;align-items:center;gap:5px;white-space:nowrap}
      .ew-legendSwatch{width:9px;height:9px;border-radius:2px;flex:none;box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)}
      .ew-pieWrap{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
      .ew-pieSvg{display:block;width:100%;max-width:300px;height:auto;flex:1 1 220px}
      .ew-pieLegend{display:flex;flex-direction:column;gap:4px;font-size:11px;min-width:150px;flex:1 1 150px}
      .ew-pieLegendRow{display:flex;align-items:center;gap:6px;color:var(--dsw-alias-label-secondary)}
      .ew-pieLegendRow b{margin-left:auto;color:var(--dsw-alias-label-primary);font-weight:600;font-variant-numeric:tabular-nums}
      .ew-tableWrap{overflow:auto;margin-top:12px;border:1px solid var(--dsw-alias-border-l1);border-radius:9px}
      .ew-table{width:100%;border-collapse:collapse;font-size:11.5px;min-width:380px}
      .ew-table th,.ew-table td{border-bottom:1px solid var(--dsw-alias-border-l1);border-right:1px solid var(--dsw-alias-border-l1);padding:6px 8px;text-align:center}
      .ew-table th:last-child,.ew-table td:last-child{border-right:0}
      .ew-table tbody tr:last-child td{border-bottom:0}
      .ew-table th{background:var(--dsw-alias-bg-layer-2);font-weight:650;color:var(--dsw-alias-label-primary)}
      .ew-table td{color:var(--dsw-alias-label-secondary)}
      .ew-table td:first-child{text-align:left;color:var(--dsw-alias-label-primary)}
      /* --- readability and simplified two-step layout --- */
      .ew-root{font-size:15px;line-height:1.62}
      .ew-headRow{padding:18px 26px 12px;gap:20px}
      .ew-title{font-size:17px}
      .ew-sub{font-size:12.5px}
      .ew-statPill{font-size:12px;padding:6px 12px}
      .ew-statPill b{font-size:14px}
      .ew-tabs{padding:0 20px;gap:4px}
      .ew-tab{font-size:14px;padding:10px 14px 11px}
      .ew-wrap{max-width:1040px;padding:28px 30px 80px}
      .ew-homeHead{padding:4px 2px 26px;max-width:780px}
      .ew-homeKicker{font-size:12px;letter-spacing:.8px;color:var(--dsw-alias-brand-primary);font-weight:650;margin-bottom:9px}
      .ew-homeTitle{margin:0 0 10px;font-size:29px;line-height:1.25;letter-spacing:.2px}
      .ew-homeDesc{margin:0;font-size:15px;line-height:1.75;color:var(--dsw-alias-label-secondary)}
      .ew-homeActions{display:flex;gap:10px;margin-top:18px;flex-wrap:wrap}
      .ew-section{margin-bottom:32px}
      .ew-sectionHead{margin-bottom:14px}
      .ew-sectionHead h2{font-size:18px}
      .ew-sectionHead p{font-size:13.5px}
      .ew-grid{grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px}
      .ew-item{padding:20px 20px 16px;border-radius:16px;gap:12px}
      .ew-glyph{width:40px;height:40px;border-radius:11px;font-size:14px}
      .ew-itemTitle{font-size:16px}
      .ew-itemDesc{font-size:13px;min-height:40px}
      .ew-itemMeta{font-size:12px;padding-top:12px}
      .ew-writing{max-width:940px;margin:0 auto;display:flex;flex-direction:column;gap:18px}
      .ew-stageHead{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:2px 0 4px}
      .ew-stageTitleWrap{min-width:0}
      .ew-stageTitle{margin:2px 0 0;font-size:22px;font-weight:650;line-height:1.3}
      .ew-chooser{padding:22px 24px}
      .ew-chooserHead{display:flex;align-items:flex-start;gap:14px;flex-wrap:wrap;margin-bottom:15px}
      .ew-chooserTitle{margin:2px 0 4px;font-size:21px;line-height:1.35}
      .ew-chooserDesc{margin:0;font-size:13px;line-height:1.6;color:var(--dsw-alias-label-secondary)}
      .ew-topicTabs{margin-bottom:14px}
      .ew-chip{font-size:13px;padding:6px 14px}
      .ew-topicGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}
      .ew-topicCard{display:flex;flex-direction:column;gap:7px;min-height:132px;text-align:left;padding:16px 18px;border-radius:13px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);color:inherit;font:inherit;cursor:pointer;transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease}
      .ew-topicCard:hover{transform:translateY(-1px);border-color:var(--dsw-alias-border-l2);box-shadow:0 4px 16px rgba(0,0,0,.05)}
      .ew-topicCard.is-on{border-color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-brand-primary) 13%,transparent)}
      .ew-topicCardTop{display:flex;gap:6px;flex-wrap:wrap}
      .ew-topicCardTitle{font-size:15px;font-weight:650;line-height:1.45}
      .ew-topicCardSub{flex:1;font-size:12px;line-height:1.5;color:var(--dsw-alias-label-secondary)}
      .ew-topicCardFoot{display:flex;justify-content:space-between;gap:8px;border-top:1px dashed var(--dsw-alias-border-l1);padding-top:8px;font-size:12px;color:var(--dsw-alias-brand-primary)}
      .ew-card{padding:20px 22px;border-radius:16px}
      .ew-promptTitle{font-size:20px;line-height:1.45}
      .ew-promptSub{font-size:13px}
      .ew-directions{font-size:14px;line-height:1.78;padding:12px 14px}
      .ew-guidance{font-size:13px;line-height:1.7;padding:12px 14px}
      .ew-passage{font-size:15px;line-height:1.85;padding:14px 16px}
      .ew-data li{font-size:13px}
      .ew-keyPoints{font-size:13px;line-height:1.7}
      .ew-textarea{min-height:320px;padding:16px 18px;font-size:16px;line-height:1.85}
      .ew-editorBar h3{font-size:15px}
      .ew-count{font-size:13px}
      .ew-btn{font-size:14px;padding:9px 18px}
      .ew-btnSmall{font-size:12.5px;padding:6px 12px}
      .ew-scoreRow{gap:18px}
      .ew-dial{width:84px;height:84px}
      .ew-dialIn{width:66px;height:66px}
      .ew-dialIn b{font-size:22px}
      .ew-feedbackTitle{font-size:15px}
      .ew-summary{font-size:14px;line-height:1.7}
      .ew-subhead{font-size:12px}
      .ew-issueProblem,.ew-issueFix{font-size:13px;line-height:1.65}
      .ew-revised,.ew-answer{font-size:14px;line-height:1.85}
      .ew-reuseExpr{font-size:13.5px}
      .ew-reuseMeta{font-size:12px}
      .ew-next{font-size:13px;line-height:1.65}
      .ew-examGrid{grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}
      .ew-examCard{padding:18px 20px;border-radius:15px;min-height:140px}
      .ew-examCardTitle{font-size:15px}
      .ew-examCardDesc{font-size:12.5px;line-height:1.55}
      .ew-bankTitle{font-size:14.5px}
      .ew-bankSub{font-size:12.5px}
      .ew-historyTitle{font-size:13.5px}
      .ew-historyMeta{font-size:12px}
      .ew-historyScore{font-size:15px}
      /* --- larger record and heading typography --- */
      .ew-title{font-size:18px}
      .ew-sub{font-size:13px}
      .ew-tab{font-size:15px}
      .ew-sectionHead h2{font-size:20px}
      .ew-sectionHead p{font-size:14px}
      .ew-cardHead h3{font-size:16px}
      .ew-promptTitle{font-size:21px}
      .ew-promptSub{font-size:13.5px}
      .ew-stageTitle{font-size:23px}
      .ew-chooserTitle{font-size:22px}
      .ew-homeTitle{font-size:30px}
      .ew-bankTitle{font-size:16px}
      .ew-itemTitle{font-size:17px}
      .ew-topicCardTitle{font-size:16px}
      .ew-examCardTitle{font-size:16px}
      .ew-bankSub{font-size:13.5px;line-height:1.55}
      .ew-historyHead{padding:13px 15px}
      .ew-historyTitle{font-size:15.5px;line-height:1.45}
      .ew-historyMeta{font-size:13px}
      .ew-historyScore{font-size:17px}
      .ew-historyBody{padding:0 15px 15px}
      .ew-historyBody p{font-size:13.5px;line-height:1.7}
      .ew-subhead{font-size:13px;letter-spacing:.35px}
      .ew-answer{font-size:15.5px;line-height:1.9}
      .ew-revised{font-size:15.5px;line-height:1.9}
      .ew-issueQuote{font-size:13.5px}
      .ew-issueProblem,.ew-issueFix{font-size:14px}
      .ew-reuseExpr{font-size:14.5px}
      .ew-reuseMeta{font-size:13px}
      .ew-next{font-size:13.5px}
      .ew-summary{font-size:14.5px}
      .ew-feedbackTitle{font-size:16px}
      .ew-archiveSummary{font-size:13.5px}
      .ew-empty{font-size:14px}
      .ew-empty h3{font-size:16px}
      .ew-bankCard{padding:14px 16px}
      @media(max-width:940px){.ew-practice{grid-template-columns:1fr}.ew-heroArt{display:none}}
      @media(max-width:700px){.ew-headStats{display:none}.ew-wrap{padding:16px 14px 60px}.ew-rubricRow{grid-template-columns:78px minmax(0,1fr) 38px}.ew-homeTitle{font-size:24px}.ew-homeDesc{font-size:14px}.ew-stageTitle{font-size:19px}.ew-chooserTitle{font-size:19px}.ew-topicGrid{grid-template-columns:1fr}.ew-topicCard{min-height:0}.ew-writing{gap:14px}.ew-card{padding:16px}.ew-textarea{min-height:260px}}
    `

    /* --------------------------------------------------------------- widgets */

    function PanelIcon(props) {
      const size = typeof props.size === 'number' ? props.size : 20
      const active = Boolean(props.active)
      const accent = active ? 'var(--dsw-alias-brand-primary)' : 'currentColor'
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          'aria-hidden': 'true',
          style: { display: 'block' },
        },
        h('path', {
          d: 'M4.5 5.6A2.6 2.6 0 0 1 7.1 3H19v16.1H7.1a2.6 2.6 0 0 0-2.6 2.6V5.6Z',
          stroke: accent,
          strokeWidth: 1.45,
          strokeLinejoin: 'round',
        }),
        h('path', {
          d: 'M7.8 7.2h7.4M7.8 10.2h5.2',
          stroke: accent,
          strokeWidth: 1.35,
          strokeLinecap: 'round',
        }),
        h('path', {
          d: 'm15.2 14.1 3.1 3.1-2 2-3.1-3.1v-2h2Z',
          stroke: accent,
          strokeWidth: 1.25,
          strokeLinejoin: 'round',
        }),
      )
    }

    function ItemGlyph(props) {
      const item = props.item
      const text = item.kind === 'big' ? '图' : item.kind === 'small' ? '信' : '译'
      return h('span', { className: 'ew-glyph' }, text)
    }

    function StatPill(props) {
      return h(
        'span',
        { className: 'ew-statPill' },
        h('span', null, props.label),
        h('b', null, props.value),
        props.suffix ? h('span', null, props.suffix) : null,
      )
    }

    function SectionHead(props) {
      return h(
        'div',
        { className: 'ew-sectionHead' },
        h('h2', null, props.title),
        props.desc ? h('p', null, props.desc) : null,
        h('span', { className: 'ew-spacer' }),
        props.extra || null,
      )
    }

    function ItemCard(props) {
      const item = props.item
      const progress = props.progress || emptyItem()
      const attempts = Number(progress.attempts) || 0
      const best = Number(progress.best) || 0
      return h(
        'button',
        {
          type: 'button',
          className: 'ew-item',
          onClick: props.onClick,
        },
        h(
          'div',
          { className: 'ew-itemTop' },
          h(ItemGlyph, { item }),
          h(
            'div',
            { style: { minWidth: 0 } },
            h('div', { className: 'ew-itemTitle' }, item.title),
            h('div', { className: 'ew-itemDesc' }, item.desc),
          ),
        ),
        h(
          'div',
          { className: 'ew-itemMeta' },
          h('span', null, attempts ? `已练 ${attempts} 次` : '尚未练习'),
          h(
            'span',
            { style: { marginLeft: 'auto' } },
            best ? `最高 ${best}/10` : '自由训练',
          ),
        ),
      )
    }

    function guidanceOf(topic, item) {
      if (!topic || !topic.guidance || !item) return ''
      if (item.kind === 'translation') return topic.guidance.translation || ''
      if (item.part === 1) return topic.guidance.p1 || ''
      if (item.part === 2) return topic.guidance.p2 || ''
      if (item.part === 3) return topic.guidance.p3 || ''
      return [topic.guidance.p1, topic.guidance.p2, topic.guidance.p3].filter(Boolean).join(' ')
    }

    const CHART_COLORS = [
      'var(--dsw-alias-brand-primary)',
      'var(--dsw-alias-state-success-primary)',
      'var(--dsw-alias-state-warn-primary)',
      'var(--dsw-alias-state-error-primary)',
      'var(--dsw-alias-state-idle-primary)',
    ]

    function chartColor(index) {
      return CHART_COLORS[index % CHART_COLORS.length]
    }

    function chartNumber(value) {
      const number = Number(value)
      if (!Number.isFinite(number)) return ''
      if (Math.abs(number) >= 1000) return Math.round(number).toLocaleString('en-US')
      return String(Math.round(number * 10) / 10)
    }

    function niceCeil(value) {
      const number = Number(value)
      if (!Number.isFinite(number) || number <= 0) return 1
      const exponent = Math.floor(Math.log10(number))
      const base = Math.pow(10, exponent)
      const normalized = number / base
      const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 5 ? 5 : 10
      return nice * base
    }

    function polarPoint(cx, cy, radius, angle) {
      const radians = ((angle - 90) * Math.PI) / 180
      return [cx + radius * Math.cos(radians), cy + radius * Math.sin(radians)]
    }

    function pieArcPath(cx, cy, radius, startAngle, endAngle) {
      const [x1, y1] = polarPoint(cx, cy, radius, startAngle)
      const [x2, y2] = polarPoint(cx, cy, radius, endAngle)
      const largeArc = endAngle - startAngle > 180 ? 1 : 0
      return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
    }

    function ChartLegend(props) {
      return h(
        'div',
        { className: 'ew-chartLegend' },
        (props.items || []).map((item, index) =>
          h(
            'span',
            { className: 'ew-legendItem', key: index },
            h('span', { className: 'ew-legendSwatch', style: { background: item.color } }),
            h('span', null, item.name),
            item.unit ? h('span', { className: 'ew-chartUnit' }, ` (${item.unit})`) : null,
          ),
        ),
      )
    }

    function BarChart(props) {
      const chart = props.chart
      const labels = Array.isArray(chart.labels) ? chart.labels : []
      const series = Array.isArray(chart.series) ? chart.series : []
      if (!labels.length || !series.length) return null
      const values = series.flatMap((row) => (Array.isArray(row.values) ? row.values.map(Number) : []))
      const max = niceCeil(Math.max(...values.filter((value) => Number.isFinite(value)), 1))
      const W = 560
      const H = 270
      const padL = 48
      const padR = 16
      const padT = 22
      const padB = 42
      const plotW = W - padL - padR
      const plotH = H - padT - padB
      const groupW = plotW / Math.max(labels.length, 1)
      const gap = 4
      const barW = Math.max(8, Math.min(36, (groupW * 0.72 - gap * (series.length - 1)) / Math.max(series.length, 1)))
      const barsW = barW * series.length + gap * (series.length - 1)
      const grid = [0, 0.25, 0.5, 0.75, 1]
      return h(
        'div',
        { className: 'ew-chart' },
        chart.yLabel ? h('div', { className: 'ew-chartHead' }, chart.yLabel) : null,
        h(
          'svg',
          {
            className: 'ew-chartSvg',
            viewBox: `0 0 ${W} ${H}`,
            role: 'img',
            'aria-label': chart.yLabel || 'bar chart',
          },
          grid.map((fraction, index) => {
            const y = padT + plotH - fraction * plotH
            return h(
              'g',
              { key: index },
              h('line', {
                x1: padL,
                y1: y,
                x2: W - padR,
                y2: y,
                stroke: 'var(--dsw-alias-border-l1)',
                strokeWidth: 1,
                strokeDasharray: index === 0 ? 'none' : '3 4',
              }),
              h(
                'text',
                {
                  x: padL - 7,
                  y: y + 3,
                  textAnchor: 'end',
                  fontSize: 9,
                  fill: 'var(--dsw-alias-label-secondary)',
                },
                chartNumber(max * fraction),
              ),
            )
          }),
          labels.map((label, labelIndex) => {
            const groupX = padL + groupW * labelIndex + groupW / 2
            const startX = groupX - barsW / 2
            return h(
              'g',
              { key: labelIndex },
              series.map((row, seriesIndex) => {
                const value = Number(row.values && row.values[labelIndex]) || 0
                const height = Math.max(0, (value / max) * plotH)
                const x = startX + seriesIndex * (barW + gap)
                const y = padT + plotH - height
                return h(
                  'g',
                  { key: seriesIndex },
                  h('rect', {
                    x,
                    y,
                    width: barW,
                    height,
                    rx: 2,
                    fill: chartColor(seriesIndex),
                    opacity: 0.9,
                  }),
                  labels.length <= 6
                    ? h(
                        'text',
                        {
                          x: x + barW / 2,
                          y: Math.max(padT + 9, y - 4),
                          textAnchor: 'middle',
                          fontSize: 8.5,
                          fill: 'var(--dsw-alias-label-secondary)',
                        },
                        chartNumber(value),
                      )
                    : null,
                )
              }),
              h(
                'text',
                {
                  x: groupX,
                  y: H - 16,
                  textAnchor: 'middle',
                  fontSize: 10,
                  fill: 'var(--dsw-alias-label-secondary)',
                },
                label,
              ),
            )
          }),
        ),
        series.length > 1
          ? h(ChartLegend, {
              items: series.map((row, index) => ({
                name: row.name || `Series ${index + 1}`,
                color: chartColor(index),
                unit: row.unit,
              })),
            })
          : null,
      )
    }

    function LineChart(props) {
      const chart = props.chart
      const labels = Array.isArray(chart.labels) ? chart.labels : []
      const series = Array.isArray(chart.series) ? chart.series : []
      if (!labels.length || !series.length) return null
      const leftSeries = series.filter((row) => row.axis !== 'right')
      const rightSeries = series.filter((row) => row.axis === 'right')
      const leftValues = leftSeries.flatMap((row) => (row.values || []).map(Number))
      const rightValues = rightSeries.flatMap((row) => (row.values || []).map(Number))
      const leftMax = niceCeil(Math.max(...leftValues.filter((value) => Number.isFinite(value)), 1))
      const rightMax = niceCeil(Math.max(...rightValues.filter((value) => Number.isFinite(value)), 1))
      const hasRight = rightSeries.length > 0
      const W = 560
      const H = 275
      const padL = 48
      const padR = hasRight ? 58 : 16
      const padT = 22
      const padB = 42
      const plotW = W - padL - padR
      const plotH = H - padT - padB
      const xFor = (index) =>
        labels.length === 1 ? padL + plotW / 2 : padL + (plotW * index) / (labels.length - 1)
      const grid = [0, 0.25, 0.5, 0.75, 1]
      return h(
        'div',
        { className: 'ew-chart' },
        chart.yLabel || chart.rightLabel
          ? h(
              'div',
              { className: 'ew-chartHead' },
              chart.yLabel || '',
              hasRight && chart.rightLabel ? h('span', { className: 'ew-chartUnit' }, ` / ${chart.rightLabel}`) : null,
            )
          : null,
        h(
          'svg',
          {
            className: 'ew-chartSvg',
            viewBox: `0 0 ${W} ${H}`,
            role: 'img',
            'aria-label': chart.yLabel || 'line chart',
          },
          grid.map((fraction, index) => {
            const y = padT + plotH - fraction * plotH
            return h(
              'g',
              { key: index },
              h('line', {
                x1: padL,
                y1: y,
                x2: W - padR,
                y2: y,
                stroke: 'var(--dsw-alias-border-l1)',
                strokeWidth: 1,
                strokeDasharray: index === 0 ? 'none' : '3 4',
              }),
              h(
                'text',
                {
                  x: padL - 7,
                  y: y + 3,
                  textAnchor: 'end',
                  fontSize: 9,
                  fill: 'var(--dsw-alias-label-secondary)',
                },
                chartNumber(leftMax * fraction),
              ),
              hasRight
                ? h(
                    'text',
                    {
                      x: W - padR + 7,
                      y: y + 3,
                      textAnchor: 'start',
                      fontSize: 9,
                      fill: 'var(--dsw-alias-label-secondary)',
                    },
                    chartNumber(rightMax * fraction),
                  )
                : null,
            )
          }),
          labels.map((label, index) =>
            h(
              'text',
              {
                key: index,
                x: xFor(index),
                y: H - 16,
                textAnchor: 'middle',
                fontSize: 10,
                fill: 'var(--dsw-alias-label-secondary)',
              },
              label,
            ),
          ),
          series.map((row, seriesIndex) => {
            const isRight = row.axis === 'right'
            const max = isRight ? rightMax : leftMax
            const points = (row.values || []).map((value, index) => {
              const numeric = Number(value) || 0
              return [xFor(index), padT + plotH - (numeric / max) * plotH, numeric]
            })
            return h(
              'g',
              { key: seriesIndex },
              h('polyline', {
                points: points.map((point) => `${point[0]},${point[1]}`).join(' '),
                fill: 'none',
                stroke: chartColor(seriesIndex),
                strokeWidth: 2,
                strokeLinejoin: 'round',
                strokeLinecap: 'round',
              }),
              points.map((point, index) =>
                h('g', { key: index },
                  h('circle', {
                    cx: point[0],
                    cy: point[1],
                    r: 3.5,
                    fill: 'var(--dsw-alias-bg-base)',
                    stroke: chartColor(seriesIndex),
                    strokeWidth: 2,
                  }),
                  h(
                    'text',
                    {
                      x: point[0],
                      y: point[1] - 8,
                      textAnchor: 'middle',
                      fontSize: 8.5,
                      fill: 'var(--dsw-alias-label-secondary)',
                    },
                    chartNumber(point[2]),
                  ),
                ),
              ),
            )
          }),
        ),
        h(ChartLegend, {
          items: series.map((row, index) => ({
            name: row.name || `Series ${index + 1}`,
            color: chartColor(index),
            unit: row.unit,
          })),
        }),
      )
    }

    function PieChart(props) {
      const chart = props.chart
      const labels = Array.isArray(chart.labels) ? chart.labels : []
      const values = Array.isArray(chart.values) ? chart.values.map(Number) : []
      if (!labels.length || !values.length) return null
      const total = values.reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0) || 1
      let angle = 0
      const slices = values.map((value, index) => {
        const sweep = (Math.max(0, Number(value) || 0) / total) * 360
        const slice = {
          label: labels[index] || `Slice ${index + 1}`,
          value: Number(value) || 0,
          start: angle,
          end: angle + sweep,
          color: chartColor(index),
        }
        angle += sweep
        return slice
      })
      const cx = 142
      const cy = 138
      const radius = 96
      return h(
        'div',
        { className: 'ew-chart' },
        h(
          'div',
          { className: 'ew-pieWrap' },
          h(
            'svg',
            {
              className: 'ew-pieSvg',
              viewBox: '0 0 300 280',
              role: 'img',
              'aria-label': 'pie chart',
            },
            slices.map((slice, index) =>
              h('path', {
                key: index,
                d: pieArcPath(cx, cy, radius, slice.start, slice.end),
                fill: slice.color,
                stroke: 'var(--dsw-alias-bg-base)',
                strokeWidth: 1.5,
                opacity: 0.92,
              }),
            ),
            h('circle', {
              cx,
              cy,
              r: 30,
              fill: 'var(--dsw-alias-bg-layer-1)',
              stroke: 'var(--dsw-alias-border-l1)',
              strokeWidth: 1,
            }),
            h(
              'text',
              {
                x: cx,
                y: cy - 3,
                textAnchor: 'middle',
                fontSize: 10,
                fill: 'var(--dsw-alias-label-secondary)',
              },
              chart.unit || '%',
            ),
            h(
              'text',
              {
                x: cx,
                y: cy + 11,
                textAnchor: 'middle',
                fontSize: 9,
                fill: 'var(--dsw-alias-label-secondary)',
              },
              '100%',
            ),
          ),
          h(
            'div',
            { className: 'ew-pieLegend' },
            slices.map((slice, index) =>
              h(
                'div',
                { className: 'ew-pieLegendRow', key: index },
                h('span', { className: 'ew-legendSwatch', style: { background: slice.color } }),
                h('span', null, slice.label),
                h('b', null, `${chartNumber(slice.value)}${chart.unit || ''}`),
              ),
            ),
          ),
        ),
      )
    }

    function TableChart(props) {
      const chart = props.chart
      const columns = Array.isArray(chart.columns) ? chart.columns : []
      const rows = Array.isArray(chart.rows) ? chart.rows : []
      if (!columns.length || !rows.length) return null
      return h(
        'div',
        { className: 'ew-tableWrap' },
        h(
          'table',
          { className: 'ew-table' },
          h(
            'thead',
            null,
            h(
              'tr',
              null,
              columns.map((column, index) => h('th', { key: index }, column)),
            ),
          ),
          h(
            'tbody',
            null,
            rows.map((row, rowIndex) =>
              h(
                'tr',
                { key: rowIndex },
                row.map((cell, cellIndex) => h('td', { key: cellIndex }, cell)),
              ),
            ),
          ),
        ),
      )
    }

    function ChartView(props) {
      const chart = props.chart
      if (!chart || !chart.type) return null
      if (chart.type === 'table') return h(TableChart, { chart })
      if (chart.type === 'pie') return h(PieChart, { chart })
      if (chart.type === 'line') return h(LineChart, { chart })
      return h(BarChart, { chart })
    }

    function TopicPrompt(props) {
      const topic = props.topic
      const item = props.item
      const t = props.t
      if (!topic) {
        return h('div', { className: 'ew-card ew-empty' }, t('label.noTopics'))
      }
      const isTrans = topic.kind === 'translation'
      const chart =
        topic.kind === 'big' ? topic.chart || TOPIC_CHARTS[topic.id] || null : null
      return h(
        'div',
        { className: 'ew-card' },
        h(
          'div',
          { className: 'ew-promptTop' },
          h(
            'span',
            { className: 'ew-badge ' + (topic.source === 'real' ? 'ew-badgeBrand' : 'ew-badgeWarn') },
            topic.source === 'real'
              ? t('label.sourceReal') + (topic.year ? ' · ' + topic.year : '')
              : t('label.sourceAI'),
          ),
          topic.chartType ? h('span', { className: 'ew-badge' }, topic.chartType) : null,
          topic.letterType ? h('span', { className: 'ew-badge' }, topic.letterType) : null,
        ),
        h('h2', { className: 'ew-promptTitle' }, topic.titleZh || topic.title),
        topic.title && topic.titleZh ? h('p', { className: 'ew-promptSub' }, topic.title) : null,
        h('p', { className: 'ew-directions' }, topic.directions || ''),
        chart ? h(ChartView, { chart }) : null,
        isTrans ? h('div', { className: 'ew-passage' }, topic.passage || '') : null,
        !chart && !isTrans && Array.isArray(topic.data) && topic.data.length
          ? h(
              'ul',
              { className: 'ew-data' },
              topic.data.map((line, index) => h('li', { key: index }, line)),
            )
          : null,
        !isTrans && topic.scenario
          ? h('p', { className: 'ew-bankSub', style: { marginTop: 11 } }, h('b', null, t('label.scenario') + '：'), topic.scenario)
          : null,
        !isTrans && Array.isArray(topic.keyPoints) && topic.keyPoints.length
          ? h(
              'div',
              { style: { marginTop: 9 } },
              h('div', { className: 'ew-miniLabel' }, t('label.keyPoints')),
              h(
                'ul',
                { className: 'ew-keyPoints' },
                topic.keyPoints.map((point, index) => h('li', { key: index }, point)),
              ),
            )
          : null,
        h(
          'div',
          { className: 'ew-guidance' },
          h('b', null, t('label.guidance') + '：'),
          guidanceOf(topic, item) || '按题目要求完成本段。',
        ),
      )
    }

    function TopicPicker(props) {
      const t = props.t
      const topics = props.topics || []
      return h(
        'div',
        { className: 'ew-card' },
        h(
          'div',
          { className: 'ew-cardHead' },
          h('h3', null, t('label.topic')),
          h('span', { className: 'ew-spacer' }),
          props.onGenerate
            ? h(
                'button',
                {
                  type: 'button',
                  className: 'ew-btn ew-btnGhost ew-btnSmall',
                  disabled: props.generating,
                  onClick: props.onGenerate,
                },
                props.generating ? t('action.aiTopicBusy') : t('action.aiTopic'),
              )
            : null,
        ),
        h(
          'div',
          { className: 'ew-topicTabs' },
          h(
            'button',
            {
              type: 'button',
              className: 'ew-chip' + (props.source === 'real' ? ' is-on' : ''),
              onClick: () => props.onSource('real'),
            },
            t('label.sourceReal'),
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'ew-chip' + (props.source === 'ai' ? ' is-on' : ''),
              onClick: () => props.onSource('ai'),
            },
            t('label.sourceAI'),
          ),
        ),
        topics.length
          ? h(
              'div',
              { className: 'ew-topicList' },
              topics.map((topic) =>
                h(
                  'button',
                  {
                    key: topic.id,
                    type: 'button',
                    className: 'ew-topicItem' + (props.current && props.current.id === topic.id ? ' is-on' : ''),
                    onClick: () => props.onPick(topic),
                    title: topic.titleZh || topic.title,
                  },
                  h('b', null, topic.year || 'AI'),
                  h('span', null, topic.titleZh || topic.title || ''),
                ),
              ),
            )
          : h('div', { className: 'ew-bankSub' }, t('label.noTopics')),
      )
    }

    function TopicChooser(props) {
      const t = props.t
      const topics = Array.isArray(props.topics) ? props.topics : []
      return h(
        'div',
        { className: 'ew-card ew-chooser' },
        h(
          'div',
          { className: 'ew-chooserHead' },
          h(
            'div',
            { style: { minWidth: 0 } },
            h('div', { className: 'ew-miniLabel' }, t('label.topic')),
            h('h2', { className: 'ew-chooserTitle' }, t('label.chooseTopic')),
            h('p', { className: 'ew-chooserDesc' }, '选一道题进入写作；进入后不再显示选题列表。'),
          ),
          h('span', { className: 'ew-spacer' }),
          h('span', { className: 'ew-badge' }, `${topics.length} 道`),
          props.onGenerate
            ? h(
                'button',
                {
                  type: 'button',
                  className: 'ew-btn ew-btnGhost',
                  disabled: props.generating,
                  onClick: props.onGenerate,
                },
                props.generating ? t('action.aiTopicBusy') : t('action.aiTopic'),
              )
            : null,
        ),
        h(
          'div',
          { className: 'ew-topicTabs' },
          h(
            'button',
            {
              type: 'button',
              className: 'ew-chip' + (props.source === 'real' ? ' is-on' : ''),
              onClick: () => props.onSource('real'),
            },
            t('label.sourceReal'),
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'ew-chip' + (props.source === 'ai' ? ' is-on' : ''),
              onClick: () => props.onSource('ai'),
            },
            t('label.sourceAI'),
          ),
        ),
        topics.length
          ? h(
              'div',
              { className: 'ew-topicGrid' },
              topics.map((topic) => {
                const active = props.current && props.current.id === topic.id
                return h(
                  'button',
                  {
                    key: topic.id,
                    type: 'button',
                    className: 'ew-topicCard' + (active ? ' is-on' : ''),
                    onClick: () => props.onPick(topic),
                  },
                  h(
                    'div',
                    { className: 'ew-topicCardTop' },
                    h(
                      'span',
                      { className: 'ew-badge ' + (topic.source === 'real' ? 'ew-badgeBrand' : 'ew-badgeWarn') },
                      topic.source === 'real'
                        ? t('label.sourceReal') + (topic.year ? ' · ' + topic.year : '')
                        : t('label.sourceAI'),
                    ),
                    topic.chartType || topic.letterType
                      ? h('span', { className: 'ew-badge' }, topic.chartType || topic.letterType)
                      : null,
                    topic.aiGenerated ? h('span', { className: 'ew-badge' }, t('label.aiGenerated')) : null,
                  ),
                  h('div', { className: 'ew-topicCardTitle' }, topic.titleZh || topic.title),
                  h('div', { className: 'ew-topicCardSub' }, topic.title || ''),
                  h(
                    'div',
                    { className: 'ew-topicCardFoot' },
                    h('span', null, topic.chartType || topic.letterType || '英译汉'),
                    h('span', null, '开始写 →'),
                  ),
                )
              }),
            )
          : h('div', { className: 'ew-empty', style: { padding: '18px 16px' } }, t('label.noTopics')),
      )
    }

    function Editor(props) {
      const t = props.t
      const text = props.text
      const isTrans = props.isTrans
      const units = isTrans ? countCjk(text) : countEnglishWords(text)
      const target = props.target || 60
      const low = units < target * 0.7
      return h(
        'div',
        { className: 'ew-card' },
        h(
          'div',
          { className: 'ew-editorBar' },
          h('h3', null, props.title || t('label.answer')),
          h('span', { className: 'ew-spacer' }),
          h(
            'span',
            { className: 'ew-count' + (low ? ' is-low' : '') },
            `${units} ${isTrans ? t('label.chars') : t('label.words')} / ${t('label.target')} ${target}`,
          ),
        ),
        h('textarea', {
          ref: props.textareaRef,
          className: 'ew-textarea',
          value: text,
          placeholder: props.placeholder || '',
          onChange: (event) => props.onChange(event.target.value),
          onKeyDown: (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
              event.preventDefault()
              props.onSubmit()
            }
          },
        }),
        h(
          'div',
          { className: 'ew-actions' },
          h(
            'button',
            {
              type: 'button',
              className: 'ew-btn',
              disabled: props.busy || text.trim().length < 10,
              onClick: props.onSubmit,
            },
            props.busy ? props.busyLabel || t('action.submitting') : props.submitLabel || t('action.submit'),
          ),
          h(
            'button',
            { type: 'button', className: 'ew-btn ew-btnGhost', disabled: props.busy, onClick: props.onRetry },
            t('action.retry'),
          ),
          h(
            'span',
            { className: 'ew-bankSub', style: { marginLeft: 'auto' } },
            h('span', { className: 'ew-kbd' }, 'Ctrl'),
            ' + ',
            h('span', { className: 'ew-kbd' }, 'Enter'),
          ),
        ),
      )
    }

    function ScoreDial(props) {
      const pct = scorePct(props.score, props.maxScore)
      return h(
        'div',
        {
          className: 'ew-dial',
          style: { background: `conic-gradient(var(--dsw-alias-brand-primary) ${pct}%, var(--dsw-alias-bg-layer-2) 0)` },
        },
        h(
          'div',
          { className: 'ew-dialIn' },
          h('b', null, props.score === null || props.score === undefined ? '—' : props.score),
          h('span', null, `/ ${props.maxScore}`),
        ),
      )
    }

    function outcomeText(outcome, t) {
      if (!outcome) return ''
      return outcome.highScore ? t('label.highThisTime') : t('label.lowThisTime')
    }

    function FeedbackCard(props) {
      const feedback = props.feedback
      const item = props.item
      const t = props.t
      if (!feedback) return null
      const note = outcomeText(props.outcome, t)
      const noteClass = props.outcome ? (props.outcome.highScore ? ' is-good' : ' is-warn') : ''
      const local = Boolean(feedback.local)
      return h(
        'div',
        { className: 'ew-card ew-feedback' },
        h(
          'div',
          { className: 'ew-scoreRow' },
          h(ScoreDial, { score: feedback.score, maxScore: feedback.maxScore }),
          h(
            'div',
            { className: 'ew-feedbackMain' },
            h(
              'div',
              { className: 'ew-feedbackTitle' },
              h('span', null, t('label.feedback')),
              h(
                'span',
                { className: 'ew-badge ' + (feedback.highScore ? 'ew-badgeGood' : 'ew-badgeWarn') },
                feedback.highScore ? '高分' : '待提升',
              ),
              feedback.band ? h('span', { className: 'ew-badge' }, feedback.band) : null,
              local ? h('span', { className: 'ew-badge ew-badgeWarn' }, t('label.local')) : null,
              feedback.model
                ? h(
                    'span',
                    { className: 'ew-badge', title: feedback.model },
                    String(feedback.model).split('/').pop(),
                  )
                : null,
            ),
            h('p', { className: 'ew-summary' }, feedback.summary || ''),
          ),
        ),
        note ? h('p', { className: 'ew-feedbackNote' + noteClass }, note) : null,
        local ? h('p', { className: 'ew-bankSub', style: { marginBottom: 10 } }, t('label.localNotice')) : null,
        Array.isArray(feedback.rubric) && feedback.rubric.length
          ? h(
              'div',
              null,
              h('div', { className: 'ew-subhead' }, t('label.rubric')),
              h(
                'div',
                { className: 'ew-rubric' },
                feedback.rubric.map((row, index) =>
                  h(
                    'div',
                    { className: 'ew-rubricRow', key: index, title: row.comment || '' },
                    h('span', { className: 'ew-rubricName' }, row.criterion || '—'),
                    h(
                      'span',
                      { className: 'ew-rubricBar' },
                      h('i', {
                        className: 'ew-rubricFill',
                        style: { width: scorePct(row.score, row.max) + '%' },
                      }),
                    ),
                    h('span', { className: 'ew-rubricScore' }, `${row.score}/${row.max}`),
                  ),
                ),
              ),
            )
          : null,
        Array.isArray(feedback.strengths) && feedback.strengths.length
          ? h(
              'div',
              null,
              h('div', { className: 'ew-subhead' }, t('label.strengths')),
              h(
                'div',
                { className: 'ew-strengths' },
                feedback.strengths.map((line, index) => h('span', { className: 'ew-strength', key: index }, line)),
              ),
            )
          : null,
        Array.isArray(feedback.sectionComments) && feedback.sectionComments.length
          ? h(
              'div',
              null,
              h('div', { className: 'ew-subhead' }, '逐段评价'),
              h(
                'div',
                { className: 'ew-issues' },
                feedback.sectionComments.map((row, index) =>
                  h(
                    'div',
                    { className: 'ew-issue', key: index },
                    h('p', { className: 'ew-issueProblem' }, h('b', null, row.part + '：'), row.comment),
                  ),
                ),
              ),
            )
          : null,
        Array.isArray(feedback.issues) && feedback.issues.length
          ? h(
              'div',
              null,
              h('div', { className: 'ew-subhead' }, t('label.issues')),
              h(
                'div',
                { className: 'ew-issues' },
                feedback.issues.map((row, index) =>
                  h(
                    'div',
                    { className: 'ew-issue', key: index },
                    row.quote ? h('p', { className: 'ew-issueQuote' }, '“' + row.quote + '”') : null,
                    h('p', { className: 'ew-issueProblem' }, row.problem),
                    row.fix ? h('p', { className: 'ew-issueFix' }, h('b', null, '改法：'), row.fix) : null,
                  ),
                ),
              ),
            )
          : null,
        feedback.revised
          ? h(
              'div',
              null,
              h(
                'div',
                { className: 'ew-subhead' },
                t('label.revised'),
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'ew-link',
                    onClick: () => props.onCopy(feedback.revised),
                  },
                  t('action.copy'),
                ),
              ),
              h('pre', { className: 'ew-revised' }, feedback.revised),
            )
          : null,
        Array.isArray(feedback.reusable) && feedback.reusable.length
          ? h(
              'div',
              null,
              h('div', { className: 'ew-subhead' }, t('label.reusable')),
              h(
                'div',
                { className: 'ew-reuse' },
                feedback.reusable.map((row, index) =>
                  h(
                    'div',
                    { className: 'ew-reuseRow', key: index },
                    h(
                      'div',
                      { className: 'ew-reuseText' },
                      h('div', { className: 'ew-reuseExpr' }, row.expression),
                      h(
                        'div',
                        { className: 'ew-reuseMeta' },
                        [row.meaning, row.usage].filter(Boolean).join(' · '),
                      ),
                    ),
                    h(
                      'button',
                      {
                        type: 'button',
                        className: 'ew-btn ew-btnGhost ew-btnSmall',
                        onClick: () => props.onCopy(row.expression),
                      },
                      t('action.copy'),
                    ),
                  ),
                ),
              ),
            )
          : null,
        feedback.nextStep
          ? h('div', { className: 'ew-next' }, h('b', null, t('label.nextStep') + '：'), feedback.nextStep)
          : null,
        h(
          'div',
          { className: 'ew-actions' },
          h('button', { type: 'button', className: 'ew-btn', onClick: props.onNext }, t('action.nextTopic')),
          h('button', { type: 'button', className: 'ew-btn ew-btnGhost', onClick: props.onRetry }, t('action.retry')),
          props.onExam ? h('button', { type: 'button', className: 'ew-btn ew-btnQuiet', onClick: props.onExam }, t('action.goExam')) : null,
          feedback.raw
            ? h(
                'button',
                {
                  type: 'button',
                  className: 'ew-btn ew-btnQuiet',
                  onClick: () => props.onCopy(feedback.raw),
                },
                '复制原始回复',
              )
            : null,
        ),
      )
    }

    function ExamCard(props) {
      const t = props.t
      const kind = props.kind
      const title = kind === 'big' ? '大作文整篇' : kind === 'small' ? '小作文整篇' : '翻译整篇'
      const desc =
        kind === 'big'
          ? '图表作文 150+ 词，15 分制，含逐段评价'
          : kind === 'small'
            ? '应用文约 100 词，10 分制，检查格式与要点'
            : '英译汉整段，15 分制，检查理解与中文表达'
      return h(
        'button',
        {
          type: 'button',
          className: 'ew-examCard' + (props.active ? ' is-on' : ''),
          onClick: props.onClick,
        },
        h(
          'div',
          { className: 'ew-examCardTop' },
          h('span', { className: 'ew-examCardTitle' }, title),
          h('span', { className: 'ew-badge ew-badgeGood' }, t('label.examReady')),
        ),
        h('div', { className: 'ew-examCardDesc' }, desc),
        h(
          'div',
          { className: 'ew-bankSub', style: { display: 'flex', justifyContent: 'space-between' } },
          h('span', null, '点击开始'),
          h('span', null, kind === 'big' ? '15 分' : kind === 'small' ? '10 分' : '15 分'),
        ),
      )
    }

    function HistoryDetail(props) {
      const entry = props.entry
      const t = props.t
      const fb = entry.feedback || {}
      const issues = Array.isArray(fb.issues) ? fb.issues.filter((row) => row && typeof row === 'object') : []
      const reusable = Array.isArray(fb.reusable) ? fb.reusable.filter((row) => row && row.expression) : []
      const sections = Array.isArray(fb.sectionComments)
        ? fb.sectionComments.filter((row) => row && typeof row === 'object')
        : []
      return h(
        'div',
        { className: 'ew-historyBody' },
        h(
          'div',
          { className: 'ew-subhead' },
          t('label.answer'),
          entry.text
            ? h(
                'button',
                {
                  type: 'button',
                  className: 'ew-link',
                  onClick: () => props.onCopy(entry.text),
                },
                t('action.copy'),
              )
            : null,
        ),
        entry.text
          ? h('pre', { className: 'ew-answer' }, entry.text)
          : h('p', { className: 'ew-bankSub' }, '这条记录没有保存作答原文。'),
        fb.summary ? h('p', { className: 'ew-archiveSummary' }, fb.summary) : null,
        sections.length
          ? h(
              'div',
              null,
              h('div', { className: 'ew-subhead' }, '逐段评价'),
              h(
                'div',
                { className: 'ew-issues' },
                sections.map((row, index) =>
                  h(
                    'div',
                    { className: 'ew-issue', key: index },
                    h('p', { className: 'ew-issueProblem' }, h('b', null, (row.part || '段落') + '：'), row.comment || ''),
                  ),
                ),
              ),
            )
          : null,
        issues.length
          ? h(
              'div',
              null,
              h('div', { className: 'ew-subhead' }, t('label.issues')),
              h(
                'div',
                { className: 'ew-issues' },
                issues.map((row, index) =>
                  h(
                    'div',
                    { className: 'ew-issue', key: index },
                    row.quote ? h('p', { className: 'ew-issueQuote' }, '“' + row.quote + '”') : null,
                    h('p', { className: 'ew-issueProblem' }, row.problem || ''),
                    row.fix ? h('p', { className: 'ew-issueFix' }, h('b', null, '改法：'), row.fix) : null,
                  ),
                ),
              ),
            )
          : null,
        fb.revised
          ? h(
              'div',
              null,
              h(
                'div',
                { className: 'ew-subhead' },
                t('label.revised'),
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'ew-link',
                    onClick: () => props.onCopy(fb.revised),
                  },
                  t('action.copy'),
                ),
              ),
              h('pre', { className: 'ew-revised' }, fb.revised),
            )
          : null,
        reusable.length
          ? h(
              'div',
              null,
              h('div', { className: 'ew-subhead' }, t('label.reusable')),
              h(
                'div',
                { className: 'ew-reuse' },
                reusable.map((row, index) =>
                  h(
                    'div',
                    { className: 'ew-reuseRow', key: index },
                    h(
                      'div',
                      { className: 'ew-reuseText' },
                      h('div', { className: 'ew-reuseExpr' }, row.expression),
                      h(
                        'div',
                        { className: 'ew-reuseMeta' },
                        [row.meaning, row.usage].filter(Boolean).join(' · '),
                      ),
                    ),
                    h(
                      'button',
                      {
                        type: 'button',
                        className: 'ew-btn ew-btnGhost ew-btnSmall',
                        onClick: () => props.onCopy(row.expression),
                      },
                      t('action.copy'),
                    ),
                  ),
                ),
              ),
            )
          : null,
        fb.nextStep
          ? h('div', { className: 'ew-next' }, h('b', null, t('label.nextStep') + '：'), fb.nextStep)
          : null,
        props.onPractice
          ? h(
              'div',
              { className: 'ew-actions' },
              h('button', { type: 'button', className: 'ew-btn ew-btnGhost ew-btnSmall', onClick: props.onPractice }, t('action.practice')),
            )
          : null,
      )
    }

    /* ------------------------------------------------------------------- page */

    function Page(props) {
      const ctx = props.ctx
      const t = useT(ctx)
      const [draft] = useState(loadDraft)
      const [state, setState] = useState(loadState)
      const [tab, setTab] = useState(draft && draft.tab ? draft.tab : 'train')
      const [selectedItemId, setSelectedItemId] = useState(draft ? draft.selectedItemId || null : null)
      const [practiceStage, setPracticeStage] = useState(draft && draft.practiceStage ? draft.practiceStage : 'pick')
      const [source, setSource] = useState(draft && draft.source ? draft.source : 'real')
      const [topicId, setTopicId] = useState(draft ? draft.topicId || null : null)
      const [text, setText] = useState(draft && typeof draft.text === 'string' ? draft.text : '')
      const [pending, setPending] = useState(Boolean(draft && draft.pending))
      const [pendingKind, setPendingKind] = useState(draft && draft.pendingKind ? draft.pendingKind : null)
      const [busy, setBusy] = useState(Boolean(draft && draft.pending && draft.pendingKind !== 'exam'))
      const [feedback, setFeedback] = useState(draft ? draft.feedback || null : null)
      const [outcome, setOutcome] = useState(draft ? draft.outcome || null : null)
      const [error, setError] = useState(draft && draft.error ? draft.error : '')
      const [toast, setToast] = useState('')
      const [generating, setGenerating] = useState(false)
      const [examKind, setExamKind] = useState(draft && draft.examKind ? draft.examKind : 'big')
      const [examStage, setExamStage] = useState(draft && draft.examStage ? draft.examStage : 'pick')
      const [examSource, setExamSource] = useState(draft && draft.examSource ? draft.examSource : 'real')
      const [examTopicId, setExamTopicId] = useState(draft ? draft.examTopicId || null : null)
      const [examText, setExamText] = useState(draft && typeof draft.examText === 'string' ? draft.examText : '')
      const [examBusy, setExamBusy] = useState(Boolean(draft && draft.pending && draft.pendingKind === 'exam'))
      const [examFeedback, setExamFeedback] = useState(draft ? draft.examFeedback || null : null)
      const [bankKind, setBankKind] = useState('all')
      const [historyOpen, setHistoryOpen] = useState(null)
      const [confirmReset, setConfirmReset] = useState(false)
      const toastTimer = useRef(null)
      const feedbackRef = useRef(null)
      const textareaRef = useRef(null)
      const hydrated = useRef(false)
      const syncTimer = useRef(null)

      /* One-time reconcile with the host file: whichever side is newer wins.
       * First run on a machine that predates host storage uploads the records
       * already sitting in localStorage, so nothing is lost on upgrade. */
      useEffect(() => {
        let alive = true
        const initial = loadState()
        ;(async () => {
          const host = await fetchHostState()
          if (!alive) return
          if (!host.reachable) {
            /* offline or old host half: keep working off localStorage and do
             * not touch the file, so a transient failure cannot overwrite it */
            hydrated.current = true
            return
          }
          if (!host.state) {
            hydrated.current = true
            if (hasRecords(initial)) pushHostState(initial)
            return
          }
          if (host.state.updatedAt >= initial.updatedAt) {
            hydrated.current = true
            setState(host.state)
          } else {
            await pushHostState(initial)
            if (alive) hydrated.current = true
          }
        })()
        return () => {
          alive = false
        }
      }, [])

      useEffect(() => {
        saveState(state)
        if (!hydrated.current) return
        if (syncTimer.current) clearTimeout(syncTimer.current)
        syncTimer.current = setTimeout(() => {
          syncTimer.current = null
          pushHostState(state)
        }, SYNC_DELAY_MS)
      }, [state])

      useEffect(
        () => () => {
          if (syncTimer.current) clearTimeout(syncTimer.current)
        },
        [],
      )

      /* Coming back to this window after practising on another device: adopt
       * the host copy when it is newer, so the next local write does not push
       * a stale snapshot over the records the other device just added. Skipped
       * while a local write is still waiting to be flushed. */
      useEffect(() => {
        const resync = async () => {
          if (!hydrated.current || syncTimer.current) return
          if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return
          const host = await fetchHostState()
          if (!host.reachable || !host.state) return
          setState((prev) => (host.state.updatedAt > (prev.updatedAt || 0) ? host.state : prev))
        }
        window.addEventListener('focus', resync)
        document.addEventListener('visibilitychange', resync)
        return () => {
          window.removeEventListener('focus', resync)
          document.removeEventListener('visibilitychange', resync)
        }
      }, [])

      useEffect(() => {
        patchDraft({
          tab,
          selectedItemId,
          practiceStage,
          source,
          topicId,
          text,
          feedback,
          outcome,
          error,
          examKind,
          examStage,
          examSource,
          examTopicId,
          examText,
          examFeedback,
        })
      }, [
        tab,
        selectedItemId,
        practiceStage,
        source,
        topicId,
        text,
        feedback,
        outcome,
        error,
        examKind,
        examStage,
        examSource,
        examTopicId,
        examText,
        examFeedback,
      ])

      useEffect(() => {
        if (!pending) return undefined
        let elapsed = 0
        const timer = window.setInterval(() => {
          elapsed += 1200
          const next = loadDraft()
          if (!next || next.pending !== true) {
            if (next) {
              setText(typeof next.text === 'string' ? next.text : '')
              setFeedback(next.feedback || null)
              setOutcome(next.outcome || null)
              setExamText(typeof next.examText === 'string' ? next.examText : '')
              setExamFeedback(next.examFeedback || null)
              setError(next.error || '')
            }
            setBusy(false)
            setExamBusy(false)
            setPending(false)
            setPendingKind(null)
            window.clearInterval(timer)
            return
          }
          if (elapsed > 90000) {
            const message = '上次批改没有返回结果，请重新提交。'
            patchDraft({ pending: false, pendingKind: null, error: message })
            setBusy(false)
            setExamBusy(false)
            setPending(false)
            setPendingKind(null)
            setError(message)
            window.clearInterval(timer)
          }
        }, 1200)
        return () => window.clearInterval(timer)
      }, [pending])

      useEffect(() => {
        return () => {
          if (toastTimer.current) window.clearTimeout(toastTimer.current)
        }
      }, [])

      useEffect(() => {
        if (!feedback) return undefined
        const timer = window.setTimeout(() => {
          if (feedbackRef.current && feedbackRef.current.scrollIntoView) {
            feedbackRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 90)
        return () => window.clearTimeout(timer)
      }, [feedback])

      const showToast = useCallback((message) => {
        setToast(message)
        if (toastTimer.current) window.clearTimeout(toastTimer.current)
        toastTimer.current = window.setTimeout(() => setToast(''), 2800)
      }, [])

      const copyText = useCallback(
        async (value) => {
          try {
            await navigator.clipboard.writeText(String(value || ''))
            showToast(t('label.copyDone'))
          } catch {
            showToast(t('label.copyFail'))
          }
        },
        [showToast, t],
      )

      const selectedItem = selectedItemId ? itemById(selectedItemId) : null
      const topics = selectedItem ? topicsFor(state, selectedItem.kind, source) : []
      const currentTopic =
        topics.find((topic) => topic.id === topicId) || topics[0] || null
      const progress = selectedItem ? state.items[selectedItem.id] || emptyItem() : emptyItem()
      const examTopics = topicsFor(state, examKind, examSource)
      const examTopic = examTopics.find((topic) => topic.id === examTopicId) || examTopics[0] || null
      const attempts = totalAttempts(state)
      const avg = averageRate(state.history)

      const openItem = useCallback((item) => {
        setSelectedItemId(item.id)
        setPracticeStage('pick')
        setSource('real')
        setTopicId(null)
        setText('')
        setFeedback(null)
        setOutcome(null)
        setError('')
      }, [])

      const startFirst = useCallback(() => {
        const next = ITEMS.find((item) => !(Number(state.items[item.id] && state.items[item.id].attempts) > 0)) || ITEMS[0]
        setTab('train')
        openItem(next)
      }, [openItem, state])

      const startPractice = useCallback((topic, itemId) => {
        setTab('train')
        setSelectedItemId(itemId)
        setPracticeStage('write')
        setSource(topic.source)
        setTopicId(topic.id)
        setText('')
        setFeedback(null)
        setOutcome(null)
        setError('')
      }, [])

      const nextTopic = useCallback(() => {
        setPracticeStage('pick')
        setText('')
        setFeedback(null)
        setOutcome(null)
        setError('')
      }, [])

      const retrySame = useCallback(() => {
        setText('')
        setFeedback(null)
        setOutcome(null)
        setError('')
        if (textareaRef.current) textareaRef.current.focus()
      }, [])

      const submitSegment = useCallback(async () => {
        if (!selectedItem || !currentTopic || busy) return
        const value = text.trim()
        if (value.length < 10) {
          setError(t('label.tooShort'))
          return
        }
        setBusy(true)
        setPending(true)
        setPendingKind('train')
        setError('')
        setFeedback(null)
        setOutcome(null)
        patchDraft({
          pending: true,
          pendingKind: 'train',
          pendingKey: selectedItem.id + ':' + currentTopic.id,
          tab: 'train',
          selectedItemId: selectedItem.id,
          practiceStage: 'write',
          source: currentTopic.source,
          topicId: currentTopic.id,
          text: value,
          feedback: null,
          outcome: null,
          error: '',
        })
        try {
          const current = state.items[selectedItem.id] || emptyItem()
          const body = {
            mode: 'segment',
            kind: selectedItem.kind,
            itemId: selectedItem.id,
            part: selectedItem.part,
            topic: currentTopic,
            text: value,
            attempt: current.attempts + 1,
            maxScore: 10,
          }
          const response = await postJson(API + '/evaluate', body)
          let evaluation = response.evaluation
          let local = false
          if (
            !evaluation ||
            evaluation.score === null ||
            evaluation.score === undefined ||
            !Number.isFinite(Number(evaluation.score))
          ) {
            evaluation = localEvaluate({ ...body, raw: response.raw })
            local = true
          }
          evaluation.local = local
          if (local) evaluation.raw = response.raw || ''
          evaluation.model = response.model || ''
          const high = evaluation.score !== null && evaluation.highScore
          const nextProgress = {
            ...current,
            best: Math.max(current.best || 0, Number(evaluation.score) || 0),
            attempts: current.attempts + 1,
          }
          const entry = {
            id: 'h' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            at: Date.now(),
            itemId: selectedItem.id,
            itemTitle: selectedItem.title,
            topicId: currentTopic.id,
            topicTitle: currentTopic.titleZh || currentTopic.title,
            source: currentTopic.source,
            year: currentTopic.year || '',
            score: evaluation.score,
            maxScore: evaluation.maxScore,
            highScore: evaluation.highScore,
            local,
            feedback: evaluation,
            text: value,
          }
          setState((prev) => ({
            ...prev,
            items: { ...prev.items, [selectedItem.id]: nextProgress },
            history: [entry, ...prev.history].slice(0, 80),
          }))
          setFeedback(evaluation)
          setOutcome({ highScore: high })
          setPending(false)
          setPendingKind(null)
          patchDraft({
            pending: false,
            pendingKind: null,
            pendingKey: null,
            text: value,
            feedback: evaluation,
            outcome: { highScore: high },
            error: '',
            tab: 'train',
            selectedItemId: selectedItem.id,
            practiceStage: 'write',
            source: currentTopic.source,
            topicId: currentTopic.id,
          })
        } catch (err) {
          const message = String((err && err.message) || err)
          patchDraft({ pending: false, pendingKind: null, pendingKey: null, error: message })
          setPending(false)
          setPendingKind(null)
          setError(message)
        } finally {
          setBusy(false)
        }
      }, [busy, currentTopic, selectedItem, state, t, text])

      const generateTopic = useCallback(async () => {
        if (!selectedItem || generating) return
        setGenerating(true)
        setError('')
        try {
          const response = await postJson(API + '/evaluate', {
            action: 'generate-topic',
            kind: selectedItem.kind,
            chartType: selectedItem.kind === 'big' ? '柱状图' : undefined,
            avoid: topics.slice(0, 12).map((topic) => topic.titleZh || topic.title),
          })
          if (!response.topic) throw new Error('没有生成有效题目')
          setState((prev) => ({
            ...prev,
            customTopics: [response.topic, ...prev.customTopics].slice(0, 40),
          }))
          setSource('ai')
          setTopicId(response.topic.id)
          setPracticeStage('write')
          setText('')
          setFeedback(null)
          setOutcome(null)
          showToast('AI 已生成新题')
        } catch (err) {
          const list = AI_TOPICS.filter(
            (topic) => topic.kind === selectedItem.kind && (!currentTopic || topic.id !== currentTopic.id),
          )
          const fallback = list[Math.floor(Math.random() * list.length)]
          if (fallback) {
            setSource('ai')
            setTopicId(fallback.id)
            setPracticeStage('write')
            setText('')
            setFeedback(null)
            setOutcome(null)
            showToast('AI 服务暂不可用，已切换到本地 AI 题库')
          } else {
            setError('AI 出题失败：' + String((err && err.message) || err))
          }
        } finally {
          setGenerating(false)
        }
      }, [currentTopic, generating, selectedItem, showToast, topics])

      const startExam = useCallback((kind) => {
        setExamKind(kind)
        setExamStage('pick')
        setExamSource('real')
        setExamTopicId(null)
        setExamText('')
        setExamFeedback(null)
        setError('')
      }, [])

      const submitExam = useCallback(async () => {
        if (!examTopic || examBusy) return
        const value = examText.trim()
        if (value.length < 30) {
          setError(t('label.examTooShort'))
          return
        }
        setExamBusy(true)
        setPending(true)
        setPendingKind('exam')
        setError('')
        setExamFeedback(null)
        const maxScore = examKind === 'small' ? 10 : 15
        patchDraft({
          pending: true,
          pendingKind: 'exam',
          pendingKey: 'exam:' + examTopic.id,
          tab: 'exam',
          examKind,
          examStage: 'write',
          examSource,
          examTopicId: examTopic.id,
          examText: value,
          examFeedback: null,
          error: '',
        })
        try {
          const body = {
            mode: 'full',
            kind: examKind,
            itemId: examKind === 'big' ? 'big-p1' : examKind === 'small' ? 'small-p1' : 'translation',
            topic: examTopic,
            text: value,
            maxScore,
          }
          const response = await postJson(API + '/evaluate', body)
          let evaluation = response.evaluation
          let local = false
          if (
            !evaluation ||
            evaluation.score === null ||
            evaluation.score === undefined ||
            !Number.isFinite(Number(evaluation.score))
          ) {
            evaluation = localEvaluate({ ...body, raw: response.raw })
            local = true
          }
          evaluation.local = local
          if (local) evaluation.raw = response.raw || ''
          evaluation.model = response.model || ''
          setExamFeedback(evaluation)
          setPending(false)
          setPendingKind(null)
          patchDraft({
            pending: false,
            pendingKind: null,
            pendingKey: null,
            tab: 'exam',
            examKind,
            examStage: 'write',
            examSource,
            examTopicId: examTopic.id,
            examText: value,
            examFeedback: evaluation,
            error: '',
          })
          const entry = {
            id: 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            at: Date.now(),
            kind: examKind,
            topicId: examTopic.id,
            topicTitle: examTopic.titleZh || examTopic.title,
            score: evaluation.score,
            maxScore: evaluation.maxScore,
            highScore: evaluation.highScore,
            local,
            feedback: evaluation,
            text: value,
          }
          setState((prev) => ({ ...prev, exams: [entry, ...prev.exams].slice(0, 20) }))
        } catch (err) {
          const message = String((err && err.message) || err)
          patchDraft({ pending: false, pendingKind: null, pendingKey: null, error: message })
          setPending(false)
          setPendingKind(null)
          setError(message)
        } finally {
          setExamBusy(false)
        }
      }, [examBusy, examKind, examText, examTopic, t])

      const resetAll = useCallback(() => {
        setState(emptyState())
        clearDraft()
        setSelectedItemId(null)
        setPracticeStage('pick')
        setExamStage('pick')
        setText('')
        setExamText('')
        setFeedback(null)
        setOutcome(null)
        setExamFeedback(null)
        setPending(false)
        setPendingKind(null)
        setBusy(false)
        setExamBusy(false)
        setConfirmReset(false)
        showToast('已清空全部训练记录')
      }, [showToast])

      const renderHome = () => {
        const groups = ['big', 'small', 'translation']
        return h(
          'div',
          null,
          h(
            'div',
            { className: 'ew-homeHead' },
            h('div', { className: 'ew-homeKicker' }, '考研英语二 · 主观题'),
            h('h1', { className: 'ew-homeTitle' }, t('label.heroTitle')),
            h('p', { className: 'ew-homeDesc' }, t('label.heroDesc')),
            h(
              'div',
              { className: 'ew-homeActions' },
              h('button', { type: 'button', className: 'ew-btn', onClick: startFirst }, t('action.start')),
              h(
                'button',
                { type: 'button', className: 'ew-btn ew-btnGhost', onClick: () => setTab('bank') },
                t('label.openBank'),
              ),
            ),
          ),
          groups.map((group) => {
            const groupItems = ITEMS.filter((item) => item.group === group)
            return h(
              'section',
              { className: 'ew-section', key: group },
              h(SectionHead, {
                title: group === 'big' ? t('label.bankBig') : group === 'small' ? t('label.bankSmall') : t('label.bankTrans'),
                desc: group === 'big' ? '图表描述 → 原因分析 → 评论建议' : group === 'small' ? '点明目的 → 展开细节 → 礼貌收尾' : '理解、重组、中文表达',
                extra: h('span', { className: 'ew-badge' }, `${groupItems.length} 项`),
              }),
              h(
                'div',
                { className: 'ew-grid' },
                groupItems.map((item) =>
                  h(ItemCard, {
                    key: item.id,
                    item,
                    progress: state.items[item.id],
                    onClick: () => openItem(item),
                  }),
                ),
              ),
            )
          }),
        )
      }

      const renderPractice = () => {
        if (!selectedItem) return null
        const backToItems = () => {
          setSelectedItemId(null)
          setPracticeStage('pick')
          setFeedback(null)
          setOutcome(null)
        }
        const backToTopics = () => {
          setPracticeStage('pick')
          setText('')
          setFeedback(null)
          setOutcome(null)
          setError('')
        }
        const header = h(
          'div',
          { className: 'ew-stageHead' },
          h(
            'button',
            { type: 'button', className: 'ew-btn ew-btnGhost ew-btnSmall', onClick: backToItems },
            '← ' + t('action.back'),
          ),
          h(
            'div',
            { className: 'ew-stageTitleWrap' },
            h('div', { className: 'ew-miniLabel' }, GROUP_LABEL[selectedItem.kind]),
            h('h2', { className: 'ew-stageTitle' }, selectedItem.title),
          ),
          h('span', { className: 'ew-spacer' }),
          h('span', { className: 'ew-badge' }, `已练 ${progress.attempts || 0} 次`),
          progress.best ? h('span', { className: 'ew-badge' }, `最高 ${progress.best}/10`) : null,
          practiceStage === 'write'
            ? h(
                'button',
                { type: 'button', className: 'ew-btn ew-btnGhost ew-btnSmall', onClick: backToTopics },
                t('action.changeTopic'),
              )
            : null,
        )

        if (practiceStage !== 'write' || !currentTopic) {
          return h(
            'div',
            { className: 'ew-writing' },
            header,
            h(TopicChooser, {
              t,
              topics,
              current: topicId ? currentTopic : null,
              source,
              generating,
              onSource: (next) => {
                setSource(next)
                setTopicId(null)
                setFeedback(null)
                setOutcome(null)
              },
              onPick: (topic) => {
                setTopicId(topic.id)
                setPracticeStage('write')
                setText('')
                setFeedback(null)
                setOutcome(null)
                setError('')
              },
              onGenerate: generateTopic,
            }),
          )
        }

        return h(
          'div',
          { className: 'ew-writing' },
          header,
          h(TopicPrompt, { t, topic: currentTopic, item: selectedItem }),
          h(Editor, {
            t,
            item: selectedItem,
            title: selectedItem.kind === 'translation' ? '你的翻译' : '你的本段',
            text,
            target: selectedItem.id === 'translation' ? 220 : selectedItem.target,
            isTrans: selectedItem.kind === 'translation',
            busy,
            textareaRef,
            placeholder:
              selectedItem.kind === 'translation'
                ? '把上面的英文段落翻译成中文……'
                : '用英文写下这一段，先求完整，再求准确和高分……',
            onChange: setText,
            onSubmit: submitSegment,
            onRetry: retrySame,
          }),
          busy ? h('div', { className: 'ew-loading' }, h('span', { className: 'ew-spinner' }), h('span', null, t('label.thinking'))) : null,
          feedback
            ? h(
                'div',
                { ref: feedbackRef },
                h(FeedbackCard, {
                  t,
                  feedback,
                  item: selectedItem,
                  outcome,
                  onNext: nextTopic,
                  onRetry: retrySame,
                  onCopy: copyText,
                  onExam: selectedItem.kind !== 'translation' ? () => setTab('exam') : null,
                }),
              )
            : null,
        )
      }

      const renderExamWorkspace = () => {
        if (!examTopic) return h('div', { className: 'ew-empty' }, t('label.noTopics'))
        const target = examKind === 'translation' ? 260 : examKind === 'small' ? 100 : 160
        const backToExamPick = () => {
          setExamStage('pick')
          setExamText('')
          setExamFeedback(null)
        }
        return h(
          'div',
          { className: 'ew-writing' },
          h(
            'div',
            { className: 'ew-stageHead' },
            h(
              'button',
              { type: 'button', className: 'ew-btn ew-btnGhost ew-btnSmall', onClick: backToExamPick },
              '← ' + t('label.fullExam'),
            ),
            h(
              'div',
              { className: 'ew-stageTitleWrap' },
              h('div', { className: 'ew-miniLabel' }, kindLabel(examKind)),
              h('h2', { className: 'ew-stageTitle' }, kindLabel(examKind) + '整篇'),
            ),
            h('span', { className: 'ew-spacer' }),
            h(
              'button',
              { type: 'button', className: 'ew-btn ew-btnGhost ew-btnSmall', onClick: backToExamPick },
              t('action.changeTopic'),
            ),
          ),
          h(TopicPrompt, {
            t,
            topic: examTopic,
            item: { kind: examKind, part: 0 },
          }),
          h(Editor, {
            t,
            item: { id: examKind, kind: examKind, part: 0 },
            title: t('label.examWrite'),
            text: examText,
            target,
            isTrans: examKind === 'translation',
            busy: examBusy,
            submitLabel: t('label.examSubmit'),
            busyLabel: t('label.examSubmitting'),
            textareaRef,
            placeholder:
              examKind === 'translation'
                ? '写出完整的中文译文……'
                : '写出完整作文，注意分段、字数与卷面……',
            onChange: setExamText,
            onSubmit: submitExam,
            onRetry: () => {
              setExamText('')
              setExamFeedback(null)
            },
          }),
          examBusy
            ? h('div', { className: 'ew-loading' }, h('span', { className: 'ew-spinner' }), h('span', null, t('label.examSubmitting')))
            : null,
          examFeedback
            ? h(
                'div',
                { ref: feedbackRef },
                h(FeedbackCard, {
                  t,
                  feedback: examFeedback,
                  item: { id: examKind, kind: examKind, part: 0 },
                  outcome: null,
                  onNext: () => {
                    setExamFeedback(null)
                    setExamText('')
                  },
                  onRetry: () => {
                    setExamText('')
                    setExamFeedback(null)
                  },
                  onCopy: copyText,
                  onExam: null,
                }),
              )
            : null,
        )
      }

      const renderExam = () => {
        const kinds = ['big', 'small', 'translation']
        if (examStage === 'write') return renderExamWorkspace()
        return h(
          'div',
          null,
          h(SectionHead, {
            title: t('label.fullExam'),
            desc: t('label.examIntro'),
          }),
          h(
            'div',
            { className: 'ew-examGrid' },
            kinds.map((kind) =>
              h(ExamCard, {
                key: kind,
                t,
                kind,
                active: examKind === kind,
                onClick: () => startExam(kind),
              }),
            ),
          ),
          h(TopicChooser, {
            t,
            topics: examTopics,
            current: examTopicId ? examTopic : null,
            source: examSource,
            generating: false,
            onSource: (next) => {
              setExamSource(next)
              setExamTopicId(null)
              setExamFeedback(null)
            },
            onPick: (topic) => {
              setExamTopicId(topic.id)
              setExamStage('write')
              setExamText('')
              setExamFeedback(null)
              setError('')
            },
          }),
        )
      }

      const renderBank = () => {
        const list = [...ALL_STATIC_TOPICS, ...state.customTopics].filter(
          (topic) => bankKind === 'all' || topic.kind === bankKind,
        )
        const filters = [
          ['all', t('label.bankAll')],
          ['big', t('label.bankBig')],
          ['small', t('label.bankSmall')],
          ['translation', t('label.bankTrans')],
        ]
        return h(
          'div',
          null,
          h(SectionHead, {
            title: t('tab.bank'),
            desc: '2010—2020 英语二真题 + AI 仿真题。选一道题，直接进入对应段落的训练。',
          }),
          h(
            'div',
            { className: 'ew-bankFilters' },
            filters.map(([id, label]) =>
              h(
                'button',
                {
                  key: id,
                  type: 'button',
                  className: 'ew-chip' + (bankKind === id ? ' is-on' : ''),
                  onClick: () => setBankKind(id),
                },
                label,
              ),
            ),
          ),
          h(
            'div',
            { className: 'ew-bankList' },
            list.map((topic) => {
              const itemIds =
                topic.kind === 'big'
                  ? ['big-p1', 'big-p2', 'big-p3']
                  : topic.kind === 'small'
                    ? ['small-p1', 'small-p2', 'small-p3']
                    : ['translation']
              return h(
                'div',
                { className: 'ew-bankCard', key: topic.id },
                h(
                  'div',
                  { className: 'ew-bankMain' },
                  h(
                    'div',
                    { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 } },
                    h(
                      'span',
                      { className: 'ew-badge ' + (topic.source === 'real' ? 'ew-badgeBrand' : 'ew-badgeWarn') },
                      topic.source === 'real' ? t('label.sourceReal') : t('label.sourceAI'),
                    ),
                    topic.year ? h('span', { className: 'ew-badge' }, `${topic.year}`) : null,
                    topic.chartType ? h('span', { className: 'ew-badge' }, topic.chartType) : null,
                    topic.letterType ? h('span', { className: 'ew-badge' }, topic.letterType) : null,
                  ),
                  h('div', { className: 'ew-bankTitle' }, topic.titleZh || topic.title),
                  h('div', { className: 'ew-bankSub' }, topic.title || ''),
                  h(
                    'div',
                    { className: 'ew-partBtns' },
                    itemIds.map((itemId) => {
                      const item = ITEM_MAP[itemId]
                      const label =
                        itemId === 'translation'
                          ? '翻译'
                          : itemId.endsWith('p1')
                            ? '第一段'
                            : itemId.endsWith('p2')
                              ? '第二段'
                              : '第三段'
                      return h(
                        'button',
                        {
                          key: itemId,
                          type: 'button',
                          className: 'ew-btn ew-btnGhost ew-btnSmall',
                          onClick: () => startPractice(topic, itemId),
                        },
                        label,
                      )
                    }),
                  ),
                ),
              )
            }),
          ),
        )
      }

      const renderHistory = () => {
        const history = state.history || []
        return h(
          'div',
          null,
          h(SectionHead, {
            title: t('label.history'),
            desc: `${history.length} 次训练 · ${state.exams.length} 次综合检验`,
            extra: confirmReset
              ? h(
                  'div',
                  { className: 'ew-actions', style: { margin: 0 } },
                  h('button', { type: 'button', className: 'ew-btn ew-btnSmall', onClick: resetAll }, t('action.confirmReset')),
                  h(
                    'button',
                    { type: 'button', className: 'ew-btn ew-btnGhost ew-btnSmall', onClick: () => setConfirmReset(false) },
                    t('action.cancel'),
                  ),
                )
              : h(
                  'button',
                  { type: 'button', className: 'ew-btn ew-btnGhost ew-btnSmall', onClick: () => setConfirmReset(true) },
                  t('action.reset'),
                ),
          }),
          confirmReset
            ? h('div', { className: 'ew-error' }, t('label.clearConfirm'))
            : null,
          history.length
            ? h(
                'div',
                { className: 'ew-history' },
                history.map((entry) => {
                  const isOpen = historyOpen === entry.id
                  return h(
                    'div',
                    { className: 'ew-historyRow', key: entry.id },
                    h(
                      'button',
                      {
                        type: 'button',
                        className: 'ew-historyHead',
                        onClick: () => setHistoryOpen(isOpen ? null : entry.id),
                      },
                      h(
                        'span',
                        { className: 'ew-historyMain' },
                        h('div', { className: 'ew-historyTitle' }, `${entry.itemTitle} · ${entry.topicTitle || ''}`),
                        h(
                          'div',
                          { className: 'ew-historyMeta' },
                          `${formatDate(entry.at)} · ${entry.source === 'real' ? '真题' : 'AI 题'}${entry.local ? ' · 本地诊断' : ''}`,
                        ),
                      ),
                      h(
                        'span',
                        { className: 'ew-badge ' + (entry.highScore ? 'ew-badgeGood' : 'ew-badgeWarn') },
                        entry.highScore ? '高分' : '待提升',
                      ),
                      h('span', { className: 'ew-historyScore' }, `${entry.score}/${entry.maxScore}`),
                    ),
                    isOpen
                      ? h(HistoryDetail, {
                          entry,
                          t,
                          onCopy: copyText,
                          onPractice: () => {
                            const topic = topicById(state, entry.topicId)
                            const item = itemById(entry.itemId)
                            if (topic && item) {
                              startPractice(topic, item.id)
                            } else {
                              showToast('这道题已不在题库中，可从题库重新选择。')
                            }
                          },
                        })
                      : null,
                  )
                }),
              )
            : h('div', { className: 'ew-empty' }, h('h3', null, '还没有记录'), h('p', null, t('label.noHistory'))),
          state.exams.length
            ? h(
                'div',
                { style: { marginTop: 26 } },
                h(SectionHead, { title: t('label.exams'), desc: `${state.exams.length} 次` }),
                h(
                  'div',
                  { className: 'ew-history' },
                  state.exams.map((entry) => {
                    const isOpen = historyOpen === entry.id
                    return h(
                      'div',
                      { className: 'ew-historyRow', key: entry.id },
                      h(
                        'button',
                        {
                          type: 'button',
                          className: 'ew-historyHead',
                          onClick: () => setHistoryOpen(isOpen ? null : entry.id),
                        },
                        h(
                          'span',
                          { className: 'ew-historyMain' },
                          h('div', { className: 'ew-historyTitle' }, `${kindLabel(entry.kind)}整篇 · ${entry.topicTitle || ''}`),
                          h('div', { className: 'ew-historyMeta' }, formatDate(entry.at) + (entry.local ? ' · 本地诊断' : '')),
                        ),
                        h(
                          'span',
                          { className: 'ew-badge ' + (entry.highScore ? 'ew-badgeGood' : 'ew-badgeWarn') },
                          entry.highScore ? '高分' : '待提升',
                        ),
                        h('span', { className: 'ew-historyScore' }, `${entry.score}/${entry.maxScore}`),
                      ),
                      isOpen ? h(HistoryDetail, { entry, t, onCopy: copyText }) : null,
                    )
                  }),
                ),
              )
            : null,
        )
      }

      const tabs = [
        ['train', t('tab.train')],
        ['exam', t('tab.exam')],
        ['bank', t('tab.bank')],
        ['history', t('tab.history')],
      ]

      return h(
        'div',
        { className: 'ew-root' },
        h('style', null, CSS),
        h(
          'div',
          { className: 'ew-top' },
          h(
            'div',
            { className: 'ew-headRow' },
            h(
              'div',
              { className: 'ew-brand' },
              h('div', { className: 'ew-logo' }, h(PanelIcon, { size: 20, active: true })),
              h(
                'div',
                { style: { minWidth: 0 } },
                h('h1', { className: 'ew-title' }, t('panel.title')),
                h('div', { className: 'ew-sub' }, t('panel.subtitle')),
              ),
            ),
            h(
              'div',
              { className: 'ew-headStats' },
              h(StatPill, { label: t('stat.items'), value: ITEMS.length }),
              h(StatPill, { label: t('stat.attempts'), value: attempts }),
              h(StatPill, { label: t('stat.avg'), value: avg + '%' }),
            ),
          ),
          h(
            'div',
            { className: 'ew-tabs' },
            tabs.map(([id, label]) =>
              h(
                'button',
                {
                  key: id,
                  type: 'button',
                  className: 'ew-tab' + (tab === id ? ' is-on' : ''),
                  onClick: () => setTab(id),
                },
                label,
              ),
            ),
          ),
        ),
        h(
          'div',
          { className: 'ew-scroll' },
          h(
            'div',
            { className: 'ew-wrap' },
            error ? h('div', { className: 'ew-error' }, error) : null,
            tab === 'train' ? (selectedItem ? renderPractice() : renderHome()) : null,
            tab === 'exam' ? renderExam() : null,
            tab === 'bank' ? renderBank() : null,
            tab === 'history' ? renderHistory() : null,
          ),
        ),
        toast ? h('div', { className: 'ew-toast' }, toast) : null,
      )
    }

    return {
      name: 'dsh-english-writing-trainer',
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => {
          const offZh = ctx.locale.register('english-writing', 'zh', ZH)
          const offEn = ctx.locale.register('english-writing', 'en', EN)
          return () => {
            offZh()
            offEn()
          }
        }, 'english-writing-locale')

        ctx.slots.inject('sidebar.panellist', () =>
          ctx.slots.register(
            {
              name: 'sidebar.panellist',
              id: 'english-writing',
              order: 30,
              label: () => makeT(ctx)('panel.title'),
            },
            PanelIcon,
          ),
        )

        ctx.slots.inject('main', () =>
          ctx.slots.register({ name: 'main', key: 'english-writing' }, () => h(Page, { ctx })),
        )
      },
    }
  },
})
