window.AccentStorage={
  key:"americanAccentTrainer.v2",
  defaults(){return {
    currentDay:0,
    diagnosticComplete:false,
    scores:{wordStress:null,sentenceStress:null,reductionRecognition:null,reductionProduction:null,linking:null,rhythm:null,americanR:null,americanT:null,th:null,vowels:null,intonation:null,automaticity:null},
    attempts:{},
    completed:{},
    selfRatings:{},
    recordingMeta:[]
  }},
  load(){
    try{
      const raw=JSON.parse(localStorage.getItem(this.key)||"{}");
      return {...this.defaults(),...raw,scores:{...this.defaults().scores,...(raw.scores||{})},attempts:{...(raw.attempts||{})},completed:{...(raw.completed||{})},selfRatings:{...(raw.selfRatings||{})},recordingMeta:[...(raw.recordingMeta||[])]};
    }catch(e){return this.defaults()}
  },
  save(data){localStorage.setItem(this.key,JSON.stringify(data));return data},
  patch(patch){const next={...this.load(),...patch};return this.save(next)},
  addAttempt(skill,correct,id){
    const data=this.load();
    if(!data.attempts[skill]) data.attempts[skill]=[];
    if(id && data.attempts[skill].some(a=>a.id===id)) return data;
    data.attempts[skill].push({id:id||`${Date.now()}`,correct:!!correct,ts:Date.now()});
    const arr=data.attempts[skill];
    const pct=Math.round(arr.filter(a=>a.correct).length/arr.length*100);
    data.scores[skill]=pct;
    return this.save(data);
  },
  setSelfRating(key,value){const data=this.load();data.selfRatings[key]=value;return this.save(data)},
  markComplete(id){const data=this.load();data.completed[id]=true;this.save(data);return data},
  isComplete(id){return !!this.load().completed[id]},
  addRecordingMeta(meta){const data=this.load();data.recordingMeta.push({ts:Date.now(),...meta});return this.save(data)},
  reset(){localStorage.removeItem(this.key);return this.defaults()}
};