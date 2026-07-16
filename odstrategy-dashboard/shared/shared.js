(function () {
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const logoutButton = document.getElementById('logout-button');
  const errorNode = document.getElementById('login-error');

  function list(items, ordered) {
    const tag = ordered ? 'ol' : 'ul';
    return `<${tag}>${(items || []).map((item) => `<li>${item}</li>`).join('')}</${tag}>`;
  }

  function render(data) {
    loginView.hidden = true;
    dashboardView.hidden = false;
    logoutButton.hidden = false;
    document.getElementById('shared-overall-status').textContent = data.meta.overallStatus;
    document.getElementById('shared-updated').textContent = `Updated ${data.meta.asOf}`;
    document.getElementById('shared-status-copy').textContent = data.meta.statusExplanation;

    const kpis = [
      ['Revenue to date', money.format(data.financial.actualRevenueToDate)],
      ['Expenses to date', money.format(data.financial.actualExpensesToDate)],
      ['Business cash', money.format(data.financial.endingCash)],
      ['Owner draw paid', money.format(data.financial.actualOwnerDrawToDate)],
      ['Qualified prospects', data.pipeline.qualifiedProspects],
      ['Contacts completed', data.pipeline.contacted],
      ['Training hours', `${data.training.loggedHours} / ${data.training.totalRequiredHours}`],
      ['Confirmed work hours', data.workload.confirmedHours]
    ];
    document.getElementById('private-kpis').innerHTML = kpis.map(([label, value]) => `<article class="private-kpi"><span>${label}</span><strong>${value}</strong></article>`).join('');

    document.getElementById('monthly-financials').innerHTML = data.financial.monthly.map((item) => `<tr><td>${item.month}</td><td>${money.format(item.plan)}</td><td>${money.format(item.actual)}</td><td>${money.format(item.expenses)}</td><td>${money.format(item.actualDraw)}</td></tr>`).join('');
    document.getElementById('household-bridge').innerHTML = `<p><strong>Required household support:</strong> ${money.format(data.financial.requiredOwnerDrawToDate)}</p><p><strong>Business-funded draw:</strong> ${money.format(data.financial.actualOwnerDrawToDate)}</p><p><strong>Outside-income bridge used:</strong> ${money.format(data.financial.outsideIncomeUsed)}</p><p>${data.financial.bridgeNote}</p>`;
    document.getElementById('pipeline-summary').innerHTML = `<p><strong>Qualified:</strong> ${data.pipeline.qualifiedProspects}</p><p><strong>Contacted:</strong> ${data.pipeline.contacted}</p><p><strong>Discovery calls:</strong> ${data.pipeline.discoveryCalls}</p><p><strong>Proposals:</strong> ${data.pipeline.proposals}</p><p><strong>Paid starters:</strong> ${data.pipeline.paidStarters}</p><p><strong>Active retainers:</strong> ${data.pipeline.activeRetainers}</p>`;
    document.getElementById('activity-summary').innerHTML = list(data.pipeline.currentActions, true);
    document.getElementById('project-summary').innerHTML = list(data.projects, false);
    document.getElementById('capacity-summary').innerHTML = `<p><strong>Confirmed hours:</strong> ${data.workload.confirmedHours}</p><p><strong>Pending time entries:</strong> ${data.workload.pendingEntries}</p><p><strong>Training hours:</strong> ${data.training.loggedHours}</p><p><strong>Capacity status:</strong> ${data.workload.capacityStatus}</p>`;
    document.getElementById('risk-summary').innerHTML = data.risks.map((item) => `<div class="alert"><strong>${item.risk}</strong><p>${item.response}</p></div>`).join('');
    document.getElementById('seap-summary').innerHTML = `<p><strong>Training:</strong> ${data.training.loggedHours} of ${data.training.totalRequiredHours} hours logged.</p>${data.compliance.deadlines.map((item) => `<div class="alert"><strong>${item.date}: ${item.item}</strong><p>${item.status}</p></div>`).join('')}`;
    document.getElementById('professional-summary').innerHTML = data.professionalGates.map((item) => `<div class="alert"><strong>${item.name}</strong><p>${item.status}: ${item.action}</p></div>`).join('');
    document.getElementById('decision-summary').innerHTML = `<h4>Priorities</h4>${list(data.actions, true)}<h4>Current decisions</h4>${list(data.decisions, false)}`;
    document.getElementById('record-links').innerHTML = data.recordLinks.map((item) => `<a class="record-link" href="${item.url}" target="_blank" rel="noopener">${item.name}</a>`).join('');
    document.getElementById('document-links').innerHTML = data.approvedDocuments.length ? data.approvedDocuments.map((item) => `<a class="record-link" href="${item.url}" target="_blank" rel="noopener">${item.name}</a>`).join('') : '<p>No supporting documents are currently approved for direct shared access.</p>';
  }

  async function load() {
    const response = await fetch('/api/session', { credentials: 'same-origin', cache: 'no-store' });
    const session = await response.json().catch(() => ({}));
    if (!response.ok || !session.authenticated) return;
    const dataResponse = await fetch('/api/private-data', { credentials: 'same-origin', cache: 'no-store' });
    if (!dataResponse.ok) throw new Error('Protected dashboard data could not be loaded.');
    render(await dataResponse.json());
  }

  document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    errorNode.textContent = '';
    const password = document.getElementById('dashboard-password').value;
    const response = await fetch('/api/login', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) { errorNode.textContent = result.message || 'Access denied.'; return; }
    document.getElementById('dashboard-password').value = '';
    await load();
  });

  logoutButton.addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' });
    dashboardView.hidden = true;
    logoutButton.hidden = true;
    loginView.hidden = false;
  });

  load().catch((error) => { errorNode.textContent = error.message; });
}());
