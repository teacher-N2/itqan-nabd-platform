(() => {
  const root = document.getElementById('screenRoot');
  const logoutBtn = document.getElementById('logoutBtn');
  const contextPill = document.getElementById('contextPill');
  const brandHome = document.getElementById('brandHome');
  const toastEl = document.getElementById('toast');

  const SKILLS = {
    R_FLU:'القراءة الجهرية', R_MAIN:'الفكرة الرئيسة', R_EVENT:'الأحداث والتفاصيل', R_INFER:'الاستنتاج', R_EVID:'الدليل النصي', R_VOC:'المفردة من السياق', R_SUM:'التلخيص',
    G_NOM:'الجملة الاسمية', G_KANA:'كان وأخواتها', G_INNA:'إن وأخواتها', G_MASC:'جمع المذكر السالم', G_FEM:'جمع المؤنث السالم',
    W_STORY:'كتابة القصة', W_ORG:'تنظيم الأفكار', W_LINK:'ترابط الفقرة', W_EDIT:'المراجعة اللغوية',
    S_HAMZA_Y:'الهمزة المتوسطة على الياء', S_HAMZA_A:'الهمزة المتوسطة على الألف', S_HAMZA_W:'الهمزة المتوسطة على الواو',
    L_LISTEN:'فهم المسموع', SP_SPEAK:'التحدث والعرض'
  };

  const CURRICULUM = [
    {id:'u1', no:1, title:'الوحدة الأولى', page:17, active:true, outcomes:['القراءة الجهرية المعبرة للقصة','تحديد الأحداث الرئيسة وبعض التفاصيل','التعرّف إلى معاني المفردات من خلال السياق','التعرّف إلى الجملة الاسمية وأنواع الخبر','كتابة قصة قصيرة'], components:[
      {type:'القراءة',title:'المستقبل (قصة)',page:19,skills:['R_FLU','R_EVENT','R_VOC','R_INFER']},
      {type:'الكلمة والجملة',title:'الجملة الاسمية',page:26,skills:['G_NOM']},
      {type:'التعبير الكتابي',title:'استفد من أخطائك',page:30,skills:['W_STORY','W_EDIT']}
    ]},
    {id:'u2', no:2, title:'الوحدة الثانية', page:33, active:false, outcomes:['القراءة الجهرية المعبرة للنشيد','استنتاج الأفكار الرئيسة والفرعية','إبداء الرأي والمقارنة','التعرّف إلى كان وأخواتها','فهم المسموع والتحدث المنظّم'], components:[
      {type:'القراءة',title:'نحن الشباب',page:35,skills:['R_FLU','R_MAIN','R_INFER']},
      {type:'الكلمة والجملة',title:'كان وأخواتها',page:43,skills:['G_KANA']},
      {type:'الإملاء',title:'اللام المزدوجة',page:47,skills:['W_EDIT']},
      {type:'الخط',title:'خط النسخ: ج - ح - خ',page:49,skills:[]},
      {type:'الاستماع',title:'صداقة جديدة',page:50,skills:['L_LISTEN']},
      {type:'التحدث',title:'التعليم سبيل التقدم',page:52,skills:['SP_SPEAK']}
    ]},
    {id:'u3', no:3, title:'الوحدة الثالثة', page:55, active:false, outcomes:['القراءة الصحيحة للنص','استنتاج الأفكار الرئيسة والفرعية','توظيف السياق لفهم المفردات والمصطلحات','تنظيم المعلومات كتابيًا','توظيف أدوات الربط وعلامات الترقيم'], components:[
      {type:'القراءة',title:'التقويم الهجري',page:57,skills:['R_FLU','R_MAIN','R_VOC','R_INFER']},
      {type:'التعبير الكتابي',title:'التقويم القطري',page:64,skills:['W_ORG','W_LINK']},
      {type:'الإملاء',title:'الهمزة المتوسطة على الياء',page:65,skills:['S_HAMZA_Y']},
      {type:'الخط',title:'خط النسخ: ع - غ',page:68,skills:[]}
    ]},
    {id:'u4', no:4, title:'الوحدة الرابعة', page:71, active:false, outcomes:['القراءة الجهرية المعبرة للقصيدة','استنباط المعاني والاستدلال عليها','توظيف إن وأخواتها','الهمزة المتوسطة على الألف','فهم المسموع والتحدث بالفصحى'], components:[
      {type:'القراءة',title:'العصفورة',page:73,skills:['R_FLU','R_INFER','R_EVID']},
      {type:'الكلمة والجملة',title:'إن وأخواتها',page:81,skills:['G_INNA']},
      {type:'الإملاء',title:'الهمزة المتوسطة على الألف',page:85,skills:['S_HAMZA_A']},
      {type:'الخط',title:'خط النسخ: هـ',page:88,skills:[]},
      {type:'الاستماع',title:'صاحب الدحل',page:89,skills:['L_LISTEN']},
      {type:'التحدث',title:'ذكاء طائر',page:92,skills:['SP_SPEAK']}
    ]},
    {id:'u5', no:5, title:'الوحدة الخامسة', page:95, active:false, outcomes:['القراءة الجهرية المعبرة للقصة','التعرّف إلى معاني المفردات من خلال السياق والمعجم','تحديد الأحداث والتفاصيل','التعرّف إلى جمع المذكر السالم','إعادة سرد قصة مع إضافة أحداث'], components:[
      {type:'القراءة',title:'فصاحة غلام',page:97,skills:['R_FLU','R_EVENT','R_VOC','R_INFER']},
      {type:'الكلمة والجملة',title:'جمع المذكر السالم',page:105,skills:['G_MASC']},
      {type:'التعبير الكتابي',title:'إعادة سرد قصة',page:110,skills:['W_STORY','W_ORG']},
      {type:'الإملاء',title:'الهمزة المتوسطة على الواو',page:111,skills:['S_HAMZA_W']},
      {type:'الخط',title:'خط النسخ: و - ي',page:114,skills:[]}
    ]},
    {id:'u6', no:6, title:'الوحدة السادسة', page:117, active:false, outcomes:['القراءة الجهرية المعبرة للنص','التعرّف إلى الكلمات المتضادة والمترادفة','تحديد الأفكار الرئيسة والفرعية','التعرّف إلى جمع المؤنث السالم','كتابة نص منظّم وفهم المسموع'], components:[
      {type:'القراءة',title:'سوق واقف',page:119,skills:['R_FLU','R_MAIN','R_VOC']},
      {type:'الكلمة والجملة',title:'جمع المؤنث السالم',page:127,skills:['G_FEM']},
      {type:'التعبير الكتابي',title:'الحدائق العامة في قطر',page:131,skills:['W_ORG','W_LINK']},
      {type:'الخط',title:'خط النسخ: م',page:132,skills:[]},
      {type:'الاستماع',title:'قصر الحمراء',page:133,skills:['L_LISTEN']}
    ]}
  ];

  const MISSIONS = [
    {id:'d1-r',day:1,icon:'📖',title:'نبض القراءة',points:10,unit:'الوحدة الأولى',lesson:'المستقبل',skill:'R_EVENT',passage:'استيقظت ليان مبكرًا لتجهز حقيبتها قبل الرحلة العلمية. راجعت قائمة الأدوات، ثم اكتشفت أن زجاجة الماء غير موجودة، فعادت إلى المطبخ وأحضرتها قبل خروج الحافلة.',question:'ما الحدث الذي وقع بعد مراجعة ليان لقائمة الأدوات؟',choices:['خرجت الحافلة مباشرة.','اكتشفت غياب زجاجة الماء.','أنهت الرحلة العلمية.'],correct:1,hint:'ابحثي عن الفعل الذي جاء بعد كلمة «ثم».'},
    {id:'d1-v',day:1,icon:'🧠',title:'كلمة في سياق',points:10,unit:'الوحدة الأولى',lesson:'المستقبل',skill:'R_VOC',passage:'ظلَّت الطالبةُ مثابرةً على تدريبها حتى أتقنت القراءة الجهرية.',question:'ما أقرب معنى لكلمة «مثابرة» في السياق؟',choices:['مواظبة بجد','مترددة','مسرعة'],correct:0,hint:'انظري إلى ما حدث بعدها: واصلت التدريب حتى أتقنت.'},
    {id:'d1-i',day:1,icon:'⭐',title:'تحدّي الأداء المستقل',points:10,unit:'الوحدة الأولى',lesson:'المستقبل',skill:'R_INFER',passage:'لم تتوقف سارة عند أول خطأ في تجربتها، بل سجّلته، وعدّلت خطواتها، ثم أعادت المحاولة حتى نجحت.',question:'ماذا نستنتج عن شخصية سارة؟',choices:['تتعلم من أخطائها','تتجنب المحاولة','تعتمد على الحظ'],correct:0,hint:'فكري في موقفها من الخطأ وإعادة المحاولة.'},

    {id:'d2-r',day:2,icon:'📖',title:'الأحداث الرئيسة',points:10,unit:'الوحدة الأولى',lesson:'المستقبل',skill:'R_EVENT',passage:'بدأ خالد مشروعه بقراءة التعليمات، ثم جمع الأدوات، وبعد ذلك صنع النموذج الأول. لاحظ خللًا صغيرًا، فأصلحه وأعاد التجربة.',question:'أي حدث يُعد خطوة أساسية قبل صناعة النموذج؟',choices:['جمع الأدوات','العودة إلى المنزل','تغيير لون النموذج'],correct:0,hint:'اختاري حدثًا ورد في تسلسل خطوات المشروع.'},
    {id:'d2-e',day:2,icon:'🔎',title:'الدليل النصي',points:10,unit:'الوحدة الأولى',lesson:'المستقبل',skill:'R_EVID',passage:'كانت مريم تُراجع واجبها قبل تسليمه، وتضع خطًا تحت الكلمات التي تشك في كتابتها، ثم تعود إلى القاعدة لتصححها.',question:'أي دليل يثبت أن مريم تراجع عملها بعناية؟',choices:['تسلّم الواجب سريعًا.','تضع خطًا تحت الكلمات التي تشك فيها.','تكتب واجبًا جديدًا كل يوم.'],correct:1,hint:'ابحثي عن سلوك يدل على المراجعة والتحقق.'},
    {id:'d2-m',day:2,icon:'🎯',title:'الفكرة الرئيسة',points:10,unit:'الوحدة الأولى',lesson:'المستقبل',skill:'R_MAIN',passage:'الخطأ لا يعني نهاية التعلم؛ فعندما نحدد سببه ونصححه ونجرب مرة أخرى، يصبح الخطأ خطوة تقرّبنا من الإتقان.',question:'ما الفكرة الرئيسة؟',choices:['الخطأ فرصة للتعلم والتحسن.','يجب تجنب كل تجربة جديدة.','التعلم لا يحتاج إلى مراجعة.'],correct:0,hint:'اختاري الفكرة التي تشمل جميع الجمل.'},

    {id:'d3-g1',day:3,icon:'🧩',title:'الجملة الاسمية',points:10,unit:'الوحدة الأولى',lesson:'الجملة الاسمية',skill:'G_NOM',question:'أيُّ الجمل الآتية جملةٌ اسمية صحيحة؟',choices:['الطالبةُ مجتهدةٌ.','تكتبُ الطالبةُ.','لن تكتبَ الطالبةُ.'],correct:0,hint:'الجملة الاسمية تبدأ باسم.'},
    {id:'d3-g2',day:3,icon:'🧩',title:'المبتدأ والخبر',points:10,unit:'الوحدة الأولى',lesson:'الجملة الاسمية',skill:'G_NOM',question:'في الجملة «القراءةُ مفيدةٌ» ما الخبر؟',choices:['القراءةُ','مفيدةٌ','القراءة مفيدة'],correct:1,hint:'الخبر يتمم معنى المبتدأ ويخبرنا عنه.'},
    {id:'d3-i',day:3,icon:'⭐',title:'استقلال لغوي',points:10,unit:'الوحدة الأولى',lesson:'الجملة الاسمية',skill:'G_NOM',question:'أيُّ الجمل الآتية خبرُها جملةٌ فعلية؟',choices:['الحديقةُ جميلةٌ.','الطالبةُ تقرأُ كتابًا.','السماءُ صافيةٌ.'],correct:1,hint:'ابحثي عن خبر يتكون من فعل وما يتصل به.'},

    {id:'d4-w1',day:4,icon:'✍️',title:'بداية القصة',points:10,unit:'الوحدة الأولى',lesson:'استفد من أخطائك',skill:'W_STORY',question:'أيُّ البدايات الآتية أصلح لقصة قصيرة عن موقف تعلّمتِ منه؟',choices:['في صباح يومٍ دراسي بدأتُ تجربةً جديدة، ولم أتوقع أن خطأً صغيرًا سيعلمني الكثير.','الأخطاء كثيرة جدًا.','أنا أحب المدرسة فقط.'],correct:0,hint:'البداية الجيدة تتضمن زمانًا أو موقفًا، وتمهّد لحدث.'},
    {id:'d4-w2',day:4,icon:'🔗',title:'ترابط الأحداث',points:10,unit:'الوحدة الأولى',lesson:'استفد من أخطائك',skill:'W_LINK',question:'اختاري الرابط الأنسب: «اكتشفتُ سبب الخطأ، ____ عدّلتُ الخطوات وأعدتُ المحاولة.»',choices:['ثم','لكن','أو'],correct:0,hint:'المعنى هنا ترتيب أحداث متتابعة.'},
    {id:'d4-e',day:4,icon:'📝',title:'راجعي كتابتك',points:10,unit:'الوحدة الأولى',lesson:'استفد من أخطائك',skill:'W_EDIT',question:'أيُّ الجمل الآتية أكثر سلامةً وترابطًا؟',choices:['تعلمتُ من خطئي، لذلك أعدتُ المحاولةَ بهدوء.','تعلمت من خطئي لذلك، أعدت المحاولة هدوء.','تعلمت خطئي لأن المحاولة.'],correct:0,hint:'راجعي المعنى وعلامة الترقيم وصحة التركيب.'},

    {id:'d5-r',day:5,icon:'🏁',title:'نبض الأسبوع',points:10,unit:'الوحدة الأولى',lesson:'مراجعة الوحدة',skill:'R_INFER',passage:'بعد أن أخفقت نور في العرض الأول، طلبت ملاحظات معلمتها، وتدربت أمام المرآة، ثم قدمت العرض مرة أخرى بثقة أكبر.',question:'ما سبب تحسّن أداء نور؟',choices:['استفادت من التغذية الراجعة وتدرّبت.','غيرت موضوع العرض فقط.','توقفت عن المشاركة.'],correct:0,hint:'اربطي بين الأفعال التي قامت بها والنتيجة.'},
    {id:'d5-g',day:5,icon:'🧩',title:'نبض القاعدة',points:10,unit:'الوحدة الأولى',lesson:'مراجعة الوحدة',skill:'G_NOM',question:'اختاري الجملة الاسمية ذات الخبر المفرد:',choices:['الكتابُ مفيدٌ.','الطالبةُ تكتبُ.','الزهرةُ تنمو سريعًا.'],correct:0,hint:'الخبر المفرد ليس جملة فعلية.'},
    {id:'d5-w',day:5,icon:'🏆',title:'قرار الكاتبة',points:10,unit:'الوحدة الأولى',lesson:'مراجعة الوحدة',skill:'W_EDIT',question:'قبل تسليم فقرتكِ، ما الخطوة الأجدى؟',choices:['أراجع الفكرة والترابط والإملاء وعلامات الترقيم.','أضيف جملًا كثيرة بلا حاجة.','أتجنب قراءة ما كتبت.'],correct:0,hint:'اختاري ما يساعدك على اكتشاف الخطأ وتحسين النص.'}
  ];

  const DEMO_STUDENTS = [
    {name:'مريم',points:430,streak:8,avg:86,risk:'green'},
    {name:'دانة',points:355,streak:6,avg:77,risk:'yellow'},
    {name:'نورة',points:298,streak:4,avg:68,risk:'yellow'},
    {name:'جود',points:248,streak:3,avg:57,risk:'red'},
    {name:'هند',points:395,streak:7,avg:83,risk:'green'},
    {name:'ريم',points:222,streak:2,avg:55,risk:'red'}
  ];

  const defaultMastery = {R_FLU:60,R_MAIN:62,R_EVENT:58,R_INFER:54,R_EVID:56,R_VOC:63,R_SUM:50,G_NOM:59,W_STORY:57,W_LINK:55,W_EDIT:61};
  const defaults = {user:null,student:{name:'',points:0,streak:1,completed:{},attempts:{},mastery:defaultMastery,badges:[]},selectedDay:1,studentTab:'today',teacherTab:'overview'};

  function load(){
    try{
      const saved = JSON.parse(localStorage.getItem('itqanNabdStage1V4')||'{}');
      return {...defaults,...saved,student:{...defaults.student,...(saved.student||{}),mastery:{...defaultMastery,...((saved.student||{}).mastery||{})}}};
    }catch{return structuredClone(defaults)}
  }
  let state=load();
  const save=()=>localStorage.setItem('itqanNabdStage1V4',JSON.stringify(state));
  const esc=(s='')=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]||c));
  const route=v=>location.hash=v;
  const currentRoute=()=> (location.hash||'#home').slice(1);
  const level=()=>Math.max(1,Math.floor(state.student.points/150)+1);
  const toast=msg=>{toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(toastEl._t);toastEl._t=setTimeout(()=>toastEl.classList.remove('show'),2400)};
  const missionDone=id=>Boolean(state.student.completed[id]);
  const dayMissions=()=>MISSIONS.filter(m=>m.day===state.selectedDay);
  const dayCompleted=()=>dayMissions().filter(m=>missionDone(m.id)).length;
  const dayProgress=()=>Math.round(dayCompleted()/3*100);
  const masteryAvg=()=>{const vals=Object.values(state.student.mastery);return vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0};

  function setHeader(){
    logoutBtn.classList.toggle('hidden',!state.user);
    contextPill.textContent=state.user?.role==='teacher'?'لوحة المعلمة • الصف الخامس':'الصف الخامس • الفصل الأول';
  }

  function renderHome(){
    root.innerHTML=`<section class="hero">
      <div class="hero-copy"><span class="eyebrow">مرتبطة بمنهج اللغة العربية للصف الخامس – العام الدراسي 2026–2027</span><h1>إتقان <span>| نبض</span></h1><p>منصة يومية تحوّل المنهج إلى رحلة تعليمية قصيرة قابلة للقياس: <b>قراءة، ومهارة لغوية، وكتابة، وأداء مستقل</b>. النقاط تحفّز الطالبة، بينما تحتفظ المنصة بمؤشرات المهارة لتساعد المعلمة على اتخاذ قرار تدريسي أدق.</p><div class="hero-actions"><button class="btn primary" id="goStudent" type="button">دخول الطالبة</button><button class="btn secondary" id="goTeacher" type="button">لوحة المعلمة</button></div><div class="tag-row" style="margin-top:18px"><span class="tag skill">6 وحدات من الكتاب</span><span class="tag">30 نقطة يوميًا</span><span class="tag">نقيس المهارة، لا الدرجة فقط</span><span class="tag">منهج • درس • مهمة • أثر</span></div></div>
      <div class="hero-media"><div class="mascot-frame"><img src="assets/salama-clean-v4.jpg" alt="سلامة بالمريول الرصاصي تحمل كتابًا مفتوحًا"/></div><div class="companion-card"><span class="companion-icon">⭐</span><div><b>سلامة ترافق الطالبة</b><br>في رحلة واضحة ومتدرجة: أفهم • أتدرّب • أؤدي وحدي.</div></div></div>
    </section>`;
    document.getElementById('goStudent').addEventListener('click',()=>route('student-login'));
    document.getElementById('goTeacher').addEventListener('click',()=>route('teacher-login'));
  }

  function renderStudentLogin(){
    root.innerHTML=`<section class="login-wrap"><div class="panel"><span class="eyebrow">بوابة الطالبة</span><h2>أهلًا بكِ في إتقان | نبض</h2><p>أدخلي اسمك ثم ابدئي مهمة اليوم. تحفظ هذه النسخة تقدّمكِ على هذا الجهاز مؤقتًا، إلى حين ربط المنصة بقاعدة البيانات المركزية.</p><form id="studentForm" class="form-grid"><div class="field"><label for="studentName">اسم الطالبة</label><input id="studentName" maxlength="40" value="${esc(state.student.name)}" placeholder="مثال: مريم" required/></div><button class="btn primary" type="submit">ابدئي رحلة الإتقان</button><button class="btn beige" id="demoStudent" type="button">دخول تجريبي باسم «مريم»</button></form></div></section>`;
    document.getElementById('studentForm').addEventListener('submit',e=>{e.preventDefault();const n=document.getElementById('studentName').value.trim();if(!n)return;state.user={role:'student'};state.student.name=n;save();route('student')});
    document.getElementById('demoStudent').addEventListener('click',()=>{state.user={role:'student'};state.student.name='مريم';save();route('student')});
  }

  function studentNav(){return `<nav class="student-nav"><button class="nav-btn ${state.studentTab==='today'?'active':''}" data-stab="today">نبض اليوم</button><button class="nav-btn ${state.studentTab==='curriculum'?'active':''}" data-stab="curriculum">منهجي</button><button class="nav-btn ${state.studentTab==='progress'?'active':''}" data-stab="progress">إنجازاتي</button></nav>`}

  function renderStudent(){
    if(state.user?.role!=='student')return route('student-login');
    let content='';
    if(state.studentTab==='today'){
      const days=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'];
      const missionCards=dayMissions().map(m=>`<article class="mission ${missionDone(m.id)?'done':''}"><div class="mission-top"><div class="mission-icon">${m.icon}</div><div class="points">${missionDone(m.id)?'✓ مكتملة':`+${m.points}`}</div></div><div><h3>${esc(m.title)}</h3><p>${esc(m.lesson)} • ${esc(SKILLS[m.skill]||m.skill)}</p></div><div class="tag-row"><span class="tag skill">${esc(m.unit)}</span><span class="tag">${esc(SKILLS[m.skill]||'مهارة')}</span></div><button class="btn ${missionDone(m.id)?'secondary':'primary'} openMission" data-id="${m.id}" type="button">${missionDone(m.id)?'راجعي المهمة':'ابدئي المهمة'}</button></article>`).join('');
      content=`<div class="section-title"><div><h2>مهمة اليوم</h2><p>3 مهام قصيرة • 30 نقطة متاحة • الوحدة الأولى</p></div><b>${dayCompleted()} / 3</b></div><div class="day-strip">${days.map((d,i)=>`<button class="day-btn ${state.selectedDay===i+1?'active':''}" data-day="${i+1}" type="button">${d}<br><small>${i+1}</small></button>`).join('')}</div><div class="progress-track"><div class="progress-fill" style="width:${dayProgress()}%"></div></div><div class="missions">${missionCards}</div><div class="insight-card"><b>قاعدة نبض:</b> النقاط لا تُعطى لمجرد الدخول؛ المحاولة الأولى الصحيحة تكسب أعلى نقاط، وبعد الخطأ تقل النقاط مع بقاء فرصة التعلم وإعادة المحاولة.</div>`;
    }else if(state.studentTab==='curriculum'){
      content=`<div class="section-title"><div><h2>منهجي</h2><p>خريطة الفصل الدراسي الأول كما وردت في كتاب اللغة العربية.</p></div></div><div class="curriculum-list">${CURRICULUM.map(u=>`<article class="unit-card ${u.active?'active':''}"><div class="unit-head"><div><h3>${u.title}</h3><small>تبدأ في صفحة ${u.page}</small></div><span class="status ${u.active?'green':'yellow'}">${u.active?'الوحدة الحالية':'قادمة'}</span></div><div class="component-list">${u.components.map(c=>`<span class="component">${c.type}: ${c.title} • ص ${c.page}</span>`).join('')}</div></article>`).join('')}</div>`;
    }else{
      const activeSkills=Object.entries(state.student.mastery).filter(([k])=>SKILLS[k]).sort((a,b)=>b[1]-a[1]);
      content=`<div class="grid-2"><div class="panel"><h2>نقاطي ومستواي</h2><p>كل 150 نقطة ترفع مستوى إنجازكِ في رحلة الإتقان.</p><div class="stats" style="grid-template-columns:1fr 1fr"><div class="stat"><div class="value">${state.student.points}</div><div class="label">نقطة</div></div><div class="stat"><div class="value">${level()}</div><div class="label">المستوى</div></div></div></div><div class="panel"><h2>أوسمتي</h2><p>${state.student.points>=150?'⭐ نجمة الإتقان • ':''}${state.student.points>=300?'📚 قارئة واعية • ':''}${state.student.points>=450?'✍️ كاتبة نامية':''}${state.student.points<150?'أول وسام ينتظركِ عند 150 نقطة.':''}</p></div></div><div class="panel"><h2>خريطة إتقاني</h2><div class="skill-bars">${activeSkills.map(([k,v])=>`<div class="skill-row"><strong>${SKILLS[k]}</strong><div class="progress-track"><div class="progress-fill" style="width:${v}%"></div></div><span>${v}%</span></div>`).join('')}</div></div>`;
    }
    root.innerHTML=`<section class="dashboard"><div class="welcome"><div><span class="eyebrow">الوحدة الأولى • رحلة الإتقان</span><h1>مرحبًا ${esc(state.student.name)} 🌟</h1><p>هدفكِ ليس جمع النقاط فقط؛ بل إثبات قدرتكِ على أداء المهارة باستقلالية.</p></div><img src="assets/salama-clean-v4.jpg" alt="سلامة، الشخصية المرافقة للطالبة في منصة إتقان | نبض"/></div><div class="stats"><div class="stat"><div class="value">${state.student.points}</div><div class="label">مجموع النقاط</div><div class="micro">كل إجابة صحيحة تقرّبكِ من هدفكِ</div></div><div class="stat"><div class="value">${state.student.streak} 🔥</div><div class="label">سلسلة الأيام</div><div class="micro">الاستمرار أهم من الكمال</div></div><div class="stat"><div class="value">${masteryAvg()}%</div><div class="label">متوسط الإتقان</div><div class="micro">حسب المهارات</div></div><div class="stat"><div class="value">${level()}</div><div class="label">مستواكِ</div><div class="micro">رحلتكِ الشخصية</div></div></div>${studentNav()}${content}</section>`;
    root.querySelectorAll('[data-stab]').forEach(b=>b.addEventListener('click',()=>{state.studentTab=b.dataset.stab;save();renderStudent()}));
    root.querySelectorAll('[data-day]').forEach(b=>b.addEventListener('click',()=>{state.selectedDay=Number(b.dataset.day);save();renderStudent()}));
    root.querySelectorAll('.openMission').forEach(b=>b.addEventListener('click',()=>route(`task/${b.dataset.id}`)));
  }

  function renderTask(id){
    if(state.user?.role!=='student')return route('student-login');
    const m=MISSIONS.find(x=>x.id===id);if(!m)return route('student');
    state.student.attempts[id]=state.student.attempts[id]||0;
    root.innerHTML=`<section class="task-wrap"><div class="task-card"><div class="task-meta"><span class="tag skill">${esc(m.unit)}</span><span class="tag">${esc(m.lesson)}</span><span class="tag">${esc(SKILLS[m.skill])}</span></div><h2>${esc(m.question)}</h2>${m.passage?`<div class="passage">${esc(m.passage)}</div>`:''}<div class="choices">${m.choices.map((c,i)=>`<button class="choice" data-choice="${i}" type="button">${esc(c)}</button>`).join('')}</div><div id="feedback"></div><button class="btn beige hidden" id="hintBtn" type="button">تلميح من سلامة</button><div style="margin-top:16px"><button class="btn secondary" id="backTasks" type="button">العودة لمهام اليوم</button></div></div></section>`;
    const feedback=document.getElementById('feedback');const hintBtn=document.getElementById('hintBtn');
    document.getElementById('backTasks').addEventListener('click',()=>route('student'));
    root.querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>{
      const choice=Number(btn.dataset.choice);state.student.attempts[id]=(state.student.attempts[id]||0)+1;const attempt=state.student.attempts[id];
      if(choice===m.correct){
        let earned=0;if(!missionDone(id)){earned=attempt===1?10:attempt===2?7:5;state.student.points+=earned;state.student.completed[id]={earned,at:new Date().toISOString()};const current=state.student.mastery[m.skill]??55;const gain=attempt===1?5:attempt===2?3:2;state.student.mastery[m.skill]=Math.min(100,current+gain);save()}
        feedback.innerHTML=`<div class="feedback success"><b>أحسنتِ!</b> الإجابة صحيحة.${earned?` حصلتِ على <span class="score-pop">+${earned}</span> نقاط.`:' المهمة مكتملة سابقًا.'}<br>تقدّمتِ في مهارة «${esc(SKILLS[m.skill])}».</div>`;
        hintBtn.classList.add('hidden');
      }else{
        btn.classList.add('wrong');setTimeout(()=>btn.classList.remove('wrong'),420);hintBtn.classList.remove('hidden');feedback.innerHTML='<div class="feedback warning"><b>محاولة موفّقة.</b> راجعي معنى السؤال أو الدليل، ثم حاولي مرة أخرى.</div>';
      }
    }));
    hintBtn.addEventListener('click',()=>{feedback.innerHTML=`<div class="feedback warning"><b>تلميح من سلامة:</b> ${esc(m.hint)}</div>`});
  }

  function renderTeacherLogin(){
    root.innerHTML=`<section class="login-wrap"><div class="panel"><span class="eyebrow">بوابة المعلمة</span><h2>لوحة إتقان | نبض</h2><p>الدخول الحالي تجريبي إلى حين إضافة حسابات المدرسة وربط المنصة بقاعدة البيانات المركزية.</p><form id="teacherForm" class="form-grid"><div class="field"><label for="teacherCode">الرمز التجريبي</label><input id="teacherCode" inputmode="numeric" placeholder="5555" required/></div><button class="btn primary" type="submit">دخول لوحة المعلمة</button><span class="helper">للتجربة: 5555</span></form></div></section>`;
    document.getElementById('teacherForm').addEventListener('submit',e=>{e.preventDefault();if(document.getElementById('teacherCode').value.trim()!=='5555')return toast('الرمز التجريبي هو 5555');state.user={role:'teacher'};save();route('teacher')});
  }

  function teacherNav(){return `<nav class="teacher-nav"><button class="nav-btn ${state.teacherTab==='overview'?'active':''}" data-ttab="overview">نظرة عامة</button><button class="nav-btn ${state.teacherTab==='curriculum'?'active':''}" data-ttab="curriculum">خريطة المنهج</button><button class="nav-btn ${state.teacherTab==='skills'?'active':''}" data-ttab="skills">المهارات والتدخل العلاجي</button><button class="nav-btn ${state.teacherTab==='design'?'active':''}" data-ttab="design">تصميم المهمة</button></nav>`}

  function renderTeacher(){
    if(state.user?.role!=='teacher')return route('teacher-login');
    let content='';
    if(state.teacherTab==='overview'){
      const all=[...DEMO_STUDENTS];
      if(state.student.name&&!all.some(s=>s.name===state.student.name))all.unshift({name:state.student.name,points:state.student.points,streak:state.student.streak,avg:masteryAvg(),risk:masteryAvg()>=80?'green':masteryAvg()>=60?'yellow':'red'});
      content=`<div class="teacher-grid"><div class="data-card"><b>${all.length}</b><small>طالبات في العرض</small></div><div class="data-card"><b>73%</b><small>متوسط الإتقان</small></div><div class="data-card"><b>4</b><small>تحت 60%</small></div><div class="data-card"><b>30</b><small>نقطة يومية مستهدفة</small></div></div><div class="insight-card"><div class="section-title"><div><h2>قرار الحصة القادمة</h2><p>المنصة لا تعرض رقمًا فقط؛ بل تحدد موضع التدخل المقترح.</p></div><span class="status yellow">ملاحظة</span></div><p>إذا تكرر الخطأ في <b>الاستنتاج والدليل النصي</b> لدى مجموعة من الطالبات، فالتدخل المقترح: نمذجة قصيرة لمدة 5 دقائق، ثم تدريب موجّه، ثم سؤال مستقل جديد قبل الانتقال.</p></div><div class="student-board"><div class="student-board-head"><span>الطالبة</span><span>النقاط</span><span>السلسلة</span><span>الإتقان</span><span>القرار</span></div>${all.map(s=>`<div class="student-record"><div class="student-name">${esc(s.name)}</div><div data-label="النقاط">${s.points}</div><div data-label="السلسلة">${s.streak}</div><div class="mastery-cell" data-label="الإتقان"><div class="progress-track"><div class="progress-fill" style="width:${s.avg}%"></div></div><b>${s.avg}%</b></div><div data-label="القرار"><span class="status ${s.risk}">${s.risk==='green'?'إثراء':s.risk==='yellow'?'تدريب موجّه':'تدخل علاجي مركز'}</span></div></div>`).join('')}</div>`;
    }else if(state.teacherTab==='curriculum'){
      content=`<div class="section-title"><div><h2>خريطة المنهج من كتاب الطالب</h2><p>كل مكوّن مرتبط بصفحته في كتاب الطالب، ثم بالمهارات والمهام الرقمية المرتبطة به.</p></div></div><div class="curriculum-list">${CURRICULUM.map(u=>`<article class="unit-card ${u.active?'active':''}"><div class="unit-head"><div><h3>${u.title}</h3><small>صفحة البداية: ${u.page}</small></div><span class="status ${u.active?'green':'yellow'}">${u.active?'مفعّلة الآن':'قادمة'}</span></div><div class="component-list">${u.components.map(c=>`<span class="component">${c.type}: ${c.title} • ص ${c.page}</span>`).join('')}</div><p class="muted" style="margin:0;line-height:1.8"><b>نواتج محورية:</b> ${u.outcomes.join(' • ')}</p></article>`).join('')}</div>`;
    }else if(state.teacherTab==='skills'){
      const rows=Object.entries(state.student.mastery).filter(([k])=>SKILLS[k]).map(([k,v])=>`<div class="skill-row"><strong>${SKILLS[k]}</strong><div class="progress-track"><div class="progress-fill" style="width:${v}%"></div></div><span>${v}%</span></div>`).join('');
      content=`<div class="grid-2"><div class="panel"><h2>إتقان المهارات</h2><p>تُتابَع كل مهارة بصورة مستقلة عن الدرجة الكلية.</p><div class="skill-bars">${rows}</div></div><div class="panel"><h2>قاعدة القرار</h2><p><span class="status green">80% فأعلى</span> إثراء والانتقال إلى مستوى أعلى في المهارة.</p><p><span class="status yellow">60–79%</span> تدريب موجّه ثم إعادة قياس.</p><p><span class="status red">أقل من 60%</span> إعادة تعليم المهارة بطريقة مختلفة.</p></div></div><div class="interventions"><div class="intervention red"><h3>🔴 تدخل علاجي مركز</h3><p class="muted">الاستنتاج والاستدلال بالدليل النصي</p><div class="names"><span class="name-chip">جود</span><span class="name-chip">ريم</span></div></div><div class="intervention yellow"><h3>🟡 قريب من الإتقان</h3><p class="muted">ترابط الفقرة</p><div class="names"><span class="name-chip">دانة</span><span class="name-chip">نورة</span></div></div><div class="intervention green"><h3>🟢 إثراء</h3><p class="muted">تلخيص واستدلال أعمق</p><div class="names"><span class="name-chip">مريم</span><span class="name-chip">هند</span></div></div></div>`;
    }else{
      content=`<div class="grid-2"><div class="panel"><h2>تصميم مهمة جديدة</h2><p>في النسخة النهائية ستختارين الوحدة والدرس والمهارة، ثم تضيفين السؤال ومعيار التصحيح.</p><form id="builderForm" class="form-grid"><div class="field"><label>الوحدة</label><select id="bUnit">${CURRICULUM.map(u=>`<option>${u.title}</option>`).join('')}</select></div><div class="field"><label>المهارة</label><select id="bSkill">${Object.entries(SKILLS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></div><div class="field"><label>السؤال</label><textarea id="bQuestion" placeholder="اكتبي سؤال المهمة"></textarea></div><button class="btn primary" type="submit">حفظ كمسودة تجريبية</button></form></div><div class="panel"><h2>كيف تربط المهمة بالتحصيل؟</h2><p>كل إجابة تُسجَّل مع: <b>الطالبة، الوحدة، الدرس، المهارة، المحاولة، النقاط، ومستوى الاستقلال</b>. بهذا نستطيع لاحقًا إظهار التحسّن الحقيقي لكل مهارة ومقارنة القياس القبلي بالبعدي.</p><div class="tag-row"><span class="tag skill">المحاولة الأولى = استقلال أعلى</span><span class="tag">التلميح لا يلغي التعلم</span><span class="tag">المهمة القصيرة = بيانات متتابعة</span></div></div></div>`;
    }
    root.innerHTML=`<section class="dashboard"><div class="welcome"><div><span class="eyebrow">لوحة المعلمة • الصف الخامس</span><h1>أ. نوف الغرينيق</h1><p>المرحلة: الصف الخامس • الفصل الدراسي الأول • يُبنى القرار التدريسي على بيانات المهارة.</p></div><img src="assets/salama-clean-v4.jpg" alt="سلامة، الشخصية المرافقة للطالبة في منصة إتقان | نبض"/></div>${teacherNav()}${content}</section>`;
    root.querySelectorAll('[data-ttab]').forEach(b=>b.addEventListener('click',()=>{state.teacherTab=b.dataset.ttab;save();renderTeacher()}));
    const builder=document.getElementById('builderForm');if(builder)builder.addEventListener('submit',e=>{e.preventDefault();toast('حُفظت الفكرة كمسودة في النسخة التجريبية')});
  }

  function render(){
    setHeader();const r=currentRoute();
    if(r==='home')renderHome();else if(r==='student-login')renderStudentLogin();else if(r==='student')renderStudent();else if(r.startsWith('task/'))renderTask(r.split('/')[1]);else if(r==='teacher-login')renderTeacherLogin();else if(r==='teacher')renderTeacher();else renderHome();
    root.focus({preventScroll:true});window.scrollTo({top:0,behavior:'smooth'});
  }

  brandHome.addEventListener('click',()=>route(state.user?.role==='teacher'?'teacher':state.user?.role==='student'?'student':'home'));
  logoutBtn.addEventListener('click',()=>{state.user=null;save();route('home')});
  window.addEventListener('hashchange',render);
  if(!location.hash)location.hash='home';else render();
})();
