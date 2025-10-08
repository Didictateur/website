const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async ()=>{
  const workspace = path.resolve(__dirname, '..');
  const animJsonPath = path.join(workspace, 'EasterEggs', 'animations', 'crocodile', 'animations', '12345.json');
  if(!fs.existsSync(animJsonPath)){
    console.error('Animation JSON not found at', animJsonPath);
    process.exit(2);
  }
  const outDir = path.join(workspace, 'EasterEggs', 'animations', 'crocodile', 'frames');
  fs.mkdirSync(outDir, { recursive: true });

  const json = JSON.parse(fs.readFileSync(animJsonPath, 'utf8'));
  const w = json.w || 400;
  const h = json.h || 400;

  console.log('Animation size:', w, h);

  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: Math.ceil(w), height: Math.ceil(h), deviceScaleFactor: 1 });

  // provide lottie via CDN and the animation data via page.evaluate
  const lottieCdn = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.10.2/lottie.min.js';

  const html = `
  <!doctype html>
  <html><head></head><body style="margin:0;">
  <div id="cont" style="width:${w}px;height:${h}px;"></div>
  <script src="${lottieCdn}"></script>
  <script>
    window.__animData = null; // to be set
    function createAnim(animData){
      window.anim = lottie.loadAnimation({container:document.getElementById('cont'), renderer:'canvas', loop:false, autoplay:false, animationData:animData});
      window.anim.setSubframe(false);
      return new Promise(resolve=>{
        window.anim.addEventListener('DOMLoaded', ()=>{ resolve(); });
        // fallback
        setTimeout(resolve, 1500);
      });
    }
  </script>
  </body></html>`;

  await page.setContent(html, { waitUntil: 'load' });
  // inject animation data and create animation
  await page.exposeFunction('__getAnimData', ()=> json);
  await page.evaluate(async ()=>{
    const data = await window.__getAnimData();
    await createAnim(data);
  });

  // determine frame count
  const totalFrames = await page.evaluate(()=> Math.round(window.anim.totalFrames || window.anim.getDuration(true) * 60 || 60));
  console.log('Total frames (reported):', totalFrames);

  // limit frames to reasonable number to avoid huge output; if many frames, sample up to 60
  const maxFrames = Math.min(totalFrames, 60);
  const step = Math.max(1, Math.floor(totalFrames / maxFrames));
  console.log('Rendering', Math.ceil(totalFrames/step), 'frames (step', step, ')');

  const canvasHandle = await page.$('canvas');
  if(!canvasHandle){ console.error('No canvas found'); await browser.close(); process.exit(3); }

  let idx = 0;
  for(let f = 0; f < totalFrames; f += step){
    await page.evaluate((fr)=>{ window.anim.goToAndStop(fr, true); }, f);
    const outPath = path.join(outDir, `frame_${String(idx).padStart(3,'0')}.png`);
    await canvasHandle.screenshot({ path: outPath });
    console.log('Wrote', outPath);
    idx++;
  }

  await browser.close();
  console.log('Done. Generated', idx, 'frames in', outDir);
})();
