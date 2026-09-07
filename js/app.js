(function(){
  const modal=document.getElementById('modal');
  const modalContent=document.getElementById('modalContent');
  const close=document.getElementById('closeModal');
  const order=['hear','stress','copy','connect','use','prove'];

  function openModal(html){modalContent.innerHTML=html;modal.classList.remove('hidden');document.body.classList.add('modal-open');}
  function closeModal(){LessonEngine.stopAll?.();modal.classList.add('hidden');modalContent.innerHTML='';document.body.classList.remove('modal-open');}

  function renderDashboard(){
    const data=AccentStorage.load();
    document.getElementById('currentDay').textContent=data.currentDay;
    document.getElementById('diagnosticCard').style.display=data.diagnosticComplete?'none':'flex';
    document.getElementById('todayTitle').textContent=data.diagnosticComplete?DAY1_LESSON.title:'Complete Day 0 Diagnostic first';
    const labels={wordStress:'Word stress',sentenceStress:'Sentence focus',reductionRecognition:'Hear reductions',reductionProduction:'Produce reductions',linking:'Linking',rhythm:'Rhythm',americanR:'American R',americanT:'American T',th:'TH',vowels:'Vowels',intonation:'Intonation',automaticity:'Automaticity'};
    document.getElementById('skillDashboard').innerHTML=Object.entries(labels).map(([key,label])=>{
      const value=data.scores[key];const measured=Number.isFinite(value);
      return `<div class="skill-row"><strong>${label}</strong><div class="bar"><span style="width:${measured?value:0}%"></span></div><span class="skill-score">${measured?value+'%':'—'}</span></div>`;
    }).join('');

    document.querySelectorAll('.lesson-card').forEach(button=>{
      const route=button.dataset.route;const idx=order.indexOf(route);const done=!!data.completed[`day1-${route}`];
      const previousDone=idx===0?true:!!data.completed[`day1-${order[idx-1]}`];
      const unlocked=data.diagnosticComplete&&previousDone;
      button.disabled=!unlocked;button.classList.toggle('completed',done);button.classList.toggle('locked',!unlocked);
      const small=button.querySelector('small');
      if(done) small.textContent='Complete ✓';
      else if(!data.diagnosticComplete) small.textContent='Finish diagnostic';
      else if(!previousDone) small.textContent='Locked';
      else small.textContent=(DAY1_LESSON.blocks.find(b=>b.id===route)?.minutes||0)+' min';
    });
  }

  document.querySelector('[data-route="diagnostic"]').addEventListener('click',()=>{
    openModal(LessonEngine.renderDiagnostic());
    LessonEngine.bindDiagnostic(modalContent,()=>{renderDashboard();closeModal();});
  });

  document.querySelectorAll('.lesson-card').forEach(button=>{
    button.addEventListener('click',()=>{
      if(button.disabled)return;
      const block=DAY1_LESSON.blocks.find(item=>item.id===button.dataset.route);if(!block)return;
      openModal(LessonEngine.renderDayBlock(block));
      LessonEngine.bindDayBlock(modalContent,block,()=>{renderDashboard();closeModal();});
    });
  });

  close.addEventListener('click',closeModal);
  modal.addEventListener('click',event=>{if(event.target===modal)closeModal();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!modal.classList.contains('hidden'))closeModal();});
  renderDashboard();
})();