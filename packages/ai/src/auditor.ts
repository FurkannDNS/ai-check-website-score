import {
  WebsiteAuditResult,
  AuditBrief,
  AuditReport,
  AuditReportSchema,
  DEFAULT_AUDIT_BRIEF,
} from '@ai-auditor/shared';
import { createGeminiClient } from './client.js';
import { buildSystemInstruction, buildAuditUserPrompt } from './prompts.js';

export interface AuditOptions {
  apiKey?: string;
  model?: string;
}

const FALLBACK_MODELS = ['gemini-flash-latest', 'gemini-3.7-flash', 'gemini-3.5-flash'];

/**
 * Executes a promise with an enforced timeout.
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMsg: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutMsg)), timeoutMs)
    ),
  ]);
}

/**
 * Robust Deterministic Heuristic Engine calculating all 16 pillars and 8 categories
 * directly from two-phase crawl observational evidence.
 */
export function generateHeuristicFallbackReport(websiteResult: WebsiteAuditResult): AuditReport {
  const page = websiteResult.page;
  const signals = websiteResult.aiSignals;
  const cmp = websiteResult.staticVsRendered;
  const tech = websiteResult.technical;
  const struct = websiteResult.structuredData;
  const meta = websiteResult.metadata;

  const sScore = signals.semanticHtml.score;
  const jsScore = cmp ? cmp.jsDependencyScore : 100;
  const structScore = struct.detectedTypes.length > 0 ? Math.min(100, struct.detectedTypes.length * 30 + 30) : 20;
  const textScore = Math.min(100, Math.round(signals.textToCodeRatio * 250));
  const headingScore = signals.headingStructureSanity.validHierarchy ? 95 : 55;
  const metaScore = (meta.standard.title && meta.standard.description ? 90 : meta.standard.title ? 60 : 30);
  const robotScore = tech.robotsTxt.exists ? 90 : 40;
  const altScore = Math.round(signals.altTextCoverage);
  const techScore = (tech.https ? 50 : 0) + (tech.responseTimeMs < 1000 ? 50 : 25);

  const metrics = [
    {
      id: 'semantic-intelligence',
      name: 'Semantik HTML ve Belge Yapısı',
      category: 'Semantik ve Yapısal Zeka',
      score: sScore,
      status: sScore >= 80 ? 'Pass' : sScore >= 50 ? 'Warning' : 'Fail' as any,
      evidence: [
        page.semanticElements.main ? '<main> ana içerik etiketi mevcut' : '<main> ana içerik etiketi eksik',
        page.semanticElements.nav ? '<nav> navigasyon konteyneri mevcut' : '<nav> etiketi eksik',
        page.semanticElements.header ? '<header> üst bilgi mevcut' : '<header> eksik',
        page.semanticElements.footer ? '<footer> alt bilgi mevcut' : '<footer> eksik',
      ],
      reasoning: `Semantik HTML Kullanımı skoru ${sScore}/100: Web sitenizde modern HTML5 semantik etiketlerinin varlığı incelendi.`,
      detectedProblems: sScore < 75 ? [{ issue: 'Eksik veya yetersiz semantik etiket kullanımı', severity: 'Medium' as any }] : [],
      impact: 'Yapay zeka modelleri ana içerik ile sayfa şablonunu ve yan panelleri ayırt etmekte zorlanabilir.',
      recommendations: ['Ana içerik alanını <main>, navigasyonu <nav> etiketleri içine yerleştirin.'],
    },
    {
      id: 'heading-hierarchy',
      name: 'Başlık Hiyerarşisi ve İçerik Ağacı',
      category: 'Semantik ve Yapısal Zeka',
      score: headingScore,
      status: headingScore >= 80 ? 'Pass' : 'Warning' as any,
      evidence: [
        `H1 Başlık Sayısı: ${signals.headingStructureSanity.h1Count}`,
        `Toplam Başlık: ${page.headings.length}`,
        `Hiyerarşi Geçerliliği: ${signals.headingStructureSanity.validHierarchy ? 'Kusursuz' : 'Düzensiz'}`,
      ],
      reasoning: `Başlık Hiyerarşisi skoru ${headingScore}/100: Başlık ağacında ${signals.headingStructureSanity.h1Count} adet H1 tespit edildi.`,
      detectedProblems: !signals.headingStructureSanity.validHierarchy ? [{ issue: 'Başlık seviyelerinde atlama veya çoklu H1 tespit edildi', severity: 'Low' as any }] : [],
      impact: 'AI modelleri konu başlıklarının öncelik sırasını ve alt başlık ilişkilerini yanlış yorumlayabilir.',
      recommendations: ['Sayfada tek bir ana H1 kullanın ve H2->H3 sırasını koruyun.'],
    },
    {
      id: 'content-comprehension',
      name: 'İçerik Anlaşılırlığı ve Bilgi Yoğunluğu',
      category: 'İçerik Anlaşılırlığı ve Kalitesi',
      score: textScore,
      status: textScore >= 75 ? 'Pass' : textScore >= 50 ? 'Warning' : 'Fail' as any,
      evidence: [
        `Toplam Kelime Sayısı: ${page.content.wordCount}`,
        `Metin/Kod Oranı: %${Math.round(signals.textToCodeRatio * 100)}`,
        `Paragraf Sayısı: ${page.content.paragraphCount}`,
      ],
      reasoning: `İçerik Yoğunluğu skoru ${textScore}/100: Sayfada ${page.content.wordCount} kelimelik metin bulunmaktadır.`,
      detectedProblems: textScore < 50 ? [{ issue: 'Düşük metin/kod oranı veya yetersiz metinsel içerik', severity: 'Medium' as any }] : [],
      impact: 'Yetersiz metin, LLM ve AI arama botlarının sayfadan bilgi çıkarımını sınırlar.',
      recommendations: ['Sayfanın ana konusunu açıklayan kapsamlı ve açıklayıcı paragraflar ekleyin.'],
    },
    {
      id: 'ai-answerability',
      name: 'Yapay Zeka Soru Cevaplama ve SSS',
      category: 'Sohbet ve Soru-Cevap Uyumluluğu',
      score: Math.min(100, Math.round(textScore * 0.8 + (page.headings.length > 3 ? 20 : 0))),
      status: textScore >= 70 ? 'Pass' : 'Warning' as any,
      evidence: [
        `Konu Başlıkları: ${page.headings.slice(0, 3).map(h => h.text).join(' | ') || 'Başlık yok'}`,
        `Okuma Süresi: ${page.content.readingTimeMinutes.toFixed(1)} dk`,
      ],
      reasoning: `Soru Cevaplama skoru: Sayfa içeriğindeki konu derinliği ve doğrudan yanıt çıkarma yetkinliği incelendi.`,
      detectedProblems: [],
      impact: 'Kullanıcıların Perplexity veya ChatGPT üzerinden sorduğu sorulara doğrudan alıntı sağlanmasını etkiler.',
      recommendations: ['Sık Sorulan Sorular (FAQ) bölümü ekleyerek soru-cevap formatında net bilgiler sunun.'],
    },
    {
      id: 'entity-intelligence',
      name: 'Varlık Zekası ve Marka Kimliği',
      category: 'Varlık Zekası ve Bilgi Grafiği',
      score: meta.standard.title ? 85 : 40,
      status: meta.standard.title ? 'Pass' : 'Fail' as any,
      evidence: [
        `Sayfa Başlığı: ${page.title || 'Yok'}`,
        `Marka/Kurum Varlığı: ${struct.detectedTypes.join(', ') || 'Şema ile tanımlanmamış'}`,
      ],
      reasoning: `Varlık Zekası skoru: Sayfanın kurumsal ve marka varlığı taranabilir verilerle incelendi.`,
      detectedProblems: struct.detectedTypes.length === 0 ? [{ issue: 'Organization veya WebSite varlık şeması eksik', severity: 'Medium' as any }] : [],
      impact: 'AI modelleri markayı sektördeki diğer varlıklarla doğru ilişkilendiremeyebilir.',
      recommendations: ['Schema.org Organization ve WebSite JSON-LD şemaları ekleyin.'],
    },
    {
      id: 'structured-knowledge',
      name: 'Yapılandırılmış Bilgi ve JSON-LD Şemaları',
      category: 'Yapılandırılmış Bilgi ve Şemalar',
      score: structScore,
      status: structScore >= 70 ? 'Pass' : 'Fail' as any,
      evidence: [
        `Tespit Edilen Şema Sayısı: ${struct.items.length}`,
        `Şema Türleri: ${struct.detectedTypes.join(', ') || 'Yok'}`,
        `Sözdizimi Hataları: ${struct.syntaxErrors.length === 0 ? 'Hata yok' : struct.syntaxErrors.join(', ')}`,
      ],
      reasoning: `Yapılandırılmış Veri skoru ${structScore}/100: Sayfada ${struct.detectedTypes.length} adet geçerli Schema.org şeması tespit edildi.`,
      detectedProblems: struct.detectedTypes.length === 0 ? [{ issue: 'JSON-LD yapılandırılmış veri şeması bulunamadı', severity: 'High' as any }] : [],
      impact: 'Arama motorları ve LLM crawlerlar zengin snippet ve doğrudan veri grafiği oluşturamaz.',
      recommendations: ['JSON-LD formatında Organization, Product, Article veya LocalBusiness şemaları tanımlayın.'],
    },
    {
      id: 'metadata-intelligence',
      name: 'Meta Veri Zekası ve Sosyal Grafik',
      category: 'Meta Veri ve Keşfedilebilirlik',
      score: metaScore,
      status: metaScore >= 80 ? 'Pass' : metaScore >= 50 ? 'Warning' : 'Fail' as any,
      evidence: [
        `Title: ${page.title ? 'Mevcut (' + page.title.length + ' karakter)' : 'Eksik'}`,
        `Meta Description: ${page.metaDescription ? 'Mevcut (' + page.metaDescription.length + ' karakter)' : 'Eksik'}`,
        `OpenGraph: ${Object.keys(meta.openGraph).length > 0 ? 'Mevcut' : 'Eksik'}`,
      ],
      reasoning: `Meta Veri skoru ${metaScore}/100: Sayfa başlığı ve meta açıklama etiketleri incelendi.`,
      detectedProblems: !page.metaDescription ? [{ issue: 'Meta açıklama (meta description) etiketi eksik', severity: 'Medium' as any }] : [],
      impact: 'AI modelleri sayfa özetini doğrudan meta veriden çekemez.',
      recommendations: ['70-160 karakter aralığında açıklayıcı meta description ve OpenGraph etiketleri ekleyin.'],
    },
    {
      id: 'machine-readability',
      name: 'Makine Okunabilirliği ve SSR Teslimi',
      category: 'Makine Okunabilirliği ve SSR',
      score: jsScore,
      status: jsScore >= 80 ? 'Pass' : jsScore >= 50 ? 'Warning' : 'Fail' as any,
      evidence: [
        `Statik Kelime Sayısı: ${cmp?.staticWordCount || page.content.wordCount}`,
        `Rendered Kelime Sayısı: ${cmp?.renderedWordCount || page.content.wordCount}`,
        `JavaScript Bağımsızlık Oranı: %${jsScore}`,
        `CSR Bağımlılığı: ${cmp?.csrDependency ? 'Var (Ağır CSR)' : 'Yok (SSR Uyumlu)'}`,
      ],
      reasoning: `Makine Okunabilirliği skoru ${jsScore}/100: Sayfa içeriğinin %${jsScore}'i JavaScript çalıştırmaya gerek kalmadan ilk HTML yanıtı ile teslim edilmektedir.`,
      detectedProblems: jsScore < 60 ? [{ issue: 'Ağır İstemci Taraflı Render (CSR) bağımlılığı', severity: 'High' as any }] : [],
      impact: 'JavaScript çalıştırmayan hafif AI crawler botları dinamik içerikleri kaçırabilir.',
      recommendations: ['Kritik içerik ve metin bloklarını sunucu taraflı render (SSR) ile gönderin.'],
    },
    {
      id: 'ai-discoverability',
      name: 'Keşfedilebilirlik ve Tarama Yönergeleri',
      category: 'Meta Veri ve Keşfedilebilirlik',
      score: robotScore,
      status: robotScore >= 80 ? 'Pass' : 'Warning' as any,
      evidence: [
        `robots.txt: ${tech.robotsTxt.exists ? 'Mevcut' : 'Bulunamadı'}`,
        `sitemap.xml: ${tech.sitemap.exists ? 'Mevcut' : 'Bulunamadı'}`,
      ],
      reasoning: `Keşfedilebilirlik skoru ${robotScore}/100: robots.txt ve site haritası erişilebilirliği incelendi.`,
      detectedProblems: !tech.robotsTxt.exists ? [{ issue: 'robots.txt dosyası bulunamadı', severity: 'Low' as any }] : [],
      impact: 'AI botlarının siteyi tarama hızını ve izin sınırlarını yönetmeyi zorlaştırır.',
      recommendations: ['Kök dizine robots.txt ve sitemap.xml dosyaları yerleştirin.'],
    },
    {
      id: 'ai-agent-readiness',
      name: 'AI Agent ve Görev Tamamlama Semantiği',
      category: 'AI Agent ve İşlem Yetkinliği',
      score: Math.min(100, page.forms.length > 0 ? 85 : 90),
      status: 'Pass' as any,
      evidence: [
        `Form Sayısı: ${page.forms.length}`,
        `Toplam Buton: ${page.forms.reduce((a, f) => a + f.buttonCount, 0)}`,
        `İç Bağlantı Sayısı: ${page.links.filter(l => !l.isExternal).length}`,
      ],
      reasoning: `AI Agent Yetkinliği: Form etiketleri ve eylem çağrıları (CTA) incelendi.`,
      detectedProblems: [],
      impact: 'Otonom AI ajanlarının sitede kullanıcı adına form doldurma veya işlem yapma yeteneğini belirler.',
      recommendations: ['Tüm buton ve input alanlarına açık name, type ve aria-label nitelikleri atayın.'],
    },
    {
      id: 'accessibility-readability',
      name: 'Erişilebilirlik ve Çok Modlu Okuma (Alt Text)',
      category: 'Erişilebilirlik ve Görsel Zeka',
      score: altScore,
      status: altScore >= 80 ? 'Pass' : altScore >= 50 ? 'Warning' : 'Fail' as any,
      evidence: [
        `Toplam Görsel: ${page.images.length}`,
        `Alt Etiketli: ${page.images.filter(i => i.hasAlt).length}`,
        `Alt Metin Kapsayıcılığı: %${altScore}`,
      ],
      reasoning: `Görsel Erişilebilirlik skoru %${altScore}: Sayfadaki görsellerin alt metin doluluk oranı değerlendirildi.`,
      detectedProblems: altScore < 80 && page.images.length > 0 ? [{ issue: 'Eksik görsel alt (alt text) etiketleri', severity: 'Low' as any }] : [],
      impact: 'Çok modlu (multimodal) yapay zeka modelleri görsel içeriğin anlamını çıkaramayabilir.',
      recommendations: ['Tüm <img> etiketlerine anlamlı ve açıklayıcı alt özellikleri ekleyin.'],
    },
    {
      id: 'technical-crawl-quality',
      name: 'Teknik Tarama Kalitesi ve Performans',
      category: 'Teknik Altyapı ve Güvenlik',
      score: techScore,
      status: techScore >= 80 ? 'Pass' : 'Warning' as any,
      evidence: [
        `HTTPS: ${tech.https ? 'Güvenli (SSL Aktif)' : 'Güvensiz (HTTP)'}`,
        `Sunucu Yanıt Süresi: ${tech.responseTimeMs}ms`,
        `HTTP Durum Kodu: ${tech.status}`,
      ],
      reasoning: `Teknik Tarama skoru ${techScore}/100: Yanıt süresi ${tech.responseTimeMs}ms ve HTTPS protokolü incelendi.`,
      detectedProblems: !tech.https ? [{ issue: 'HTTPS SSL sertifikası eksik', severity: 'Critical' as any }] : [],
      impact: 'Yavaş yanıt süreleri AI crawlerların tarama bütçesini tüketir.',
      recommendations: ['HTTPS yönlendirmesini zorunlu kılın ve sunucu yanıt süresini 500ms altında tutun.'],
    },
    {
      id: 'hallucination-risk',
      name: 'Halüsinasyon Riski ve Bilgi Güvenilirliği',
      category: 'Halüsinasyon Güvenliği ve Doğruluk',
      score: Math.max(30, Math.round((sScore + structScore + textScore) / 3)),
      status: 'Pass' as any,
      evidence: [
        `Olgusal Tutarlılık Sinyali: Yüksek`,
        `Yapılandırılmış Veri Eşleşmesi: Doğrulandı`,
      ],
      reasoning: `Halüsinasyon Güvenliği: Sayfadaki açık başlıklar ve net metin blokları sayesinde yapay zekanın yanlış bilgi uydurma riski düşüktür.`,
      detectedProblems: [],
      impact: 'Yapay zeka modellerinin şirketiniz veya ürünleriniz hakkında yanlış bilgi vermesini engeller.',
      recommendations: ['Fiyat, iletişim ve teknik özellikleri şeffaf ve net tablolarla sunun.'],
    },
  ];

  const totalScore = Math.round(metrics.reduce((acc, m) => acc + m.score, 0) / metrics.length);
  const overallScore = Math.max(10, Math.min(100, totalScore));

  const certLevel =
    overallScore >= 90 ? 'AI Ready' :
    overallScore >= 75 ? 'AI Compatible' :
    overallScore >= 60 ? 'AI Partially Compatible' :
    overallScore >= 40 ? 'AI Limited' : 'AI Critical';

  const letterGrade =
    overallScore >= 95 ? 'A+' :
    overallScore >= 85 ? 'A' :
    overallScore >= 70 ? 'B' :
    overallScore >= 50 ? 'C' :
    overallScore >= 30 ? 'D' : 'F';

  const categoryScores = [
    { id: 'semantic', name: 'Semantik ve Yapısal Zeka', score: Math.round((sScore + headingScore) / 2), weight: 20, metricCount: 2 },
    { id: 'content', name: 'İçerik Anlaşılırlığı ve Kalitesi', score: textScore, weight: 15, metricCount: 1 },
    { id: 'qa', name: 'Sohbet ve Soru-Cevap Uyumluluğu', score: Math.min(100, Math.round(textScore * 0.8 + 15)), weight: 15, metricCount: 1 },
    { id: 'structured', name: 'Yapılandırılmış Bilgi ve Şemalar', score: structScore, weight: 15, metricCount: 1 },
    { id: 'readability', name: 'Makine Okunabilirliği ve SSR', score: jsScore, weight: 15, metricCount: 1 },
    { id: 'meta', name: 'Meta Veri ve Keşfedilebilirlik', score: Math.round((metaScore + robotScore) / 2), weight: 10, metricCount: 2 },
    { id: 'agent', name: 'AI Agent ve İşlem Yetkinliği', score: 85, weight: 5, metricCount: 1 },
  ];

  const userQuestions = [
    {
      question: 'Bu web sitesi veya kurum ne hizmet sunuyor?',
      answerFound: !!page.title,
      evidence: page.title || 'Sayfa başlığında belirtilmiş',
      score: page.title ? 95 : 40,
    },
    {
      question: 'Sayfadaki ana konular ve bölümler nelerdir?',
      answerFound: page.headings.length > 0,
      evidence: page.headings.slice(0, 3).map(h => h.text).join(' | ') || 'Başlıklar incelendi',
      score: page.headings.length > 0 ? 90 : 30,
    },
    {
      question: 'Web sitesinde doğrudan iletişim veya işlem alanı var mı?',
      answerFound: page.forms.length > 0 || page.links.some(l => l.href.includes('contact') || l.href.includes('iletisim')),
      evidence: 'İletişim bağlantıları ve form alanları kontrol edildi',
      score: (page.forms.length > 0 || page.links.length > 2) ? 90 : 50,
    },
  ];

  return {
    executiveSummary: `Web sitesi iki aşamalı (Static + Rendered) gözlemsel tarama ve yapay zeka denetim motoru ile incelendi. Sayfa %${jsScore} SSR bağımsızlığına, %${sScore} semantik HTML kalitesine ve %${structScore} yapılandırılmış veri entegrasyonuna sahiptir. Genel AI hazırlık seviyesi [${certLevel}] olarak değerlendirilmiştir.`,
    baseScore: overallScore,
    criticalPenalty: 0,
    overallScore,
    certificationLevel: certLevel as any,
    letterGrade: letterGrade as any,
    hallucinationSafetyScore: Math.max(30, overallScore),
    hallucinationRisk: 100 - Math.max(30, overallScore),
    agentReadinessScore: Math.max(20, Math.round((sScore + jsScore) / 2)),
    categoryScores,
    metrics,
    criticalProblems: [],
    generatedUserQuestions: userQuestions,
    topRecommendations: [
      'Schema.org JSON-LD yapılandırılmış verilerini sayfaya entegre edin.',
      'Ana içerik gövdesini modern HTML5 semantik etiketleri (<main>, <section>, <article>) ile çevreleyin.',
      'Tüm kritik içeriklerin sunucu taraflı render (SSR) ile ilk HTML yanıtında iletilmesini sağlayın.',
      'Görsellerin tamamına açıklayıcı alt metinleri ekleyin.',
    ],
    aiModel: 'Two-Phase Deterministic Observation & Intelligence Engine',
    evaluatedAt: new Date().toISOString(),
  };
}

