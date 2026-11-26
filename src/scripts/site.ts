export {};

const root = document.documentElement;
const themeToggle = document.querySelector<HTMLButtonElement>('#theme-toggle');
const scheme = matchMedia('(prefers-color-scheme: dark)');
let manualTheme = false;
try {
  const saved = localStorage.getItem('portfolio-theme');
  manualTheme = saved === 'light' || saved === 'dark';
} catch { /* Use this tab's theme if browser storage is unavailable. */ }

function setTheme(theme: 'light' | 'dark') {
  root.dataset.theme = theme;
  themeToggle?.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme');
}

setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
if (themeToggle) {
  themeToggle.hidden = false;
  themeToggle.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    manualTheme = true;
    setTheme(theme);
    try { localStorage.setItem('portfolio-theme', theme); } catch { /* This tab still keeps the preference. */ }
  });
}
scheme.addEventListener('change', (event) => {
  if (!manualTheme) setTheme(event.matches ? 'dark' : 'light');
});

const header = document.querySelector<HTMLElement>('.site-header');
const menu = document.querySelector<HTMLButtonElement>('#menu-toggle');
const navigation = document.querySelector<HTMLElement>('#site-nav');
const compact = matchMedia('(max-width: 980px)');

if (header && menu && navigation) {
  function showMenu(open: boolean) {
    menu!.setAttribute('aria-expanded', String(open));
    navigation!.hidden = compact.matches && !open;
  }

  function updateMenuMode() {
    menu!.hidden = !compact.matches;
    showMenu(false);
  }

  updateMenuMode();
  navigation.dataset.ready = '';
  compact.addEventListener('change', updateMenuMode);
  menu.addEventListener('click', () => showMenu(menu.getAttribute('aria-expanded') !== 'true'));
  header.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      showMenu(false);
      menu.focus();
    }
  });
  navigation.addEventListener('click', (event) => {
    if (!compact.matches || !(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a');
    if (!link) return;
    showMenu(false);
    if (link.hash && link.pathname === location.pathname) {
      const section = document.getElementById(link.hash.slice(1));
      section?.setAttribute('tabindex', '-1');
      section?.focus({ preventScroll: true });
    }
  });
}

const sectionLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-section]'));
const sections = sectionLinks.flatMap((link) => {
  const target = document.getElementById(link.dataset.section ?? '');
  return target ? [{ link, target }] : [];
}).sort((a, b) => (a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

if (sections.length) {
  let queued = false;
  function highlightSection() {
    queued = false;
    const anchorOffset = (header?.getBoundingClientRect().height ?? 0) + 44;
    let active = sections[0];
    for (const section of sections) {
      if (section.target.getBoundingClientRect().top > anchorOffset) break;
      active = section;
    }
    if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      active = sections.at(-1) ?? active;
    }
    for (const section of sections) {
      if (section === active) section.link.setAttribute('aria-current', 'location');
      else section.link.removeAttribute('aria-current');
    }
  }
  function scheduleHighlight() {
    if (!queued) requestAnimationFrame(highlightSection);
    queued = true;
  }
  window.addEventListener('scroll', scheduleHighlight, { passive: true });
  window.addEventListener('resize', scheduleHighlight);
  highlightSection();
}

const architecture = document.querySelector<HTMLElement>('#architecture');
const controls = architecture?.querySelector<HTMLElement>('.stage-list');
if (architecture && controls) {
  const buttons = [...controls.querySelectorAll<HTMLButtonElement>('[data-stage]')];
  const descriptions = [...architecture.querySelectorAll<HTMLElement>('[data-stage-detail]')];
  function showStage(id: string | undefined) {
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.stage === id));
    for (const description of descriptions) description.hidden = description.dataset.stageDetail !== id;
  }
  showStage(buttons[0]?.dataset.stage);
  architecture.dataset.ready = '';
  const pulse = architecture.querySelector('.telemetry-pulse');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const stopTransmission = () => architecture.classList.remove('is-transmitting');
  for (const button of buttons) button.addEventListener('click', () => {
    showStage(button.dataset.stage);
    if (!motion.matches) architecture.classList.add('is-transmitting');
  });
  pulse?.addEventListener('animationend', stopTransmission);
  motion.addEventListener('change', stopTransmission);

  const observer = new IntersectionObserver(([entry]) => {
    architecture.classList.toggle('in-view', Boolean(entry?.isIntersecting));
    if (!entry?.isIntersecting) stopTransmission();
  });
  observer.observe(architecture);
}

const filters = document.querySelector<HTMLElement>('.project-filters');
const status = document.querySelector<HTMLElement>('.filter-status');
if (filters && status) {
  const cards = [...document.querySelectorAll<HTMLElement>('[data-category]')];
  const buttons = [...filters.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  filters.hidden = false;
  status.hidden = false;
  for (const button of buttons) {
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
      for (const card of cards) card.hidden = Boolean(category && card.dataset.category !== category);
      const shown = cards.filter((card) => !card.hidden).length;
      status.textContent = shown ? 'Showing ' + shown + (shown === 1 ? ' case study.' : ' case studies.') : 'No case studies match this category.';
    });
  }
}

const contact = document.querySelector<HTMLFormElement>('.contact-form');
const submit = contact?.querySelector<HTMLButtonElement>('button[type="submit"]');
const formStatus = contact?.querySelector<HTMLElement>('.form-status');
const fields = contact?.querySelector<HTMLFieldSetElement>('.contact-fields');
if (contact && submit && formStatus && fields) {
  contact.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    const data = new FormData(contact);
    submit.disabled = true;
    fields.disabled = true;
    contact.setAttribute('aria-busy', 'true');
    formStatus.textContent = 'Sending your message…';
    try {
      const response = await fetch(contact.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
        signal: AbortSignal.timeout(15000)
      });
      if (!response.ok) throw new Error('Message was not accepted.');
      contact.reset();
      formStatus.textContent = 'Your message was sent.';
    } catch {
      formStatus.textContent = 'Your message could not be sent. Please try again or use the email link if available.';
    } finally {
      submit.disabled = false;
      fields.disabled = false;
      contact.removeAttribute('aria-busy');
    }
  });
}
