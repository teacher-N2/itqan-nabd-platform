window.ITQAN_SERVER = (() => {
  const url = 'https://cryzcyvnbpadpgowntbx.supabase.co';
  const key = 'sb_publishable_bP66SF6RLmRKMCMUqU4eNA_b-7rV-q7';
  const apiUrl = `${url}/functions/v1/itqan-api`;
  const sessionKey = 'itqanV72Session';
  let session = null;

  const baseHeaders = () => ({ 'apikey': key, 'Content-Type': 'application/json' });
  const authHeaders = () => ({ ...baseHeaders(), ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}) });
  const syntheticEmail = (role, code) => `${role}.${String(code || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')}@itqan.local`;

  function saveSession(value) {
    session = value || null;
    if (session) localStorage.setItem(sessionKey, JSON.stringify(session));
    else localStorage.removeItem(sessionKey);
  }

  function restore() {
    try { session = JSON.parse(localStorage.getItem(sessionKey) || 'null'); }
    catch { session = null; }
    return session;
  }

  async function refreshIfNeeded() {
    if (!session?.refresh_token) return session;
    const expiresAt = Number(session.expires_at || 0) * 1000;
    if (expiresAt && Date.now() < expiresAt - 60000) return session;
    const r = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST', headers: baseHeaders(), body: JSON.stringify({ refresh_token: session.refresh_token })
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) { saveSession(null); throw new Error('انتهت الجلسة. سجّلي الدخول مرة أخرى.'); }
    saveSession(data); return session;
  }

  async function signIn(role, code, pin) {
    const email = syntheticEmail(role, code);
    const r = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: 'POST', headers: baseHeaders(), body: JSON.stringify({ email, password: String(pin || '') })
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error('رمز الدخول أو الرقم السري غير صحيح.');
    saveSession(data); return data;
  }

  async function api(action, payload = {}, requireAuth = true) {
    if (requireAuth) await refreshIfNeeded();
    const r = await fetch(apiUrl, {
      method: 'POST', headers: requireAuth ? authHeaders() : baseHeaders(),
      body: JSON.stringify({ action, ...payload })
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      const messages = {
        teacher_already_exists: 'تم تفعيل حساب المعلمة مسبقًا. استخدمي تسجيل الدخول.',
        invalid_activation: 'رمز التفعيل غير صحيح.',
        invalid_fields: 'راجعي البيانات المدخلة.',
        forbidden: 'لا تملكين صلاحية تنفيذ هذه العملية.',
        bank_not_synced: 'يجب مزامنة بنك نبض قبل نشر الأسبوع.'
      };
      throw new Error(messages[data.error] || data.message || 'تعذر الاتصال بالخادم.');
    }
    return data;
  }

  async function select(table, query = '') {
    await refreshIfNeeded();
    const r = await fetch(`${url}/rest/v1/${table}${query ? `?${query}` : ''}`, { headers: authHeaders() });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data?.message || 'تعذر قراءة البيانات من الخادم.');
    return data;
  }

  async function bootstrapTeacher(activation, code, pin, displayName) {
    return api('bootstrap_teacher', { activation, code, pin, display_name: displayName }, false);
  }

  const b64 = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
  async function decryptBankSeed(activation) {
    const r = await fetch('data/bank-seed-v7.enc.json', { cache: 'no-store' });
    if (!r.ok) throw new Error('تعذر قراءة ملف بنك نبض المشفر.');
    const blob = await r.json();
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(activation), 'PBKDF2', false, ['deriveKey']);
    const aesKey = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64(blob.salt), iterations: blob.iterations, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    let plain;
    try { plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(blob.iv) }, aesKey, b64(blob.ciphertext)); }
    catch { throw new Error('تعذر فتح بنك نبض. تأكدي من رمز التفعيل الأصلي.'); }
    return JSON.parse(new TextDecoder().decode(plain));
  }

  async function syncEncryptedBank(activation, progress) {
    const seed = await decryptBankSeed(activation);
    const questions = seed.questions || [];
    let sent = 0;
    for (let i = 0; i < questions.length; i += 100) {
      const batch = questions.slice(i, i + 100);
      await api('sync_bank', { questions: batch }, true);
      sent += batch.length;
      if (progress) progress(sent, questions.length);
    }
    return sent;
  }

  function signOut() { saveSession(null); }
  restore();
  return { url, key, apiUrl, signIn, signOut, restore, select, api, bootstrapTeacher, syncEncryptedBank, get session() { return session; } };
})();
