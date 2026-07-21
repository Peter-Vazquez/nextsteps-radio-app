const el=id=>document.getElementById(id);
let plan={};
let timeState={};

function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function tasks(){return Object.fromEntries([...document.querySelectorAll('[data-task]')].map(x=>[x.dataset.task,x.checked]));}
function taskTimes(){return Object.fromEntries([...document.querySelectorAll('[data-time]')].map(x=>[x.dataset.time,x.value]));}
function payload(action='save'){
  const date=el('date').value;
  return {
    action,
    recordId:`DAS-${date}`,
    date,
    status:action==='close'?'Closed':'Open',
    objective:el('objective').value,
    plannedStart:el('plannedStart').value,
    plannedEnd:el('plannedEnd').value,
    actualStart:el('actualStart').value,
    actualEnd:el('actualEnd').value,
    breakMinutes:Number(el('breakMinutes').value||0),
    workHours:Number(el('hours').value||0),
    taskStatus:{...tasks(),_plan:plan,_time:taskTimes()},
    contactsSent:Number(el('contacts').value||0),
    responses:Number(el('responses').value||0),
    meetingsSet:Number(el('meetings').value||0),
    prospectingHours:Number(el('prospecting').value||0),
    followUpNotes:el('followUp').value,
    closeoutComments:el('comments').value,
    tomorrowFirstAction:el('tomorrow').value
  };
}

function formatDate(value){
  const d=new Date(`${value}T12:00:00`);
  if(Number.isNaN(d.getTime()))return value||'Operating Day';
  return d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
}
function updateCover(){
  el('coverDate').textContent=formatDate(el('date').value);
  el('coverStart').textContent=el('actualStart').value||el('plannedStart').value||'Not recorded';
  const b=Number(el('breakMinutes').value||0);
  el('coverBreak').textContent=b?`${b} minutes`:'Not yet taken';
}
function status(t,c=''){el('status').textContent=t;el('status').className=`status ${c}`;}

function renderAgenda(p={}){
  plan=p;
  el('operatingRule').textContent=p.operatingRule||'Advance all three lanes today — Revenue, Build, and Compliance.';
  const list=el('agendaList');
  const items=p.agenda||[
    {key:'compliance',number:1,title:p.compliance?.title||'Compliance lane',duration:p.compliance?.duration||'30–45 minutes',action:p.compliance?.action||p.compliance?.copy,completion:p.compliance?.completion},
    {key:'build',number:2,title:p.build?.title||'Build lane',duration:p.build?.duration||'90 minutes',action:p.build?.action||p.build?.copy,completion:p.build?.completion},
    {key:'training',number:3,title:p.training?.title||'Training lane',duration:p.training?.duration||'60–90 minutes',action:p.training?.action,completion:p.training?.completion},
    {key:'revenue',number:4,title:p.revenue?.title||'Revenue lane',duration:p.revenue?.duration||'45–60 minutes',action:p.revenue?.action||p.revenue?.copy,completion:p.revenue?.completion},
    {key:'record',number:5,title:p.record?.title||'End-of-day synchronization',duration:p.record?.duration||'20–30 minutes',action:p.record?.action||p.record?.copy,completion:p.record?.completion}
  ];
  list.innerHTML=items.map(item=>`
    <article class="agenda-item ${item.key==='break'?'break':''} ${item.key==='record'?'closeout':''}">
      <input type="checkbox" data-task="${esc(item.key)}" aria-label="Complete ${esc(item.title)}">
      <div class="agenda-copy">
        <h3>${esc(item.number)}. ${esc(item.title)}</h3>
        <p><strong>Action:</strong> ${esc(item.action||item.copy||'')}</p>
        <p class="completion"><strong>Completion standard:</strong> ${esc(item.completion||'Complete the documented milestone and retain evidence.')}</p>
        <label class="field" style="display:block;margin-top:6px"><span style="font-size:8px;text-transform:uppercase;font-weight:800;color:#6a7984">Actual time / note</span><input data-time="${esc(item.key)}" value="${esc(timeState[item.key]||'')}"></label>
      </div>
      <div class="duration">${esc(item.duration||'')}</div>
    </article>`).join('');

  const min=p.minimumFinish||[];
  el('minimumList').innerHTML=min.map((item,i)=>`<div class="minimum-item"><input type="checkbox" data-task="minimum-${i}"><span>${esc(item)}</span></div>`).join('');
  el('deferred').textContent=p.deferred||'';
}

function apply(r){
  ['date','objective','plannedStart','plannedEnd','actualStart','actualEnd'].forEach(k=>{if(el(k)&&r[k]!=null)el(k).value=r[k]});
  el('hours').value=r.workHours||0;
  el('breakMinutes').value=r.breakMinutes||0;
  el('contacts').value=r.contactsSent||0;
  el('responses').value=r.responses||0;
  el('meetings').value=r.meetingsSet||0;
  el('prospecting').value=r.prospectingHours||0;
  el('followUp').value=r.followUpNotes||'';
  el('comments').value=r.closeoutComments||'';
  el('tomorrow').value=r.tomorrowFirstAction||'';
  const s=r.taskStatus||{};
  timeState=s._time||{};
  renderAgenda(s._plan||{});
  Object.entries(s).forEach(([k,v])=>{
    if(k.startsWith('_'))return;
    const x=document.querySelector(`[data-task="${CSS.escape(k)}"]`);
    if(x)x.checked=!!v;
  });
  updateCover();
}

async function load(){
  try{
    const r=await fetch('/api/action-sheet',{credentials:'same-origin',cache:'no-store'});
    const b=await r.json();
    if(!r.ok)throw new Error(b.message);
    apply(b.record);
    status(b.source==='created'?'A new priority-agenda action sheet was created from the current roadmap. All tasks and totals were reset.':'Today’s active priority agenda loaded.','ok');
  }catch(e){status(e.message,'warn');}
}

async function send(action){
  if(action==='close'&&!confirm('Close, archive, and retire this agenda? A new printable priority agenda will be generated from the current roadmap with all tasks and daily totals reset.'))return;
  status(action==='close'?'Closing and regenerating the priority agenda…':'Saving progress…');
  try{
    const r=await fetch('/api/action-sheet',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload(action))});
    const b=await r.json();
    if(!r.ok)throw new Error(b.message);
    apply(b.record);
    status(b.message,'ok');
  }catch(e){status(e.message,'warn');}
}

['date','plannedStart','actualStart','breakMinutes'].forEach(id=>el(id).addEventListener('input',updateCover));
el('save').onclick=()=>send('save');
el('close').onclick=()=>send('close');
load();