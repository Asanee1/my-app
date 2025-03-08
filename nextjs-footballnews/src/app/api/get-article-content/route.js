import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

// In-memory cache (replace with Redis for production)
const cache = {};
const CACHE_EXPIRATION = 60 * 60; // 1 hour in seconds

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is missing' }, { status: 400 });
  }

  // Check the cache first
  if (cache[url] && cache[url].expires > Date.now()) {
    console.log('Cache hit for:', url);
    return NextResponse.json({ content: cache[url].content });
  }

  console.log('Cache miss for:', url);

  try {
    const response = await fetch(url);
    const html = await response.text();

    const dom = new JSDOM(html);
    const document = dom.window.document;

    const articleContent = extractArticleContent(document, url);

    // Store in the cache
    cache[url] = {
      content: articleContent,
      expires: Date.now() + CACHE_EXPIRATION * 1000,
    };

    return NextResponse.json({ content: articleContent });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch and parse article content' }, { status: 500 });
  }
}

function extractArticleContent(document, url) {
  try {
    // Basic Text Extraction (Fallback)
    const paragraphs = document.querySelectorAll('p');
    if (paragraphs.length > 0) {
      return Array.from(paragraphs)
        .map(p => p.textContent.trim())
        .join('\n\n');
    }

    // Thai Rath Specific (Example)
    if (url.includes('thairath.co.th')) {
      const articleContent = document.querySelector('.article-content');
        if (articleContent) {
           const paragraphs = articleContent.querySelectorAll('p');
           if(paragraphs.length > 0) {
            return Array.from(paragraphs)
              .map(p => p.textContent.trim())
              .join('\n\n');
           }
           return articleContent.textContent.trim();
        }
    }

     // Other Websites (Add more logic here if needed)
    if (url.includes('website2.com')) {
      // ... specific logic for website2.com ...
    }

    // ... add more site-specific extraction logic ...

    // If no specific logic is found, return a message
    return "Content not found for this website or article format.";

  } catch (error) {
    console.error("Error during content extraction:", error);
    return "Error extracting content.";
  }
}
