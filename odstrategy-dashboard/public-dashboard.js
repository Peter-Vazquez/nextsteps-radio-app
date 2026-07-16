(function () {
  const data = window.OD_PUBLIC_DATA;
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const setText = (id, value) => { const node = document.getElementById(id); if (node) node.textContent = value; };
  setText('public-promise', data.meta.promise);
  setText('public-phase', data.meta.phase);
  setText('public-outreach', data.meta.outreachStart);
  setText('public-updated', data.meta.updated);
  setText('metric-prospects', data.metrics.prospects);
  setText('metric-pipeline', money.format(data.metrics.pipeline));
  setText('metric-training', `${data.metrics.trainingLogged} / ${data.metrics.trainingRequired}`);
  setText('metric-contacts', data.metrics.contacts);

  document.getElementById('purpose-grid').innerHTML = data.purpose.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join('');
  document.getElementById('service-grid').innerHTML = data.services.map(([name, price, label, description]) => `<article><span class="tag">${label}</span><h3>${name}</h3><p class="price">${money.format(price)}</p><p>${description}</p></article>`).join('');
  document.getElementById('market-grid').innerHTML = data.market.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join('');
  document.getElementById('annual-plan-body').innerHTML = data.annualPlans.map(([year, revenue, draw, cash, status]) => `<tr><td><strong>${year}</strong></td><td>${money.format(revenue)}</td><td>${money.format(draw)}</td><td>${money.format(cash)}</td><td>${status}</td></tr>`).join('');
  document.getElementById('growth-grid').innerHTML = data.growth.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join('');
  document.getElementById('milestone-list').innerHTML = data.milestones.map(([date, name, evidence]) => `<article class="milestone"><time>${date}</time><div><strong>${name}</strong><p>${evidence}</p></div></article>`).join('');
}());
