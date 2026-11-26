import { available, byId, httpsLink, link, publicEmail } from './dom.js';

export function initContact(config, socials) {
  const form = byId('contact-form');
  const submit = byId('contact-submit');
  const mode = byId('contact-mode');
  const status = byId('contact-status');
  const email = publicEmail(config.email);
  const endpoint = config.mode === 'provider' ? httpsLink(config.endpoint) : null;
  const emailLink = email ? 'mailto:' + email : null;

  if (emailLink) byId('contact-links').append(link('Email directly', emailLink));
  if (available(config.phone) && /^\+?\d[\d ().-]{5,24}$/.test(config.phone)) {
    byId('contact-links').append(link(config.phone, 'tel:' + config.phone.replace(/[^+\d]/g, '')));
  }
  const linkedIn = !endpoint && !emailLink ? socials.find(({ label }) => label === 'LinkedIn') : undefined;
  if (linkedIn) byId('contact-links').append(link('Message me on LinkedIn', linkedIn.href, 'button primary'));
  byId('contact-links').append(...socials.filter((profile) => profile !== linkedIn).map(({ label, href }) => link(label, href)));
  if (!endpoint && !emailLink) return;
  form.hidden = false;
  mode.hidden = false;
  if (endpoint) {
    mode.textContent = 'This form sends your message through ' + (available(config.providerName) ? config.providerName : 'the configured contact provider') + '.';
    submit.textContent = 'Send message';
  } else if (emailLink) {
    mode.textContent = 'This form prepares a draft in your email application. Review it there before sending.';
    submit.textContent = 'Open email draft ↗';
  }
  submit.disabled = false;

  function say(message, error = false) {
    status.textContent = message;
    status.toggleAttribute('data-error', error);
  }

  form.addEventListener('input', (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      event.target.setCustomValidity('');
    }
  });
  form.addEventListener('invalid', () => say('Check the highlighted field and try again.', true), true);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    const fields = ['name', 'email', 'subject', 'message'].map((name) => form.elements.namedItem(name));
    for (const field of fields) {
      if (!field.value.trim()) field.setCustomValidity('Enter a value for this field.');
    }
    if (!form.reportValidity()) return;
    const [name, sender, subject, message] = fields.map((field) => field.value.trim());

    if (endpoint) {
      submit.disabled = true;
      fields.forEach((field) => { field.readOnly = true; });
      say('Sending your message…');
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
          signal: AbortSignal.timeout(15000)
        });
        if (!response.ok || (await response.json()).ok !== true) throw new Error('Message unconfirmed');
        form.reset();
        say('The contact provider confirmed your message.');
      } catch {
        say('Your message could not be confirmed. Please try again' + (email ? ' or use the direct email link.' : '.'), true);
      } finally {
        submit.disabled = false;
        fields.forEach((field) => { field.readOnly = false; });
      }
      return;
    }

    const body = name + ' (' + sender + ')\r\n\r\n' + message.replace(/\r?\n/g, '\r\n');
    const draft = emailLink + '?subject=' + encodeURIComponent(subject.replace(/[\r\n]/g, ' ')) + '&body=' + encodeURIComponent(body);
    if (draft.length > 1900) {
      say('This email draft is too long for some email apps. Shorten the message or copy it into a direct email.', true);
      return;
    }
    say('Opening your email application with a draft. Send it from your email app when ready.');
    location.href = draft;
  });
}
