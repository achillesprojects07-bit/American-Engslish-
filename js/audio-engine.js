window.AudioEngine=(function(){
  let preferredVoice=null;
  function chooseVoice(){
    const voices=window.speechSynthesis?.getVoices?.()||[];
    const us=voices.filter(v=>/^en-US$/i.test(v.lang));
    preferredVoice=us.find(v=>/Samantha|Ava|Allison|Alex|Google US English|Microsoft.*(Aria|Jenny|Guy)/i.test(v.name))||us[0]||voices.find(v=>/^en/i.test(v.lang))||null;
    return preferredVoice;
  }
  if('speechSynthesis' in window){
    chooseVoice();
    window.speechSynthesis.addEventListener?.('voiceschanged',chooseVoice);
  }
  function speak(text,{rate=0.92,pitch=1}={}){
    return new Promise((resolve,reject)=>{
      if(!('speechSynthesis' in window)) return reject(new Error('Model audio is not supported in this browser.'));
      const utterance=new SpeechSynthesisUtterance(String(text||''));
      utterance.lang='en-US';utterance.rate=rate;utterance.pitch=pitch;
      const voice=preferredVoice||chooseVoice();if(voice) utterance.voice=voice;
      utterance.onend=()=>resolve();utterance.onerror=e=>reject(new Error(e.error||'Model audio could not play.'));
      window.speechSynthesis.cancel();window.speechSynthesis.speak(utterance);
    });
  }
  function stop(){if('speechSynthesis' in window) window.speechSynthesis.cancel();}
  return {speak,stop,getVoice:()=>preferredVoice||chooseVoice()};
})();