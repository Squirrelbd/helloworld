export const byId = (id) => document.getElementById(id);

export function available(value) {
  return typeof value === 'string' && Boolean(value.trim()) && !/^YOUR_[A-Z_]+$/.test(value.trim());
}

export function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (available(text)) node.textContent = text;
  return node;
}

export function setText(id, text) {
  if (available(text)) byId(id).textContent = text;
}

export function httpsLink(value) {
  if (!available(value)) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

export function publicEmail(value) {
  if (!available(value)) return null;
  return /^[\w.!$+-]+@[\w-]+(?:\.[\w-]+)+$/.test(value) ? value : null;
}

export function localAsset(path, extensions) {
  if (!available(path) || !/^assets\/(?:[\w-]+\/)*[\w-]+\.[\w]+$/.test(path)) return null;
  return extensions.includes(path.split('.').at(-1).toLowerCase()) ? './' + path : null;
}

export function link(text, href, className) {
  if (!available(text) || !href) return null;
  const anchor = element('a', className, text);
  anchor.href = href;
  return anchor;
}

export function image(asset, onError) {
  const path = localAsset(asset?.path, ['avif', 'webp', 'png', 'jpg', 'jpeg', 'svg']);
  if (!path || !available(asset?.alt)) return null;
  const img = element('img');
  img.alt = asset.alt;
  img.width = Number.isInteger(asset.width) && asset.width > 0 ? asset.width : 640;
  img.height = Number.isInteger(asset.height) && asset.height > 0 ? asset.height : 360;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.addEventListener('error', () => { img.remove(); onError?.(); }, { once: true });
  img.src = path;
  return img;
}

export function tags(items) {
  const values = Array.isArray(items) ? items.filter(available) : [];
  if (!values.length) return null;
  const list = element('ul', 'tags');
  list.append(...values.map((value) => element('li', '', value)));
  return list;
}
