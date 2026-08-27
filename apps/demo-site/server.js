import http from 'node:http';
import pc from 'picocolors';

const PORT = parseInt(process.env.DEMO_PORT || process.env.PORT || '4321', 10);

const GOOD_SEO_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NexusAI Studio - Enterprise AI Agent Management Platform</title>
  <meta name="description" content="Build, orchestrate, and audit autonomous AI workflows with enterprise-grade observability and zero vendor lock-in.">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="http://localhost:${PORT}/">

  <!-- OpenGraph Metadata -->
  <meta property="og:title" content="NexusAI Studio - Enterprise AI Platform">
  <meta property="og:description" content="Build and audit autonomous AI workflows with enterprise observability.">
  <meta property="og:image" content="http://localhost:${PORT}/images/og-cover.png">
  <meta property="og:type" content="website">
  <meta property="og:url" content="http://localhost:${PORT}/">
  <meta property="og:site_name" content="NexusAI Studio">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="NexusAI Studio - Enterprise AI Platform">
  <meta name="twitter:description" content="Build and audit autonomous AI workflows with enterprise observability.">
  <meta name="twitter:image" content="http://localhost:${PORT}/images/twitter-cover.png">

  <!-- JSON-LD Structured Data: Organization, WebSite & Product -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "http://localhost:${PORT}/#organization",
        "name": "NexusAI Technologies Inc.",
        "url": "http://localhost:${PORT}",
        "logo": "http://localhost:${PORT}/logo.png",
        "sameAs": [
          "https://twitter.com/nexusai",
          "https://github.com/nexusai"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "http://localhost:${PORT}/#website",
        "url": "http://localhost:${PORT}",
        "name": "NexusAI Studio",
        "publisher": {
          "@id": "http://localhost:${PORT}/#organization"
        }
      },
      {
        "@type": "Product",
        "name": "NexusAI Studio Pro",
        "description": "Enterprise autonomous AI agent orchestration platform.",
        "brand": {
          "@type": "Brand",
          "name": "NexusAI"
        },
        "offers": {
          "@type": "Offer",
          "price": "99.00",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        }
      }
    ]
  }
  </script>

  <style>
    :root {
      --bg: #090d16;
      --card: #131b2e;
      --text: #f1f5f9;
      --muted: #94a3b8;
      --primary: #6366f1;
      --accent: #10b981;
    }
    body {
      margin: 0;
      font-family: system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
    }
    header {
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    nav a {
      color: var(--muted);
      text-decoration: none;
      margin-left: 1.5rem;
      font-weight: 500;
    }
    nav a:hover { color: var(--text); }
    main {
      max-width: 900px;
      margin: 0 auto;
      padding: 3rem 1.5rem;
    }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: rgba(99, 102, 241, 0.2);
      color: #818cf8;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    h1 { font-size: 2.75rem; margin: 0 0 1rem 0; line-height: 1.2; }
    h2 { font-size: 1.8rem; margin-top: 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; }
    h3 { font-size: 1.3rem; margin-top: 1.5rem; }
    p { color: var(--muted); font-size: 1.1rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-top: 1.5rem; }
    .card { background: var(--card); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.5rem; }
    .cta-box { background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(16,185,129,0.15)); border: 1px solid rgba(99,102,241,0.3); border-radius: 16px; padding: 2rem; margin-top: 3rem; text-align: center; }
    button { background: var(--primary); color: white; border: none; padding: 0.75rem 1.5rem; font-size: 1rem; font-weight: 600; border-radius: 8px; cursor: pointer; }
    footer { border-top: 1px solid rgba(255,255,255,0.1); padding: 2rem; text-align: center; color: var(--muted); font-size: 0.9rem; margin-top: 4rem; }
  </style>
