window.DAY0_DIAGNOSTIC={
  title:"Day 0 — American Speech Diagnostic",
  intro:"Establish your baseline before training. Do not rehearse. The goal is to discover what is already automatic and what breaks down in spontaneous speech.",
  sections:[
    {id:"listening",title:"Listening Diagnostic",type:"quiz",items:[
      {prompt:"Which word sounds most prominent?",audioText:"I sent the revised proposal yesterday.",choices:["I","sent","revised proposal","yesterday"],answer:2,skill:"sentenceStress"},
      {prompt:"Which version sounds like normal unstressed CAN?",audioText:"I can check that for you.",choices:["strong CAN","weak can"],answer:1,skill:"reductionRecognition"},
      {prompt:"Which word carries the correction?",audioText:"I said Friday, not Thursday.",choices:["said","Friday","not","Thursday"],answer:1,skill:"sentenceStress"},
      {prompt:"Which phrase should flow as one connected unit?",audioText:"send it over",choices:["send / it / over","send-it-over"],answer:1,skill:"linking"}
    ]},
    {id:"stress",title:"Word Stress Check",type:"selfRecord",instructions:"Record these words naturally without looking up the stress: information, customer, available, confirmation, account, proposal, marketing, opportunity, professional, communicate.",skill:"wordStress"},
    {id:"reading",title:"Standard Reading",type:"selfRecord",text:"Thank you for calling. I reviewed the account this morning and found that the payment was received yesterday. I’ll send the updated confirmation to you this afternoon and follow up if anything changes.",skill:"rhythm"},
    {id:"business",title:"Business Response",type:"selfRecord",prompt:"Explain what your company does and what kind of clients you usually work with. Speak for 60 seconds without scripting.",skill:"automaticity"},
    {id:"casual",title:"Casual Response",type:"selfRecord",prompt:"Tell me what you did yesterday from morning until evening. Speak naturally for 60 seconds.",skill:"automaticity"},
    {id:"contrast",title:"Critical Contrast",type:"selfRecord",instructions:"Record: I can process that today. / I can't process that today.",skill:"reductionProduction"}
  ],
  note:"Baseline results are stored locally and compared with weekly audits and Day 42."
};