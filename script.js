const timeEl = document.getElementById('time');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const presetBtns = document.querySelectorAll('.preset [data-min]');
const customBtn = document.getElementById('customBtn');
const soundToggle = document.getElementById('soundToggle');
const chime = document.getElementById('chime');
const sessionsEl = document.getElementById('sessions');

let seconds = +localStorage.getItem('ff_seconds') || 25 * 60;
let running = false;
let interval = null;
let sessions = +localStorage.getItem('ff_sessions') || 0;
sessionsEl.textContent = sessions;

function fmt(s){
  const m = Math.floor(s/60).toString().padStart(2,'0');
  const sec = (s%60).toString().padStart(2,'0');
  return `${m}:${sec}`;
}
function render(){ timeEl.textContent = fmt(seconds); }
render();

function tick(){
  if(seconds>0){ seconds--; localStorage.setItem('ff_seconds', seconds); render(); }
  if(seconds===0){ stop(); if(soundToggle.checked) chime.play(); sessions++; localStorage.setItem('ff_sessions', sessions); sessionsEl.textContent = sessions; }
}
function start(){ if(running) return; running = true; interval = setInterval(tick, 1000); }
function stop(){ running=false; clearInterval(interval); interval=null; }
function reset(toMin=25){ stop(); seconds = toMin*60; localStorage.setItem('ff_seconds', seconds); render(); }

startBtn.onclick = start;
pauseBtn.onclick = stop;
resetBtn.onclick = () => reset();

presetBtns.forEach(b => b.onclick = () => reset(+b.dataset.min));
customBtn.onclick = () => {
  const m = prompt('Minutes?', '30');
  const n = Math.max(1, Math.min(240, parseInt(m||'30',10)));
  reset(n);
};