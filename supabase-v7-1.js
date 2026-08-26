window.ITQAN_SUPABASE = (()=>{
  const url='https://cryzcyvnbpadpgowntbx.supabase.co';
  const key='sb_publishable_bP66SF6RLmRKMCMUqU4eNA_b-7rV-q7';
  let session=null;
  const headers=(auth=false)=>({'apikey':key,'Content-Type':'application/json',...(auth&&session?.access_token?{'Authorization':`Bearer ${session.access_token}`}:{})});
  async function signIn(email,password){const r=await fetch(`${url}/auth/v1/token?grant_type=password`,{method:'POST',headers:headers(),body:JSON.stringify({email,password})});const data=await r.json();if(!r.ok)throw new Error(data?.msg||data?.error_description||'تعذر تسجيل الدخول.');session=data;localStorage.setItem('itqanV7Session',JSON.stringify(data));return data}
  function restore(){try{session=JSON.parse(localStorage.getItem('itqanV7Session')||'null')}catch{session=null}return session}
  function signOut(){session=null;localStorage.removeItem('itqanV7Session')}
  async function select(table,query=''){const r=await fetch(`${url}/rest/v1/${table}?${query}`,{headers:headers(true)});if(!r.ok)throw new Error('تعذر قراءة البيانات من الخادم.');return r.json()}
  async function insert(table,row,prefer='return=representation'){const r=await fetch(`${url}/rest/v1/${table}`,{method:'POST',headers:{...headers(true),'Prefer':prefer},body:JSON.stringify(row)});if(!r.ok)throw new Error('تعذر حفظ البيانات في الخادم.');return r.status===204?null:r.json()}
  restore();
  return {url,key,signIn,signOut,restore,select,insert,get session(){return session}};
})();