import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';

const output = resolve(process.env.TEST_DIST ?? 'dist');
const base = (process.env.SITE_BASE ?? '').replace(/\/$/, '');
const port = Number(process.env.TEST_PORT ?? 4178);
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.pdf': 'application/pdf'
};

createServer((request, response) => {
  let path;
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!pathname.startsWith(base + '/')) return response.writeHead(404).end();
    path = resolve(output, '.' + pathname.slice(base.length));
    if (path !== output && !path.startsWith(output + sep)) return response.writeHead(404).end();
    if (statSync(path).isDirectory()) path = resolve(path, 'index.html');
    if (!statSync(path).isFile()) throw new Error('Not a file');
    response.statusCode = 200;
  } catch {
    response.statusCode = 404;
    path = resolve(output, '404.html');
  }

  response.setHeader('Content-Type', types[extname(path)] ?? 'application/octet-stream');
  const stream = createReadStream(path);
  stream.on('error', () => response.end());
  stream.pipe(response);
}).listen(port, '127.0.0.1', () => {
  process.stdout.write('Static preview at http://127.0.0.1:' + port + base + '/\n');
});
