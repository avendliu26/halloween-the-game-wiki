import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

// Keep the repository's own prebuild and build steps, including asset checks.
const result = spawnSync('npm', ['run', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, CF_STATIC_EXPORT: '1' },
});
if (result.status !== 0) process.exit(result.status || 1);

const manifest = JSON.parse(readFileSync('.next/routes-manifest.json', 'utf8'));
const redirects = (manifest.redirects || []).map(({ source, destination, statusCode }) => {
  const keys = [];
  const pattern = source.split('/').map(segment => {
    if (segment.startsWith(':')) {
      const match = /^:([A-Za-z][A-Za-z0-9_]*)([+*]?)$/.exec(segment);
      if (!match) throw new Error(`Unsupported backup redirect: ${source}`);
      keys.push(match[1]);
      return match[2] === '*' ? '(.*)' : match[2] === '+' ? '(.+)' : '([^/]+)';
    }
    return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }).join('/');
  return { pattern: `^${pattern}$`, keys, destination, statusCode };
});

// Pages advanced mode preserves redirects which static export cannot serve.
// All backup responses remain out of search indexes; canonical URLs stay original.
writeFileSync('out/_worker.js', `
const redirects = ${JSON.stringify(redirects)};
const headers = { 'X-Robots-Tag': 'noindex, nofollow' };
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    for (const rule of redirects) {
      const match = new RegExp(rule.pattern).exec(url.pathname);
      if (!match) continue;
      let target = rule.destination;
      rule.keys.forEach((key, index) => {
        target = target.replace(new RegExp(':' + key + '[+*]?', 'g'), match[index + 1]);
      });
      const destination = new URL(target, url.origin);
      if (!destination.search) destination.search = url.search;
      return new Response(null, { status: rule.statusCode, headers: { ...headers, Location: destination.href } });
    }
    const response = await env.ASSETS.fetch(request);
    const output = new Response(response.body, response);
    output.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return output;
  }
};
`);
writeFileSync('out/_routes.json', JSON.stringify({ version: 1, include: ['/*'], exclude: [] }));
console.log(`Cloudflare backup ready: ${redirects.length} redirect rules; noindex enabled.`);
