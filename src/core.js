/* Pure learning-domain logic. Demo storage is not an authorization mechanism. */
(function(global){
 'use strict';
 const copy=v=>JSON.parse(JSON.stringify(v));
 const norm=v=>String(v??'').normalize('NFC').trim().replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/\s+/g,' ');
 const initial=()=>({schema:1,students:[{id:'demo-1',name:'ليان',className:'خامس ٢ · حساب افتراضي'},{id:'demo-2',name:'مريم',className:'خامس ٢ · حساب افتراضي'},{id:'demo-3',name:'دانة',className:'خامس ٢ · حساب افتراضي'}],assignments:[],responses:[],rewards:{},reports:{},notes:'',drafts:{},games:[]});
 const question=(data,id)=>data.questions.find(q=>q.id===id)||data.stories.flatMap(s=>s.questions).find(q=>q.id===id);
 const student=(s,id)=>s.students.find(x=>x.id===id);
 const attempts=(s,sid,aid,qid)=>s.responses.filter(r=>r.studentId===sid&&r.assignmentId===aid&&r.questionId===qid).sort((a,b)=>a.attempt-b.attempt);
 function assign(s,data,{id,title,questionIds,studentIds,kind='training',storyId=null}){
  if(!['training','independent','story'].includes(kind))throw Error('نوع المهمة غير صالح.');
  if(!id||s.assignments.some(a=>a.id===id))throw Error('معرّف المهمة مكرر.');
  const ids=[...new Set(questionIds)], ss=[...new Set(studentIds)];
  if(!ids.length||!ss.length||ids.length>12||ss.some(x=>!student(s,x)))throw Error('اختاري أسئلة وطالبة واحدة على الأقل.');
  ids.forEach(x=>{const q=question(data,x);if(!q||q.needsContentReview||q.type==='observation'||q.activityOnly)throw Error('أحد البنود غير جاهز للتكليف.');if(kind==='independent'&&q.origin!=='independent')throw Error('الأداء المستقل يحتاج أسئلة مخصصة له.');});
  const n=copy(s);n.assignments.push({id,title:String(title).slice(0,120),questionIds:ids,studentIds:ss,kind,storyId,createdAt:new Date().toISOString()});return n;
 }
 function reward(n,r,score){
  const key=r.studentId+'|'+r.questionId;
  if(score===2&&!Object.prototype.hasOwnProperty.call(n.rewards,key))n.rewards[key]=(r.attempt===1&&!r.usedHint)?10:5;
 }
 function submit(s,data,{id,studentId,assignmentId,questionId,value,usedHint=false}){
  if(s.responses.some(x=>x.id===id))return s;
  const a=s.assignments.find(x=>x.id===assignmentId),q=question(data,questionId);
  if(!a||!q||!a.studentIds.includes(studentId)||!a.questionIds.includes(questionId))throw Error('المهمة غير متاحة لهذه الطالبة.');
  const previous=attempts(s,studentId,assignmentId,questionId),last=previous.at(-1);
  if(last&&(last.score===2||last.status==='pending'||last.status==='reviewed'))return s;
  if(previous.length>=(a.kind==='independent'?1:3))return s;
  if(usedHint&&a.kind==='independent')throw Error('لا تتاح التلميحات أثناء الأداء المستقل.');
  if(q.type==='mcq'&&(!Number.isInteger(value)||value<0||value>=q.choices.length))throw Error('اختاري إجابة أولًا.');
  if(q.type!=='mcq'&&(!norm(value)||String(value).length>3000))throw Error('اكتبي إجابة لا تتجاوز ٣٠٠٠ حرف.');
  let score=null,status='pending';
  if(q.type==='mcq'&&Number.isInteger(q.answer)){score=value===q.answer?2:0;status=score===2?'correct':(a.kind==='independent'?'incorrect':'retry');}
  // Unknown short answers are reviewed, not automatically rejected: Arabic synonyms can be valid.
  if(q.type==='short'&&(q.answer||[]).map(norm).includes(norm(value))){score=2;status='correct';}
  const n=copy(s),r={id,studentId,assignmentId,questionId,value,usedHint:!!usedHint,attempt:previous.length+1,kind:a.kind,score,status,at:new Date().toISOString(),comment:''};
  n.responses.push(r);reward(n,r,score);delete n.drafts[`${studentId}|${assignmentId}|${questionId}`];return n;
 }
 function review(s,id,score,comment=''){
  if(![0,1,2].includes(score))throw Error('اختاري نتيجة صحيحة للمراجعة.');
  const n=copy(s),r=n.responses.find(x=>x.id===id);if(!r)throw Error('لم يتم العثور على الإجابة.');if(r.status!=='pending')return s;
  r.score=score;r.status='reviewed';r.comment=String(comment).slice(0,600);r.reviewedAt=new Date().toISOString();reward(n,r,score);return n;
 }
 function latest(s,sid){const m=new Map();s.responses.filter(x=>x.studentId===sid).forEach(r=>m.set(r.assignmentId+'|'+r.questionId,r));return [...m.values()];}
 function summary(s,data,sid){
  const rs=latest(s,sid),graded=rs.filter(r=>r.score!==null),pending=rs.filter(r=>r.score===null).length;
  const buckets={};graded.forEach(r=>{const q=question(data,r.questionId);if(!q)return;const b=buckets[q.skill]||(buckets[q.skill]={skill:q.skill,score:0,max:0,count:0,independent:0});b.score+=r.score;b.max+=2;b.count++;if(r.kind==='independent')b.independent++;});
  const rows=Object.values(buckets).map(b=>({...b,percent:Math.round(b.score/b.max*100)}));
  const weak=[...rows].sort((a,b)=>a.percent-b.percent)[0];
  const points=Object.entries(s.rewards).filter(([k])=>k.startsWith(sid+'|')).reduce((t,[,v])=>t+v,0);
  const scored=graded.reduce((t,r)=>t+r.score,0),max=graded.length*2;
  const storyIds=[...new Set(s.assignments.filter(a=>a.kind==='story'&&a.studentIds.includes(sid)&&a.questionIds.every(qid=>attempts(s,sid,a.id,qid).length>0)).map(a=>a.storyId))];
  return {student:copy(student(s,sid)),count:rs.length,graded:graded.length,pending,points,score:scored,max,percent:max?Math.round(scored/max*100):null,rows,completedStories:storyIds.length,independentCount:graded.filter(r=>r.kind==='independent').length,needsFollowUp:rows.filter(r=>r.percent<100).map(x=>x.skill),recommendation:!weak?'لم تتوفر إجابات بعد. ابدؤوا بمهمة قصيرة، ثم نحدد خطوة المتابعة.':weak.percent===100?'كانت الإجابات على البنود المصححة صحيحة. الخطوة التالية: شاهد مستقل جديد، لا تكرار السؤال نفسه.':weak.skill==='evidence'?'بعد قراءة فقرة قصيرة، اسألوا ابنتكم: ما الجملة التي تثبت إجابتك؟':weak.skill==='infer'?'اسألوا ابنتكم: لماذا تصرفت الشخصية هكذا؟ واطلبوا منها ربط السبب بحدث في النص.':'اقرؤوا فقرة قصيرة مع ابنتكم، ثم اطلبوا منها شرح معناها بكلماتها.'};
 }
 function publish(s,data){const n=copy(s);s.students.forEach(st=>{const t=summary(s,data,st.id);if(t.graded&&!t.pending)n.reports[st.id]={...t,generatedAt:new Date().toISOString(),demo:true};});return n;}
 function points(s,sid){return Object.entries(s.rewards).filter(([k])=>k.startsWith(sid+'|')).reduce((a,[,v])=>a+v,0);}
 const api={initial,question,attempts,assign,submit,review,latest,summary,publish,points,norm};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else global.ITQAN_CORE=api;
})(typeof window!=='undefined'?window:globalThis);
