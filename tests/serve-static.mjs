import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';

const directory = resolve('docs');
const base = (process.env.PORTFOLIO_BASE ?? '').replace(/\/$/, '');
const port = Number(process.env.PORTFOLIO_PORT ?? 4186);
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.png': 'image/png', '.pdf': 'application/pdf'
};

createServer((request, response) => {
  let file;
  try {
    const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (base && path === base) return response.writeHead(301, { Location: base + '/' }).end();
    if (!path.startsWith(base + '/')) throw new Error('Outside test mount');
    const relative = path.slice(base.length + 1) || 'index.html';
    file = resolve(directory, relative);
    if (!file.startsWith(directory + sep) || !statSync(file, { throwIfNoEntry: false })?.isFile()) {
      throw new Error('Missing file');
    }
    response.statusCode = 200;
  } catch {
    response.statusCode = 404;
    file = resolve(directory, '404.html');
  }
  response.setHeader('content-type', types[extname(file)] ?? 'application/octet-stream');
  if (request.method === 'HEAD') return response.end();
  createReadStream(file).on('error', () => response.end()).pipe(response);
}).listen(port, '127.0.0.1', () => {
  process.stdout.write('Static portfolio at http://127.0.0.1:' + port + base + '/\n');
});
