/* CreatorPromote: request briefs, FormSubmit email delivery, and directory filters. */
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
    const sendForm = document.getElementById('send-request-form');
    const sendButton = document.getElementById('send-request');
    let submitting = false;
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
      const references = get('reference').split(/[,\r\n]+/).map(link => link.trim()).filter(Boolean);
      let invalidIndex = -1;
      references.some((link, index) => {
        try {
          const url = new URL(link);
          if (!/^https?:\/\//i.test(link) || !['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password || /\s/.test(link)) {
            invalidIndex = index;
            return true;
          }
        } catch {
          invalidIndex = index;
          return true;
        }
        return false;
      });
      reference.setCustomValidity(!references.length
        ? 'Add at least one public reference link, starting with https://.'
        : invalidIndex >= 0
          ? `Reference link ${invalidIndex + 1} is not valid. Use a full http:// or https:// link and separate links with commas or new lines.`
          : '');
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
        references.map((link, index) => `${index + 1}. ${link}`).join('\n'),
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
      document.getElementById('send-name').value = get('name');
      document.getElementById('send-contact').value = get('contact');
      document.getElementById('send-message').value = output.value;
      submitting = false;
      sendButton.disabled = false;
      sendButton.textContent = 'Send request ↗';
      status.textContent = '';
      form.hidden = true;
      result.hidden = false;
      resultTitle.focus();
    });

    // This is a regular HTTPS form POST. No mail app, API key, or client-side SMTP.
    // FormSubmit handles email delivery, its verification step, and confirmation.
    sendForm.addEventListener('submit', event => {
      if (submitting || !output.value) {
        event.preventDefault();
        return;
      }
      document.getElementById('send-message').value = output.value;
      submitting = true;
      sendButton.disabled = true;
      sendButton.textContent = 'Sending…';
      status.textContent = 'Opening secure verification and submission. Your brief stays available here if you need to come back.';
    });
    // Restore the send button when returning from the provider with Back.
    window.addEventListener('pageshow', () => {
      submitting = false;
      sendButton.disabled = false;
      sendButton.textContent = 'Send request ↗';
      status.textContent = '';
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
        status.textContent = 'Copied. You can also press Send request to email your brief directly to PMOG.';
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
