import { content } from './content.js';
import { available, byId, element, httpsLink, image, link, localAsset, setText, tags } from './dom.js';
import { renderProjects } from './projects.js';
import { initContact } from './contact.js';

const root = document.documentElement;
const { profile } = content;
const phone = matchMedia('(max-width: 980px)');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const menu = byId('menu-button');
const nav = byId('primary-nav');
const header = document.querySelector('.site-header');

function showMenu(open) {
  menu.hidden = !phone.matches;
  menu.setAttribute('aria-expanded', String(open));
  nav.hidden = phone.matches && !open;
}
root.dataset.enhanced = '';
showMenu(false);
delete root.dataset.enhancing;
phone.addEventListener('change', () => showMenu(false));
menu.addEventListener('click', () => showMenu(menu.getAttribute('aria-expanded') !== 'true'));
header.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    showMenu(false);
    menu.focus();
  }
});
nav.addEventListener('click', (event) => {
  const anchor = event.target.closest('a');
  if (!anchor || !phone.matches) return;
  showMenu(false);
  const target = anchor.getAttribute('href')?.startsWith('#') && byId(anchor.hash.slice(1));
  if (!target) { menu.focus({ preventScroll: true }); return; }
  target?.setAttribute('tabindex', '-1');
  target?.focus({ preventScroll: true });
});

