(()=>{'use strict';
const KEY='livearena29.audio', CONTROL='livearena27.control';
const defaults={enabled:true,volume:.62,ambience:true,traffic:true,people:true,weather:true,emergency:true,cinema:true,announcements:true,spatial:true,dynamics:true,intensity:.7};
let prefs={...defaults};try{Object.assign(prefs,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){}
let ctx=null,master=null,duckGain=null,voices=0,MAX_VOICES=18,panCursor=0,ambGain=null,noiseBuffer=null,ambientNodes=[],lastCity='',lastShow='',lastWeather='',lastEvent=0,lastCue=0,lastAnnounce=0,prevKO=0,prevFights=0,active=false;
const rand=(a,b)=>a+Math.random()*(b-a), clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function init(){if(ctx)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;ctx=new AC();master=ctx.createGain();master.gain.value=prefs.enabled?prefs.volume:0;const compressor=ctx.createDynamicsCompressor();compressor.threshold.value=-16;compressor.ratio.value=7;compressor.attack.value=.005;compressor.release.value=.25;duckGain=ctx.createGain();duckGain.gain.value=1;master.connect(duckGain);duckGain.connect(compressor);compressor.connect(ctx.destination);
noiseBuffer=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);const a=noiseBuffer.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;setAmbience();}
async function start(){init();if(ctx){try{await ctx.resume();active=ctx.state==='running'}catch(e){};updateMaster();}}
function updateMaster(){if(!ctx)return;master.gain.setTargetAtTime(prefs.enabled?clamp(+prefs.volume||0,0,1):0,ctx.currentTime,.06)}
function voice(type,freq,duration,gain,filter=0,endFreq=null,when=0,pan=null){
 if(!ctx||ctx.state!=='running'||!prefs.enabled||voices>=MAX_VOICES)return;
 voices++;const t=ctx.currentTime+when,source=type==='noise'?ctx.createBufferSource():ctx.createOscillator();
 if(type==='noise')source.buffer=noiseBuffer;else{source.type=type;source.frequency.setValueAtTime(Math.max(20,freq),t);if(endFreq)source.frequency.exponentialRampToValueAtTime(Math.max(20,endFreq),t+duration)}
 const g=ctx.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,gain*(prefs.intensity??.7)),t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+duration);
 let tail=source;if(filter){const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=filter;tail.connect(f);tail=f}tail.connect(g);
 if(prefs.spatial&&ctx.createStereoPanner){const p=ctx.createStereoPanner();p.pan.value=pan===null?Math.sin(++panCursor*2.399):clamp(pan,-1,1);g.connect(p);p.connect(master)}else g.connect(master);
 source.onended=()=>{voices=Math.max(0,voices-1);try{source.disconnect();g.disconnect()}catch(e){}};source.start(t);source.stop(t+duration+.025);
}
function tone(freq=300,duration=.2,gain=.07,type='sine',endFreq=null,when=0,pan=null){voice(type,freq,duration,gain,0,endFreq,when,pan)}
function noise(duration=.4,gain=.05,filter=800,when=0,pan=null){voice('noise',0,duration,gain,filter,null,when,pan)}
function duck(seconds=1.7){if(!ctx||!prefs.dynamics)return;const t=ctx.currentTime;duckGain.gain.cancelScheduledValues(t);duckGain.gain.setTargetAtTime(.43,t,.05);duckGain.gain.setTargetAtTime(1,t+seconds,.5)}
function stopAmbience(){for(const n of ambientNodes){try{n.stop()}catch(e){}}ambientNodes=[];if(ambGain){try{ambGain.disconnect()}catch(e){}}}
function setAmbience(){if(!ctx)return;stopAmbience();ambGain=ctx.createGain();ambGain.gain.value=0;ambGain.connect(master);if(!prefs.ambience)return;const s=ctx.createBufferSource(),f=ctx.createBiquadFilter();s.buffer=noiseBuffer;s.loop=true;f.type='lowpass';f.frequency.value=280;const g=ctx.createGain();g.gain.value=.045;s.connect(f);f.connect(g);g.connect(ambGain);s.start();ambientNodes.push(s);ambGain.gain.setTargetAtTime(1,ctx.currentTime,.8)}
function cue(name){switch(name){case 'traffic':if(prefs.traffic){tone(rand(90,140),.45,.035,'sawtooth',rand(60,85));if(Math.random()<.4)tone(460,.12,.05,'square',420,.12)}break;
case 'crowd':if(prefs.people){tone(rand(110,210),.15,.025,'triangle',rand(80,120));noise(.15,.018,950)}break;
case 'footsteps':if(prefs.people){noise(.065,.018,210);noise(.065,.014,240,.22)}break;
case 'rain':if(prefs.weather)noise(.8,.055,1600);break;
case 'wind':if(prefs.weather)noise(1.3,.06,440);break;
case 'thunder':if(prefs.weather){noise(1.9,.16,190);tone(53,1.1,.085,'sawtooth',32)}break;
case 'siren':if(prefs.emergency){duck(1.4);for(let i=0;i<4;i++)tone(i%2?580:740,.3,.055,'sine',i%2?740:580,i*.3); }break;
case 'helicopter':if(prefs.emergency)for(let i=0;i<8;i++)noise(.07,.032,260,i*.14);break;
case 'fire':if(prefs.emergency)for(let i=0;i<4;i++)noise(.22,.035,420,i*.16);break;
case 'impact':if(prefs.emergency){duck(.5);noise(.22,.13,300);tone(100,.22,.07,'triangle',45)}break;
case 'cinema':if(prefs.cinema){duck(1.1);tone(220,.5,.055,'sine',180);tone(330,.6,.045,'sine',260,.15);tone(440,.8,.04,'sine',330,.3)}break;
case 'news':if(prefs.announcements){duck(.5);tone(660,.16,.035,'sine');tone(880,.24,.035,'sine',null,.18)}break;
case 'transition':if(prefs.announcements){noise(.48,.035,1800);tone(300,.36,.05,'sine',620)}break;
case 'night':if(prefs.ambience){tone(160,.6,.02,'sine',130)}break;}}
function read(){let s={};try{s=JSON.parse(localStorage.getItem(CONTROL)||'{}')}catch(e){}return s}
function tick(){if(!ctx||ctx.state!=='running'||!prefs.enabled)return;const s=read(),city=s.city||document.getElementById('city24')?.value||'lisboa',show=s.show||document.getElementById('show24')?.value||'city',weather=s.weather==='auto'?(show==='weather'?'storm':city==='london'?'rain':'sun'):(s.weather||'sun');const now=performance.now();
if(city!==lastCity||show!==lastShow){if(lastCity)cue('transition');if(show==='cinema')cue('cinema');else if(show==='rescue')cue('siren');else if(show==='night')cue('night');else cue('news');lastCity=city;lastShow=show;lastEvent=now}
if(weather!==lastWeather){lastWeather=weather;if(weather==='storm')cue('thunder')}
const ko=Number(document.getElementById('kos')?.textContent||0),fights=Number(document.getElementById('fights')?.textContent||0);if(ko>prevKO)cue('impact');prevKO=ko;if(fights>prevFights+2&&now-lastCue>2500){cue('crowd');lastCue=now}prevFights=fights;
if(now-lastEvent>rand(1800,3100)){const pool=['footsteps','crowd'];if(show==='city'||show==='morning')pool.push('traffic','traffic');if(show==='rescue')pool.push('siren','helicopter','fire','traffic');if(show==='cinema')pool.push('cinema','traffic','helicopter');if(weather==='rain'||weather==='storm')pool.push('rain','wind');if(weather==='storm')pool.push('thunder');if(weather==='fog')pool.push('wind');if(show==='night')pool.push('night');cue(pool[Math.floor(Math.random()*pool.length)]);lastEvent=now}
}
function apply(p){if(!p||typeof p!=='object')return;for(const k of Object.keys(defaults)){if((k==='volume'||k==='intensity')&&Number.isFinite(Number(p[k])))prefs[k]=clamp(Number(p[k]),0,1);else if(k!=='volume'&&k!=='intensity'&&typeof p[k]==='boolean')prefs[k]=p[k]}try{localStorage.setItem(KEY,JSON.stringify(prefs))}catch(e){}updateMaster();if(ctx)setAmbience();if(prefs.enabled&&ctx?.state==='suspended')start()}
window.addEventListener('message',e=>{if(e.origin!==location.origin)return;if(e.data?.type==='arena29.audio'){apply(e.data.prefs);if(e.data.activate)start();if(e.data.test)cue(e.data.test)}});
try{const bc=new BroadcastChannel('livearena29.audio');bc.onmessage=e=>{if(e.data?.type==='prefs')apply(e.data.prefs);if(e.data?.type==='activate')start();if(e.data?.type==='test')cue(e.data.name)}}catch(e){}
window.addEventListener('storage',e=>{if(e.key===KEY&&e.newValue){try{apply(JSON.parse(e.newValue))}catch(err){}}});
window.addEventListener('pointerdown',start,{once:true});window.addEventListener('keydown',start,{once:true});
// Browser autoplay policies may block sound until a user gesture or OBS browser-source configuration.
setInterval(tick,500);window.__arenaAudio29={start,cue,apply,get:()=>({...prefs}),diagnostics:()=>({state:ctx?.state||'not-started',voices,maxVoices:MAX_VOICES})};
})();