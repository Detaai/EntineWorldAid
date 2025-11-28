// Randeth Vision filter script
const fileInput = document.getElementById('fileInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

const startCamBtn = document.getElementById('startCam');
const stopCamBtn = document.getElementById('stopCam');
const downloadBtn = document.getElementById('downloadBtn');

const greenRet = document.getElementById('greenRet'); // percent
const greenFlat = document.getElementById('greenFlat'); // percent
const forceMerge = document.getElementById('forceMerge');
const bBoost = document.getElementById('bBoost');

let videoStream = null;
let videoEl = null;
let running = false;

function resizeCanvas(w,h){
  canvas.width = w;
  canvas.height = h;
}

function applyRandethVisionToImageData(imgData){
  const px = imgData.data;
  const len = px.length;

  // Randeth vision: weak to red, yellow, blue; strong for green and neutrals
  for(let i=0;i<len;i+=4){
    let r = px[i], g = px[i+1], b = px[i+2], a = px[i+3];

    // Reduce red, yellow, and blue sensitivity
    let yellow = (r + g) / 2;
    if(yellow > b && yellow > g) {
      r *= 0.5;
      g *= 0.5;
    }
    r *= 0.35;
    b *= 0.4;
    g *= 1.25;

    px[i] = Math.max(0, Math.min(255, Math.round(r)));
    px[i+1] = Math.max(0, Math.min(255, Math.round(g)));
    px[i+2] = Math.max(0, Math.min(255, Math.round(b)));
    px[i+3] = a;
  }

  // Simple box blur (smoothing) pass
  // Only run if image is not tiny
  if(imgData.width > 2 && imgData.height > 2){
    const w = imgData.width, h = imgData.height;
    const src = new Uint8ClampedArray(px);
    for(let y=1;y<h-1;y++){
      for(let x=1;x<w-1;x++){
        let i = (y*w + x)*4;
        let sumR=0, sumG=0, sumB=0;
        for(let dy=-1;dy<=1;dy++){
          for(let dx=-1;dx<=1;dx++){
            let ni = ((y+dy)*w + (x+dx))*4;
            sumR += src[ni];
            sumG += src[ni+1];
            sumB += src[ni+2];
          }
        }
        px[i]   = Math.round(sumR/9);
        px[i+1] = Math.round(sumG/9);
        px[i+2] = Math.round(sumB/9);
        // alpha unchanged
      }
    }
  }
  return imgData;
}

function drawImageToCanvas(img){
  resizeCanvas(img.width, img.height);
  ctx.drawImage(img,0,0);
  let id = ctx.getImageData(0,0,canvas.width, canvas.height);
  id = applyRandethVisionToImageData(id);
  ctx.putImageData(id,0,0);
}

fileInput.addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  const img = new Image();
  img.onload = ()=> drawImageToCanvas(img);
  img.src = URL.createObjectURL(file);
});

startCamBtn.addEventListener('click', async ()=>{
  if(running) return;
  try{
    videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
  }catch(err){
    alert('Could not start camera: ' + err.message);
    return;
  }
  videoEl = document.createElement('video');
  videoEl.srcObject = videoStream;
  videoEl.play();

  videoEl.addEventListener('loadedmetadata', ()=>{
    resizeCanvas(videoEl.videoWidth, videoEl.videoHeight);
    running = true;
    renderLoop();
  });
});

stopCamBtn.addEventListener('click', ()=>{
  if(videoStream){
    const tracks = videoStream.getTracks();
    tracks.forEach(t=>t.stop());
    videoStream = null;
    videoEl = null;
    running = false;
  }
});

function renderLoop(){
  if(!running || !videoEl) return;
  ctx.drawImage(videoEl,0,0,canvas.width, canvas.height);
  let id = ctx.getImageData(0,0,canvas.width, canvas.height);
  id = applyRandethVisionToImageData(id);
  ctx.putImageData(id,0,0);
  requestAnimationFrame(renderLoop);
}

downloadBtn.addEventListener('click', ()=>{
  const link = document.createElement('a');
  link.download = 'randeth_view.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// live update when sliders change
[greenRet, greenFlat, forceMerge, bBoost].forEach(el=>{
  el.addEventListener('input', ()=>{
    // if static image loaded, reapply
    if(!videoEl && canvas.width>0 && canvas.height>0 && !running){
      try{
        const imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
        const out = applyRandethVisionToImageData(imgData);
        ctx.putImageData(out,0,0);
      }catch(e){ /* ignore if no image present */ }
    }
  });
});
