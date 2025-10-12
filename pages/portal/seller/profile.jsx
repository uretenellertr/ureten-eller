"use client";
import React from "react";

export default function SellerProfilePage(){
  // ====== STATE ======
  const [lang,setLang] = React.useState("tr");
  const DIR = lang === "ar" ? "rtl" : "ltr";
  const SUPPORTED = ["tr","en","ar","de"];

  // Görünüm kontrolü (profile owner / public visitor). Admin, rozet/veri düzenler.
  const [view,setView] = React.useState("owner"); // owner | visitor
  const [isAdmin,setIsAdmin] = React.useState(true);

  // Satıcı temel bilgileri (örnek veri)
  const [seller,setSeller] = React.useState({
    username:"el_ustasi",
    firstName:"Zehra",
    lastName:"Yılmaz",
    city:"İzmir",
    district:"Karşıyaka",
    joinedAt:"2023-08-14",
    bio:{
      tr:"Ev yapımı mantı ve el emeği örgü setleri üretiyorum. Siparişe göre çalışırım, zamanında ve temiz teslim ederim.",
      en:"I make handmade dumplings and knit sets. I work to order and deliver clean, on time.",
      ar:"أصنع مانطي منزليًا وأطقم حياكة يدوية. أعمل بالطلبات وأسلم في الوقت وبجودة.",
      de:"Ich mache hausgemachte Manti und Strick-Sets. Ich arbeite auf Bestellung und liefere pünktlich und sauber."
    },
    customOrders:true,
    delivery:{
      cities:["İzmir","Manisa","Aydın"],
      etaDays:2,
      shippingFee:"49 TL",
      pickup:true
    },
    returns:{
      tr:["Teslimden 3 gün içinde iade.","Kişiye özel ürünlerde iade yok.","Kargo ücreti alıcıya aittir."],
      en:["Returns within 3 days of delivery.","No returns for custom items.","Shipping at buyer's cost."],
      ar:["إرجاع خلال 3 أيام من التسليم.","لا إرجاع للطلبات الخاصة.","الشحن على المشتري."],
      de:["Rückgabe innerhalb von 3 Tagen.","Keine Rückgabe bei Sonderanfertigungen.","Versandkosten Käufer."]
    },
    stats:{ totalSales: 128, ratingAvg: 4.7, ratingCount: 36 },
    premium:false, // premium değilse "PREMIUM OL" görünsün
    verified:true, // onaylı satıcı
    trustBadges:{ id: true, tax: true, securePay: true }, // admin verir
    phone:"+90 532 000 00 00",
    address:"Karşıyaka, İzmir — Mavişehir Mah. 123. Sk. No:4",
  });

  // İlanlar (örnek)
  const [listingsLive] = React.useState([
    {id:1,title:"Ev Yapımı Mantı (1 kg)",price:220,thumb:"/demo/manti.jpg"},
    {id:2,title:"Vitrin: Örgü Bebek Takımı",price:450,thumb:"/demo/knit.jpg"},
    {id:3,title:"Zeytinyağlı Yaprak Sarma",price:260,thumb:"/demo/sarma.jpg"},
  ]);
  const [listingsExpired,setListingsExpired] = React.useState([
    {id:11,title:"Glutensiz Kurabiye",price:180,thumb:"/demo/cookie.jpg", daysAgo: 5},
  ]);

  // Sipariş ve yorum sayıları (örnek)
  const [pendingOrders] = React.useState(3);
  const [comments] = React.useState([
    {id:1, user:"Ayşe", text:{tr:"Çok lezzetliydi, paketleme özenliydi.",en:"Very tasty, careful packaging.",ar:"لذيذ جدًا وتغليف متقن.",de:"Sehr lecker, sorgfältig verpackt."}, stars:5, date:"2025-02-10"},
    {id:2, user:"Mehmet", text:{tr:"Teslimat hızlıydı.",en:"Delivery was fast.",ar:"التسليم كان سريعًا.",de:"Lieferung war schnell."}, stars:4, date:"2025-01-28"},
  ]);

  // Ödeme modal state + kopyalama
  const [showPay, setShowPay] = React.useState(false);
  const [copied, setCopied] = React.useState("");

  // ====== I18N ======
  const STR = {
    tr:{
      BRAND:"ÜRETEN ELLER",
      SELLER_PAGE:"Satıcı Profili",
      FOLLOW:"Takip et", MESSAGE:"Mesaj gönder", REQUEST:"Özel istek",
      VERIFIED:"Onaylı Satıcı", PRO:"PREMIUM",
      STARS:"Puan", REVIEWS:"Yorumlar", SEE_REVIEWS:"Yorumları gör",
      TOTAL_SALES:"Toplam satış", JOINED:"Mağazaya katılma", REPORT:"Şikayet et / Bildir",
      TRUST:"Güven Rozetleri", ID_VERIFIED:"Kimlik doğrulandı", TAX_VERIFIED:"Vergi bilgisi doğrulandı", SECURE_PAY:"Güvenli ödeme",
      ABOUT:"2–3 cümle tanıtım",
      HOW_WORK:"Çalışma şekli", CUSTOM_OK:"Kişiye özel sipariş alıyorum", CUSTOM_NO:"Kişiye özel sipariş almıyorum",
      DELIVERY:"Teslimat", DELIVERS_TO:"Gönderim yapılan şehirler", ETA:"Tahmini süre (gün)", FEE:"Kargo ücreti", PICKUP:"Elden teslim",
      RETURNS:"İade / değişim kuralları",
      OWNER_QUICK:"Hızlı bakış (Sahip)", PENDING_ORDERS:"Onay bekleyen siparişler", MY_REVIEWS:"Yorumlar",
      TABS_TITLE:"İlanlarım", TAB_PENDING:"Onay bekleyen ilanlar", TAB_LIVE:"Yayındaki ilanlar", TAB_EXPIRED:"Süresi biten ilanlar",
      EXTEND:"Süre uzat", EDIT:"Düzenle", DELETE:"Sil",
      LIVE_LISTINGS:"Yayındaki ilanlar", BEST_SELLERS:"En çok satanlar",
      RATE_SELLER:"Puan ver", CANNOT_RATE_SELF:"Kendi profilinde puan veremezsin",
      BOTTOM_HOME:"Ana sayfa", BOTTOM_MSG:"Mesajlar", BOTTOM_NOTIF:"Bildirimler",
      LEGAL_TITLE:"KURUMSAL",
      LEGAL_LINKS:[
        {href:"/legal/hakkimizda", label:"HAKKIMIZDA"},
        {href:"/legal/iletisim", label:"İLETİŞİM"},
        {href:"/legal/gizlilik", label:"GİZLİLİK"},
        {href:"/legal/kvkk-aydinlatma", label:"KVKK AYDINLATMA"},
        {href:"/legal/kullanim-sartlari", label:"KULLANIM ŞARTLARI"},
        {href:"/legal/mesafeli-satis-sozlesmesi", label:"MESAFELİ SATIŞ"},
        {href:"/legal/teslimat-iade", label:"TESLİMAT & İADE"},
        {href:"/legal/cerez-politikasi", label:"ÇEREZ POLİTİKASI"},
        {href:"/legal/topluluk-kurallari", label:"TOPLULUK KURALLARI"},
        {href:"/legal/yasakli-urunler", label:"YASAKLI ÜRÜNLER"},
      ],
      ADMIN_PANEL:"Admin Paneli", GIVE_VERIFY:"Onay rozeti ver", GIVE_PREMIUM:"Premium ver", GIVE_TRUST:"Güven rozetleri",
      COMPLAINT_HINT:"Kötüye kullanım için bildir",
      // Yeni
      SETTINGS:"Ayarlar",
      CONTACT:"İletişim",
      PHONE:"Telefon",
      ADDRESS:"Adres",
      FULLNAME:"Ad Soyad",
      PREMIUM_CTA:"PREMIUM OL",
      PREMIUM_ACTIVE:"PREMIUM AKTİF",
      PAY_NOW:"Ödeme Yap",
      BANK_TRANSFER:"Havale / EFT",
      BENEFICIARY:"Alıcı",
      IBAN:"IBAN",
      PAPARA:"Papara",
      COPY:"Kopyala",
      COPIED:"Kopyalandı!",
      CARD_PAY:"Kartla Öde",
      CLOSE:"Kapat",
    },
    en:{
      BRAND:"ÜRETEN ELLER",
      SELLER_PAGE:"Seller Profile",
      FOLLOW:"Follow", MESSAGE:"Message", REQUEST:"Custom request",
      VERIFIED:"Verified Seller", PRO:"PREMIUM",
      STARS:"Stars", REVIEWS:"Reviews", SEE_REVIEWS:"See reviews",
      TOTAL_SALES:"Total sales", JOINED:"Joined", REPORT:"Report",
      TRUST:"Trust Badges", ID_VERIFIED:"ID verified", TAX_VERIFIED:"Tax info verified", SECURE_PAY:"Secure payment",
      ABOUT:"2–3 sentence intro",
      HOW_WORK:"How I work", CUSTOM_OK:"I accept custom orders", CUSTOM_NO:"No custom orders",
      DELIVERY:"Delivery", DELIVERS_TO:"Ships to", ETA:"ETA (days)", FEE:"Shipping fee", PICKUP:"Pickup",
      RETURNS:"Return / exchange rules",
      OWNER_QUICK:"Owner quick glance", PENDING_ORDERS:"Pending orders", MY_REVIEWS:"Reviews",
      TABS_TITLE:"My listings", TAB_PENDING:"Pending", TAB_LIVE:"Live", TAB_EXPIRED:"Expired",
      EXTEND:"Extend", EDIT:"Edit", DELETE:"Delete",
      LIVE_LISTINGS:"Live listings", BEST_SELLERS:"Best sellers",
      RATE_SELLER:"Rate seller", CANNOT_RATE_SELF:"You can't rate your own profile",
      BOTTOM_HOME:"Home", BOTTOM_MSG:"Messages", BOTTOM_NOTIF:"Alerts",
      LEGAL_TITLE:"CORPORATE",
      LEGAL_LINKS:[
        {href:"/legal/hakkimizda", label:"ABOUT"},
        {href:"/legal/iletisim", label:"CONTACT"},
        {href:"/legal/gizlilik", label:"PRIVACY"},
        {href:"/legal/kvkk-aydinlatma", label:"PDPL (KVKK) NOTICE"},
        {href:"/legal/kullanim-sartlari", label:"TERMS OF USE"},
        {href:"/legal/mesafeli-satis-sozlesmesi", label:"DISTANCE SALES"},
        {href:"/legal/teslimat-iade", label:"DELIVERY & RETURNS"},
        {href:"/legal/cerez-politikasi", label:"COOKIE POLICY"},
        {href:"/legal/topluluk-kurallari", label:"COMMUNITY GUIDELINES"},
        {href:"/legal/yasakli-urunler", label:"PROHIBITED ITEMS"},
      ],
      ADMIN_PANEL:"Admin Panel", GIVE_VERIFY:"Grant verified badge", GIVE_PREMIUM:"Grant premium", GIVE_TRUST:"Trust badges",
      COMPLAINT_HINT:"Report misuse",
      // New
      SETTINGS:"Settings",
      CONTACT:"Contact",
      PHONE:"Phone",
      ADDRESS:"Address",
      FULLNAME:"Full name",
      PREMIUM_CTA:"Go PREMIUM",
      PREMIUM_ACTIVE:"PREMIUM ACTIVE",
      PAY_NOW:"Pay Now",
      BANK_TRANSFER:"Bank transfer",
      BENEFICIARY:"Beneficiary",
      IBAN:"IBAN",
      PAPARA:"Papara",
      COPY:"Copy",
      COPIED:"Copied!",
      CARD_PAY:"Pay by Card",
      CLOSE:"Close",
    },
    ar:{
      BRAND:"أُورَتِن إِلَّر",
      SELLER_PAGE:"ملف البائع",
      FOLLOW:"متابعة", MESSAGE:"رسالة", REQUEST:"طلب خاص",
      VERIFIED:"بائع موثّق", PRO:"بريميوم",
      STARS:"نجوم", REVIEWS:"التقييمات", SEE_REVIEWS:"عرض التقييمات",
      TOTAL_SALES:"إجمالي المبيعات", JOINED:"انضمّ", REPORT:"إبلاغ",
      TRUST:"شارات الثقة", ID_VERIFIED:"تم توثيق الهوية", TAX_VERIFIED:"تم توثيق الضريبة", SECURE_PAY:"دفع آمن",
      ABOUT:"تعريف من 2–3 جمل",
      HOW_WORK:"طريقة العمل", CUSTOM_OK:"أقبل الطلبات الخاصة", CUSTOM_NO:"لا أقبل الطلبات الخاصة",
      DELIVERY:"التسليم", DELIVERS_TO:"يشحن إلى", ETA:"المدة (أيام)", FEE:"رسوم الشحن", PICKUP:"استلام يدًا بيد",
      RETURNS:"قواعد الإرجاع/الاستبدال",
      OWNER_QUICK:"نظرة سريعة (المالك)", PENDING_ORDERS:"طلبات قيد الموافقة", MY_REVIEWS:"التقييمات",
      TABS_TITLE:"إعلاناتي", TAB_PENDING:"قيد الموافقة", TAB_LIVE:"منشور", TAB_EXPIRED:"منتهي",
      EXTEND:"تمديد", EDIT:"تعديل", DELETE:"حذف",
      LIVE_LISTINGS:"الإعلانات المنشورة", BEST_SELLERS:"الأكثر مبيعًا",
      RATE_SELLER:"قيّم البائع", CANNOT_RATE_SELF:"لا يمكنك تقييم ملفك",
      BOTTOM_HOME:"الرئيسية", BOTTOM_MSG:"الرسائل", BOTTOM_NOTIF:"الإشعارات",
      LEGAL_TITLE:"الشركة",
      LEGAL_LINKS:[
        {href:"/legal/hakkimizda", label:"مَنْ نَحْنُ"},
        {href:"/legal/iletisim", label:"اتِّصَال"},
        {href:"/legal/gizlilik", label:"الخصوصية"},
        {href:"/legal/kvkk-aydinlatma", label:"إشعار KVKK"},
        {href:"/legal/kullanim-sartlari", label:"شروط الاستخدام"},
        {href:"/legal/mesafeli-satis-sozlesmesi", label:"البيع عن بُعد"},
        {href:"/legal/teslimat-iade", label:"التسليم والإرجاع"},
        {href:"/legal/cerez-politikasi", label:"سياسة الكوكيز"},
        {href:"/legal/topluluk-kurallari", label:"إرشادات المجتمع"},
        {href:"/legal/yasakli-urunler", label:"السلع المحظورة"},
      ],
      ADMIN_PANEL:"لوحة الإدارة", GIVE_VERIFY:"منح شارة التوثيق", GIVE_PREMIUM:"منح بريميوم", GIVE_TRUST:"شارات الثقة",
      COMPLAINT_HINT:"للإبلاغ عن إساءة",
      // جديد
      SETTINGS:"الإعدادات",
      CONTACT:"التواصل",
      PHONE:"الهاتف",
      ADDRESS:"العنوان",
      FULLNAME:"الاسم الكامل",
      PREMIUM_CTA:"اشترك بريميوم",
      PREMIUM_ACTIVE:"بريميوم مفعّل",
      PAY_NOW:"ادفع الآن",
      BANK_TRANSFER:"حوالة بنكية",
      BENEFICIARY:"المستفيد",
      IBAN:"IBAN",
      PAPARA:"Papara",
      COPY:"نسخ",
      COPIED:"تم النسخ!",
      CARD_PAY:"الدفع بالبطاقة",
      CLOSE:"إغلاق",
    },
    de:{
      BRAND:"ÜRETEN ELLER",
      SELLER_PAGE:"Verkäuferprofil",
      FOLLOW:"Folgen", MESSAGE:"Nachricht", REQUEST:"Sonderwunsch",
      VERIFIED:"Verifizierter Verkäufer", PRO:"PREMIUM",
      STARS:"Sterne", REVIEWS:"Bewertungen", SEE_REVIEWS:"Bewertungen ansehen",
      TOTAL_SALES:"Gesamtverkäufe", JOINED:"Beigetreten", REPORT:"Melden",
      TRUST:"Vertrauensaspekte", ID_VERIFIED:"ID verifiziert", TAX_VERIFIED:"Steuerinfo verifiziert", SECURE_PAY:"Sichere Zahlung",
      ABOUT:"Kurzvorstellung (2–3 Sätze)",
      HOW_WORK:"Arbeitsweise", CUSTOM_OK:"Nimmt Sonderbestellungen an", CUSTOM_NO:"Keine Sonderbestellungen",
      DELIVERY:"Lieferung", DELIVERS_TO:"Lieferorte", ETA:"Dauer (Tage)", FEE:"Versandkosten", PICKUP:"Abholung",
      RETURNS:"Rückgabe / Umtausch",
      OWNER_QUICK:"Schnellansicht (Inhaber)", PENDING_ORDERS:"Ausstehende Bestellungen", MY_REVIEWS:"Bewertungen",
      TABS_TITLE:"Meine Anzeigen", TAB_PENDING:"Ausstehend", TAB_LIVE:"Live", TAB_EXPIRED:"Abgelaufen",
      EXTEND:"Verlängern", EDIT:"Bearbeiten", DELETE:"Löschen",
      LIVE_LISTINGS:"Live-Anzeigen", BEST_SELLERS:"Bestseller",
      RATE_SELLER:"Verkäufer bewerten", CANNOT_RATE_SELF:"Du kannst dich nicht selbst bewerten",
      BOTTOM_HOME:"Start", BOTTOM_MSG:"Nachrichten", BOTTOM_NOTIF:"Meldungen",
      LEGAL_TITLE:"UNTERNEHMEN",
      LEGAL_LINKS:[
        {href:"/legal/hakkimizda", label:"ÜBER UNS"},
        {href:"/legal/iletisim", label:"KONTAKT"},
        {href:"/legal/gizlilik", label:"DATENSCHUTZ"},
        {href:"/legal/kvkk-aydinlatma", label:"KVKK-HINWEIS"},
        {href:"/legal/kullanim-sartlari", label:"NUTZUNGSBEDINGUNGEN"},
        {href:"/legal/mesafeli-satis-sozlesmesi", label:"FERNABSATZ"},
        {href:"/legal/teslimat-iade", label:"LIEFERUNG & RÜCKGABE"},
        {href:"/legal/cerez-politikasi", label:"COOKIE-RICHTLINIE"},
        {href:"/legal/topluluk-kurallari", label:"COMMUNITY-RICHTLINIEN"},
        {href:"/legal/yasakli-urunler", label:"VERBOTENE ARTIKEL"},
      ],
      ADMIN_PANEL:"Admin-Bereich", GIVE_VERIFY:"Verifizierungsabzeichen geben", GIVE_PREMIUM:"Premium geben", GIVE_TRUST:"Vertrauensaspekte",
      COMPLAINT_HINT:"Missbrauch melden",
      // Neu
      SETTINGS:"Einstellungen",
      CONTACT:"Kontakt",
      PHONE:"Telefon",
      ADDRESS:"Adresse",
      FULLNAME:"Vollständiger Name",
      PREMIUM_CTA:"PREMIUM werden",
      PREMIUM_ACTIVE:"PREMIUM AKTIV",
      PAY_NOW:"Jetzt zahlen",
      BANK_TRANSFER:"Überweisung",
      BENEFICIARY:"Empfänger",
      IBAN:"IBAN",
      PAPARA:"Papara",
      COPY:"Kopieren",
      COPIED:"Kopiert!",
      CARD_PAY:"Mit Karte zahlen",
      CLOSE:"Schließen",
    },
  };
  const t = STR[lang];

  // Admin işlemleri (sadece görünüm amaçlı)
  function toggleVerify(){ if(!isAdmin) return; setSeller(s=>({...s, verified:!s.verified })); }
  function togglePremium(){ if(!isAdmin) return; setSeller(s=>({...s, premium:!s.premium })); }
  function toggleTrust(key){ if(!isAdmin) return; setSeller(s=>({...s, trustBadges:{...s.trustBadges, [key]: !s.trustBadges[key]}})); }

  // Kısa yardımcılar
  const fullName = `${seller.firstName} ${seller.lastName}`;
  const canRate = view === 'visitor'; // sahibi kendine puan veremez
  const ratingStars = Array.from({length:5}, (_,i)=> i < Math.round(seller.stats.ratingAvg));

  function extendExpired(id){ setListingsExpired(arr=>arr.map(x=> x.id===id ? {...x, daysAgo:0} : x)); }
  function deleteExpired(id){ setListingsExpired(arr=>arr.filter(x=> x.id!==id)); }
  async function copy(text){
    try{
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(()=>setCopied(""),2000);
    }catch(_e){ alert("Kopyalanamadı"); }
  }

  return (
    <div lang={lang} dir={DIR} className="min-h-screen pb-24">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <a className="flex items-center gap-2 font-black no-underline text-zinc-900" href="/">
            <img src="/logo.png" alt="logo" width="34" height="34"/>
            <span>{t.BRAND}</span>
          </a>
          <div className="ml-auto flex items-center gap-2">
            <select value={lang} onChange={e=>setLang(e.target.value)} className="border rounded-lg px-2 py-1">
              {SUPPORTED.map(k=>(<option key={k} value={k}>{k.toUpperCase()}</option>))}
            </select>
            <a href="/portal/settings" className="btn sm">{t.SETTINGS}</a>
            <div className="hidden md:flex items-center gap-2 text-xs">
              <span className="opacity-60">view:</span>
              <select value={view} onChange={e=>setView(e.target.value)} className="border rounded px-2 py-1">
                <option value="owner">owner</option>
                <option value="visitor">visitor</option>
              </select>
              <label className="flex items-center gap-1 ms-2"><input type="checkbox" checked={isAdmin} onChange={e=>setIsAdmin(e.target.checked)}/><span>admin</span></label>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-4 grid lg:grid-cols-3 gap-4">
        {/* LEFT: Avatar & badges */}
        <aside className="lg:col-span-1">
          <div className={`rounded-2xl p-4 border bg-white shadow-sm ${seller.premium? 'ring-2 ring-yellow-400':''}`} style={seller.premium?{boxShadow:'0 0 0 3px rgba(234,179,8,.35) inset'}:{}}>
            <div className="flex items-center gap-3">
              <div className={`avatar ${seller.premium?'gold':''}`}>
                <img src="/avatar.png" alt="avatar"/>
              </div>
              <div>
                <div className="text-lg font-black">@{seller.username}</div>
                <div className="text-sm text-zinc-600">{fullName} • {seller.city}</div>
              </div>
            </div>
            {seller.verified && (
              <div className="mt-2 text-xs font-bold text-emerald-700 inline-flex items-center gap-2">
                <span className="badge">{t.VERIFIED}</span>
                {seller.premium && <span className="badge gold">{t.PRO}</span>}
              </div>
            )}

            <div className="mt-3 flex items-center gap-2">
              {ratingStars.map((on,i)=> <span key={i} className={`star ${on?'on':''}`}>★</span>)}
              <span className="text-sm font-bold">{seller.stats.ratingAvg.toFixed(1)}</span>
              <button className="link text-sm" disabled={!canRate} title={!canRate? t.CANNOT_RATE_SELF : t.RATE_SELLER}>{t.SEE_REVIEWS} ({seller.stats.ratingCount})</button>
            </div>

            {view==='visitor' && (
              <div className="mt-3 flex gap-2">
                <button className="btn sm">{t.FOLLOW}</button>
                <button className="btn sm">{t.MESSAGE}</button>
                <button className="btn sm">{t.REQUEST}</button>
              </div>
            )}

            {/* İLETİŞİM */}
            <div className="mt-4">
              <div className="text-sm font-black mb-1">{t.CONTACT}</div>
              <ul className="text-sm text-zinc-700 space-y-1">
                <li><b>{t.FULLNAME}:</b> {fullName}</li>
                <li><b>{t.PHONE}:</b> {seller.phone}</li>
                <li><b>{t.ADDRESS}:</b> {seller.address}</li>
              </ul>
            </div>

            {/* Güven rozetleri */}
            <div className="mt-4">
              <div className="text-sm font-black mb-1">{t.TRUST}</div>
              <div className="flex flex-wrap gap-2">
                {seller.trustBadges.id && <span className="chip">{t.ID_VERIFIED}</span>}
                {seller.trustBadges.tax && <span className="chip">{t.TAX_VERIFIED}</span>}
                {seller.trustBadges.securePay && <span className="chip">{t.SECURE_PAY}</span>}
              </div>
              {view==='visitor' && <button className="link mt-2 text-xs" title={t.COMPLAINT_HINT}>{t.REPORT}</button>}
            </div>

            {/* PREMIUM */}
            <div className="mt-4 rounded-xl border p-3 bg-white">
              <div className="text-sm font-black mb-1">PREMIUM</div>
              {seller.premium ? (
                <div className="text-sm text-emerald-700 font-bold">{t.PREMIUM_ACTIVE}</div>
              ) : (
                <button className="btn sm" onClick={()=>setShowPay(true)}>{t.PREMIUM_CTA}</button>
              )}
              <div className="mt-2 flex gap-2 flex-wrap">
                <button className="btn sm" onClick={()=>setShowPay(true)}>{t.PAY_NOW}</button>
                <a className="btn sm" href="/portal/pay?plan=premium">{t.CARD_PAY}</a>
              </div>
            </div>

            {/* Admin panel (yalnız admin görsün) */}
            {isAdmin && (
              <div className="mt-4 rounded-xl border p-3 bg-zinc-50">
                <div className="text-xs font-black mb-2">{t.ADMIN_PANEL}</div>
                <div className="flex flex-col gap-2 text-sm">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={seller.verified} onChange={toggleVerify}/> {t.GIVE_VERIFY}</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={seller.premium} onChange={togglePremium}/> {t.GIVE_PREMIUM}</label>
                  <div className="flex flex-col gap-1">
                    <div className="text-xs opacity-70">{t.GIVE_TRUST}</div>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={seller.trustBadges.id} onChange={()=>toggleTrust('id')}/> {t.ID_VERIFIED}</label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={seller.trustBadges.tax} onChange={()=>toggleTrust('tax')}/> {t.TAX_VERIFIED}</label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={seller.trustBadges.securePay} onChange={()=>toggleTrust('securePay')}/> {t.SECURE_PAY}</label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT: Content */}
        <section className="lg:col-span-2 grid gap-4">
          {/* Üst istatistikler */}
          <div className="rounded-2xl p-4 border bg-white shadow-sm grid md:grid-cols-3 gap-3">
            <div>
              <div className="text-xs text-zinc-500">{t.TOTAL_SALES}</div>
              <div className="text-2xl font-black">≈ {seller.stats.totalSales}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">{t.JOINED}</div>
              <div className="text-2xl font-black">{seller.joinedAt}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">{t.REVIEWS}</div>
              <div className="text-2xl font-black">{comments.length}</div>
            </div>
          </div>

          {/* Owner quick glance */}
          {view==='owner' && (
            <div className="rounded-2xl p-4 border bg-white shadow-sm">
              <div className="text-sm font-black mb-2">{t.OWNER_QUICK}</div>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="kpi">
                  <div className="kpi-k">{t.PENDING_ORDERS}</div>
                  <div className="kpi-v">{pendingOrders}</div>
                </div>
                <div className="kpi">
                  <div className="kpi-k">{t.MY_REVIEWS}</div>
                  <div className="kpi-v">{comments.length}</div>
                </div>
              </div>
            </div>
          )}

          {/* Hakkında ve politikalar */}
          <div className="rounded-2xl p-4 border bg-white shadow-sm grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-black mb-1">{t.ABOUT}</div>
              <div className="text-sm text-zinc-700">{seller.bio[lang]}</div>

              <div className="text-sm font-black mt-4 mb-1">{t.HOW_WORK}</div>
              <div className="text-sm text-zinc-700">{seller.customOrders ? t.CUSTOM_OK : t.CUSTOM_NO}</div>

              <div className="text-sm font-black mt-4 mb-1">{t.DELIVERY}</div>
              <ul className="text-sm text-zinc-700 space-y-1 list-disc ps-5">
                <li><b>{t.DELIVERS_TO}:</b> {seller.delivery.cities.join(', ')}</li>
                <li><b>{t.ETA}:</b> {seller.delivery.etaDays}</li>
                <li><b>{t.FEE}:</b> {seller.delivery.shippingFee}</li>
                <li><b>{t.PICKUP}:</b> {seller.delivery.pickup? '✓':'–'}</li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-black mb-1">{t.RETURNS}</div>
              <ul className="text-sm text-zinc-700 space-y-1 list-disc ps-5">
                {seller.returns[lang].map((r,i)=>(<li key={i}>{r}</li>))}
              </ul>
            </div>
          </div>

          {/* İlan sekmeleri */}
          <div className="rounded-2xl p-4 border bg-white shadow-sm">
            <div className="text-sm font-black mb-3">{t.TABS_TITLE}</div>
            <div className="flex flex-wrap gap-2 mb-3">
              <button className="tab-btn">{t.TAB_PENDING}</button>
              <button className="tab-btn primary">{t.TAB_LIVE}</button>
              <button className="tab-btn">{t.TAB_EXPIRED}</button>
            </div>

            {/* Live listings */}
            <div className="grid md:grid-cols-3 gap-3">
              {listingsLive.map(card=> (
                <div key={card.id} className="card">
                  <div className="thumb"><img src={card.thumb} alt=""/></div>
                  <div className="p-3">
                    <div className="card-title">{card.title}</div>
                    <div className="card-sub">{card.price} TL</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Expired */}
            {listingsExpired.length>0 && (
              <div className="mt-4">
                <div className="text-sm font-black mb-2">{t.TAB_EXPIRED}</div>
                <div className="grid md:grid-cols-2 gap-3">
                  {listingsExpired.map(card => (
                    <div key={card.id} className="card">
                      <div className="thumb small"><img src={card.thumb} alt=""/></div>
                      <div className="p-3 flex items-center justify-between gap-3">
                        <div>
                          <div className="card-title">{card.title}</div>
                          <div className="card-sub">{card.price} TL • {card.daysAgo}g önce bitti</div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <button className="btn xs" onClick={()=>extendExpired(card.id)}>{t.EXTEND}</button>
                          <button className="btn xs" onClick={()=>alert('edit '+card.id)}>{t.EDIT}</button>
                          <button className="btn xs danger" onClick={()=>deleteExpired(card.id)}>{t.DELETE}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Yorumlar */}
          <div className="rounded-2xl p-4 border bg-white shadow-sm" id="reviews">
            <div className="text-sm font-black mb-3">{t.REVIEWS}</div>
            <div className="space-y-3">
              {comments.map(c => (
                <div key={c.id} className="rounded-xl border">
                  <div className="p-3 flex items-center gap-2">
                    <div className="avatar sm"><img src="/user.png" alt=""/></div>
                    <div className="font-bold text-sm">{c.user}</div>
                    <div className="text-xs text-zinc-500 ms-auto">{c.date}</div>
                  </div>
                  <div className="px-3 pb-3 text-sm text-zinc-700">{c.text[lang]}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* PAYMENT MODAL */}
      {showPay && (
        <div className="modal" onClick={()=>setShowPay(false)}>
          <div className="sheet" onClick={(e)=>e.stopPropagation()}>
            <div className="text-lg font-black mb-2">{t.PAY_NOW}</div>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border p-3 bg-white">
                <div className="font-bold mb-1">{t.BANK_TRANSFER}</div>
                <div><b>{t.BENEFICIARY}:</b> Nejla Kavuncu</div>
                <div className="flex items-center gap-2 mt-1">
                  <b>{t.IBAN}:</b>
                  <span className="mono">TR590082900009491868461105</span>
                  <button className="btn xs" onClick={()=>copy('TR590082900009491868461105')}>{copied==='TR590082900009491868461105' ? t.COPIED : t.COPY}</button>
                </div>
              </div>
              <div className="rounded-xl border p-3 bg-white">
                <div className="font-bold mb-1">{t.PAPARA}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="mono">TR590082900009491868461105</span>
                  <button className="btn xs" onClick={()=>copy('TR590082900009491868461105')}>{copied==='TR590082900009491868461105' ? t.COPIED : t.COPY}</button>
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <a className="btn" href="/portal/pay?plan=premium">{t.CARD_PAY}</a>
              <button className="btn" onClick={()=>setShowPay(false)}>{t.CLOSE}</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER (LEGAL) */}
      <footer className="mt-8 w-full bg-black text-zinc-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="text-sm font-black mb-2">{t.LEGAL_TITLE}</div>
          <nav className="flex flex-wrap gap-3 text-xs">
            {t.LEGAL_LINKS.map((L,i)=> (<a key={i} className="hover:underline" href={L.href}>{L.label}</a>))}
          </nav>
          <div className="text-[11px] text-zinc-400 mt-2">© 2025 Üreten Eller</div>
        </div>
      </footer>

      {/* BOTTOM NAV (sabit) */}
      <nav className="bottombar">
        <a href="/" className="bbtn">🏠 <span>{t.BOTTOM_HOME}</span></a>
        <a href="/portal/messages" className="bbtn">💬 <span>{t.BOTTOM_MSG}</span></a>
        <a href="/portal/alerts" className="bbtn">🔔 <span>{t.BOTTOM_NOTIF}</span></a>
      </nav>

      {/* STYLES */}
      <style>{`
        *{box-sizing:border-box}
        body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;background:
          radial-gradient(1200px 600px at 10% -10%, #ffe4e6, transparent),
          radial-gradient(900px 500px at 90% -10%, #e0e7ff, transparent),
          linear-gradient(120deg,#ff80ab,#a78bfa,#60a5fa,#34d399)}
        .min-h-screen{min-height:100vh}
        .pb-24{padding-bottom:6rem}
        .mx-auto{margin-left:auto;margin-right:auto}
        .max-w-6xl{max-width:72rem}
        .px-4{padding-left:1rem;padding-right:1rem}
        .py-3{padding-top:.75rem;padding-bottom:.75rem}
        .py-4{padding-top:1rem;padding-bottom:1rem}
        .mt-4{margin-top:1rem}.mt-8{margin-top:2rem}
        .text-2xl{font-size:1.5rem}
        .font-black{font-weight:900}.font-bold{font-weight:700}
        .text-xs{font-size:.75rem}.text-sm{font-size:.875rem}
        .text-zinc-200{color:#e4e4e7}.text-zinc-400{color:#a1a1aa}.text-zinc-500{color:#71717a}.text-zinc-600{color:#52525b}.text-zinc-700{color:#3f3f46}.text-zinc-900{color:#18181b}
        .bg-white{background:#fff}.bg-white\/90{background:rgba(255,255,255,.9)}.bg-black{background:#000}.bg-zinc-50{background:#fafafa}
        .rounded-xl{border-radius:12px}.rounded-2xl{border-radius:16px}
        .border{border:1px solid #e5e7eb}.border-zinc-200{border-color:#e4e4e7}
        .shadow-sm{box-shadow:0 10px 25px rgba(0,0,0,.06)}
        .backdrop-blur{backdrop-filter:blur(8px)}
        .sticky{position:sticky}.top-0{top:0}
        .z-40{z-index:40}
        .flex{display:flex}.items-center{align-items:center}.justify-between{justify-content:space-between}
        .gap-1{gap:.25rem}.gap-2{gap:.5rem}.gap-3{gap:.75rem}.gap-4{gap:1rem}
        .grid{display:grid}.md\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.md\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.lg\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}
        .lg\:col-span-2{grid-column:span 2 / span 2}

        .no-underline{text-decoration:none}
        .hover\:underline:hover{text-decoration:underline}

        .avatar{width:72px;height:72px;border-radius:999px;overflow:hidden;border:3px solid #e5e7eb;box-shadow:0 4px 16px rgba(0,0,0,.08)}
        .avatar img{width:100%;height:100%;object-fit:cover}
        .avatar.gold{border:3px solid transparent;background:linear-gradient(#fff,#fff) padding-box, linear-gradient(135deg,#f59e0b,#facc15,#f59e0b) border-box}
        .avatar.sm{width:36px;height:36px;border-width:2px}

        .badge{font-size:10px;padding:.25rem .5rem;border-radius:999px;border:1px solid #10b981;background:#ecfdf5;color:#065f46}
        .badge.gold{border-color:#f59e0b;background:#fff7ed;color:#92400e}

        .star{font-size:18px;opacity:.25}
        .star.on{opacity:1}

        .btn{border:1px solid #e5e7eb;border-radius:12px;padding:.5rem .75rem;background:#fff;font-weight:700}
        .btn.sm{padding:.35rem .6rem;font-size:.8rem}
        .btn.xs{padding:.25rem .45rem;font-size:.75rem;border-radius:10px}
        .btn.danger{border-color:#ef4444;color:#b91c1c}
        .link{background:none;border:none;padding:0;color:#2563eb;text-decoration:underline;cursor:pointer}

        .kpi{border:1px solid #e5e7eb;border-radius:12px;padding:.75rem;background:#fff}
        .kpi-k{font-size:.75rem;color:#71717a}
        .kpi-v{font-size:1.25rem;font-weight:900}

        .tab-btn{border:1px solid #e5e7eb;border-radius:999px;padding:.4rem .9rem;background:#fff;font-weight:800}
        .tab-btn.primary{background:linear-gradient(135deg,#ef4444,#8b5cf6,#22c55e);color:#fff;border-color:transparent}

        .card{border:1px solid #e5e7eb;border-radius:16px;background:#fff;overflow:hidden}
        .thumb{aspect-ratio:4/3;background:#f4f4f5}
        .thumb.small{aspect-ratio:3/2}
        .thumb img{width:100%;height:100%;object-fit:cover}
        .p-3{padding:.75rem}
        .card-title{font-weight:900}
        .card-sub{font-size:.85rem;color:#52525b;margin-top:.15rem}

        .chip{font-size:11px;border:1px solid #e5e7eb;border-radius:999px;padding:.2rem .6rem;background:#fff}

        .bottombar{position:fixed;left:0;right:0;bottom:0;background:#0b0b0c;color:#fff;border-top:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-around;padding:.5rem;z-index:50}
        .bbtn{display:flex;align-items:center;gap:.4rem;color:#fff;text-decoration:none;font-weight:800}
        .bbtn span{font-size:.85rem}

        nav.bottombar + *{margin-bottom:64px}

        /* extra */
        .mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace}
        .modal{position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:1rem;z-index:60}
        .modal .sheet{width:100%;max-width:520px;background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1rem;box-shadow:0 20px 40px rgba(0,0,0,.2)}
      `}</style>
    </div>
  );
}
