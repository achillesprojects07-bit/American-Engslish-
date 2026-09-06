window.DAY1_LESSON={
  day:1,
  title:"Day 1 — American Rhythm: Strong vs Weak",
  objective:"Make information words clearly prominent while compressing grammar words without losing intelligibility.",
  targetSentence:"I'll send you the updated report this afternoon.",
  blocks:[
    {id:"hear",title:"HEAR",minutes:10,activities:[
      {type:"listenChoose",prompt:"Which words should carry the message?",text:"I'll send you the updated report this afternoon.",choices:["I'll / you / the / this","send / updated / report / afternoon"],answer:1},
      {type:"listenChoose",prompt:"Which version sounds more natural in General American business speech?",text:"We received your email this morning.",choices:["Every word equally strong","RECEIVED / EMAIL / MORNING stand out"],answer:1}
    ]},
    {id:"stress",title:"STRESS GYM",minutes:10,activities:[
      {type:"stressWords",items:[
        {word:"information",stress:"MA"},{word:"customer",stress:"CUS"},{word:"available",stress:"VAIL"},{word:"confirmation",stress:"MA"},{word:"account",stress:"COUNT"},{word:"proposal",stress:"PO"},{word:"marketing",stress:"MAR"},{word:"opportunity",stress:"TU"},{word:"professional",stress:"FES"},{word:"communicate",stress:"MU"}
      ]}
    ]},
    {id:"copy",title:"COPY",minutes:10,activities:[
      {type:"recordCompare",text:"I'll send you the updated report this afternoon."},
      {type:"recordCompare",text:"We received your email this morning."},
      {type:"recordCompare",text:"I'll check that with my manager."}
    ]},
    {id:"connect",title:"CONNECT",minutes:10,activities:[
      {type:"practice",text:"I can CHECK that for you.",note:"Keep can, that, for, you lighter than CHECK."},
      {type:"practice",text:"I'll SEND you the FILE.",note:"Let SEND and FILE carry the rhythm."},
      {type:"practice",text:"Could you give me a MOMENT?",note:"Do not give each word equal duration."}
    ]},
    {id:"use",title:"USE IT",minutes:12,activities:[
      {type:"promptRecord",prompt:"A client says: ‘Did you already send the revised quotation?’ Respond naturally and explain when it was sent."},
      {type:"promptRecord",prompt:"A customer asks when an update will arrive. Give a professional answer with a clear timeframe."}
    ]},
    {id:"prove",title:"PROVE IT",minutes:8,activities:[
      {type:"benchmark",text:"I'll check the account and send you an update before five.",criteria:["CHECK, ACCOUNT, SEND, UPDATE and FIVE stand out","function words are lighter","sentence flows as thought groups","no word-by-word rhythm"]}
    ]}
  ]
};