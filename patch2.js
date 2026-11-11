/* patch2.js: loaded after patch.js */
const CERT_CSS=`.cert{position:relative;background:#FFFDF5;color:#14302B;border:10px double #B8892B;padding:36px 28px;text-align:center;border-radius:6px;font-family:Georgia,serif;max-width:760px;margin:0 auto 16px}
.cert small{letter-spacing:.25em;text-transform:uppercase;font-size:11px;opacity:.7;font-family:system-ui,sans-serif}
.cert h1{font-size:34px;margin:8px 0;color:#1E5B4F}
.cert h2{font-size:28px;margin:14px 0 6px;border-bottom:1px solid #B8892B;display:inline-block;padding:0 24px 4px;color:#C8532E}
.cert p{margin:8px auto;max-width:560px;line-height:1.6}
.cert .seal{width:84px;height:84px;border-radius:50%;margin:16px auto 6px;background:radial-gradient(circle,#E3B94F,#B8892B);color:#fff;font:700 38px Georgia,serif;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 4px #FFFDF5,0 0 0 6px #B8892B}
.cert .sg{display:flex;justify-content:space-around;gap:10px;margin-top:22px;font-size:13px}
.cert .sg div{border-top:1px solid #14302B;padding-top:6px;min-width:140px}
.cert.rev{opacity:.6}
.cert .stamp{position:absolute;top:42%;left:50%;transform:translate(-50%,-50%) rotate(-14deg);border:6px solid #B3261E;color:#B3261E;font:700 44px system-ui,sans-serif;padding:4px 22px;letter-spacing:.1em;text-transform:uppercase;background:rgba(255,253,245,.7)}`;
const stl=document.createElement('style');
stl.textContent=CERT_CSS+'@media print{body *{visibility:hidden}.cert,.cert *{visibility:visible}.cert{position:absolute;left:0;top:0;width:100%}}';
document.head.appendChild(stl);

const passB=sid=>db.b.filter(x=>x.sid===sid&&x.status==='pass').slice(-1)[0];
const longD=k=>new Date(k+'T00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
const certId=(s,b)=>'GRIT-NOV-'+s.id.toUpperCase()+'-'+String(b.id).replace(/\D/g,'').slice(-4).padStart(4,'0');
const certHtml=(s,b,rev)=>`<div class="cert${rev?' rev':''}"><small>GRIT &middot; NIAT</small><h1>Certificate of Achievement</h1><p>This is to certify that</p><h2>${s.n}</h2><p>has cleared every required skill and successfully completed the live GRIT interview, and is hereby awarded the</p><p><b>Novice Badge &middot; AI Product Mastery</b></p><div class=seal>&#10003;</div><small>Issued by GRIT</small><p style="font-size:13px">Interviewed by ${I(b.iid).n} on ${longD(b.date)}</p><div class=sg><div>GRIT Team</div><div>Certificate ID<br>${certId(s,b)}</div><div>Interview Panel</div></div>${rev?'<div class=stamp>Revoked</div>':''}</div>`;
const certBtns='<div class=r><button class=t data-a=certDl>Download certificate</button><button data-a=certPr>Print or save as PDF</button></div>';

A.certPr=()=>window.print();
A.certDl=()=>{const s=S(ui.sid),b=passB(ui.sid);if(!b)return;
 const h='<!doctype html><meta charset="utf-8"><title>GRIT Certificate</title><style>body{margin:30px;background:#fff}'+CERT_CSS+'</style>'+certHtml(s,b,0);
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([h],{type:'text/html'}));a.download='GRIT-certificate-'+s.n.replace(/\s+/g,'-')+'.html';a.click()};

/* student home: certificate once passed */
const _vh3=V.home;
V.home=()=>{const h=_vh3(),k=st(ui.sid),b=passB(ui.sid);if(k!=='PASSED'||!b)return h;
 const c=`<div class=card><h3>Your certificate</h3>${certHtml(S(ui.sid),b,0)}${certBtns}</div>`;
 return h.replace('<div class=g>',()=>c+'<div class=g>')};

