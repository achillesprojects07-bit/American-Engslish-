window.AccentStorage={
  key:"americanAccentTrainer.v1",
  defaults(){return {currentDay:0,diagnosticComplete:false,scores:{wordStress:0,sentenceStress:0,reductionRecognition:0,reductionProduction:0,linking:0,rhythm:0,americanR:0,americanT:0,th:0,vowels:0,intonation:0,automaticity:0},completed:{},recordings:[]}},
  load(){try{return {...this.defaults(),...JSON.parse(localStorage.getItem(this.key)||"{}")}}catch(e){return this.defaults()}},
  save(data){localStorage.setItem(this.key,JSON.stringify(data));return data},
  patch(patch){const next={...this.load(),...patch};return this.save(next)},
  setScore(skill,value){const data=this.load();data.scores[skill]=Math.max(0,Math.min(100,value));this.save(data);return data},
  markComplete(id){const data=this.load();data.completed[id]=true;this.save(data);return data},
  reset(){localStorage.removeItem(this.key);return this.defaults()}
};