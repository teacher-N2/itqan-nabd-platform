const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.resolve(__dirname,'..'),box={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'src/data.js'),'utf8'),box);const D=JSON.parse(JSON.stringify(box.window.ITQAN_DATA)),C=require('../src/core.js');
const tests=[];function check(name,fn){fn();tests.push({name,passed:true});}
check('Six units plus introductory section',()=>assert.equal(D.units.length,7));
const lessons=D.units.flatMap(u=>u.lessons),ids=D.questions.map(q=>q.id);
check('All 29 curriculum components plus intro',()=>assert.equal(lessons.length,30));
check('Unique immutable question ids',()=>assert.equal(ids.length,new Set(ids).size));
for(const l of lessons){check('Complete page assets and typed source cards: '+l.id,()=>{assert(l.ready);assert(l.questionCount>0);assert.equal(l.questionCount,D.questions.filter(q=>q.lesson===l.id&&q.origin==='book').length);for(const p of l.pages)assert(fs.existsSync(path.join(root,'assets/book/p'+String(p).padStart(3,'0')+'.webp')));});}
for(const q of D.questions){check('Source and scoring contract: '+q.id,()=>{
 assert(lessons.some(l=>l.id===q.lesson));assert(q.prompt.trim().length>2);assert(D.skills[q.skill]);
 if(q.origin==='book'){assert(q.page>=10&&q.page<=135);assert(fs.existsSync(path.join(root,q.sourcePageImage)));}
 if(q.answerSourcePage){assert(q.answerSourcePage>=1&&q.answerSourcePage<=45);assert(fs.existsSync(path.join(root,q.answerPageImage)));}
 if(q.type==='mcq'){assert(q.choices.length>=2);if(q.answer!==null&&q.answer!==undefined){assert(Number.isInteger(q.answer));assert(q.answer>=0&&q.answer<q.choices.length);}}
 if(q.type==='short'&&q.answer!==null&&q.answer!==undefined)assert(Array.isArray(q.answer));
 if(q.type==='observation'||q.activityOnly||q.needsContentReview){assert.throws(()=>C.assign(C.initial(),D,{id:'a',title:'تجربة',questionIds:[q.id],studentIds:['demo-1']}));return;}
 let s=C.assign(C.initial(),D,{id:'a',title:'تجربة',questionIds:[q.id],studentIds:['demo-1'],kind:q.origin==='independent'?'independent':'training'});
 const value=q.type==='mcq'?(Number.isInteger(q.answer)?q.answer:0):q.type==='short'&&q.answer?.length?q.answer[0]:'إجابة تحتاج مراجعة المعلمة.';
 s=C.submit(s,D,{id:'r',studentId:'demo-1',assignmentId:'a',questionId:q.id,value});
 if(q.autoGraded||q.type==='mcq'&&Number.isInteger(q.answer)||q.type==='short'&&q.answer?.length){assert.equal(s.responses[0].score,2);assert.equal(C.points(s,'demo-1'),10);}else{assert.equal(s.responses[0].status,'pending');assert.equal(s.responses[0].score,null);assert.equal(C.summary(s,D,'demo-1').graded,0);s=C.review(s,'r',2,'راجعت المعلمة المطلوب.');assert.equal(C.points(s,'demo-1'),10);}
 const old=s.responses.length;s=C.submit(s,D,{id:'r2',studentId:'demo-1',assignmentId:'a',questionId:q.id,value});assert.equal(s.responses.length,old);assert.equal(C.points(s,'demo-1'),10);
 const restored=JSON.parse(JSON.stringify(s));assert.deepStrictEqual(C.summary(restored,D,'demo-1'),C.summary(s,D,'demo-1'));
 });}
check('All pages of original textbook included',()=>{for(let i=1;i<=136;i++)assert(fs.existsSync(path.join(root,`assets/book/p${String(i).padStart(3,'0')}.webp`)));});
check('All source answer reference pages included',()=>{for(let i=1;i<=45;i++)assert(fs.existsSync(path.join(root,`assets/answers/a${String(i).padStart(2,'0')}.webp`)));});
check('No invented independent item outside original path',()=>assert(D.questions.filter(q=>q.origin==='independent').every(q=>q.lesson==='u1-l1')));
check('Statistics reconcile source cards',()=>{const a=D.contentAudit;assert.equal(a.bookCards,a.autoGradedBookCards+a.manualBookCards+a.observationCards);assert.equal(a.bookCards,D.questions.filter(q=>q.origin==='book').length);});
fs.writeFileSync(path.join(root,'docs/curriculum-domain-results.json'),JSON.stringify({passed:tests.length,tests},null,2));console.log(tests.length+' curriculum/domain checks passed');
