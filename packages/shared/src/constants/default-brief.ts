import { AuditBrief } from '../schemas/brief.js';

export const DEFAULT_AUDIT_BRIEF: AuditBrief = {
  version: '2.0',
  name: 'Kapsamlı Yapay Zeka ve AI Agent Uyumluluk Denetimi (Comprehensive AI & Agent Readiness Audit)',
  description: 'Web sitesini yalnızca klasik SEO kurallarına göre değil, AI sistemleri ve AI agentların siteyi ne kadar doğru anlayabildiği, yorumlayabildiği, güvenilir biçimde kullanabildiği ve bilgi çıkarabildiği açısından 16 temel sütun ve 24 alt metrik grubunda değerlendirir.',
  criteria: [
    {
      id: 'semantic-intelligence',
      name: 'Semantik ve Yapısal Zeka (Semantic & Structural Intelligence)',
      description: 'Sayfa amacının netliği, Semantic HTML5 kullanımı (<main>, <header>, <nav>, <article>, <section>, <footer>), başlık hiyerarşisi (H1-H6), içerik/navigasyon ayrımı ve DOM anlamsal kalitesi.',
      weight: 8,
      rules: [
        'Sayfanın ana amacını ve konusunu tekil ve net biçimde tanımlayan bir <h1> etiketi bulunmalıdır.',
        'HTML5 semantik etiketleri (<main>, <header>, <nav>, <article>, <section>, <footer>) kullanılarak ana içerik genel şablon gürültüsünden ayrıştırılmalıdır.',
        'Başlık hiyerarşisi (H1 -> H2 -> H3) atlama yapılmadan mantıksal düzende kurgulanmalıdır.',
        'Sayfa tipi ve bilgi mimarisi yapay zeka tarafından kolayca tespit edilebilir olmalıdır.',
      ],
    },
    {
      id: 'content-comprehension',
      name: 'İçerik Anlaşılırlığı ve Bilgi Yoğunluğu (Content Comprehension & Information Density)',
      description: 'İçeriğin netliği, konu odağı, bağlam eksiksizliği, belirsizlikten ve laf kalabalığından arınmış olması, özetlenebilirlik, kilit bilgilerin görünürlüğü ve olgusal netlik.',
      weight: 8,
      rules: [
        'Gereksiz dolgu metinlerinden arındırılmış, olgusal ve net bilgi içeren metinler yer almalıdır.',
        'Yapay zeka modellerinin konuyu kavraması için yeterli derinlikte ve bağlamda içerik (ideal > 250 kelime) bulunmalıdır.',
        'Kilit bilgiler (ürün özellikleri, amaç, değer önerisi) açık ve belirgin ifadelerle sunulmalıdır.',
        'İçerik tutarlı, anlam bütünlüğüne sahip ve özetlenebilir yapıda olmalıdır.',
      ],
    },
    {
      id: 'ai-answerability',
      name: 'Yapay Zeka Soru Cevaplama Yetkinliği (AI Answerability & Direct Answers)',
      description: 'Kullanıcı ve AI sistemlerinin soru yönelttiğinde doğrudan yanıt bulabilme kolaylığı; ürün/hizmet detayları, fiyatlandırma şeffaflığı, iletişim, konum, çalışma saatleri, politikalar ve SSS (FAQ) kapsamı.',
      weight: 7,
      rules: [
        'Kullanıcıların ve AI ajanlarının sıkça soracağı sorulara doğrudan ve net yanıtlar sunulmalıdır.',
        'Ürün ve hizmet detayları, fiyatlandırma bilgileri ve koşullar açık ve şeffaf olmalıdır.',
        'İletişim, konum, çalışma saatleri ve iade/hizmet politikaları kolayca erişilebilir olmalıdır.',
        'Cevap çıkarma zorluğu düşük, doğrudan bilgi sunumu yüksek olmalıdır.',
      ],
    },
    {
      id: 'entity-intelligence',
      name: 'Varlık Zekası ve Kimlik Netliği (Entity Intelligence & Disambiguation)',
      description: 'Kurum (Organization), Marka (Brand), Kişi (Person), Ürün/Hizmet (Product/Service), Yayıncı/Yazar (Publisher/Author) kimliklerinin net tanımlanması ve varlık ilişkilerinin tutarlılığı.',
      weight: 7,
      rules: [
        'Marka ve kurum ismi tüm başlık, metin ve meta verilerde tutarlı şekilde kullanılmalıdır.',
        'Yayıncı, kurum veya yazar kimliği açıkça tanımlanmalı, şüpheye yer bırakılmamalıdır.',
        'Varlıklar arasındaki ilişkiler (Marka -> Ürün, Kurum -> Hizmet) net bir şekilde modellenmelidir.',
      ],
    },
    {
      id: 'structured-knowledge',
      name: 'Yapılandırılmış Veri ve Bilgi Grafiği (Structured Knowledge & Schema.org)',
      description: 'Hatasız JSON-LD şemaları, Schema.org entegrasyonu, Organization, Product, Article, LocalBusiness, WebSite, BreadcrumbList, FAQPage şemalarının tamlığı ve içerikle uyumu.',
      weight: 8,
      rules: [
        'Sayfada geçerli, hatasız JSON-LD (<script type="application/ld+json">) şemaları bulunmalıdır.',
        'Sayfa türüne uygun temel şemalar (Organization, WebSite, Product, FAQPage vb.) entegre edilmelidir.',
        'JSON-LD şemalarında belirtilen veriler ile sayfadaki görünür içerik birebir örtüşmelidir.',
      ],
    },
    {
      id: 'metadata-intelligence',
      name: 'Meta Veri Zekası ve Sosyal Grafik (Metadata Intelligence)',
      description: 'Sayfa başlığı (<title>), meta açıklama (description), kanonik URL (canonical), dil beyanı (lang), viewport ve OpenGraph / Twitter Card etiketlerinin eksiksizliği.',
      weight: 5,
      rules: [
        '<title> etiketi 30-65 karakter aralığında, açıklayıcı ve özgün olmalıdır.',
        '<meta name="description"> 70-160 karakter aralığında sayfayı özetleyen net ifadeler içermelidir.',
        'Kanonik URL (canonical) tanımlanarak kopya içerik belirsizliği önlenmelidir.',
        'OpenGraph (og:title, og:image, og:description) ve Twitter Card etiketleri eksiksiz olmalıdır.',
      ],
    },
    {
      id: 'machine-readability',
      name: 'Makine Okunabilirliği ve Statik İçerik Teslimi (Machine Readability & SSR)',
      description: 'HTML okunabilirliği, metin erişilebilirliği, aşırı JavaScript/CSR bağımlılığı olmadan doğrudan statik payload içinde içeriğin sunulması, DOM karmaşıklığı.',
      weight: 7,
      rules: [
        'Kritik metin içeriği istemci tarafı JS render edilmeksizin ilk statik HTML içinde sunulmalıdır.',
        'Yapay zekanın içeriğe erişimini engelleyen aşırı DOM derinliği veya gizli içerik tuzakları olmamalıdır.',
        'Yüksek metin/kod oranı (text-to-code ratio) ile saf bilgiye erişim kolaylaştırılmalıdır.',
      ],
    },
    {
      id: 'ai-discoverability',
      name: 'Keşfedilebilirlik ve Tarama Yönergeleri (AI Discoverability & Crawl Directives)',
      description: 'robots.txt varlığı ve yapılandırması, sitemap.xml mevcudiyeti, AI botlarına (GPTBot, ClaudeBot, Google-Extended) verilen izinler ve taranabilir iç bağlantılar.',
      weight: 6,
      rules: [
        'robots.txt dosyası erişilebilir olmalı ve tarama botlarına açık kurallar sunmalıdır.',
        'XML Site Haritası (sitemap.xml) bulunmalı ve robots.txt içinde referans verilmelidir.',
        'Tüm kritik alt sayfalar anlamlı bağlantı metinlerine sahip iç linklerle bağlanmalıdır.',
      ],
    },
    {
      id: 'trust-evidence',
      name: 'Güvenilirlik, Kanıt ve E-E-A-T Sinyalleri (Trust, Evidence & Authority)',
      description: 'Yazar/kurum şeffaflığı, iletişim kanalları, Hakkımızda, Gizlilik ve Kullanım Koşulları sayfaları, kaynak referansları ve doğrulanabilir bilgi sinyalleri.',
      weight: 6,
      rules: [
        'Kurumsal şeffaflık (açık iletişim adresi, e-posta, telefon, şirket unvanı) sunulmalıdır.',
        'Hakkımızda, Gizlilik Politikası ve Kullanım Koşulları bağlantıları mevcut olmalıdır.',
        'İddia edilen olgusal bilgiler doğrulanabilir kanıt veya kaynak referanslarıyla desteklenmelidir.',
      ],
    },
    {
      id: 'freshness-reliability',
      name: 'Güncellik ve Zamansal Güvenilirlik (Freshness & Temporal Reliability)',
      description: 'İçeriğin güncelliği, son güncellenme/yayın tarihi bilgisi, fiyat ve stok durumlarının güncelliği, süresi geçmiş bilgilerin tespiti.',
      weight: 5,
      rules: [
        'Sayfa içeriğinde veya şemada yayın ve son güncelleme tarihleri (datePublished, dateModified) yer almalıdır.',
        'Fiyat, kampanya ve hizmet bilgilerinin zamansal geçerliliği net olmalıdır.',
        'Süresi dolmuş veya güncelliğini yitirmiş yanıltıcı bilgiler bulunmamalıdır.',
      ],
    },
    {
      id: 'information-consistency',
      name: 'Bilgi Tutarlılığı ve Çelişki Tespiti (Information Consistency)',
      description: 'Sayfa içi bölümler arası tutarlılık, şema verisi ile görünen metin arasındaki uyum, meta veriler ile içerik arasındaki çelişkisizlik.',
      weight: 5,
      rules: [
        'Sayfa başlığı, meta veriler, şema verileri ve gövde metni birbiriyle tam uyumlu olmalıdır.',
        'Fiyat, iletişim ve ürün özellikleri sayfadaki farklı bölümlerde çelişmemelidir.',
      ],
    },
    {
      id: 'conversational-readiness',
      name: 'Sohbet ve Doğal Dil Sorgu Uyumluluğu (Conversational Readiness)',
      description: 'Doğal dilde sorulan kullanıcı sorularına cevap üretme uygunluğu, SSS yapısının kalitesi, bağlam korunumu ve doğrudan cevap çıkarma kalitesi.',
      weight: 6,
      rules: [
        'Kullanıcıların sesli veya yazılı doğal dil aramalarına uygun soru-cevap blokları barındırmalıdır.',
        'Paragraflar ve listeler sohbet tabanlı AI modellerinin anında alıntı yapabileceği netlikte olmalıdır.',
      ],
    },
    {
      id: 'ai-agent-readiness',
      name: 'AI Agent ve Görev Tamamlama Uyumluluğu (AI Agent Readiness & Actions)',
      description: 'AI agentların sitede işlem yapabilmesi için eylemlerin keşfedilebilirliği (CTA), buton ve form semantiği, etiket kalitesi, rezervasyon/satın alma/iletişim akış netliği.',
      weight: 7,
      rules: [
        'Form alanlarında açık <label> ve semantic name/type özellikleri bulunmalıdır.',
        'Butonlar ve eylem çağrıları (CTA) amacını net belirten metinlere sahip olmalıdır.',
        'Bir AI ajanının site üzerinde form doldurma veya işlem tamamlama adımları anlaşılır olmalıdır.',
      ],
    },
    {
      id: 'accessibility-readability',
      name: 'Erişilebilirlik ve Çok Modlu Okuma (Accessibility as AI Readability)',
      description: 'Görsellerde alt etiketleri (alt text), ARIA etiketleri, form etiketleri, ekran okuyucu ve multimodal AI modelleri için metin alternatifleri.',
      weight: 5,
      rules: [
        'Tüm görsellerde açıklayıcı ve amaca uygun alt nitelikleri (%100 kapsayıcılık) bulunmalıdır.',
        'Görsel olmayan ortamlar ve multimodal modeller için metin alternatifleri eksiksiz olmalıdır.',
      ],
    },
    {
      id: 'technical-crawl-quality',
      name: 'Teknik Tarama Kalitesi ve Performans (Technical Crawl Quality & Speed)',
      description: 'Güvenli HTTPS bağlantısı, HTTP 200 durumu, hızlı sunucu yanıt süresi (< 1000ms), yönlendirme zincirlerinin olmaması, hafif HTML boyutu.',
      weight: 5,
      rules: [
        'Tüm bağlantılar güvenli HTTPS üzerinden sunulmalıdır.',
        'Sunucu ilk yanıt süresi (TTFB / Response Time) 1000ms altında olmalıdır.',
        'Gereksiz 301/302 yönlendirme zincirleri ve kırık bağlantılar bulunmamalıdır.',
      ],
    },
    {
      id: 'hallucination-risk',
      name: 'Halüsinasyon Riski ve Bilgi Çıkarımı (AI Hallucination Risk & Retrieval)',
      description: 'Desteksiz iddialar, eksik bağlam, yanıltıcı meta veriler ve şema-içerik çelişkilerinden kaynaklanan yapay zeka yanlış yorumlama riskinin düşüklüğü.',
      weight: 5,
      rules: [
        'Yapay zekanın yanlış çıkarım yapmasına yol açabilecek muğlak ve bağlamsız ifadelerden kaçınılmalıdır.',
        'Bilgi parçaları (chunks) bağımsız olarak anlam ifade edecek şekilde yapılandırılmalıdır.',
      ],
    },
  ],
};
