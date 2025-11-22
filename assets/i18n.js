// Simple client-side i18n loader using JSON files in /locales/
(function(){
  const defaultLang = localStorage.getItem('lang') || (navigator.language && navigator.language.startsWith && navigator.language.startsWith('en') ? 'en' : 'fr');
  let current = defaultLang;

  async function loadLocale(lang){
    try{
  const res = await fetch(`locales/${lang}.json`);
      if(!res.ok) throw new Error('locale not found');
      return await res.json();
    }catch(e){
      console.error('i18n load error', e);
      return {};
    }
  }

  function applyTranslations(messages){
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const txt = messages[key];
      if(!txt) return;
      if(el.placeholder !== undefined && el.tagName.toLowerCase()==='input'){
        el.placeholder = txt;
      } else if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = txt;
      } else {
        el.textContent = txt;
      }
    });
  }

  async function setLang(lang){
    const messages = await loadLocale(lang);
    applyTranslations(messages);
    localStorage.setItem('lang', lang);
    current = lang;
    try{ document.documentElement.lang = lang; }catch(e){}
    document.querySelectorAll('.lang-toggle').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang')===lang);
    });
  }

  // init on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    // attach toggles
    document.querySelectorAll('.lang-toggle').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const l = btn.getAttribute('data-lang');
        setLang(l);
      });
    });
    setLang(current);
  });

  // expose for debug
  window.__i18n = { setLang };
})();
