// 链接转换为 Markdown 的工具函数

// 检测是否为有效的 URL
export function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// 从 HTML 中提取文本内容并转换为 Markdown
function htmlToMarkdown(html: string): string {
  // 创建一个临时的 DOM 元素来解析 HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // 移除 script 和 style 标签
  const scripts = tempDiv.querySelectorAll('script, style');
  scripts.forEach(script => script.remove());

  // 简单的 HTML 到 Markdown 转换
  let markdown = tempDiv.innerHTML;

  // 转换标题
  markdown = markdown.replace(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi, (match, level, content) => {
    const hashes = '#'.repeat(parseInt(level));
    return `${hashes} ${content.replace(/<[^>]*>/g, '')}\n\n`;
  });

  // 转换段落
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');

  // 转换链接
  markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // 转换粗体
  markdown = markdown.replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, '**$2**');

  // 转换斜体
  markdown = markdown.replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, '*$2*');

  // 转换代码
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

  // 转换代码块
  markdown = markdown.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gi, '\n$1\n');

  // 转换列表
  markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gi, (match, content) => {
    return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  });

  markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gi, (match, content) => {
    let counter = 1;
    return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${counter++}. $1\n`);
  });

  // 移除剩余的 HTML 标签
  markdown = markdown.replace(/<[^>]*>/g, '');

  // 清理多余的空行
  markdown = markdown.replace(/\n\s*\n\s*\n/g, '\n\n');

  // 解码 HTML 实体
  const textarea = document.createElement('textarea');
  textarea.innerHTML = markdown;
  markdown = textarea.value;

  return markdown.trim();
}

// 获取网页内容并转换为 Markdown
export async function fetchUrlContent(url: string): Promise<{ title: string; content: string }> {
  console.log('fetchUrlContent called with:', url);

  try {
    // 先尝试直接获取，如果失败再使用代理
    let html = '';
    let title = '';

    try {
      // 直接尝试获取（可能会因为CORS失败）
      const directResponse = await fetch(url);
      if (directResponse.ok) {
        html = await directResponse.text();
        console.log('Direct fetch successful');
      } else {
        throw new Error('Direct fetch failed');
      }
    } catch (directError) {
      console.log('Direct fetch failed, trying proxy:', directError);

      // 使用代理服务
      const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
      console.log('Using proxy URL:', proxyUrl);

      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
      });

      console.log('Proxy response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      html = await response.text();
    }

    console.log('HTML length:', html.length);

    // 解析 HTML 获取标题
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const titleElement = tempDiv.querySelector('title');
    title = titleElement ? titleElement.textContent?.trim() || '' : '';

    // 如果没有标题，使用URL的域名
    if (!title) {
      try {
        const urlObj = new URL(url);
        title = urlObj.hostname;
      } catch {
        title = 'Untitled';
      }
    }

    console.log('Extracted title:', title);

    // 尝试获取主要内容
    let mainContent = '';

    // 尝试从常见的内容容器中提取内容
    const contentSelectors = [
      'main',
      'article',
      '.content',
      '.post-content',
      '.entry-content',
      '.article-content',
      '#content',
      '.main-content',
      '.post',
      '.article'
    ];

    for (const selector of contentSelectors) {
      const element = tempDiv.querySelector(selector);
      if (element && element.textContent && element.textContent.trim().length > 100) {
        mainContent = element.innerHTML;
        console.log('Found content with selector:', selector);
        break;
      }
    }

    // 如果没有找到主要内容容器，使用 body
    if (!mainContent) {
      const bodyElement = tempDiv.querySelector('body');
      if (bodyElement) {
        // 移除导航、页脚等不相关内容
        const elementsToRemove = bodyElement.querySelectorAll('nav, footer, header, .nav, .navigation, .footer, .header, .sidebar, .ads, .advertisement');
        elementsToRemove.forEach(el => el.remove());
        mainContent = bodyElement.innerHTML;
        console.log('Using body content');
      } else {
        mainContent = html;
        console.log('Using full HTML');
      }
    }

    // 转换为 Markdown
    const markdown = htmlToMarkdown(mainContent);
    console.log('Markdown length:', markdown.length);

    const result = {
      title: title,
      content: `# ${title}\n\n> 来源: ${url}\n> 获取时间: ${new Date().toLocaleString()}\n\n${markdown}`
    };

    console.log('Final result:', { title: result.title, contentLength: result.content.length });
    return result;

  } catch (error) {
    console.error('Error fetching URL content:', error);

    // 如果获取失败，返回一个基本的 Markdown 模板
    let title = 'Untitled';
    try {
      const urlObj = new URL(url);
      title = urlObj.hostname;
    } catch {
      title = 'Invalid URL';
    }

    const fallbackResult = {
      title,
      content: `# ${title}\n\n> 来源: ${url}\n> 获取时间: ${new Date().toLocaleString()}\n\n⚠️ 无法自动获取内容，可能的原因：\n- 网站不允许跨域访问\n- 网络连接问题\n- 网站需要身份验证\n\n请手动复制粘贴内容，或者尝试其他链接。`
    };

    console.log('Returning fallback result:', fallbackResult);
    return fallbackResult;
  }
}

// 检测输入的文本是否包含链接
export function detectUrlsInText(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex);
  return matches ? matches.filter(url => isValidUrl(url)) : [];
}