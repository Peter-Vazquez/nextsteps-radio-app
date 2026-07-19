(function () {
  const polish = document.createElement('link');
  polish.rel = 'stylesheet';
  polish.href = '/responsive-polish.css';
  document.head.appendChild(polish);

  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  function setHtml(id, html) {
    const node = document.getElementById(id);
    if (node) node.innerHTML = html;
  }

  function setText(id, text) {
    const node = document.getElementById(id);
    if (node) node.textContent = text;
  }

  function renderOperatingCase(data) {
    const operating = data.operatingCase;
    if (!operating) return;

    setHtml('private-purpose', operating.purpose.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join(''));
    setHtml('private-services', operating.services.map(([name, price, label, description]) => `<article><span class="tag">${label}</span><h3>${name}</h3><p class="price">${money.format(price)}</p><p>${description}</p></article>`).join(''));
    setHtml('private-market', operating.market.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join(''));
    setText('private-beachhead', operating.beachhead);
    setHtml('annual-financials', data.financial.annualPlans.map(([year, revenue, draw, cash, status]) => `<tr><td><strong>${year}</strong></td><td>${money.format(revenue)}</td><td>${money.format(draw)}</td><td>${money.format(cash)}</td><td>${status}</td></tr>`).join(''));
    setHtml('private-growth', operating.growth.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join(''));
    setHtml('private-milestones', operating.milestones.map(([date, name, evidence]) => `<article class="milestone"><time>${date}</time><div><strong>${name}</strong><p>${evidence}</p></div></article>`).join(''));
  }

  function renderCloseout(closeout) {
    setText('shared-updated', `Updated ${closeout.asOf}`);
    setText('shared-overall-status', closeout.overallStatus);
    setText('shared-status-copy', closeout.statusExplanation);
    setHtml('capacity-summary', `<p><strong>Confirmed hours:</strong> ${closeout.confirmedHours}</p><p><strong>Pending entries:</strong> ${closeout.pendingEntries}</p><p><strong>Capacity:</strong> ${closeout.capacityStatus}</p>`);

    document.querySelectorAll('.private-kpi').forEach((card) => {
      const label = card.querySelector('span');
      const value = card.querySelector('strong');
      if (label && value && label.textContent.trim() === 'Work hours') value.textContent = closeout.confirmedHours;
    });
  }

  async function refreshOperatingCase() {
    const sessionResponse = await fetch('/api/session', { credentials: 'same-origin', cache: 'no-store' });
    const session = await sessionResponse.json().catch(() => ({}));
    if (!sessionResponse.ok || !session.authenticated) return;

    const [dataResponse, closeoutResponse] = await Promise.all([
      fetch('/api/private-data', { credentials: 'same-origin', cache: 'no-store' }),
      fetch('/api/closeout-data', { credentials: 'same-origin', cache: 'no-store' })
    ]);

    if (dataResponse.ok) renderOperatingCase(await dataResponse.json());
    if (closeoutResponse.ok) setTimeout(async () => renderCloseout(await closeoutResponse.json()), 100);
  }

  document.addEventListener('DOMContentLoaded', () => {
    refreshOperatingCase();
    const form = document.getElementById('login-form');
    if (form) form.addEventListener('submit', () => setTimeout(refreshOperatingCase, 800));
  });
}());
