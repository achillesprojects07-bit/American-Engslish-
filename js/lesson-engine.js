window.LessonEngine={
  esc(s){return String(s??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]))},
  renderRecorder(label="Record your voice"){
    return `<div class="recorder"><button class="secondary-btn record-start">🎙 ${this.esc(label)}</button><button class="secondary-btn record-stop" disabled>■ Stop</button><audio class="record-playback" controls hidden></audio></div><p class="record-status status-pill">Ready</p>`;
  },
  bindRecorder(container){
    container.querySelectorAll('.recorder').forEach(rec=>{
      const start=rec.querySelector('.record-start'),stop=rec.querySelector('.record-stop'),audio=rec.querySelector('.record-playback'),status=rec.nextElementSibling;
      start?.addEventListener('click',async()=>{try{await RecordingEngine.start();start.disabled=true;stop.disabled=false;status.textContent='Recording…'}catch(e){status.textContent=e.message}});
      stop?.addEventListener('click',async()=>{try{const out=await RecordingEngine.stop();audio.src=out.url;audio.hidden=false;start.disabled=false;stop.disabled=true;status.textContent='Recorded — listen back and compare.'}catch(e){status.textContent=e.message}});
    });
  },
  renderDiagnostic(){
    const d=window.DAY0_DIAGNOSTIC;
    let html=`<p class="eyebrow">BASELINE</p><h2>${this.esc(d.title)}</h2><p>${this.esc(d.intro)}</p>`;
    d.sections.forEach(section=>{
      html+=`<div class="activity"><h3>${this.esc(section.title)}</h3>`;
      if(section.type==='quiz') section.items.forEach((item,i)=>{html+=`<p><strong>${this.esc(item.prompt)}</strong></p><p>${this.esc(item.audioText)}</p><div class="choice-grid">${item.choices.map((c,ci)=>`<button class="choice-btn diagnostic-choice" data-skill="${item.skill}" data-correct="${ci===item.answer}">${this.esc(c)}</button>`).join('')}</div>`});
      if(section.text) html+=`<p>${this.esc(section.text)}</p>`;
      if(section.instructions) html+=`<p>${this.esc(section.instructions)}</p>`;
      if(section.prompt) html+=`<p>${this.esc(section.prompt)}</p>`;
      if(section.type==='selfRecord') html+=this.renderRecorder();
      html+='</div>';
    });
    html+=`<div class="activity"><h3>Finish baseline</h3><p>When you finish the recordings, save the diagnostic. You can retake it later, but the first baseline is the comparison point for Day 42.</p><button class="primary-btn" id="finishDiagnostic">Save Diagnostic</button></div>`;
    return html;
  },
  bindDiagnostic(container,onFinish){
    this.bindRecorder(container);
    container.querySelectorAll('.diagnostic-choice').forEach(btn=>btn.addEventListener('click',()=>{
      const correct=btn.dataset.correct==='true';btn.textContent+=(correct?' ✓':' ✕');btn.disabled=true;
      const skill=btn.dataset.skill;const current=AccentStorage.load().scores[skill]||0;AccentStorage.setScore(skill,Math.max(current,correct?75:35));
    }));
    container.querySelector('#finishDiagnostic')?.addEventListener('click',()=>{AccentStorage.patch({diagnosticComplete:true,currentDay:1});onFinish?.()});
  },
  renderDayBlock(block){
    let html=`<p class="eyebrow">${block.minutes} MIN</p><h2>${this.esc(block.title)}</h2>`;
    block.activities.forEach(a=>{
      html+='<div class="activity">';
      if(a.prompt) html+=`<h3>${this.esc(a.prompt)}</h3>`;
      if(a.text) html+=`<p><strong>${this.esc(a.text)}</strong></p>`;
      if(a.note) html+=`<p>${this.esc(a.note)}</p>`;
      if(a.type==='listenChoose') html+=`<div class="choice-grid">${a.choices.map((c,i)=>`<button class="choice-btn lesson-choice" data-correct="${i===a.answer}">${this.esc(c)}</button>`).join('')}</div>`;
      if(a.type==='stressWords') html+=a.items.map(x=>`<p><strong>${this.esc(x.word)}</strong> — stressed syllable: <strong>${this.esc(x.stress)}</strong></p>`).join('');
      if(a.type==='recordCompare'||a.type==='promptRecord') html+=this.renderRecorder('Record');
      if(a.type==='practice') html+=this.renderRecorder('Practice & record');
      if(a.type==='benchmark') html+=`<ul>${a.criteria.map(c=>`<li>${this.esc(c)}</li>`).join('')}</ul>${this.renderRecorder('Take benchmark')}`;
      html+='</div>';
    });
    html+=`<button class="primary-btn complete-block" data-block="${block.id}">Mark ${this.esc(block.title)} complete</button>`;
    return html;
  },
  bindDayBlock(container,block,onComplete){
    this.bindRecorder(container);
    container.querySelectorAll('.lesson-choice').forEach(btn=>btn.addEventListener('click',()=>{const correct=btn.dataset.correct==='true';btn.textContent+=(correct?' ✓':' ✕');btn.disabled=true}));
    container.querySelector('.complete-block')?.addEventListener('click',()=>{AccentStorage.markComplete(`day1-${block.id}`);onComplete?.()});
  }
};