/* certificate tab */
V.cert=()=>{const s=S(ui.sid),k=st(ui.sid),b=passB(ui.sid);
 if(b&&k==='PASSED')return '<h2>Your certificate</h2>'+certHtml(s,b,0)+certBtns;
 if(b&&k==='NULLIFIED')return '<h2>Your certificate</h2>'+certHtml(s,b,1)+'<div class=card><p>This badge was withdrawn after review. Re-interview opens once the GRIT team reinstates you.</p></div>';
 return `<h2>Your certificate</h2><div class=card><h3>Not issued yet</h3><p>Your certificate appears here as soon as you clear the interview. Current status: ${L[k]}.</p></div>`};

/* leaderboard: other students plus everyone who has earned the badge */
const OTH=[['Meera Joshi',1480],['Arjun Das',1390],['Priya Menon',1320],['Vikram Rao',1180],['Divya Nambiar',1100]];
V.board=()=>{
 const P=db.s.filter(s=>st(s.id)==='PASSED').map(s=>{const b=passB(s.id);return{n:s.n,m:1250+(b&&b.score?b.score.reduce((x,y)=>x+y,0)*10:0),id:s.id}});
 const all=OTH.map(o=>({n:o[0],m:o[1]})).concat(P).sort((a,b)=>b.m-a.m);
 return `<h2>Qualiflyers leaderboard</h2><div class=card><table><tr><th>Rank</th><th>Student</th><th>Badge</th><th>Miles</th></tr>${all.map((x,i)=>`<tr><td>${i+1}</td><td>${x.n}${x.id===ui.sid?' <span class=chip>You</span>':''}${x.id&&x.id!==ui.sid?' <span class=chip>New</span>':''}</td><td>Novice</td><td>${x.m.toLocaleString('en-IN')}</td></tr>`).join('')}</table></div>`};

/* inbox: unread tracking */
V.inbox=()=>{const l=db.m.filter(m=>m.sid===ui.sid);
 const h='<h2>Inbox</h2>'+(l.map(m=>`<div class=card>${m.read?'':'<span class=chip>New</span>'}<h3>${m.t}</h3><p>${m.b}</p></div>`).join('')||'<div class=card>No messages yet.</div>');
 l.forEach(m=>m.read=1);save();return h};

/* interviewer: at-a-glance */
const _vs3=V.sched;
V.sched=()=>{const l=db.b.filter(b=>b.iid===ui.iid&&b.status==='booked'),td=l.filter(b=>b.date===dk(0)).length,pend=l.filter(b=>eT(b)<now()).length;
 const x=`<div class=g><div class=card><small>Interviews today</small><h1>${td}</h1></div><div class=card><small>Outcomes pending</small><h1>${pend}</h1></div></div>`;
 return _vs3().replace('<div class=card><table>',()=>x+'<div class=card><table>')};