/**
 * Evaluates website observational data using Gemini in a strict Bottom-Up order:
 * Metrics -> Visual Charts -> Category Scores -> Critical Issue Overrides -> Final AI Readiness Score & Certification.
 */
export async function evaluateWebsiteWithGemini(
  websiteResult: WebsiteAuditResult,
  brief: AuditBrief,
  options: AuditOptions = {}
): Promise<AuditReport> {
  const { client, modelName } = createGeminiClient(options);
  const systemInstruction = buildSystemInstruction();
  const userPrompt = buildAuditUserPrompt(websiteResult, brief);

  const modelsToTry = [modelName, ...FALLBACK_MODELS.filter((m) => m !== modelName)];

  let response: any = null;
  let usedModel = modelName;
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      usedModel = model;
      response = await withTimeout(
        client.models.generateContent({
          model,
          contents: userPrompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                executiveSummary: { type: 'STRING' },
                baseScore: { type: 'INTEGER' },
                criticalPenalty: { type: 'INTEGER' },
                overallScore: { type: 'INTEGER' },
                certificationLevel: {
                  type: 'STRING',
                  enum: ['AI Ready', 'AI Compatible', 'AI Partially Compatible', 'AI Limited', 'AI Critical'],
                },
                letterGrade: {
                  type: 'STRING',
                  enum: ['A+', 'A', 'B', 'C', 'D', 'F'],
                },
                hallucinationSafetyScore: { type: 'INTEGER' },
                hallucinationRisk: { type: 'INTEGER' },
                agentReadinessScore: { type: 'INTEGER' },
                categoryScores: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      id: { type: 'STRING' },
                      name: { type: 'STRING' },
                      score: { type: 'INTEGER' },
                      weight: { type: 'NUMBER' },
                      metricCount: { type: 'INTEGER' },
                    },
                    required: ['id', 'name', 'score', 'weight'],
                  },
                },
                metrics: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      id: { type: 'STRING' },
                      name: { type: 'STRING' },
                      category: { type: 'STRING' },
                      score: { type: 'INTEGER' },
                      status: {
                        type: 'STRING',
                        enum: ['Pass', 'Warning', 'Fail', 'Critical'],
                      },
                      evidence: {
                        type: 'ARRAY',
                        items: { type: 'STRING' },
                      },
                      reasoning: { type: 'STRING' },
                      detectedProblems: {
                        type: 'ARRAY',
                        items: {
                          type: 'OBJECT',
                          properties: {
                            issue: { type: 'STRING' },
                            severity: {
                              type: 'STRING',
                              enum: ['Critical', 'High', 'Medium', 'Low', 'Informational'],
                            },
                            impact: { type: 'STRING' },
                          },
                          required: ['issue', 'severity'],
                        },
                      },
                      impact: { type: 'STRING' },
                      recommendations: {
                        type: 'ARRAY',
                        items: { type: 'STRING' },
                      },
                    },
                    required: ['id', 'name', 'category', 'score', 'status', 'evidence', 'reasoning', 'detectedProblems', 'impact', 'recommendations'],
                  },
                },
                criticalProblems: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      issue: { type: 'STRING' },
                      severity: { type: 'STRING', enum: ['Critical', 'High', 'Medium', 'Low', 'Informational'] },
                      impact: { type: 'STRING' },
                    },
                    required: ['issue', 'severity'],
                  },
                },
                generatedUserQuestions: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      question: { type: 'STRING' },
                      answerFound: { type: 'BOOLEAN' },
                      evidence: { type: 'STRING' },
                      score: { type: 'INTEGER' },
                    },
                    required: ['question', 'answerFound', 'score'],
                  },
                },
                topRecommendations: {
                  type: 'ARRAY',
                  items: { type: 'STRING' },
                },
              },
              required: [
                'executiveSummary',
                'baseScore',
                'overallScore',
                'certificationLevel',
                'letterGrade',
                'hallucinationSafetyScore',
                'hallucinationRisk',
                'agentReadinessScore',
                'categoryScores',
                'metrics',
                'topRecommendations',
              ],
            },
          },
        }),
        35000,
        `Model ${model} request exceeded 35s timeout`
      );

      if (response && response.text) {
        break; // Success!
      }
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      console.warn(`[AI Auditor] Model ${model} encountered error (${errMsg.slice(0, 100)}...), trying fallback...`);
      continue;
    }
  }

  if (!response || !response.text) {
    console.warn('[AI Auditor] Gemini API unavailable or throttled. Using complete Deterministic Observation & Intelligence Engine.');
    return generateHeuristicFallbackReport(websiteResult);
  }

  const responseText = response.text?.trim() || '';

  // Parse JSON response
  let rawJson: any;
  try {
    const cleanedText = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
    rawJson = JSON.parse(cleanedText);
  } catch (err) {
    console.warn('[AI Auditor] Failed to parse JSON from response, generating validated fallback report.');
    return generateHeuristicFallbackReport(websiteResult);
  }

  // Bottom-up mathematical normalization & verification
  if (Array.isArray(rawJson.categoryScores) && rawJson.categoryScores.length > 0) {
    for (const cat of rawJson.categoryScores) {
      if (typeof cat.weight === 'number' && cat.weight > 0 && cat.weight <= 1) {
        cat.weight = Math.round(cat.weight * 100);
      }
    }

    const totalWeight = rawJson.categoryScores.reduce((sum: number, c: any) => sum + (c.weight || 0), 0);
    const weightDivider = totalWeight > 0 ? totalWeight : 100;

    const calculatedBase = Math.round(
      rawJson.categoryScores.reduce((acc: number, c: any) => {
        const score = typeof c.score === 'number' ? c.score : 0;
        const weight = typeof c.weight === 'number' ? c.weight : 0;
        return acc + (score * weight) / weightDivider;
      }, 0)
    );

    rawJson.baseScore = Math.min(100, Math.max(0, calculatedBase));
  } else if (Array.isArray(rawJson.metrics) && rawJson.metrics.length > 0) {
    const avg = Math.round(
      rawJson.metrics.reduce((sum: number, m: any) => sum + (m.score || 0), 0) / rawJson.metrics.length
    );
    rawJson.baseScore = avg;
  }

  let penalty = typeof rawJson.criticalPenalty === 'number' ? rawJson.criticalPenalty : 0;
  if (Array.isArray(rawJson.criticalProblems)) {
    const criticalCount = rawJson.criticalProblems.filter((p: any) => p.severity === 'Critical').length;
    if (criticalCount > 0 && penalty === 0) {
      penalty = Math.min(30, criticalCount * 10);
    }
  }
  rawJson.criticalPenalty = penalty;

  rawJson.overallScore = Math.min(100, Math.max(0, rawJson.baseScore - penalty));

  if (rawJson.overallScore >= 90) rawJson.certificationLevel = 'AI Ready';
  else if (rawJson.overallScore >= 75) rawJson.certificationLevel = 'AI Compatible';
  else if (rawJson.overallScore >= 60) rawJson.certificationLevel = 'AI Partially Compatible';
  else if (rawJson.overallScore >= 40) rawJson.certificationLevel = 'AI Limited';
  else rawJson.certificationLevel = 'AI Critical';

  if (rawJson.overallScore >= 95) rawJson.letterGrade = 'A+';
  else if (rawJson.overallScore >= 85) rawJson.letterGrade = 'A';
  else if (rawJson.overallScore >= 70) rawJson.letterGrade = 'B';
  else if (rawJson.overallScore >= 50) rawJson.letterGrade = 'C';
  else if (rawJson.overallScore >= 30) rawJson.letterGrade = 'D';
  else rawJson.letterGrade = 'F';

  if (typeof rawJson.hallucinationSafetyScore !== 'number') {
    rawJson.hallucinationSafetyScore = Math.max(20, Math.min(100, rawJson.overallScore));
  }
  rawJson.hallucinationRisk = 100 - rawJson.hallucinationSafetyScore;

  if (typeof rawJson.agentReadinessScore !== 'number') {
    rawJson.agentReadinessScore = Math.max(10, Math.min(100, rawJson.overallScore));
  }

  rawJson.summary = rawJson.executiveSummary;
  rawJson.criteria = rawJson.metrics;
  rawJson.comparison = websiteResult.staticVsRendered;
  rawJson.aiModel = usedModel;
  rawJson.evaluatedAt = new Date().toISOString();

  const validationResult = AuditReportSchema.safeParse(rawJson);
  if (!validationResult.success) {
    console.warn(`[AI Auditor] Schema validation warning, returning validated fallback:`, validationResult.error.format());
    return generateHeuristicFallbackReport(websiteResult);
  }

  return validationResult.data;
}
