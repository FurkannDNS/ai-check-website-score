#!/usr/bin/env node
import { config } from 'dotenv';
import pc from 'picocolors';
import { AuditEngine } from './engine.js';
import { BriefManager } from './brief-manager.js';

// Load environment variables from .env file
config();

function renderProgressBar(score: number, width: number = 20): string {
  const filled = Math.round((score / 100) * width);
  const empty = Math.max(0, width - filled);
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  if (score >= 80) return pc.green(bar);
  if (score >= 60) return pc.yellow(bar);
  return pc.red(bar);
}

function renderComparisonBar(staticVal: number, renderedVal: number, width: number = 15): string {
  const max = Math.max(staticVal, renderedVal, 1);
  const sFilled = Math.round((staticVal / max) * width);
  const rFilled = Math.round((renderedVal / max) * width);
  return (
    `\n     Statik:   [${pc.cyan('█'.repeat(sFilled) + '░'.repeat(width - sFilled))}] ${staticVal}` +
    `\n     Rendered: [${pc.magenta('█'.repeat(rFilled) + '░'.repeat(width - rFilled))}] ${renderedVal}`
  );
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  let targetUrl = '';
  let enableAi = false;
  let jsonOutput = false;
  let briefPath = '';
  let modelName = process.env.GEMINI_MODEL;
  let allowLocal = process.env.ALLOW_LOCAL === 'true';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--ai') {
      enableAi = true;
    } else if (arg === '--json') {
      jsonOutput = true;
    } else if (arg === '--allow-local') {
      allowLocal = true;
    } else if (arg === '--brief' && i + 1 < args.length) {
      briefPath = args[++i];
    } else if (arg === '--model' && i + 1 < args.length) {
      modelName = args[++i];
    } else if (!arg.startsWith('-') && !targetUrl) {
      targetUrl = arg;
    }
  }

  if (!targetUrl) {
    console.error(pc.red('Hata: Hedef web sitesi URL adresi gereklidir.'));
    printHelp();
    process.exit(1);
  }

  if (enableAi && !process.env.GEMINI_API_KEY) {
    console.error(
      pc.yellow(
        '\nUyarı: GEMINI_API_KEY ortam değişkeni tanımlı değil. Yalnızca iki aşamalı gözlemsel veri toplanıyor...\n' +
        'Yapay zeka analizini aktif etmek için .env dosyasına GEMINI_API_KEY=anahtariniz ekleyin.\n'
      )
    );
    enableAi = false;
  }

  let customBrief;
  if (briefPath) {
    try {
      customBrief = await BriefManager.loadFromFile(briefPath);
    } catch (err: any) {
      console.error(pc.red(`Özel denetim brief dosyası yüklenemedi (${briefPath}): ${err.message}`));
      process.exit(1);
    }
  }

  if (!jsonOutput) {
    console.log(pc.cyan(`\n🔍 AI Website Intelligence Denetimi Başlatılıyor: `) + pc.bold(pc.white(targetUrl)));
    console.log(pc.gray(`⚙️  İki Aşamalı Tarama Motoru (Static HTTP + Headless Browser Chromium) devrede.`));
    if (enableAi) {
      console.log(pc.magenta(`🤖 Aşağıdan-Yukarıya (Bottom-Up) AI Değerlendirmesi Aktif (Model: `) + pc.bold(modelName || 'gemini-3.7-flash') + pc.magenta(`)`));
    }
    if (allowLocal) {
      console.log(pc.yellow(`🔓 Yerel/Localhost URL izinleri aktif (--allow-local)`));
    }
    console.log(pc.gray('─'.repeat(70)));
  }

  try {
    const result = await AuditEngine.run({
      url: targetUrl,
      enableAi,
      model: modelName,
      brief: customBrief,
      analyzerOptions: {
        allowLocal,
        enableRenderedCrawl: true,
      },
    });

    if (jsonOutput) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    const { website, audit } = result;

    if (!website.success) {
      console.log(pc.red(`\n✖ Web Sitesi Analizi Başarısız Oldu:`));
      for (const err of website.errors) {
        console.log(pc.red(`    [${err.code}] ${err.message} (aşama: ${err.phase})`));
      }
      process.exit(1);
    }

    // 1. Static vs Rendered Comparison Section
    console.log(pc.bold(pc.cyan(`\n📊 1. İKİ AŞAMALI TARAMA & DOM KARŞILAŞTIRMA (Static vs Rendered)`)));
    console.log(pc.gray('─'.repeat(70)));

    const cmp = website.staticVsRendered;
    if (cmp) {
      console.log(pc.white(`  • Kelime Sayısı (Word Count):  `) + `Statik: ${pc.bold(cmp.staticWordCount)} | Rendered: ${pc.bold(cmp.renderedWordCount)} | Fark: ${cmp.wordCountGap >= 0 ? '+' : ''}${cmp.wordCountGap}`);
      console.log(pc.white(`  • Başlık Sayısı (Headings):    `) + `Statik: ${pc.bold(cmp.staticHeadingCount)} | Rendered: ${pc.bold(cmp.renderedHeadingCount)} | Fark: ${cmp.headingCountGap >= 0 ? '+' : ''}${cmp.headingCountGap}`);
      console.log(pc.white(`  • Bağlantılar (Links):         `) + `Statik: ${pc.bold(cmp.staticLinkCount)} | Rendered: ${pc.bold(cmp.renderedLinkCount)}`);
      console.log(pc.white(`  • Görseller (Images):          `) + `Statik: ${pc.bold(cmp.staticImageCount)} | Rendered: ${pc.bold(cmp.renderedImageCount)}`);
      console.log(pc.white(`  • JavaScript Bağımsızlık Skoru:`) + ` ${pc.bold(pc.green(`%${cmp.jsDependencyScore}`))} (100 = Tamamen SSR Bağımsız)`);
      console.log(pc.white(`  • CSR / SPA Bağımlılığı:       `) + (cmp.csrDependency ? pc.red('Evet (Ağır CSR)') : pc.green('Hayır (İçerik Statik/SSR)')));
      console.log(pc.white(`  • SSR Kullanılabilirliği:      `) + (cmp.ssrAvailability ? pc.green('Evet') : pc.yellow('Sınırlı')));
      console.log(pc.white(`  • Dinamik İçerik / Hydration:  `) + (cmp.dynamicContentDetected ? pc.yellow('Tespit Edildi') : pc.gray('Statik Eşleşme')));
      console.log(pc.gray(`\n  Özet: ${cmp.summary}`));
    }

    // 2. AI Audit Report
    if (audit) {
      console.log(pc.bold(pc.magenta(`\n═`.repeat(70))));
      console.log(pc.bold(pc.magenta(`  AI READINESS & AGENT USABILITY DENETİM RAPORU`)));
      console.log(pc.bold(pc.magenta(`═`.repeat(70))));

      console.log(pc.white(`\n📋 Yönetici Özeti (Executive Summary):`));
      console.log(pc.italic(`  ${audit.executiveSummary}`));

      // Category Scores Summary
      if (audit.categoryScores && audit.categoryScores.length > 0) {
        console.log(pc.bold(pc.cyan(`\n🏷️  Kategori Puanları (Category Scores):`)));
        for (const cat of audit.categoryScores) {
          const scoreColor = cat.score >= 80 ? pc.green : cat.score >= 60 ? pc.yellow : pc.red;
          console.log(
            `  • ${cat.name.padEnd(45)} ` +
            `${renderProgressBar(cat.score, 12)} ` +
            scoreColor(pc.bold(`${String(cat.score).padStart(3)}/100`)) +
            pc.gray(` (Ağırlık: %${cat.weight})`)
          );
        }
      }

      // Metric by Metric Breakdown with Charts
      console.log(pc.bold(pc.cyan(`\n📊 Metrik Bazlı İnceleme ve Grafikler (${audit.metrics.length} Metrik):`)));
      for (const m of audit.metrics) {
        const scoreColor = m.score >= 80 ? pc.green : m.score >= 60 ? pc.yellow : pc.red;
        const statusBadge =
          m.status === 'Pass' ? pc.bgGreen(pc.black(' PASS ')) :
          m.status === 'Warning' ? pc.bgYellow(pc.black(' WARN ')) :
          m.status === 'Fail' ? pc.bgRed(pc.white(' FAIL ')) : pc.bgRed(pc.bold(pc.white(' CRITICAL ')));

        console.log(
          `\n  ${statusBadge} ${pc.bold(m.name)} ` +
          `[${m.category}] ` +
          scoreColor(pc.bold(`${m.score}/100`))
        );

        // Visual Chart
        console.log(`     ${renderProgressBar(m.score, 24)} ${m.score}/100`);
        if (m.chart && m.chart.staticVal !== undefined && m.chart.renderedVal !== undefined) {
          console.log(renderComparisonBar(m.chart.staticVal, m.chart.renderedVal));
        }

        console.log(pc.white(`     Gerekçe: `) + pc.italic(m.reasoning));

        if (m.evidence && m.evidence.length > 0) {
          console.log(pc.gray(`     Kanıtlar:`));
          for (const ev of m.evidence) {
            console.log(pc.gray(`      • ${ev}`));
          }
        }

        if (m.detectedProblems && m.detectedProblems.length > 0) {
          console.log(pc.red(`     Tespit Edilen Sorunlar:`));
          for (const p of m.detectedProblems) {
            const sevColor = p.severity === 'Critical' ? pc.bgRed(pc.white(` ${p.severity} `)) :
                             p.severity === 'High' ? pc.red(`[${p.severity}]`) : pc.yellow(`[${p.severity}]`);
            console.log(`      ✖ ${sevColor} ${p.issue}`);
          }
        }

        if (m.recommendations && m.recommendations.length > 0) {
          console.log(pc.yellow(`     Tavsiye: `) + m.recommendations.join(' | '));
        }
      }

      // Generated User Questions Answering Test
      if (audit.generatedUserQuestions && audit.generatedUserQuestions.length > 0) {
        console.log(pc.bold(pc.cyan(`\n💬 Yapay Zeka Soru Cevaplama Testi (Domain Specific Q&A):`)));
        for (const q of audit.generatedUserQuestions) {
          const ansBadge = q.answerFound ? pc.green('✔ CEVAP MEVCUT') : pc.red('✖ CEVAP BULUNAMADI');
          console.log(`  • "${pc.bold(q.question)}" ➔ ${ansBadge} (${q.score}/100)`);
          if (q.evidence) console.log(pc.gray(`    Kanıt: ${q.evidence}`));
        }
      }

      // Critical Problems
      if (audit.criticalProblems && audit.criticalProblems.length > 0) {
        console.log(pc.bold(pc.red(`\n🚨 Kritik Sorunlar ve Cezalar (Critical Overrides):`)));
        for (const cp of audit.criticalProblems) {
          console.log(pc.red(`  ✖ [${cp.severity}] ${cp.issue}`));
        }
      }

      // Top Recommendations
      console.log(pc.bold(pc.yellow(`\n🎯 En Öncelikli Geliştirme Tavsiyeleri:`)));
      for (const rec of audit.topRecommendations) {
        console.log(pc.yellow(`  ✦ ${rec}`));
      }

      // Final Bottom-Up Overall Score Banner
      console.log(pc.magenta(`\n═`.repeat(70)));
      console.log(pc.bold(pc.white(`  🏆 FİNAL AI READINESS DEĞERLENDİRMESİ (BOTTOM-UP HESAPLANDI)`)));
      console.log(pc.magenta(`═`.repeat(70)));

      const certColor =
        audit.certificationLevel === 'AI Ready' ? pc.green :
        audit.certificationLevel === 'AI Compatible' ? pc.cyan :
        audit.certificationLevel === 'AI Partially Compatible' ? pc.yellow : pc.red;

      console.log(
        `  • Temel Puan (Base Score):        ${pc.bold(`${audit.baseScore}/100`)}\n` +
        `  • Kritik Hata Cezası (Penalty):   ${audit.criticalPenalty > 0 ? pc.red(`-${audit.criticalPenalty}`) : pc.green('0')}\n` +
        `  • FİNAL GENEL SKOR (Overall):     ${pc.bold(certColor(`${audit.overallScore}/100`))}  Not: ${pc.bold(`[ ${audit.letterGrade} ]`)}\n` +
        `  • Sertifikasyon Seviyesi:         ${certColor(pc.bold(`[ ${audit.certificationLevel} ]`))}\n` +
        `  • Halüsinasyon Güvenliği:         ${pc.green(`%${audit.hallucinationSafetyScore}`)} (Risk: %${audit.hallucinationRisk})\n` +
        `  • AI Agent İşlem Yetkinliği:      ${pc.cyan(`%${audit.agentReadinessScore}`)}\n` +
        pc.gray(`  (Değerlendiren Model: ${audit.aiModel})`)
      );

    } else {
      console.log(pc.gray(`\nİpucu: Kapsamlı yapay zeka analizi, grafikler ve sertifikasyon için komutu --ai bayrağı ile çalıştırın.`));
    }

    console.log(pc.gray('\n' + '─'.repeat(70) + '\n'));
  } catch (err: any) {
    console.error(pc.red(`\nDenetim çalıştırılırken hata oluştu: ${err.message}`));
    process.exit(1);
  }
}

function printHelp() {
  console.log(`
${pc.bold(pc.cyan('AI Website Auditor'))} - İki Aşamalı AI & Agent Denetim CLI

${pc.bold('Kullanım:')}
  pnpm audit <url> [seçenekler]
  pnpm audit:ai <url> [seçenekler]

${pc.bold('Seçenekler:')}
  --ai            Aşağıdan-yukarıya Gemini AI değerlendirmesini, metrik grafiklerini ve sertifikasyonu çalıştırır
  --json          Ham JSON çıktısını yazdırır
  --allow-local   Localhost ve yerel ağ adreslerine izin verir (testler için)
  --brief <yol>   Özel bir AuditBrief JSON dosyasının yolu
  --model <isim>  Gemini model ismi (örn. gemini-3.7-flash)
  --help, -h      Yardım mesajını görüntüler

${pc.bold('Örnekler:')}
  pnpm run audit https://example.com
  pnpm run audit http://localhost:4321 --allow-local
  pnpm run audit:ai https://example.com
  pnpm run audit:ai http://localhost:4321 --allow-local
`);
}

main();