/* team: attention list, reminders, CSV export, student timeline */
A.remind=d=>{lg('Reminder sent to interviewer for '+S(d.sid).n);alert('Reminder sent to the interviewer.')};
A.csv=()=>{const r=[['Student','Status','Slot','Interviewer']].concat(db.s.map(s=>{const k=st(s.id),l=last(s.id),lv=l&&l.status==='booked';return[s.n,L[k],lv?fd(l.date)+' '+ft(l.h):'',lv?I(l.iid).n:'']}));
 const t=r.map(x=>x.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n'),a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob([t],{type:'text/csv'}));a.download='grit-interview-desk.csv';a.click()};
const _vd3=V.desk;
V.desk=()=>{
 const aw=db.s.filter(s=>st(s.id)==='AWAITING').map(s=>{const l=last(s.id);return[s,l,Math.floor((now()-eT(l))/36e5)]});
 const att=`<div class=card><h3>Needs attention</h3>${aw.length?aw.map(a=>`<div class=r style="align-items:center;margin:6px 0"><span>${a[0].n}: interview with ${I(a[1].iid).n} ended ${a[2]}h ago</span>${a[2]>=24?'<span class=chip style="background:var(--t);color:#fff">Overdue</span>':''}<button data-a=remind data-sid=${a[0].id}>Remind interviewer</button></div>`).join(''):'<p>No interview is waiting on a result.</p>'}<p><button data-a=csv>Export desk as CSV</button></p></div>`;
 let tl='<p>Choose a student to see their timeline.</p>';
 if(ui.dsid){const s=S(ui.dsid),h=db.b.filter(b=>b.sid===s.id);
  tl=`<h3>${s.n}</h3>`+(h.map(b=>`<div>${fd(b.date)}, ${ft(b.h)} with ${I(b.iid).n}: <span class=chip>${lab[b.status]}</span>${b.score?' scores '+b.score.join('/'):''}${b.note?' &middot; '+b.note:''}${b.focus?' &middot; focus: '+b.focus:''}</div>`).join('')||'<p>No interviews yet.</p>')+(db.log||[]).filter(x=>x.x.includes(s.n)).slice(0,5).map(x=>`<div><small>${x.t}</small> ${x.x}</div>`).join('')}
 const sel=`<select data-c=dsid><option value="">Choose student</option>${db.s.map(s=>`<option value=${s.id} ${s.id===ui.dsid?'selected':''}>${s.n}</option>`).join('')}</select>`;
 return _vd3()+att+`<div class=card><h3>Student timeline</h3><p>${sel}</p>${tl}</div>`};

/* demo mode: behaviour and tools */
const _rec3=A.rec;
A.rec=d=>{if(!ui.demo)return _rec3(d);const op=window.prompt;
 window.prompt=q=>/Scores/i.test(q)?'4,4,5':/Focus/i.test(q)?'Product metrics, structured communication':'Clear thinking and good product instincts. Keep practising trade-offs.';
 try{_rec3(d)}finally{window.prompt=op}};
const _cn3=A.cancel;
A.cancel=()=>{if(ui.demo){const b=last(ui.sid);if(b&&b.status==='booked'){b.status='cancelled';lg('Demo: slot cancelled for '+S(ui.sid).n)}return}_cn3()};
const _rs3=A.reset;A.reset=()=>{_rs3();SKD.s2=[1,1,0,0];ui.dsid=''};

const needBk=()=>{const l=last(ui.sid);if(!l||l.status!=='booked'){alert('This student has no booked slot. Use "Book next slot" first.');return null}return l};
A.dUnlock=()=>{S(ui.sid).ok=1;SKD[ui.sid]=[1,1,1,1];lg('Demo: skills unlocked for '+S(ui.sid).n)};
A.dBook=()=>{if(!['ELIGIBLE','REBOOK'].includes(st(ui.sid))){alert('This student is not ready to book.');return}
 for(let n=1;n<=7;n++){const d=dk(n),s=slots(d)[0];if(s){ui.slot=d+'|'+s.h;A.confirm();return}}alert('No open slots in the next 7 days.')};
A.dLive=()=>{const l=needBk();if(!l)return;l.date=dk(0);l.h=now().getHours();lg('Demo: slot moved to now for '+S(ui.sid).n)};
A.dOver=()=>{const l=needBk();if(!l)return;l.date=dk(-2);l.h=10;lg('Demo: result made overdue for '+S(ui.sid).n)};
A.dOut=d=>{const l=needBk();if(!l)return;A.rec({id:l.id,r:d.r})};
A.dSkip=()=>{const l=last(ui.sid);if(!l||!l.until){alert('No cooldown or lock to skip.');return}l.until=dk(0);lg('Demo: cooldown skipped for '+S(ui.sid).n)};
A.dBadge=()=>{const s=S(ui.sid);s.ok=1;SKD[s.id]=[1,1,1,1];s.void=0;
 db.b.filter(b=>b.sid===s.id&&b.status==='booked').forEach(b=>b.status='cancelled');
 db.b.push({id:'b'+Date.now(),sid:s.id,iid:'i1',date:dk(0),h:10,status:'pass',score:[4,5,4],note:'Clear thinking and strong product instincts.',focus:''});
 s.rel=1;msg(s.id,'passed');lg('Demo: badge issued to '+s.n)};
A.dClear=()=>{const s=S(ui.sid);db.b=db.b.filter(b=>b.sid!==s.id);db.m=db.m.filter(m=>m.sid!==s.id);s.void=0;s.rel=0};
const demoP=()=>`<div class=card style="border-color:var(--t)"><small>Demo mode on</small><p>Outcomes unlock immediately, forms fill themselves in and cut-offs are skipped. These tools act on the selected student.</p><div class=r><select data-c=sid>${db.s.map(s=>`<option value=${s.id} ${s.id===ui.sid?'selected':''}>${s.n}</option>`).join('')}</select><button data-a=dUnlock>Unlock skills</button><button data-a=dBook>Book next slot</button><button data-a=dLive>Jump to interview time</button><button data-a=dOver>Make result overdue</button><button class=p data-a=dOut data-r=pass>Pass</button><button data-a=dOut data-r=retake>Retake later</button><button class=t data-a=dOut data-r=fail>Not cleared</button><button data-a=dSkip>Skip cooldown</button><button class=t data-a=dBadge>Instant badge</button><button data-a=dClear>Reset journey</button></div></div>`;

/* before and after: certificate, leaderboard */
const _vc3=V.compare;
V.compare=()=>{const ba=(t,a,b)=>`<h3>${t}</h3><div class=ba><div><small>Before</small>${a}</div><div><small>After</small>${b}</div></div>`,
 s={id:'s1',n:'Ananya Reddy'},fk={id:'b2417',iid:'i1',date:dk(2)};
 const top=x=>'<div class=card>'+x.map((r,i)=>`<div>${i+1}. ${r[0]} &middot; ${r[1].toLocaleString('en-IN')} Miles</div>`).join('')+'</div>';
 return _vc3()
 +ba('Certificate',`<div class=card><h3>Not issued yet</h3><p>Your certificate appears here as soon as you clear the interview.</p></div>`,certHtml(s,fk,0))
 +ba('Certificate after malpractice review',certHtml(s,fk,0),certHtml(s,fk,1))
 +ba('Leaderboard',top(OTH.slice(0,3)),top(OTH.slice(0,3).concat([['Ananya Reddy',1400]]).sort((a,b)=>b[1]-a[1])))};

render=function(){
 const un=db.m.filter(m=>m.sid===ui.sid&&!m.read).length;
 const R={student:[['home','Home'],['book','Book interview'],['cert','Certificate'],['board','Leaderboard'],['inbox','Inbox'+(un?' ('+un+')':'')]],interviewer:[['sched','Schedule'],['avail','Availability']],team:[['desk','Interview desk'],['log','Audit log']],compare:[['compare','Before / After']]}[ui.role];
 if(!R.some(t=>t[0]===ui.tab))ui.tab=R[0][0];
 const sel=(c,a,v)=>`<select data-c=${c}>${a.map(s=>`<option value=${s.id} ${s.id===v?'selected':''}>${s.n}</option>`).join('')}</select>`,
 p=ui.role==='student'?sel('sid',db.s,ui.sid):ui.role==='interviewer'?sel('iid',db.i,ui.iid):'';
 $('#app').innerHTML=`<header><span class=logo>&#9992; Layover</span>${[['student','Student'],['interviewer','Interviewer'],['team','Interview team'],['compare','Before / After']].map(r=>`<button class="${ui.role===r[0]?'on':''}" data-a=role data-v=${r[0]}>${r[1]}</button>`).join('')}${p}<button class="${ui.demo?'t':''}" data-a=demo style="margin-left:auto">Demo mode: ${ui.demo?'ON':'OFF'}</button><button data-a=reset>Reset data</button></header><nav>${R.map(t=>`<button class="${ui.tab===t[0]?'on':''}" data-a=tab data-v=${t[0]}>${t[1]}</button>`).join('')}</nav><main>${ui.demo?demoP():''}${V[ui.tab]()}</main>`};
render();
