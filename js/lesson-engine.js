window.LessonEngine={
  esc(s){return String(s??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]))},
  modelButton(text,label='Hear American'){
    return `<button class="secondary-btn model-audio" data-audio="${this.esc(text)}">🔊 ${this.esc(label)}</button>`;
  },
  renderRecorder(label="Record your voice",meta=""){
    return `<div class="recorder" data-recorded="false" data-meta="${this.esc(meta)}"><button class="secondary-btn record-start">🎙 ${this.esc(label)}</button><button class="secondary-btn record-stop" disabled>■ Stop</button><button class="secondary-btn record-retry" hidden>↻ Try Again</button><audio class="record-playback" controls hidden></audio></div><p class="record-status status-pill">Ready</p>`;
  },
  bindAudio(container){
    container.querySelectorAll('.model-audio').forEach(btn=>btn.addEventListener('click',async()=>{
      const old=btn.textContent;btn.disabled=true;btn.textContent='🔊 Playing…';
      try{await window.AudioEngine.speak(btn.dataset.audio,{rate:0.9});}catch(e){alert(e?.message||'Model audio could not play.');}
      btn.disabled=false;btn.textContent=old;
    }));
  },
  bindRecorder(container,onStateChange){
    container.querySelectorAll('.recorder').forEach(rec=>{
      if(rec.dataset.bound==='true') return;rec.dataset.bound='true';
      const start=rec.querySelector('.record-start'),stop=rec.querySelector('.record-stop'),retry=rec.querySelector('.record-retry'),audio=rec.querySelector('.record-playback'),status=rec.nextElementSibling;
      const engine=window.RecordingEngine;let currentUrl=null;
      if(!engine){start.disabled=true;stop.disabled=true;status.textContent='Recorder unavailable. Refresh the app.';return;}
      const begin=async()=>{
        try{
          if(currentUrl){URL.revokeObjectURL(currentUrl);currentUrl=null;}
          audio.pause();audio.removeAttribute('src');audio.load();audio.hidden=true;retry.hidden=true;start.hidden=false;
          await engine.start();start.disabled=true;stop.disabled=false;status.textContent='Recording…';
        }catch(e){status.textContent=e?.message||'Microphone could not start.';start.disabled=false;}
      };
      start.addEventListener('click',begin);retry.addEventListener('click',begin);
      stop.addEventListener('click',async()=>{
        try{
          const out=await engine.stop();currentUrl=out.url;audio.src=currentUrl;audio.hidden=false;rec.dataset.recorded='true';
          start.hidden=true;start.disabled=false;stop.disabled=true;retry.hidden=false;status.textContent='Recorded — listen back or try again.';
          AccentStorage.addRecordingMeta({context:rec.dataset.meta||'practice'});onStateChange?.();
        }catch(e){status.textContent=e?.message||'Recording could not be stopped.';start.disabled=false;stop.disabled=true;}
      });
    });
  },
  diagnosticReady(container){
    const choices=[...container.querySelectorAll('.diagnostic-item')];
    const records=[...container.querySelectorAll('.diagnostic-record .recorder')];
    return choices.every(x=>x.dataset.answered==='true')&&records.every(x=>x.dataset.recorded==='true');
  },
  renderDiagnostic(){
    const d=window.DAY0_DIAGNOSTIC;let html=`<p class="eyebrow">BASELINE</p><h2>${this.esc(d.title)}</h2><p>${this.esc(d.intro)}</p><p class="notice">Use headphones if possible. Listen before reading. The transcript appears only after you answer.</p>`;
    d.sections.forEach(section=>{
      html+=`<div class="activity"><h3>${this.esc(section.title)}</h3>`;
      if(section.type==='quiz') section.items.forEach((item,i)=>{
        html+=`<div class="diagnostic-item" data-answered="false">${this.modelButton(item.audioText,'Play clip')}<p><strong>${this.esc(item.prompt)}</strong></p><div class="choice-grid">${item.choices.map((c,ci)=>`<button class="choice-btn diagnostic-choice" data-id="${section.id}-${i}" data-skill="${item.skill}" data-correct="${ci===item.answer}">${this.esc(c)}</button>`).join('')}</div><p class="transcript hidden"><strong>Transcript:</strong> ${this.esc(item.audioText)}</p></div>`;
      });
      if(section.text) html+=`<p>${this.esc(section.text)}</p>`;
      if(section.instructions) html+=`<p>${this.esc(section.instructions)}</p>`;
      if(section.prompt) html+=`<p>${this.esc(section.prompt)}</p>`;
      if(section.type==='selfRecord') html+=`<div class="diagnostic-record">${this.renderRecorder('Record baseline',`diagnostic-${section.id}`)}</div>`;
      html+='</div>';
    });
    html+=`<div class="activity"><h3>Finish baseline</h3><p>Complete every listening item and every required recording. Production recordings are saved as baseline evidence, but are not given a fake automatic accent score.</p><button class="primary-btn" id="finishDiagnostic" disabled>Save Diagnostic</button><p id="diagnosticStatus" class="record-status status-pill">Complete all items to continue.</p></div>`;
    return html;
  },
  bindDiagnostic(container,onFinish){
    const update=()=>{const b=container.querySelector('#finishDiagnostic');if(b)b.disabled=!this.diagnosticReady(container);};
    this.bindAudio(container);this.bindRecorder(container,update);
    container.querySelectorAll('.diagnostic-choice').forEach(btn=>btn.addEventListener('click',()=>{
      const wrap=btn.closest('.diagnostic-item');if(wrap.dataset.answered==='true')return;
      wrap.dataset.answered='true';const correct=btn.dataset.correct==='true';
      wrap.querySelectorAll('.diagnostic-choice').forEach(b=>{b.disabled=true;if(b===btn)b.classList.add(correct?'correct':'incorrect');});
      wrap.querySelector('.transcript')?.classList.remove('hidden');AccentStorage.addAttempt(btn.dataset.skill,correct,btn.dataset.id);update();
    }));
    container.querySelector('#finishDiagnostic')?.addEventListener('click',()=>{
      if(!this.diagnosticReady(container))return;
      AccentStorage.patch({diagnosticComplete:true,currentDay:1});onFinish?.();
    });
    update();
  },
  renderStressWords(a){
    return a.items.map((x,i)=>`<div class="stress-item"><div class="inline-actions">${this.modelButton(x.word,'Hear word')}<button class="secondary-btn reveal-stress" data-target="stress-${i}">Reveal stress</button></div><p><strong>${this.esc(x.word)}</strong></p><p id="stress-${i}" class="hidden">Stressed syllable: <strong>${this.esc(x.stress)}</strong></p></div>`).join('');
  },
  blockReady(container){
    const quiz=[...container.querySelectorAll('.lesson-item[data-required="true"]')];
    const records=[...container.querySelectorAll('.recorder[data-required="true"]')];
    return quiz.every(x=>x.dataset.answered==='true')&&records.every(x=>x.dataset.recorded==='true');
  },
  renderDayBlock(block){
    let html=`<p class="eyebrow">${block.minutes} MIN</p><h2>${this.esc(block.title)}</h2>`;
    block.activities.forEach((a,idx)=>{
      html+=`<div class="activity lesson-item" data-required="${a.type==='listenChoose'}" data-answered="${a.type==='listenChoose'?'false':'true'}">`;
      if(a.prompt) html+=`<h3>${this.esc(a.prompt)}</h3>`;
      if(a.type==='listenChoose') html+=`${this.modelButton(a.text,'Hear first')}<div class="choice-grid">${a.choices.map((c,i)=>`<button class="choice-btn lesson-choice" data-correct="${i===a.answer}">${this.esc(c)}</button>`).join('')}</div><p class="transcript hidden"><strong>Transcript:</strong> ${this.esc(a.text)}</p>`;
      else if(a.type==='stressWords') html+=this.renderStressWords(a);
      else {
        if(a.text) html+=`<p><strong>${this.esc(a.text)}</strong></p>`;
        if(a.note) html+=`<p>${this.esc(a.note)}</p>`;
        if(a.type==='recordCompare') html+=`${this.modelButton(a.text)}${this.renderRecorder('Record me',`${block.id}-${idx}`)}`;
        if(a.type==='promptRecord') html+=this.renderRecorder('Record response',`${block.id}-${idx}`);
        if(a.type==='practice') html+=`${a.text?this.modelButton(a.text):''}${this.renderRecorder('Practice & record',`${block.id}-${idx}`)}`;
        if(a.type==='benchmark') html+=`<ul>${a.criteria.map(c=>`<li>${this.esc(c)}</li>`).join('')}</ul>${this.renderRecorder('Take benchmark',`${block.id}-${idx}`)}`;
      }
      html+='</div>';
    });
    html+=`<button class="primary-btn complete-block" data-block="${block.id}" disabled>Complete ${this.esc(block.title)}</button><p class="block-status status-pill">Complete the required activities first.</p>`;
    return html;
  },
  bindDayBlock(container,block,onComplete){
    const update=()=>{const b=container.querySelector('.complete-block');if(b)b.disabled=!this.blockReady(container);};
    this.bindAudio(container);this.bindRecorder(container,update);
    container.querySelectorAll('.reveal-stress').forEach(btn=>btn.addEventListener('click',()=>document.getElementById(btn.dataset.target)?.classList.toggle('hidden')));
    container.querySelectorAll('.lesson-choice').forEach(btn=>btn.addEventListener('click',()=>{
      const wrap=btn.closest('.lesson-item');if(wrap.dataset.answered==='true')return;wrap.dataset.answered='true';
      const correct=btn.dataset.correct==='true';wrap.querySelectorAll('.lesson-choice').forEach(b=>{b.disabled=true;if(b===btn)b.classList.add(correct?'correct':'incorrect');});wrap.querySelector('.transcript')?.classList.remove('hidden');update();
    }));
    container.querySelectorAll('.recorder').forEach(r=>r.dataset.required='true');update();
    container.querySelector('.complete-block')?.addEventListener('click',()=>{if(!this.blockReady(container))return;AccentStorage.markComplete(`day1-${block.id}`);onComplete?.(block.id);});
  },
  stopAll(){window.AudioEngine?.stop?.();const r=window.RecordingEngine;if(r?.mediaRecorder&&r.mediaRecorder.state!=='inactive'){try{r.mediaRecorder.stop()}catch(e){}}}
};