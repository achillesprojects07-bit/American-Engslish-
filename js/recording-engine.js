window.RecordingEngine={
  mediaRecorder:null,chunks:[],stream:null,
  async start(){
    if(!navigator.mediaDevices?.getUserMedia) throw new Error("Microphone recording is not supported in this browser.");
    this.stream=await navigator.mediaDevices.getUserMedia({audio:true});
    this.chunks=[];
    this.mediaRecorder=new MediaRecorder(this.stream);
    this.mediaRecorder.ondataavailable=e=>{if(e.data.size)this.chunks.push(e.data)};
    this.mediaRecorder.start();
  },
  stop(){return new Promise((resolve,reject)=>{
    if(!this.mediaRecorder) return reject(new Error("No recording in progress."));
    this.mediaRecorder.onstop=()=>{
      const blob=new Blob(this.chunks,{type:this.mediaRecorder.mimeType||"audio/webm"});
      const url=URL.createObjectURL(blob);
      this.stream?.getTracks().forEach(t=>t.stop());
      this.mediaRecorder=null;this.stream=null;resolve({blob,url});
    };
    this.mediaRecorder.stop();
  })
};