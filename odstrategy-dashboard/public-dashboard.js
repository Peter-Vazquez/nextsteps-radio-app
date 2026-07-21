(function () {
  const polish = document.createElement('link');
  polish.rel = 'stylesheet';
  polish.href = '/responsive-polish.css';
  document.head.appendChild(polish);

  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const setText = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  };

  function safeText(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function formatStamp(value) {
    if (!value) return 'Current live summary';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
    });
  }

  function renderCards(id, items, renderer) {
    const node = document.getElementById(id);
    if (node) node.innerHTML = items.map(renderer).join('');
  }

  function render(data) {
    setText('public-promise', data.meta.promise);
    setText('public-phase', data.meta.phase);
    setText('public-outreach', data.meta.outreachStart);
    setText('public-updated', formatStamp(data.meta.updated));

    const metrics = [
      ['Launch readiness', `${data.metrics.readinessScore}%`, `${data.metrics.openCriticalTasks} open critical tasks`],
      ['Qualified prospects', data.metrics.prospects, `${money.format(data.metrics.pipeline)} preliminary pipeline value`],
      ['Personalized contacts', data.metrics.contacts, `${data.metrics.weeklyContacts || 0} recorded this week`],
      ['Responses', data.metrics.responses, 'Current active-day responses'],
      ['Meetings scheduled', data.metrics.meetings, 'Discovery or relationship conversations'],
      ['Training progress', `${data.metrics.trainingEligible} / ${data.metrics.trainingRequired}`, `${data.metrics.trainingPending} hour(s) pending verification`]
    ];
    renderCards('public-kpis', metrics, ([label, value, note]) => `
      <article class="private-kpi"><span>${safeText(label)}</span><strong>${safeText(value)}</strong><small>${safeText(note)}</small></article>`);

    renderCards('public-workstreams', data.workstreams || [], (item) => `
      <article class="public-workstream-card">
        <div><span>${safeText(item.status)}</span><strong>${safeText(item.name)}</strong></div>
        <p>${safeText(item.standard)}</p>
        <small>Target: ${safeText(item.due)}</small>
      </article>`);

    renderCards('public-purpose', data.purpose || [], ([label, copy]) => `
      <article><span class="eyebrow">${safeText(label)}</span><p>${safeText(copy)}</p></article>`);

    renderCards('public-services', data.services || [], ([name, price, fit, scope]) => `
      <article><span class="eyebrow">${safeText(fit)}</span><h3>${safeText(name)}</h3><strong>${money.format(price)}</strong><p>${safeText(scope)}</p></article>`);

    renderCards('public-milestones', data.milestones || [], ([date, name, evidence]) => `
      <article class="milestone"><strong>${safeText(date)}</strong><div><h3>${safeText(name)}</h3><p>${safeText(evidence)}</p></div></article>`);
  }

  async function load() {
    try {
      const response = await fetch('/api/public-data', { cache: 'no-store' });
      if (!response.ok) throw new Error('Live public data unavailable.');
      render(await response.json());
    } catch (error) {
      render(window.OD_PUBLIC_DATA);
      const node = document.getElementById('public-updated');
      if (node) node.textContent = `${node.textContent} · approved fallback snapshot`;
    }
  }

  load();
}());