const el=id=>document.getElementById(id);
let plan={};
let currentRecordId='';

function payload(action='save'){
  const date=el('date').value;
  return {
    action,
    recordId:currentRecordId||`DOS-${date}`,
    date,
    status:action==='close'?'Closed':'Open',
    objective:el('objective').value,
    plannedStart:el('plannedStart').value,
    plannedEnd:el('plannedEnd').value,
    actualStart:el('actualStart').value,
    actualEnd:el('actualEnd').value,
    breakMinutes:Number(el('breakMinutes').value||0),
    workHours:Number(el('hours').value||0),
    taskStatus:{_plan:plan},
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
function status(t,c=''){el('status').textContent=t;el('status').className=`status ${c}`;}
function yn(value,yes,no){return value?yes:no;}

function updateCover(){
  el('coverDate').textContent=formatDate(el('date').value);
  const h=Number(el('hours').value||0);
  const contacts=Number(el('contacts').value||0);
  const responses=Number(el('responses').value||0);
  const meetings=Number(el('meetings').value||0);
  el('coverHours').textContent=h?`${h.toFixed(2)} hours`:'Not recorded';
  el('coverBusiness').textContent=(contacts||responses||meetings)?`${contacts} contacts / ${responses} responses / ${meetings} meetings`:'No activity recorded';
}

function updatePosition(r={}){
  const pieces=[];
  if(r.responses)pieces.push(`${r.responses} response${r.responses===1?'':'s'}`);
  if(r.meetingsSet)pieces.push(`${r.meetingsSet} meeting${r.meetingsSet===1?'':'s'} set`);
  if(r.workHours)pieces.push(`${Number(r.workHours).toFixed(2)} work hours recorded`);
  if(r.prospectingHours)pieces.push(`${Number(r.prospectingHours).toFixed(2)} prospecting hours`);
  el('positionSummary').textContent=pieces.length?pieces.join('. ')+'.':'No operating activity has been recorded yet for this day.';
  el('coverStatus').textContent=r.status||'Open';
  el('workLogState').textContent=yn(r.workLogSynced,'Synced','Pending');
  el('workLogState').className=r.workLogSynced?'ok':'warn';
  el('scorecardState').textContent=yn(r.scorecardSynced,'Synced','Pending');
  el('scorecardState').className=r.scorecardSynced?'ok':'warn';
  el('crmState').textContent=r.crmReviewRequired?'Review required':'Current';
  el('crmState').className=r.crmReviewRequired?'warn':'ok';
  el('kanbanState').textContent=r.kanbanReviewRequired?'Review required':'Current';
  el('kanbanState').className=r.kanbanReviewRequired?'warn':'ok';
}

function apply(r){
  currentRecordId=r.recordId||currentRecordId;
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
  plan=r.taskStatus?._plan||{};
  updateCover();
  updatePosition(r);
}

async function load(){
  try{
    const r=await fetch('/api/action-sheet',{credentials:'same-origin',cache:'no-store'});
    const b=await r.json();
    if(!r.ok)throw new Error(b.message);
    apply(b.record);
    status(b.source==='created'?'A new Daily Operating Summary was created from the current source records.':'Current Daily Operating Summary loaded.','ok');
  }catch(e){status(e.message,'warn');}
}

async function send(action){
  if(action==='close'&&!confirm('Close and archive this operating day? The current summary will be retained as the stakeholder record and the next weekday summary will be created automatically. Weekend work remains opt-in only.'))return;
  status(action==='close'?'Closing and archiving the operating day…':'Saving summary…');
  try{
    const r=await fetch('/api/action-sheet',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload(action))});
    const b=await r.json();
    if(!r.ok)throw new Error(b.message);
    apply(b.record);
    status(b.message,'ok');
  }catch(e){status(e.message,'warn');}
}

['date','hours','contacts','responses','meetings'].forEach(id=>el(id).addEventListener('input',updateCover));
el('save').onclick=()=>send('save');
el('close').onclick=()=>send('close');
load();