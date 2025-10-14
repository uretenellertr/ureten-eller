/* /script.js — genel, güvenli yardımcılar
   - Hash (#anchor) değişince hedefe kaydırır
   - Aynı hash’e tekrar tıklanınca da yeniden kaydırmayı zorlar
   - Hiçbir linke global preventDefault uygulamaz
*/
(function () {
  'use strict';

  // Hedefe kaydır
  function jumpToHash(opts) {
    var hash = (location.hash || '').replace(/^#/, '');
    if (!hash) return;
    try {
      // id veya name ile bulmaya çalış
      var el = document.getElementById(hash) || document.querySelector('[name="'+CSS.escape(hash)+'"]');
      if (!el) return;
      // Varsayılan: yumuşak kaydır
      var behavior = (opts && opts.instant) ? 'auto' : 'smooth';
      // Çok sabit layoutlarda hafif gecikme daha stabil
      setTimeout(function(){ el.scrollIntoView({ behavior: behavior, block: 'start' }); }, 0);
    } catch(_) {}
  }

  // Sayfa yüklendiğinde mevcut hash’e kaydır
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ jumpToHash({ instant:true }); }, { once:true, passive:true });
  } else {
    jumpToHash({ instant:true });
  }

  // Hash değişiminde kaydır
  window.addEventListener('hashchange', function(){ jumpToHash(); }, { passive:true });

  // Aynı hash’e tekrar tıklanınca da çalışsın
  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href]');
    if (!a) return;

    // Sadece aynı sayfa içi anchor senaryolarını ele al
    var href = a.getAttribute('href') || '';
    // Absolute URL ise kendi origin’imize çöz
    try { href = new URL(href, location.origin).href; } catch(_) {}

    // Mevcut sayfa ile aynı path + aynı hash’e tıklanıyorsa,
    // tarayıcı default olarak "hiçbir şey" yapabilir; biz yeniden kaydırmayı zorlayalım.
    var cur = location.origin + location.pathname + location.search + location.hash;
    if (href === cur && location.hash) {
      // Varsayılan davranışı engelleyip yeniden kaydır
      e.preventDefault();
      jumpToHash({ instant:false });
      return;
    }

    // Sadece hash içeren link (#xyz) ise ve hash mevcut hash ile aynıysa
    if (/^#/.test(a.getAttribute('href') || '') && (a.getAttribute('href') === location.hash)) {
      e.preventDefault();
      jumpToHash({ instant:false });
    }
  }, { passive:false });

  // Kısayol: veriyi-önden yüklemeye çalışan başka script yoksa sorun etmez
})();
</script>

