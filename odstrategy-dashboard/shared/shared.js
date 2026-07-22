(function () {
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const logoutButton = document.getElementById('logout-button');
  const actionSheetLink = document.getElementById('action-sheet-link');
  const errorNode = document.getElementById('login-error');
  let revenueChart;
  let pipelineChart;

  logoutButton.hidden = true;
  logoutButton.style.display = 'none';
  if (actionSheetLink) {
    actionSheetLink.hidden = true;
    actionSheetLink.style.display = 'none';
  }

  function list(items, ordered) {
    const tag = ordered ? 'ol' : 'ul';
    return `<${tag}>${(items || []).map((item) => `<li>${item}</li>`).join('')}</${tag}>`;
  }

  function renderDailyGuide(plan) {
    const container = document.getElementById('daily-guide');
    if (!container) return;
    container.innerHTML = `
      <div class="daily-focus"><span>${plan.date}</span><strong>${plan.focus}</strong></div>
      <div class="task-list">
        ${(plan.tasks || []).map((task) => `
          <article class="task-card">
            <div class="task-topline"><h3>${task.what}</h3><span class="task-status">${task.status}</span></div>
            <dl>
              <div><dt>When</dt><dd>${task.when}</dd></div>
              <div><dt>Where</dt><dd>${task.where}</dd></div>
              <div><dt>Why</dt><dd>${task.why}</dd></div>
              <div><dt>How</dt><dd>${task.how}</dd></div>
            </dl>
          </article>`).join('')}
      </div>`;
  }

  function renderCharts(data) {
    if (!window.Chart) return;
    const revenueCanvas = document.getElementById('revenue-chart');
    const pipelineCanvas = document.getElementById('pipeline-chart');

    if (revenueChart) revenueChart.destroy();
    if (pipelineChart) pipelineChart.destroy();

    revenueChart = new Chart(revenueCanvas, {
      type: 'bar',
      data: {
        labels: data.financial.monthly.map((item) => item.month),
        datasets: [
          { label: 'Plan', data: data.financial.monthly.map((item) => item.plan), backgroundColor: '#123f5a', borderRadius: 6 },
          { label: 'Actual', data: data.financial.monthly.map((item) => item.actual), backgroundColor: '#1b9a9b', borderRadius: 6 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: { y: { beginAtZero: true, ticks: { callback: (value) => `$${value / 1000}k` } } }
      }
    });

    pipelineChart = new Chart(pipelineCanvas, {
      type: 'bar',
      data: {
        labels: ['Qualified', 'Contacted', 'Scheduled', 'Completed', 'Proposals', 'Paid starters', 'Retainers'],
        datasets: [{
          label: 'Cumulative prospects',
          data: [data.pipeline.qualifiedProspects, data.pipeline.contacted, data.pipeline.discoveryScheduled || 0, data.pipeline.discoveryCalls, data.pipeline.proposals, data.pipeline.paidStarters, data.pipeline.activeRetainers],
          backgroundColor: ['#123f5a', '#1b9a9b', '#2caaaa', '#3faeae', '#6ec1c1', '#9bd5d5', '#c7e8e8'],
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    });
  }

  function render(data) {
    loginView.hidden = true;
    dashboardView.hidden = false;
    logoutButton.hidden = false;
    logoutButton.style.display = 'inline-flex';
    if (actionSheetLink) {
      actionSheetLink.hidden = false;
      actionSheetLink.style.display = 'inline-flex';
    }

    document.getElementById('shared-overall-status').textContent = data.meta.overallStatus;
    document.getElementById('shared-updated').textContent = `Updated ${data.meta.asOf} · ${data.meta.syncSource || 'live data'}`;
    const cumulativeNarrative = data.meta.cumulativeNarrative || `Launch progress to date includes ${data.pipeline.qualifiedProspects} qualified prospects representing ${money.format(data.pipeline.preliminaryValue)} in preliminary opportunity value, ${data.pipeline.contactsSent || 0} personalized contacts, ${data.pipeline.responses || 0} responses, ${data.pipeline.discoveryScheduled || 0} meeting scheduled, ${data.training.loggedHours} training hours logged, and ${data.workload.confirmedHours} confirmed startup work hours. Client-facing sales materials and the operating sales process remain part of the cumulative launch record.`;
    document.getElementById('shared-status-copy').textContent = cumulativeNarrative;

    const kpis = [
      ['Revenue to date', money.format(data.financial.actualRevenueToDate), 'Cumulative collected revenue'],
      ['Qualified prospects', data.pipeline.qualifiedProspects, 'Cumulative qualified pipeline'],
      ['Contacts sent', data.pipeline.contactsSent || 0, 'Cumulative outreach contacts'],
      ['Responses', data.pipeline.responses || 0, 'Cumulative prospect responses'],
      ['Training logged', `${data.training.loggedHours} / ${data.training.totalRequiredHours}`, `${data.training.eligibleHours || 0} eligible; ${data.training.pendingHours || 0} pending verification`],
      ['Work hours', data.workload.confirmedHours, 'Cumulative confirmed startup hours']
    ];
    document.getElementById('private-kpis').innerHTML = kpis.map(([label, value, note]) => `<article class="private-kpi"><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`).join('');

    const trainingPercent = Math.min(100, (data.training.loggedHours / data.training.totalRequiredHours) * 100);
    document.getElementById('training-progress-label').textContent = `${trainingPercent.toFixed(0)}% logged`;
    document.getElementById('training-progress-bar').style.width = `${trainingPercent}%`;
    document.getElementById('training-progress-copy').innerHTML = `<strong>${data.training.loggedHours} of ${data.training.totalRequiredHours} total hours logged</strong><p>${data.training.eligibleHours || 0} hour(s) verified eligible; ${data.training.pendingHours || 0} hour(s) pending verification; ${data.training.remainingHours ?? Math.max(0, data.training.totalRequiredHours - data.training.loggedHours)} hour(s) still required.</p>`;

    document.getElementById('monthly-financials').innerHTML = data.financial.monthly.map((item) => `<tr><td>${item.month}</td><td>${money.format(item.plan)}</td><td>${money.format(item.actual)}</td><td>${money.format(item.expenses)}</td><td>${money.format(item.actualDraw)}</td></tr>`).join('');
    document.getElementById('household-bridge').innerHTML = `<p><strong>Required household support:</strong> ${money.format(data.financial.requiredOwnerDrawToDate)}</p><p><strong>Business-funded draw:</strong> ${money.format(data.financial.actualOwnerDrawToDate)}</p><p><strong>Outside-income bridge:</strong> ${money.format(data.financial.outsideIncomeUsed)}</p><p>${data.financial.bridgeNote}</p>`;
    document.getElementById('pipeline-summary').innerHTML = `<p><strong>Qualified prospects:</strong> ${data.pipeline.qualifiedProspects}</p><p><strong>Preliminary value:</strong> ${money.format(data.pipeline.preliminaryValue)}</p><p><strong>Contacts sent:</strong> ${data.pipeline.contactsSent || 0}</p><p><strong>Unique prospects contacted:</strong> ${data.pipeline.contacted}</p><p><strong>Responses:</strong> ${data.pipeline.responses || 0}</p><p><strong>Discovery scheduled:</strong> ${data.pipeline.discoveryScheduled || 0}</p><p><strong>Discovery completed:</strong> ${data.pipeline.discoveryCalls}</p><p><strong>Proposals:</strong> ${data.pipeline.proposals}</p><p><strong>Paid starters:</strong> ${data.pipeline.paidStarters}</p><p><strong>Active retainers:</strong> ${data.pipeline.activeRetainers}</p><p><strong>Prospecting hours:</strong> ${data.pipeline.prospectingHours || 0}</p>`;
    document.getElementById('activity-summary').innerHTML = list(data.pipeline.currentActions.slice(0, 5), true);
    document.getElementById('project-summary').innerHTML = list(data.projects, false);
    document.getElementById('capacity-summary').innerHTML = `<p><strong>Confirmed work-log hours:</strong> ${data.workload.confirmedHours}</p><p><strong>Action-sheet hours:</strong> ${data.workload.actionSheetHours ?? data.workload.confirmedHours}</p><p><strong>Cumulative break minutes:</strong> ${data.workload.cumulativeBreakMinutes || 0}</p><p><strong>Pending open-day entries:</strong> ${data.workload.pendingEntries}</p><p><strong>Capacity:</strong> ${data.workload.capacityStatus}</p>`;
    document.getElementById('risk-summary').innerHTML = data.risks.slice(0, 5).map((item) => `<div class="alert"><strong>${item.risk}</strong><p>${item.response}</p></div>`).join('');
    document.getElementById('seap-summary').innerHTML = data.compliance.deadlines.slice(0, 5).map((item) => `<div class="deadline-row"><strong>${item.date}</strong><span>${item.item}</span><em>${item.status}</em></div>`).join('');
    document.getElementById('professional-summary').innerHTML = data.professionalGates.map((item) => `<div class="alert"><strong>${item.name}</strong><p>${item.status}: ${item.action}</p></div>`).join('');
    document.getElementById('decision-summary').innerHTML = `<h4>Current priorities</h4>${list(data.actions, true)}<h4>Cumulative decisions</h4>${list(data.decisions, false)}`;
    document.getElementById('record-links').innerHTML = data.recordLinks.map((item) => `<a class="record-link" href="${item.url}" target="_blank" rel="noopener">${item.name}</a>`).join('');
    document.getElementById('document-links').innerHTML = data.approvedDocuments.length ? data.approvedDocuments.map((item) => `<a class="record-link" href="${item.url}" target="_blank" rel="noopener">${item.name}</a>`).join('') : '<p>No supporting documents are currently approved for direct shared access.</p>';

    renderCharts(data);
  }

  async function load() {
    const response = await fetch('/api/session', { credentials: 'same-origin', cache: 'no-store' });
    const session = await response.json().catch(() => ({}));
    if (!response.ok || !session.authenticated) return;

    const [dataResponse, dailyResponse] = await Promise.all([
      fetch('/api/private-data', { credentials: 'same-origin', cache: 'no-store' }),
      fetch('/api/daily-plan', { credentials: 'same-origin', cache: 'no-store' })
    ]);
    if (!dataResponse.ok) {
      const detail = await dataResponse.json().catch(() => ({}));
      throw new Error(detail.message || 'Protected dashboard data could not be loaded.');
    }
    render(await dataResponse.json());
    if (dailyResponse.ok) renderDailyGuide(await dailyResponse.json());
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
    logoutButton.style.display = 'none';
    if (actionSheetLink) {
      actionSheetLink.hidden = true;
      actionSheetLink.style.display = 'none';
    }
    loginView.hidden = false;
  });

  load().catch((error) => { errorNode.textContent = error.message; });
}());