import { statSync } from 'node:fs';
import { resolve } from 'node:path';

export function publicFile(path: string | undefined) {
  if (!path || !/^[\w-]+(?:\/[\w-]+)*\.[\w]+$/.test(path)) return undefined;
  const filename = resolve('public', path);
  return statSync(filename, { throwIfNoEntry: false })?.isFile() ? path : undefined;
}
