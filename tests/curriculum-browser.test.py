"""Chromium UI simulation. Network navigation to localhost is blocked by the
execution environment. Sources are embedded and localStorage is a test double.
This does not test deployed hosting, Safari hardware, or real storage permissions.
"""
from pathlib import Path
import json,base64,time,re,sys
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs'
RESULTS=[]
DATA=json.loads((ROOT/'src/data.js').read_text().split('window.ITQAN_DATA = ',1)[1].rstrip().rstrip(';'))
def uri(path):
 f=ROOT/path
 mime='image/webp' if f.suffix=='.webp' else 'image/jpeg'
 return 'data:'+mime+';base64,'+base64.b64encode(f.read_bytes()).decode()
def bundle():
 css=(ROOT/'styles.css').read_text(); core=(ROOT/'src/core.js').read_text(); app=(ROOT/'src/app.js').read_text()
 for f in ['assets/school.webp','assets/sara.webp','assets/river.webp']:app=app.replace(f,uri(f))
 sources={f'assets/book/p{p:03d}.webp':uri(f'assets/book/p{p:03d}.webp') for p in range(1,137)}
 sources.update({f'assets/answers/a{p:02d}.webp':uri(f'assets/answers/a{p:02d}.webp') for p in range(1,46)})
 app=app.replace("'assets/book/p'+String(p).padStart(3,'0')+'.webp'", "window.__sourceImages['assets/book/p'+String(p).padStart(3,'0')+'.webp']")
 app=app.replace("'assets/answers/a'+String(p).padStart(2,'0')+'.webp'", "window.__sourceImages['assets/answers/a'+String(p).padStart(2,'0')+'.webp']")
 app=app.replace("if(!location.hash)history.replaceState(null,'','#teacher/home');render();", "if(!location.hash)location.hash='teacher/home';render();")
 scripts='window.__sourceImages='+json.dumps(sources)+';\n'+(ROOT/'src/data.js').read_text()+core+app
 return '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+css+'</style></head><body><div id="app"></div><div id="toast" role="status"></div><dialog id="modal"></dialog><script>'+scripts.replace('</script','<\\/script')+'</script></body></html>'
