/* patch.js: loaded after extras.js */
A.hr=d=>{const i=I(ui.iid),h=+d.h,x=i.hrs.indexOf(h);
 if(x<0){i.hrs.push(h);i.hrs.sort((p,q)=>p-q);return}
 const hit=db.b.filter(b=>b.iid===i.id&&b.h===h&&b.status==='booked'&&b.date>=dk(0));
 if(hit.length&&!confirm(hit.length+' booking(s) at '+ft(h)+' will be cancelled and the students asked to rebook. No attempt is used. Continue?'))return;
 hit.forEach(b=>{b.status='ivcancel';msg(b.sid,'ivcancel',{d:fd(b.date),t:ft(b.h),i:i.n});lg('Booking cancelled for '+S(b.sid).n+' (hour removed)')});
 i.hrs.splice(x,1)};

A.quick=d=>{ui.slot=d.v;A.confirm()};
const _vh2=V.home;
V.home=()=>{const k=st(ui.sid);let x='';
 if(['ELIGIBLE','REBOOK'].includes(k)){const o=[];
  for(let n=1;n<=7&&o.length<4;n++){const d=dk(n);slots(d).forEach(s=>{if(o.length<4)o.push([d,s.h])})}
  x=`<div class=card><h3>Book from here</h3><div class=r>${o.map(a=>`<button class=t data-a=quick data-v="${a[0]}|${a[1]}">${fd(a[0])}, ${ft(a[1])}</button>`).join('')||'No open slots right now.'}</div><p><button data-a=tab data-v=book>See all slots</button></p></div>`}
 return _vh2()+x};

const _vs=V.sched;
V.sched=()=>_vs().replace(/<small>Outcome buttons unlock[^<]*<\/small>/,'');

V.compare=()=>{
 const ba=(t,a,b)=>`<h3>${t}</h3><div class=ba><div><small>Before</small>${a}</div><div><small>After</small>${b}</div></div>`,B=hero('BOOKED',fb);
 const home=[['Passed','PASSED'],['Not cleared','COOLING'],['Retake later','RETAKE'],['No-show','LOCKED'],['Badge withdrawn','NULLIFIED']].map(x=>ba('Student home: '+x[0],B,hero(x[1],fb))).join('');
 const bk=ba('Book tab',`<div class=card><h3>Pick your interview slot</h3><p>Open slots in the next 7 days.</p></div>`,`<div class=card><h3>Booking is not open</h3><p>Current status: Cooling off.</p></div>`);
 const f=M.failed({u:'Tue, 18 Nov'}),inb=ba('Student inbox',`<div class=card>No messages yet.</div>`,`<div class=card><h3>${f[0]}</h3><p>${f[1]}</p></div>`);
 const sc=ba('Interviewer schedule',`<div class=card><b>Ananya Reddy</b> &middot; Tue, 4:00 PM <span class=chip>Upcoming</span></div>`,`<div class=card><b>Ananya Reddy</b> &middot; Tue, 4:00 PM <span class=chip>Not cleared</span></div>`);
 const dk2=ba('Interview desk',`<div class=g><div class=card><small>Booked</small><h1>1</h1></div><div class=card><small>Badges earned</small><h1>0</h1></div></div>`,`<div class=g><div class=card><small>Booked</small><h1>0</h1></div><div class=card><small>Badges earned</small><h1>1</h1></div></div>`);
 return '<h2>Before and after</h2>'+home+bk+inb+sc+dk2};

render=function(){
 const R={student:[['home','Home'],['book','Book interview'],['board','Leaderboard'],['inbox','Inbox']],interviewer:[['sched','Schedule'],['avail','Availability']],team:[['desk','Interview desk'],['log','Audit log']],compare:[['compare','Before / After']]}[ui.role];
 if(!R.some(t=>t[0]===ui.tab))ui.tab=R[0][0];
 const sel=(c,a,v)=>`<select data-c=${c}>${a.map(s=>`<option value=${s.id} ${s.id===v?'selected':''}>${s.n}</option>`).join('')}</select>`,
 p=ui.role==='student'?sel('sid',db.s,ui.sid):ui.role==='interviewer'?sel('iid',db.i,ui.iid):'';
 $('#app').innerHTML=`<header><span class=logo>&#9992; Layover</span>${[['student','Student'],['interviewer','Interviewer'],['team','Interview team'],['compare','Before / After']].map(r=>`<button class="${ui.role===r[0]?'on':''}" data-a=role data-v=${r[0]}>${r[1]}</button>`).join('')}${p}<button class="${ui.demo?'t':''}" data-a=demo style="margin-left:auto">Demo mode: ${ui.demo?'ON':'OFF'}</button><button data-a=reset>Reset data</button></header><nav>${R.map(t=>`<button class="${ui.tab===t[0]?'on':''}" data-a=tab data-v=${t[0]}>${t[1]}</button>`).join('')}</nav><main>${V[ui.tab]()}</main>`};
render();
