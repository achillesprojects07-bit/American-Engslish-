(function(){
  const modal=document.getElementById('modal');
  const modalContent=document.getElementById('modalContent');
  const close=document.getElementById('closeModal');

  function openModal(html){
    modalContent.innerHTML=html;
    modal.classList.remove('hidden');
  }

  function closeModal(){
    modal.classList.add('hidden');
    modalContent.innerHTML='';
  }

  function renderDashboard(){
    const data=AccentStorage.load();
    document.getElementById('currentDay').textContent=data.currentDay;
    document.getElementById('diagnosticCard').style.display=data.diagnosticComplete?'none':'flex';
    const labels={wordStress:'Word stress',sentenceStress:'Sentence focus',reductionRecognition:'Hear reductions',reductionProduction:'Produce reductions',linking:'Linking',rhythm:'Rhythm',americanR:'American R',americanT:'American T',th:'TH',vowels:'Vowels',intonation:'Intonation',automaticity:'Automaticity'};
    document.getElementById('skillDashboard').innerHTML=Object.entries(labels).map(([key,label])=>{
      const value=data.scores[key]||0;
      return `<div class="skill-row"><strong>${label}</strong><div class="bar"><span style="width:${value}%"></span></div><span class="skill-score">${value}%</span></div>`;
    }).join('');
  }

  function bindRecorder(container){
    LessonEngine.bindRecorder(container);
  }

  document.querySelector('[data-route="diagnostic"]').addEventListener('click',()=>{
    openModal(LessonEngine.renderDiagnostic());
    LessonEngine.bindDiagnostic(modalContent,()=>{renderDashboard();closeModal();});
  });

  document.querySelectorAll('.lesson-card').forEach(button=>{
    button.addEventListener('click',()=>{
      const block=DAY1_LESSON.blocks.find(item=>item.id===button.dataset.route);
      if(!block)return;
      openModal(LessonEngine.renderDayBlock(block));
      LessonEngine.bindDayBlock(modalContent,block,renderDashboard);
      bindRecorder(modalContent);
    });
  });

  close.addEventListener('click',closeModal);
  modal.addEventListener('click',event=>{if(event.target===modal)closeModal();});

  renderDashboard();
})();