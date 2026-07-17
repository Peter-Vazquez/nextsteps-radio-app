(function () {
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

    const kpiRow = document.getElementById('private-kpis');
    if (kpiRow && !document.getElementById('private-pipeline-value')) {
      const card = document.createElement('article');
      card.className = 'private-kpi';
      card.id = 'private-pipeline-value';
      card.innerHTML = `<span>Preliminary pipeline</span><strong>${money.format(data.pipeline.preliminaryValue)}</strong>`;
      kpiRow.appendChild(card);
    }

    const pipeline = document.getElementById('pipeline-summary');
    if (pipeline && !pipeline.textContent.includes('Preliminary value')) {
      const item = document.createElement('p');
      item.innerHTML = `<strong>Preliminary value:</strong> ${money.format(data.pipeline.preliminaryValue)}`;
      pipeline.insertBefore(item, pipeline.children[1] || null);
    }
  }

  async function refreshOperatingCase() {
    const sessionResponse = await fetch('/api/session', { credentials: 'same-origin', cache: 'no-store' });
    const session = await sessionResponse.json().catch(() => ({}));
    if (!sessionResponse.ok || !session.authenticated) return;
    const dataResponse = await fetch('/api/private-data', { credentials: 'same-origin', cache: 'no-store' });
    if (!dataResponse.ok) return;
    renderOperatingCase(await dataResponse.json());
  }

  document.addEventListener('DOMContentLoaded', () => {
    refreshOperatingCase();
    const form = document.getElementById('login-form');
    if (form) form.addEventListener('submit', () => setTimeout(refreshOperatingCase, 800));
  });
}());