HTML=bundle()
STORE="""() => {const values={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>values[k]??null,setItem:(k,v)=>values[k]=String(v),removeItem:k=>delete values[k],clear:()=>Object.keys(values).forEach(k=>delete values[k])}})}"""
def check(name,cond):
 if not cond:raise AssertionError(name)
 RESULTS.append({'name':name,'passed':True});print(len(RESULTS),name,flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1000});page.set_default_timeout(5000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m: errors.append('console: '+m.text) if m.type=='error' else None)
 page.evaluate(STORE);page.set_content(HTML,wait_until='load',timeout=25000);page.wait_for_timeout(150)
 def nav(path):
  page.evaluate('(v)=>location.hash=v',path);page.wait_for_timeout(35)
 def click(name,extra=''):
  page.locator(f'[data-do="{name}"]{extra}').first.click();page.wait_for_timeout(30)
 def state():return page.evaluate("JSON.parse(localStorage.getItem('itqan-v9-acceptance-1'))")
 try:
  check('Teacher home loads without login',page.locator('#main h1').count()>0)
  page.screenshot(path=str(ROOT.parent/'itqan-v9-curriculum-desktop.png'),full_page=True)
  for u in DATA['units']:
   for l in u['lessons']:
    nav('teacher/lesson/'+l['id']);ids=page.locator('[data-question-id]').evaluate_all('(els)=>els.map(e=>e.dataset.questionId)');expected=[q['id'] for q in DATA['questions'] if q['lesson']==l['id'] and q['origin']=='book']
    check('Lesson complete and isolated: '+l['id'],set(ids)==set(expected) and l['title'] in page.locator('#main').inner_text())
    check('No horizontal overflow: '+l['id'],page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'))
    if l['assignableCount'] and not(l['requiresAudio'] or l['requiresVideo']):
     click('select-first');click('assign-selected');page.locator('#assignForm').evaluate('(f)=>f.requestSubmit()');page.wait_for_timeout(25)
     a=state()['assignments'][-1]; check('Assignment correct lesson: '+l['id'],all(next(q for q in DATA['questions'] if q['id']==id)['lesson']==l['id'] for id in a['questionIds']))
  nav('teacher/lesson/u6-l2');page.screenshot(path=str(ROOT.parent/'itqan-v9-curriculum-lesson.png'),full_page=False)
  click('source-page','[data-page="129"]');page.wait_for_timeout(100);check('Original page image renders',page.locator('.source-page-image').evaluate('(im)=>im.complete&&im.naturalWidth>1000'));click('source-next');check('Original page navigation', '١٣٠' in page.locator('.modal-head').inner_text() or '130' in page.locator('.modal-head').inner_text());click('close')
  nav('teacher/lesson/u2-l2');click('answer-page');check('Answer source image renders',page.locator('.source-page-image').evaluate('(im)=>im.complete&&im.naturalWidth>100'));click('close')
  # Test a fresh manual-key question in the last unit.
  nav('student/lesson/u6-l2');click('self-practice');page.wait_for_timeout(50)
  # First prompt is an open source question; pending remains ungraded.
  page.locator('#answerText').fill('يعرض المتحف تاريخ قطر.');page.locator('#answerForm').evaluate('(f)=>f.requestSubmit()');page.wait_for_timeout(30)
  check('Unknown source answer stays pending',state()['responses'][-1]['status']=='pending' and state()['responses'][-1]['score'] is None)
  click('next-question');click('choose','[data-index="2"]');page.locator('#answerForm').evaluate('(f)=>f.requestSubmit()');page.wait_for_timeout(30)
  check('MCQ without documented key stays pending',state()['responses'][-1]['status']=='pending')
  nav('teacher/review');check('Teacher sees MCQ text not integer','جمع' in page.locator('.review-answer').last.inner_text());click('grade','[data-score="2"]');click('grade','[data-score="2"]')
  check('Teacher approval grants points once',len(state()['rewards'])==2)
  nav('teacher/reports');click('publish-reports');nav('family/home');check('Approved report visible in family demo','لقطة معتمدة' in page.locator('#main').inner_text())
  # All class contexts work; race handles source keys and teacher review.
  for u in DATA['units']:
   for l in u['lessons']:
    nav('teacher/class/'+l['id']);check('Class context: '+l['id'],('حصة '+l['title']) in page.locator('#main').inner_text());click('start-game','[data-id="race"]');check('Race context: '+l['id'],l['title'] in page.locator('.game-stage').inner_text());
    if page.locator('[data-do="race-review"]').count():click('race-review','[data-score="10"]')
    else:click('race-answer','[data-index="0"]')
    check('Race feedback ends decision state: '+l['id'],page.locator('[data-do="race-next"]').count()>0 or 'أكملتم التحدي' in page.locator('#main').inner_text())
    click('finish-game')
  nav('teacher/lesson/u1-l1');page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(50);check('Mobile no overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'));page.evaluate('window.scrollTo(0,0)');page.screenshot(path=str(ROOT.parent/'itqan-v9-curriculum-mobile.png'),full_page=False)
  click('read-book');check('Mobile reading dialog no overflow',page.locator('#modal').evaluate('(e)=>e.scrollWidth<=e.clientWidth+1'));click('close')
  page.set_viewport_size({'width':768,'height':1024});nav('teacher/curriculum');check('Tablet no overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'));page.screenshot(path=str(ROOT.parent/'itqan-v9-curriculum-tablet.png'),full_page=True)
  check('No unhandled browser errors',not errors)
 except Exception as exc:
  print('FAILED:',exc,'ERRORS:',errors);page.screenshot(path=str(ROOT.parent/'itqan-v9-curriculum-test-failure.png'),full_page=True)
  (OUT/'curriculum-browser-results.json').write_text(json.dumps({'environment':'Chromium set_content; in-memory storage test double; embedded images; no live deployment','passed':len(RESULTS),'failure':str(exc),'browserErrors':errors,'tests':RESULTS},ensure_ascii=False,indent=2));b.close();raise
 (OUT/'curriculum-browser-results.json').write_text(json.dumps({'environment':'Chromium set_content; in-memory storage test double; embedded images; no live deployment or hardware Safari test','passed':len(RESULTS),'browserErrors':errors,'tests':RESULTS},ensure_ascii=False,indent=2));print(len(RESULTS),'browser checks passed');b.close()
