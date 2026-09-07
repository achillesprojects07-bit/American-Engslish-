window.RecordingEngine={
  mediaRecorder:null,chunks:[],stream:null,
  async start(){
    if(this.mediaRecorder&&this.mediaRecorder.state==='recording') throw new Error('A recording is already in progress.');
    if(!navigator.mediaDevices?.getUserMedia) throw new Error('Microphone recording is not supported in this browser.');
    this.stream=await navigator.mediaDevices.getUserMedia({audio:true});this.chunks=[];
    const options=MediaRecorder.isTypeSupported?.('audio/mp4')?{mimeType:'audio/mp4'}:undefined;
    this.mediaRecorder=options?new MediaRecorder(this.stream,options):new MediaRecorder(this.stream);
    this.mediaRecorder.ondataavailable=e=>{if(e.data.size)this.chunks.push(e.data)};this.mediaRecorder.start();
  },
  cleanup(){this.stream?.getTracks().forEach(t=>t.stop());this.stream=null;this.mediaRecorder=null;this.chunks=[];},
  stop(){return new Promise((resolve,reject)=>{
    if(!this.mediaRecorder||this.mediaRecorder.state!=='recording') return reject(new Error('No recording in progress.'));
    const recorder=this.mediaRecorder;
    recorder.onstop=()=>{
      const type=recorder.mimeType||'audio/webm';const blob=new Blob(this.chunks,{type});const url=URL.createObjectURL(blob);
      this.cleanup();resolve({blob,url,type});
    };
    recorder.onerror=()=>{this.cleanup();reject(new Error('Recording failed. Please try again.'));};
    recorder.stop();
  })
  },
  cancel(){
    try{if(this.mediaRecorder&&this.mediaRecorder.state!=='inactive')this.mediaRecorder.stop();}catch(e){}
    this.stream?.getTracks().forEach(t=>t.stop());this.stream=null;this.mediaRecorder=null;this.chunks=[];
  }
};