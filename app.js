(() => {
const pads=[...document.querySelectorAll('.pad')],
S=id=>document.getElementById(id),
start=S('start'),strictBtn=S('strict'),lvl=S('level'),
msg=S('message'),modal=S('resultModal'),
title=S('resultTitle'),text=S('resultText'),score=S('score');

let seq=[],i=0,playing=0,strict=0,level=0,fallI,fallT;
const ctx=new AudioContext(),freq={green:329,red:262,yellow:220,blue:196};

const tone=(c,d=300)=>{
 let o=ctx.createOscillator(),g=ctx.createGain();
 o.frequency.value=freq[c];o.connect(g);g.connect(ctx.destination);
 g.gain.value=0.001;o.start();
 g.gain.exponentialRampToValueAtTime(.3,ctx.currentTime+.02);
 g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+d/1000);
 o.stop(ctx.currentTime+d/1000+.02);
}

const flash=e=>{
 e.classList.add('active');tone(e.dataset.color,250);
 setTimeout(()=>e.classList.remove('active'),250);
}

const playSeq=()=>{
 playing=1;msg.textContent="Watch!";
 seq.forEach((c,j)=>setTimeout(()=>flash(S(c)),j*600));
 setTimeout(()=>{playing=0;msg.textContent="Your turn"},seq.length*600+200);
}

const next=()=>{
 level++;lvl.textContent=level;i=0;
 seq.push(["green","red","yellow","blue"][Math.random()*4|0]);
 if(level==10)return show(1);
 playSeq();
}

pads.forEach(p=>p.onclick=e=>{
 if(playing)return;
 flash(e.target);
 if(e.target.dataset.color==seq[i]){
  if(++i==seq.length)setTimeout(next,500);
 }else{
  score.textContent=level-1;
  show(0);if(!strict)playSeq(); else reset();
 }
});

const show=w=>{
 title.textContent=w?"You Win":"Game Over";
 text.textContent=w?`Completed ${level}`:`Reached ${level-1}`;
 modal.classList.remove("hidden");
 if(w)flowers();
}

const reset=()=>{
 seq=[];level=0;i=0;lvl.textContent="--";
 msg.textContent="Click Start";
}

start.onclick=()=>{reset();ctx.resume();next()}
strictBtn.onclick=()=>{
 strict^=1;
 strictBtn.textContent=strict?"Strict: ON":"Strict: OFF";
}

S('playAgain').onclick=()=>{
 clearInterval(fallI);
 clearTimeout(fallT);
 document.querySelectorAll('.flower').forEach(f=>f.remove());
 modal.classList.add("hidden");
 reset();
 ctx.resume();
 next();
}
S('closeModal').onclick=()=>{modal.classList.add("hidden");reset();}

const flowers = () => {
 let f = ['🌸','🌼','🌺','🌷'];
 fallI = setInterval(() => {
  let d = document.createElement("div");
  d.textContent = f[Math.random() * 4 | 0];
  d.className = "flower";
  d.style.left = Math.random() * 100 + "vw";
  d.style.animationDuration = (3000 + Math.random() * 2000) + "ms";
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 4000);
 }, 200);
 fallT = setTimeout(() => clearInterval(fallI), 60000);
}
})();

