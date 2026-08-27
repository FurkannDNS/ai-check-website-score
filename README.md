# AI Website Auditor — LLM & Autonomous AI Agent Evaluation Platform

<div align="center">
  <h3>İki Aşamalı Tarama & Google Gemini Destekli Web Sitesi AI Uyumluluk Denetim Platformu</h3>
  <p>Measure and optimize how effectively Large Language Models (LLMs), AI Search Engines (Perplexity, SearchGPT, Gemini), and autonomous AI agents can crawl, comprehend, extract structured information, and perform actions on your website.</p>
</div>

---

## 🚀 Temel Özellikler / Key Features

- ⚡ **İki Aşamalı Tarama Motoru (Two-Phase Crawling Engine):**
  - **Faz 1 (Statik HTTP Crawl):** Hızlı, hafif botların ve temel AI crawler'ların gördüğü ilk HTML yanıtını inceler.
  - **Faz 2 (Rendered Browser Crawl):** Playwright Chromium headless tarayıcısı ile JavaScript ve SPA/CSR içeriklerini render eder, konsol hatalarını yakalar.
  - **DOM Delta Karşılaştırma:** Kelime, başlık, bağlantı, görsel ve yapılandırılmış veri farklarını ve JavaScript bağımlılık (SSR Uyumu) skorunu hesaplar.

- 🤖 **Gemini AI Destekli Aşağıdan-Yukarıya Puanlama (Bottom-Up Evaluation):**
  - 13-16 temel değerlendirme boyutu ve 8 ana kategori üzerinden her bir metriğe özel:
    - Segmentli Dairesel Halka Grafiği (Segmented Donut Radial Gauge)
    - Somut Kanıtlar (Evidence & Quotes)
    - Skor Gerekçesi & Detaylı Analiz
    - Tespit Edilen Sorunlar (`Critical`, `High`, `Medium`, `Low`)
    - Aksiyonel İyileştirme Tavsiyeleri

- 🛡️ **Kritik İhlal & Halüsinasyon Güvenliği (Hallucination Safety & Penalty Engine):**
  - robots.txt engellemeleri, meta noindex, ağır CSR bağımlılığı veya bilgi eksikliklerinde orantılı ceza puanları düşürülür.
  - Halüsinasyon Güvenliği ve AI Agent Hazırlık oranları şeffaf bir formülle sunulur:
    Final Skor = max(0, Temel Skor - Kritik Cezalar)

- 🏆 **Yönetici Özeti & Sertifikasyon (Executive AI Readiness Certification):**
  - `[ AI Ready ]` (90-100), `[ AI Compatible ]` (75-89), `[ AI Partially Compatible ]` (60-74), `[ AI Limited ]` (<60).
  - Sayfa sonunda yer alan büyük dairesel skor kartı ve net yönetici yorumu.

- 💬 **Domain Odaklı Soru-Cevap Simülatörü (Q&A Benchmark):**
  - AI ajanlarının sitenizden ürün, hizmet, iletişim ve fiyatlandırma bilgilerini doğrudan cevaplayabilme başarımı.

- 🔒 **Kurumsal Güvenlik & SSRF Koruması:**
  - Özel IP aralıkları (127.0.0.1, 10.0.0.0/8, 192.168.0.0/16 vb.), metadata servisleri ve tehlikeli portlara karşı katı DNS çözümleme ve IP doğrulama kalkanı.

---

## 📦 Proje Mimarisi / Monorepo Architecture

```
tool/
├── apps/
│   ├── api/          # Hono.js REST API Sunucusu & İnteraktif Web Arayüzü (Port 3030)
│   └── demo-site/    # Test & Doğrulama için Hazır Mock Web Sitesi (Port 4321)
├── packages/
│   ├── ai/           # Google Gemini AI Değerlendirme & Fallback Motoru
│   ├── audit/        # CLI & Kapsamlı Denetim Yürütme Pipeline'ı
│   ├── shared/       # Zod Şemaları, Tipler ve Paylaşılan Sabitler
│   └── website-tool/ # Güvenli Fetcher, SSRF Guard, Playwright Crawler & DOM Extractor
```

---

## 🛠️ Kurulum & Çalıştırma / Quick Start

### 1. Bağımlılıkları Yükleyin
```bash
pnpm install
```

### 2. Ortam Değişkenlerini Tanımlayın
`.env.example` dosyasını `.env` olarak kopyalayın ve Gemini API anahtarınızı girin:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=3030
```

### 3. Projeyi Derleyin & Testleri Çalıştırın
```bash
pnpm build
pnpm test
```

### 4. Web Arayüzü & API Sunucusunu Başlatın
```bash
pnpm run start:api
```
Tarayıcınızda açın: 👉 **`http://localhost:3030`**

### 5. CLI Üzerinden Doğrudan Denetim Yapın
```bash
# Hızlı Statik Denetim
pnpm run audit https://example.com

# İki Aşamalı Rendered & AI Destekli Denetim
pnpm run audit:ai https://example.com

# Yerel Test Siteleri için (--allow-local)
pnpm run audit:ai http://localhost:4321 --allow-local
```

---

## 🧪 Test Kapsamı

Proje **Vitest** ile kapsamlı şekilde test edilmiştir (SSRF Koruması, HTML/Metadata çıkarımı, JSON-LD şemaları, İki Aşamalı Tarama ve Hono API uç noktaları dahil 38 testin tamamı geçmektedir).

```bash
pnpm test
```

---

## 📄 Lisans / License
MIT License (c) 2026 Furkan
