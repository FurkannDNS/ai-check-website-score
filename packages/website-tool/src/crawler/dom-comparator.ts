import {
  PageData,
  StructuredDataResult,
  AiSignals,
  StaticVsRenderedComparison,
} from '@ai-auditor/shared';

export class DOMComparator {
  public static compare(
    staticPage: PageData,
    renderedPage: PageData,
    staticStructuredData: StructuredDataResult,
    renderedStructuredData: StructuredDataResult,
    staticSignals: AiSignals,
    renderedSignals: AiSignals
  ): StaticVsRenderedComparison {
    const staticWordCount = staticPage.content.wordCount;
    const renderedWordCount = renderedPage.content.wordCount;
    const wordCountGap = renderedWordCount - staticWordCount;

    const staticHeadingCount = staticPage.headings.length;
    const renderedHeadingCount = renderedPage.headings.length;
    const headingCountGap = renderedHeadingCount - staticHeadingCount;

    const staticLinkCount = staticPage.links.length;
    const renderedLinkCount = renderedPage.links.length;
    const linkCountGap = renderedLinkCount - staticLinkCount;

    const staticImageCount = staticPage.images.length;
    const renderedImageCount = renderedPage.images.length;
    const imageCountGap = renderedImageCount - staticImageCount;

    const staticSemanticScore = staticSignals.semanticHtml.score;
    const renderedSemanticScore = renderedSignals.semanticHtml.score;

    const staticStructuredDataCount = staticStructuredData.detectedTypes.length;
    const renderedStructuredDataCount = renderedStructuredData.detectedTypes.length;

    // JavaScript Dependency Calculation:
    // If rendered word count > 0 and static is 0 => 100% JS dependent (Score = 0)
    // If static has all content => 100% SSR Independent (Score = 100)
    let jsDependencyScore = 100;
    if (renderedWordCount > 0) {
      const ratio = Math.min(1, staticWordCount / renderedWordCount);
      jsDependencyScore = Math.round(ratio * 100);
    } else if (staticWordCount === 0) {
      jsDependencyScore = 0;
    }

    const csrDependency = wordCountGap > 50 && staticWordCount < 50;
    const ssrAvailability = staticWordCount >= 100 || (renderedWordCount > 0 && staticWordCount / renderedWordCount > 0.7);
    const dynamicContentDetected = Math.abs(wordCountGap) > 20 || Math.abs(headingCountGap) > 1 || Math.abs(linkCountGap) > 2;
    const hydrationDependency = !csrDependency && dynamicContentDetected;

    // AI Crawlability Gap: positive means rendered DOM has significantly more content than static HTML
    const aiCrawlabilityGap = renderedWordCount > 0 
      ? Math.round(((renderedWordCount - staticWordCount) / Math.max(renderedWordCount, 1)) * 100)
      : 0;

    let summary = '';
    if (csrDependency) {
      summary = `Sayfa yoğun İstemci Taraflı Render (CSR/SPA) kullanmaktadır. Statik HTML'de yalnızca ${staticWordCount} kelime bulunurken, JavaScript çalıştırıldığında ${renderedWordCount} kelimeye ve ${renderedHeadingCount} başlığa ulaşılmaktadır. Standart HTTP tarayıcıları bu içeriği kaçırabilir.`;
    } else if (dynamicContentDetected) {
      summary = `Sayfa Sunucu Taraflı Render (SSR) ile ${staticWordCount} kelimelik temel içeriği başarıyla sunmaktadır. JavaScript çalıştığında ek ${wordCountGap} kelime ve dinamik bileşenler hydrate edilmektedir.`;
    } else {
      summary = `Statik HTML ile render edilen DOM arasında tam bir içerik tutarlılığı (%${jsDependencyScore} SSR Uyumu) tespit edilmiştir. Tüm temel içerikler ve başlıklar JavaScript çalıştırmadan da doğrudan taranabilmektedir.`;
    }

    return {
      staticWordCount,
      renderedWordCount,
      wordCountGap,
      staticHeadingCount,
      renderedHeadingCount,
      headingCountGap,
      staticLinkCount,
      renderedLinkCount,
      linkCountGap,
      staticImageCount,
      renderedImageCount,
      imageCountGap,
      staticSemanticScore,
      renderedSemanticScore,
      staticStructuredDataCount,
      renderedStructuredDataCount,
      jsDependencyScore,
      csrDependency,
      ssrAvailability,
      hydrationDependency,
      dynamicContentDetected,
      aiCrawlabilityGap,
      summary,
    };
  }
}
