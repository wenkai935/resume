/**
 * 由 index.html 渲染出 resume.pdf（A4）。
 *
 * 设计要点：
 * - 用 puppeteer-core 驱动「系统已安装的 Chrome / Edge」，不额外下载 Chromium。
 * - 走 print media，页面里的 @media print 规则（隐藏操作按钮、A4 纸张、防跨页断裂）自动生效。
 * - 纸张与页边距的单一来源是 index.html 里的 @page 规则，故开启 preferCSSPageSize。
 *
 * 用法：
 *   npm run build:pdf
 *   CHROME_PATH="/path/to/msedge" npm run build:pdf
 */
import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const CANDIDATES = [
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

async function findBrowser() {
  for (const candidate of CANDIDATES) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      /* 继续找下一个 */
    }
  }
  throw new Error(
    '未找到可用的 Chrome / Edge，请通过环境变量 CHROME_PATH 指定可执行文件路径。',
  );
}

const entry = resolve('index.html');
const output = resolve('resume.pdf');
const executablePath = await findBrowser();

console.log(`[build-pdf] 浏览器: ${executablePath}`);
console.log(`[build-pdf] 源文件: ${entry}`);

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
});

try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(entry).href, { waitUntil: 'networkidle0' });
  await page.emulateMediaType('print');
  await page.evaluate(() => document.fonts.ready);

  await page.pdf({
    path: output,
    preferCSSPageSize: true,
    printBackground: true,
  });

  const pages = await page.evaluate(() => {
    const height = document.querySelector('.page')?.scrollHeight ?? 0;
    return { contentHeightPx: height };
  });
  console.log(`[build-pdf] 内容高度约 ${pages.contentHeightPx}px（A4 可打印区约 1032px/页）`);
  console.log(`[build-pdf] 已生成: ${output}`);
} finally {
  await browser.close();
}
