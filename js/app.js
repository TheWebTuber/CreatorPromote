/* CreatorPromote: small, independent enhancements. No trackers or backend. */
(() => {
  'use strict';

  // Replace this with your own email, Discord invite, or request-form URL later.
  const CONTACT_URL = 'https://pmog.creatorpromote.com/links';
  document.querySelectorAll('[data-contact-link]').forEach(link => {
    link.href = CONTACT_URL;
  });

  const requestForm = document.getElementById('request-form');
  if (requestForm) setupRequestBuilder(requestForm);

  const searchForm = document.getElementById('directory-search');
  if (searchForm) setupDirectory(searchForm);

  function setupRequestBuilder(form) {
    const domainInput = document.getElementById('request-domain');
    const domainName = document.getElementById('domain-name');
    const result = document.getElementById('brief-result');
    const output = document.getElementById('brief-output');
    const status = document.getElementById('copy-status');
    const resultTitle = document.getElementById('result-title');
    form.hidden = false;

    function normalizeDomain(value) {
      return value.trim().toLowerCase();
    }

    domainInput.addEventListener('input', () => {
      domainInput.setCustomValidity('');
      const name = normalizeDomain(domainInput.value);
      // Use textContent: visitor text is never treated as HTML.
      domainName.textContent = name || 'yourname';
    });
    domainInput.addEventListener('change', () => {
      domainInput.value = normalizeDomain(domainInput.value);
      domainName.textContent = domainInput.value || 'yourname';
    });

    form.addEventListener('submit', event => {
      event.preventDefault();
      const fields = new FormData(form);
      const get = name => String(fields.get(name) || '').trim();
      const domain = normalizeDomain(get('domain'));
      domainInput.value = domain;
      const validDomain = !domain || /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(domain);
      domainInput.setCustomValidity(validDomain ? '' : 'Use letters, numbers, or hyphens. Start and end with a letter or number.');
      if (!form.reportValidity()) return;

      for (const id of ['request-name', 'request-contact', 'request-idea', 'request-style']) {
        const field = document.getElementById(id);
        field.setCustomValidity(field.value.trim() ? '' : 'Please add a few details here.');
        if (!field.reportValidity()) return;
      }
      const reference = document.getElementById('request-reference');
      let validReference = false;
      try {
        validReference = ['http:', 'https:'].includes(new URL(get('reference')).protocol);
      } catch { /* The field displays a validation message below. */ }
      reference.setCustomValidity(validReference ? '' : 'Please use a public http:// or https:// reference link.');
      if (!reference.reportValidity()) return;

      output.value = [
        'Hi PMOG! I’d like to discuss a website with CreatorPromote.',
        '',
        'ABOUT ME',
        `Name: ${get('name')}`,
        `Contact: ${get('contact')}`,
        `Website type: ${get('type')}`,
        '',
        'MY IDEA',
        get('idea'),
        '',
        'PREFERRED ADDRESS',
        domain ? `${domain}.creatorpromote.com (subject to availability and agreement)` : 'Not decided yet — happy to discuss a name.',
        '',
        'REFERENCES',
        get('reference'),
        `What I like: ${get('style')}`,
        '',
        'PAGES & CONTENT',
        get('pages') || 'To discuss.',
        '',
        'WORK ARRANGEMENT',
        get('arrangement'),
        '',
        'EXTRAS & EXPECTATIONS',
        get('extras') || 'Nothing else to add yet.',
        '',
        'I understand this is a request, not a booking or a name reservation. Scope, hosting, timing, and any costs need to be agreed with PMOG.'
      ].join('\n');
      status.textContent = '';
      form.hidden = true;
      result.hidden = false;
      resultTitle.focus();
    });

    // Clear custom validation as the visitor corrects a field.
    form.addEventListener('input', event => {
      if (typeof event.target.setCustomValidity === 'function') {
        event.target.setCustomValidity('');
      }
    });

    document.getElementById('edit-brief').addEventListener('click', () => {
      result.hidden = true;
      form.hidden = false;
      document.getElementById('request-name').focus();
    });

    document.getElementById('copy-brief').addEventListener('click', async () => {
      try {
        if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(output.value);
        status.textContent = 'Copied. Open Contact PMOG and paste your request into a message.';
      } catch {
        output.focus();
        output.select();
        status.textContent = 'Your brief is selected. Copy it using your device’s copy command, then send it to PMOG.';
      }
    });

    document.getElementById('download-brief').addEventListener('click', () => {
      const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'creatorpromote-website-request.txt';
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Give the browser time to start reading the object URL before revoking it.
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = 'Your download has been requested. Send the brief to PMOG to start the conversation.';
    });
  }

  function setupDirectory(form) {
    const query = document.getElementById('search-query');
    const category = document.getElementById('search-category');
    const cards = [...document.querySelectorAll('.directory-card')];
    const count = document.getElementById('search-count');
    const empty = document.getElementById('no-results');
    const clear = document.getElementById('clear-search');
    const entries = cards.map(card => ({
      card,
      text: card.textContent.toLocaleLowerCase(),
      category: card.dataset.category
    }));
    form.hidden = false;

    function filter() {
      const terms = query.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
      const selected = category.value;
      let visible = 0;
      entries.forEach(entry => {
        const matches = (selected === 'all' || entry.category === selected)
          && terms.every(term => entry.text.includes(term));
        entry.card.hidden = !matches;
        if (matches) visible += 1;
      });
      count.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}`;
      empty.hidden = visible > 0;
      clear.hidden = query.value.length === 0;
    }

    form.addEventListener('submit', event => { event.preventDefault(); filter(); });
    query.addEventListener('input', filter);
    category.addEventListener('change', filter);
    clear.addEventListener('click', () => { query.value = ''; filter(); query.focus(); });
    document.getElementById('reset-search').addEventListener('click', () => {
      query.value = '';
      category.value = 'all';
      filter();
      query.focus();
    });
    filter();
  }
})();