</head>
<body>
  <header>
    <div style="font-weight: 700; font-size: 1.25rem;">✨ NexusAI</div>
    <nav>
      <a href="/">Home</a>
      <a href="/features">Features</a>
      <a href="/pricing">Pricing</a>
      <a href="/poor-seo" style="color: #f87171;">Switch to Poor SEO Page</a>
    </nav>
  </header>

  <main>
    <span class="badge">Next-Gen AI Orchestration</span>
    <h1>NexusAI Studio: Enterprise AI Agent Platform</h1>
    <p>
      NexusAI Studio provides an enterprise-ready control plane for deploying, monitoring, and evaluating autonomous AI agents at scale. Connect your LLMs with deep structured toolsets, deterministic guardrails, and real-time observability.
    </p>

    <section>
      <h2>Core Platform Capabilities</h2>
      <p>Empower your engineering teams with structured workflows that eliminate hallucination risks and enforce rigorous compliance boundaries across mission-critical services.</p>
      
      <div class="grid">
        <article class="card">
          <h3>Deterministic Tool Calling</h3>
          <p>Integrate with standard API endpoints and MCP servers with strict schema validation and error recovery pipelines.</p>
        </article>
        <article class="card">
          <h3>Autonomous Agent Sandbox</h3>
          <p>Safely run browser agents, code interpreters, and data extractors in isolated, low-latency micro-containers.</p>
        </article>
        <article class="card">
          <h3>Real-time Semantic Auditing</h3>
          <p>Evaluate input/output safety, context token usage, and latency metrics with comprehensive telemetry.</p>
        </article>
      </div>
    </section>

    <section>
      <h2>Supported Frameworks & Infrastructure</h2>
      <p>NexusAI runs natively on Node.js, Cloudflare Workers, Docker, and Kubernetes with sub-millisecond cold starts and unified TypeScript SDKs.</p>
      <img src="http://localhost:${PORT}/images/architecture.png" alt="NexusAI Autonomous Agent Architecture Diagram" width="800" height="400" style="max-width:100%; height:auto; border-radius:8px; border:1px solid rgba(255,255,255,0.1);">
    </section>

    <section class="cta-box">
      <h2>Ready to Supercharge Your AI Workflows?</h2>
      <p>Get started with our free developer tier or request an enterprise demo.</p>
      <form action="/subscribe" method="POST" style="display:flex; justify-content:center; gap:0.5rem; margin-top:1rem;">
        <input type="email" name="email" placeholder="Enter your work email" style="padding:0.75rem 1rem; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:#090d16; color:white; min-width:280px;" required>
        <button type="submit">Start Free Trial</button>
      </form>
    </section>
  </main>

  <footer>
    <p>© 2026 NexusAI Technologies Inc. All rights reserved. | <a href="/privacy" style="color:var(--muted)">Privacy Policy</a></p>
  </footer>
</body>
</html>
`;

const POOR_SEO_PAGE = `<!DOCTYPE html>
<html>
<head>
  <title>Test</title>
</head>
<body>
  <div>
    <div>Nav: <a href="/">Home</a></div>
    <div>Welcome to our site.</div>
    <div><img src="/img1.jpg"></div>
    <div>Click here to buy stuff.</div>
  </div>
</body>
</html>
`;

const ROBOTS_TXT = `User-agent: *
Disallow: /admin
Disallow: /api/private
Sitemap: http://localhost:${PORT}/sitemap.xml
`;

const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://localhost:${PORT}/</loc>
    <lastmod>2026-08-27</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>http://localhost:${PORT}/features</loc>
    <lastmod>2026-08-27</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
`;

const server = http.createServer((req, res) => {
  const url = req.url || '/';

  if (url === '/robots.txt') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(ROBOTS_TXT);
    return;
  }

  if (url === '/sitemap.xml') {
    res.writeHead(200, { 'Content-Type': 'application/xml' });
    res.end(SITEMAP_XML);
    return;
  }

  if (url === '/poor-seo') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(POOR_SEO_PAGE);
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(GOOD_SEO_PAGE);
});

server.listen(PORT, () => {
  console.log(pc.green(`\n🌐 Demo Test Website is running on: `) + pc.bold(pc.cyan(`http://localhost:${PORT}`)));
  console.log(pc.white(`\nTest Pages Available:`));
  console.log(pc.green(`  1. Perfect AI-Ready Page: `) + pc.cyan(`http://localhost:${PORT}/`));
  console.log(pc.yellow(`  2. Poor SEO Baseline Page: `) + pc.cyan(`http://localhost:${PORT}/poor-seo`));
  console.log(pc.gray(`  3. Robots.txt:             http://localhost:${PORT}/robots.txt`));
  console.log(pc.gray(`  4. Sitemap.xml:            http://localhost:${PORT}/sitemap.xml\n`));
  console.log(pc.bold(`To audit this local demo site, run in another terminal:`));
  console.log(pc.magenta(`  pnpm run audit http://localhost:${PORT} --allow-local`));
  console.log(pc.magenta(`  pnpm run audit:ai http://localhost:${PORT} --allow-local\n`));
});
