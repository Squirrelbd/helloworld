import { available, byId, element, httpsLink, image, link, tags } from './dom.js';

const caseFields = {
  overview: 'Overview', role: 'Contribution', problem: 'Problem', objectives: 'Objectives',
  requirements: 'Requirements', constraints: 'Operational constraints', solution: 'Solution',
  architecture: 'System architecture', hardware: 'Hardware', firmware: 'Firmware',
  connectivity: 'Industrial communication', dataFlow: 'Data flow', platform: 'Platform & software',
  dashboard: 'Dashboard', implementation: 'Implementation', challenges: 'Technical challenges',
  decisions: 'Engineering decisions', testing: 'Testing & validation', results: 'Verified results',
  lessons: 'Lessons learned', improvements: 'Future improvements'
};

const visuals = {
  monitoring: [
    'M18 86h264M18 55h264M18 24h264',
    'M20 82h26V55h28V65h24V41h35V71h29V28h32v23h26V35h30v14h31',
    'M20 101h37m8 0h37m8 0h14'
  ],
  platform: [
    'M68 41h42m80 0h39M68 80h42m80 0h39M89 41v39m120-39v39',
    'M114 28h72v66h-72zM24 26h44v29H24zM24 66h44v29H24zM229 26h47v68h-47z',
    'M124 47h52m-52 13h52m-52 13h33M238 69l8-11 7 5 14-12'
  ],
  device: [
    'M70 18h160v84H70zM127 37h46v46h-46zM138 48h25v24h-25z',
    'M116 43H98V29H79m37 28H79m37 13H94v19H79m106-46h16V31h20m-36 25h36m-36 14h17v18h19M135 29v-8m15 8v-8m15 8v-8m-30 72v8m15-8v8m15-8v8',
    'M107 43h20m-20 14h20m-20 13h20m46-27h12m-12 13h12m-12 14h12'
  ]
};

function artwork(visual) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 300 120');
  svg.setAttribute('aria-hidden', 'true');
  for (const path of (visuals[visual] ?? visuals.platform)) {
    const child = document.createElementNS(ns, 'path');
    child.setAttribute('d', path);
    svg.append(child);
  }
  return svg;
}

export function renderProjects(projects) {
  const grid = byId('project-grid');
  const filters = byId('project-filters');
  const status = byId('project-status');
  const visibleProjects = projects.filter((project) => !project.draft && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id) && available(project.title));
  const cards = new Map();

  grid.replaceChildren();
  for (const project of visibleProjects) {
    if (cards.has(project.id)) continue;
    const article = element('article', 'project-card');
    article.id = 'project-' + project.id;
    const art = element('div', 'project-art');
    art.append(image(project.image, () => art.append(artwork(project.visual))) ?? artwork(project.visual));
    const body = element('div', 'project-content');
    const classification = project.illustrative ? 'Illustrative concept' : project.status;
    body.append(element('p', 'project-meta', [project.category, classification].filter(available).join(' · ')));
    body.append(element('h3', '', project.title));
    if (available(project.description)) body.append(element('p', 'project-summary', project.description));
    const tech = tags(project.technologies);
    if (tech) body.append(tech);

    const details = element('details', 'project-detail');
    const summary = element('summary', '', 'View case study');
    summary.setAttribute('aria-label', 'View case study: ' + project.title);
    const detailBody = element('div', 'detail-body');
    if (project.illustrative) detailBody.append(element('p', '', 'This concept illustrates a design approach. The testing steps are proposals.'));
    const fields = { ...project.caseStudy };
    if (Array.isArray(project.features) && project.features.filter(available).length) {
      const feature = element('div');
      feature.append(element('h4', '', 'Key technical features'), element('p', '', project.features.filter(available).join(' · ')));
      detailBody.append(feature);
    }
    for (const [key, label] of Object.entries(caseFields)) {
      if (!available(fields[key])) continue;
      const block = element('div');
      block.append(element('h4', '', label), element('p', '', fields[key]));
      detailBody.append(block);
    }
    for (const asset of project.gallery ?? []) {
      const img = image(asset);
      if (img) detailBody.append(img);
    }
    const links = [link('Source repository ↗', httpsLink(project.githubUrl)), link('Demo ↗', httpsLink(project.demoUrl))].filter(Boolean);
    if (links.length) {
      const row = element('div', 'text-links');
      row.append(...links);
      detailBody.append(row);
    }
    if (detailBody.childElementCount) {
      details.append(summary, detailBody);
      body.append(details);
    }
    article.append(art, body);
    cards.set(project.id, { article, category: project.category, details });
    grid.append(article);
  }
  if (!cards.size) grid.append(element('p', 'muted', 'Approved project material is pending.'));
  if (!visibleProjects.some((project) => project.illustrative)) {
    byId('project-intro').textContent = 'Selected projects from my engineering work.';
  }

  const categories = [...new Set([...cards.values()].map((card) => card.category).filter(available))];
  const filterButtons = new Map();

  function select(category) {
    let count = 0;
    for (const { article, category: group } of cards.values()) {
      article.hidden = Boolean(category && group !== category);
      if (!article.hidden) count++;
    }
    for (const [option, button] of filterButtons) button.setAttribute('aria-pressed', String(category === option));
    status.textContent = count === 1 ? '1 project shown' : count + ' projects shown';
  }
  if (cards.size >= 3 && categories.length > 1) {
    for (const category of ['', ...categories]) {
      const button = element('button', '', category || 'All');
      button.type = 'button';
      button.setAttribute('aria-pressed', String(!category));
      button.addEventListener('click', () => select(category));
      filterButtons.set(category, button);
      filters.append(button);
    }
    filters.hidden = false;
  }

  function openByHash() {
    if (!location.hash.startsWith('#project-')) return;
    const card = cards.get(location.hash.slice(9));
    if (!card) return;
    if (card.article.hidden) select('');
    if (card.details.isConnected) card.details.open = true;
    card.article.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
  window.addEventListener('hashchange', openByHash);
  byId('experience-list').addEventListener('click', (event) => {
    const link = event.target.closest('.role-project');
    if (link && link.hash === location.hash) openByHash();
  });
  openByHash();
  return new Set(cards.keys());
}