const navItems = [...nav.querySelectorAll('a[href^="#"]')]
  .map((anchor) => ({ anchor, section: byId(anchor.hash.slice(1)) }))
  .filter(({ section }) => section)
  .sort((a, b) => a.section.compareDocumentPosition(b.section) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
let pendingFrame = false;
function trackSection() {
  pendingFrame = false;
  const offset = header.getBoundingClientRect().bottom + 45;
  let current = navItems[0];
  for (const item of navItems) {
    if (item.section.getBoundingClientRect().top > offset) break;
    current = item;
  }
  if (scrollY > 0 && scrollY + innerHeight >= root.scrollHeight - 3) {
    current = navItems.find(({ section }) => section.id === 'contact') ?? current;
  }
  for (const item of navItems) {
    if (item === current) item.anchor.setAttribute('aria-current', 'location');
    else item.anchor.removeAttribute('aria-current');
  }
}
function scheduleTracking() {
  if (pendingFrame) return;
  pendingFrame = true;
  requestAnimationFrame(trackSection);
}
window.addEventListener('scroll', scheduleTracking, { passive: true });
window.addEventListener('resize', scheduleTracking);

if (available(profile.name)) {
  for (const field of document.querySelectorAll('[data-person-name]')) field.textContent = profile.name;
}
setText('professional-title', profile.title);
setText('footer-role', profile.title);
setText('hero-intro', profile.introduction);
setText('biography', profile.biography);
setText('about-detail', [profile.about, profile.location].filter(available).join(' · '));
if (available(profile.tagline?.lead) && available(profile.tagline?.accent)) {
  byId('tagline').replaceChildren(profile.tagline.lead + ' ', element('em', '', profile.tagline.accent));
  setText('footer-tagline', profile.tagline.lead + ' ' + profile.tagline.accent);
}
const portrait = byId('portrait');
const portraitImg = image(profile.portrait, () => portrait.classList.remove('has-image'));
if (portraitImg) {
  portraitImg.addEventListener('load', () => portrait.classList.add('has-image'), { once: true });
  portrait.append(portraitImg);
}
byId('year').textContent = String(new Date().getFullYear());

const socials = content.socials
  .map(({ label, url }) => ({ label, href: httpsLink(url) }))
  .filter(({ label, href }) => available(label) && href);
for (const id of ['hero-socials', 'footer-socials']) {
  byId(id).append(...socials.map(({ label, href }) => link(label, href)));
}

function appendText(parent, values) {
  for (const value of values.flat().filter(available)) parent.append(element('p', '', value));
}

const domainIcons = new Map([
  ['machine', 'M3 20V9h7v4h5V8h6v12zM6 9V4h2v5m9 3h2M6 16h2m4 0h2m4 0h1'],
  ['pulse', 'M3 18h18M4 14h3l3-7 3 9 3-6 2 4h3'],
  ['network', 'M3 4h6v6H3zm12 0h6v6h-6zM9 15h6v6H9zM6 10v3h12v-3m-6 3v2'],
  ['chip', 'M6 6h12v12H6zm4 4h4v4h-4zM9 3v3m6-3v3m-6 12v3m6-3v3M3 9h3m-3 6h3m12-6h3m-3 6h3'],
  ['platform', 'M3 6h18v12H3zM7 14l3-3 3 2 4-4M9 21h6'],
  ['prototype', 'M4 4h16v16H4zm3 3h2m6 0h2m-10 10h2m6 0h2M10 10h4v4h-4z']
]);
function domainIcon(name) {
  const drawing = domainIcons.get(name);
  if (!drawing) return null;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'domain-icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(svg.namespaceURI, 'path');
  path.setAttribute('d', drawing);
  svg.append(path);
  return svg;
}

function renderGrid(id, note, entries, cardClass, noteText, includeContact = false) {
  const items = entries.filter(({ title }) => available(title));
  if (!items.length) {
    byId(id).replaceChildren(element('p', 'muted', 'Public details are pending.'));
    byId(note).hidden = true;
    return;
  }
  byId(note).textContent = noteText;
  byId(note).hidden = !items.some(({ illustrative }) => illustrative);
  const cards = items.map((entry) => {
    const card = element('article', cardClass);
    const heading = element('h3', '', entry.title);
    const icon = domainIcon(entry.icon);
    if (icon) heading.prepend(icon);
    card.append(heading);
    appendText(card, [entry.description, entry.problems]);
    const tech = tags(entry.technologies ?? entry.capabilities);
    if (tech) card.append(tech);
    if (includeContact) card.append(link('Discuss ' + entry.title.toLowerCase(), '#contact'));
    return card;
  });
  byId(id).replaceChildren(...cards);
}

renderGrid('skills-grid', 'skills-note', content.expertise, 'skill-card', 'Illustrative focus areas. Individual skills await confirmation.');
renderGrid('services-grid', 'services-note', content.services, 'service-card', 'Proposed service areas awaiting confirmation.', true);
const projectIds = renderProjects(content.projects);

const roles = content.experience.filter(({ title, organization }) => available(title) && available(organization));
if (roles.length) {
  byId('experience-list').replaceChildren(...roles.map((role) => {
    const li = element('li');
    const logo = image(role.organizationLogo);
    if (logo) li.append(logo);
    const heading = element('div', 'role-heading');
    const identity = element('div');
    identity.append(element('h3', '', role.title), element('p', 'role-organization', role.organization));
    heading.append(identity);
    const metadata = [role.period, role.location, role.employmentType].filter(available).join(' · ');
    if (metadata) heading.append(element('p', 'role-meta', metadata));
    li.append(heading);
    appendText(li, [role.overview, role.responsibilities, role.contributions, role.solutions, role.achievements]);
    const tech = tags(role.technologies);
    if (tech) li.append(tech);
    for (const id of (role.projectIds ?? []).filter((id) => projectIds.has(id))) {
      const title = content.projects.find((project) => project.id === id).title;
      li.append(link('Case study: ' + title, '#project-' + id, 'role-project'));
    }
    return li;
  }));
}

const resume = localAsset(content.resume.path, ['pdf']);
if (resume) {
  fetch(resume, { method: 'HEAD' }).then((response) => {
    if (!response.ok || !response.headers.get('content-type')?.toLowerCase().includes('application/pdf')) return;
    const actions = byId('resume-actions');
    const download = link('Download résumé', resume, 'button primary');
    download.download = '';
    actions.append(download);
    if (content.resume.preview) actions.append(link('View PDF', resume, 'button secondary'));
  }).catch(() => { /* Leave the unavailable state in place. */ });
}

initContact({ ...content.contact, phone: profile.phone }, socials);

const topology = document.querySelector('.topology');
if ('IntersectionObserver' in window) {
  const diagramObserver = new IntersectionObserver(([entry]) => {
    topology.classList.toggle('pulse', Boolean(entry?.isIntersecting) && !motion.matches);
  });
  diagramObserver.observe(topology);
  motion.addEventListener('change', () => {
    if (motion.matches) topology.classList.remove('pulse');
    else { diagramObserver.unobserve(topology); diagramObserver.observe(topology); }
  });

  const reveal = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (!motion.matches) entry.target.classList.add('reveal');
      reveal.unobserve(entry.target);
    }
  }, { threshold: .14 });
  for (const section of document.querySelectorAll('.content .section')) reveal.observe(section);
}

if (!document.querySelector('meta[name="robots"][content*="noindex"]') && content.seo.person && available(profile.name)) {
  const page = document.querySelector('link[rel="canonical"]').href;
  const data = element('script');
  data.type = 'application/ld+json';
  data.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ProfilePage', url: page,
    mainEntity: { '@type': 'Person', name: profile.name, jobTitle: profile.title, sameAs: socials.map(({ href }) => href) }
  });
  document.head.append(data);
}

trackSection();
