// when does the last escaping box of each unit clear x < X (default: west end of bridge 0)? usage: node esc_sim.js S10 [X]
const fs=require('fs'),vm=require('vm'),path=require('path');const V='/home/user/battle-maps/vicksburg';const ctx={console,Math,JSON};ctx.window=ctx;vm.createContext(ctx);
const run=f=>vm.runInContext(fs.readFileSync(f,'utf8'),ctx);run(V+'/worlds/geo.js');ctx.GM3D_PLACES=JSON.parse(fs.readFileSync(V+'/data/geo.json','utf8')).places||[];
for(const d of fs.readdirSync(V+'/worlds')){const f=path.join(V,'worlds',d,'region.js');if(fs.existsSync(f))run(f);}run(V+'/engine/seqlib.js');run(`${V}/sequences/${process.argv[2]}/seq.js`);
const S=ctx.SEQ,r=S.regions.find(q=>ctx.GM3D_REGIONS[q].kind!=='wide');const R=ctx.GM3D_REGIONS[r];const B=R.features.bridges[0];const X=+(process.argv[3]||(B.x-B.len/2*Math.abs(Math.cos(B.angle))));
const ts=(S.regionOpts&&S.regionOpts[r]&&S.regionOpts[r].troopScale)||1;console.log('bridge',B.x.toFixed(2),B.z.toFixed(2),'len',B.len,'angle',B.angle.toFixed(2),'west X',X.toFixed(2),'ts',ts);
for(const [j,u] of S.units.entries()){const e=u.escape;if(!e)continue;const art=u.type==='art',bw=(u.bw||(art?0.42:0.7))*ts,gap=(u.gap||0.12)*ts,n=u.n||4,from=e.from??0;
 const road=e.road;const k=u.keys[u.keys.length-1];const st=[k[1],k[2]];const ahead=p=>p[0]<st[0]-0.3;const jj=Math.max(0,road.findIndex(ahead));const P=[st,...road.slice(jj)];
 const seg=[];let L=0,sB=null;for(let i=1;i<P.length;i++){const d=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);seg.push(d);L+=d;if(e.slowX!=null&&P[i][0]>=e.slowX-1e-3)sB=L;}if(sB==null)sB=e.slowX!=null?0:L;
 const v=e.v??2.1,v2=e.v2??1.2,tB=e.t0+sB/v;const s=t=>t<=e.t0?0:t<tB?(t-e.t0)*v:Math.min(L,sB+(t-tB)*v2);
 const at=si=>{let i=0;while(i<seg.length-1&&si>seg[i]){si-=seg[i];i++;}const a=P[i],b=P[i+1],f=Math.min(1,Math.max(0,si/(seg[i]||1)));return [a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f];};
 let tFirstOn=null,tLastOff=null;for(let t=e.t0;t<e.t0+30;t+=0.02){const xs=[];for(let i=from;i<n;i++){const si=s(t)-(i-from)*(bw+gap)*1.05;xs.push(si>0?at(si)[0]:st[0]);}
  const onB=xs.some(x=>x<B.x+B.len/2+0.2&&x>X);if(onB&&tFirstOn==null)tFirstOn=t;if(xs.every(x=>x<X)){tLastOff=t;break;}}
 console.log(`unit#${j} ${u.side} t0 ${e.t0} v ${v}/${v2}: first box on bridge ${tFirstOn&&tFirstOn.toFixed(2)}, last box past west end ${tLastOff&&tLastOff.toFixed(2)}`);}
