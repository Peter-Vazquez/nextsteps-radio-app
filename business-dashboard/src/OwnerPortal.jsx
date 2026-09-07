import React, { useEffect, useState } from 'react';
import { money } from './dashboardData.js';

function Login({ onSuccess, lockedMessage }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Access denied.');
      setPassword('');
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return <main className="login-shell">
    <section className="login-card">
      <a className="brand" href="/"><span className="brand-mark">NS</span><span><strong>Next Steps</strong><small>Secure owner portal</small></span></a>
      <div><p className="eyebrow">Restricted access</p><h1>Owner operating dashboard</h1><p>The owner view is served only after server-side authentication. The password and signing secret are never stored in the browser application or repository.</p></div>
      {lockedMessage && <div className="secure-warning"><strong>Portal locked by design.</strong><p>{lockedMessage}</p></div>}
      <form onSubmit={submit}>
        <label htmlFor="owner-password">Owner password</label>
        <input id="owner-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required maxLength={256}/>
        <button type="submit" disabled={busy || Boolean(lockedMessage)}>{busy ? 'Verifying…' : 'Enter secure portal'}</button>
      </form>
      {error && <p className="form-error" role="alert">{error}</p>}
      <a href="/">Return to public dashboard</a>
    </section>
  </main>;
}

function PrivateKpi({ label, value, detail, warning = false }) {
  return <article className={warning ? 'private-kpi warning' : 'private-kpi'}><span>{label}</span><strong>{value}</strong><p>{detail}</p></article>;
}

function OwnerView({ data, onLogout }) {
  const f = data.financial;
  const p = data.pipeline;
  const t = data.training;

  return <div className="owner-shell">
    <header className="owner-header">
      <a className="brand" href="/"><span className="brand-mark">NS</span><span><strong>Next Steps</strong><small>Media & Digital Marketing Services</small></span></a>
      <div><span>Protected session</span><button type="button" onClick={onLogout}>Sign out</button></div>
    </header>

    <main>
      <div className="private-status">
        <span><strong>Fiscal year:</strong> {data.meta.currentFiscalYear}</span>
        <span><strong>As of:</strong> {data.meta.asOf}</span>
        <span><strong>Source:</strong> {data.meta.sourceMode}</span>
        <span><strong>Cache:</strong> No-store</span>
      </div>

      <section className="owner-hero">
        <div><p className="eyebrow">Private management view</p><h1>Operate from facts, not hope.</h1><p>Revenue conversion, cash, pipeline, SEAP compliance, and next actions are the governing management tests.</p></div>
        <aside><span>Overall status</span><strong>{data.meta.overallStatus}</strong><p>{data.meta.statusExplanation}</p></aside>
      </section>

      <section className="private-kpi-grid">
        <PrivateKpi label="Collected cash revenue" value={money.format(f.actualRevenueToDate)} detail="Business cash collected since launch." warning={f.actualRevenueToDate === 0}/>
        <PrivateKpi label="Active cash pipeline" value={money.format(f.activeCashPipeline)} detail="Dated cash opportunities only. Barter and closed/nurture records are excluded." />
        <PrivateKpi label="Cash-paying wins" value={f.cashPayingWins} detail={`${f.barterWins} noncash barter client win currently recorded.`} warning={f.cashPayingWins === 0}/>
        <PrivateKpi label="Ending business cash" value={money.format(f.endingBusinessCash)} detail="Owner draw and tax-reserve cash remain zero." warning={f.endingBusinessCash === 0}/>
        <PrivateKpi label="Actual SEAP training" value={`${t.actualHours.toFixed(2)} / ${t.totalRequiredHours}`} detail={`${t.remainingActualHours.toFixed(2)} additional actual hours currently needed.`} />
        <PrivateKpi label="Verified eligible training" value={t.verifiedHours.toFixed(2)} detail={`${t.pendingHours.toFixed(2)} hours remain pending explicit verification/acceptance.`} warning={t.verifiedHours < t.totalRequiredHours}/>
      </section>

      <section className="private-section">
        <div className="private-section-title"><p className="eyebrow">Revenue conversion</p><h2>Activity has to become collected cash.</h2><p>The current business problem is not a lack of plans, tools, or prospects. It is converting qualified opportunities into paying work.</p></div>
        <div className="private-chart-grid">
          <article className="pipeline-actions">
            <h3>Current funnel</h3>
            <p><span>CRM prospect records</span><strong>{p.prospectRecords}</strong></p>
            <p><span>Personalized contacts</span><strong>{p.personalizedContacts}</strong></p>
            <p><span>Discovery calls completed</span><strong>{p.discoveryCalls}</strong></p>
            <p><span>Proposals sent</span><strong>{p.proposals}</strong></p>
            <p><span>Clients won</span><strong>{p.clientsWon}</strong></p>
            <p><span>Cash-paying wins</span><strong>{p.cashPayingWins}</strong></p>
            <p><span>Overdue follow-ups</span><strong>{p.overdueFollowUps}</strong></p>
          </article>
          <article className="pipeline-actions">
            <h3>Weekly operating standard</h3>
            {Object.entries(p.weeklyTargets).map(([label, target]) => <p key={label}><span>{label.replace(/([A-Z])/g, ' $1')}</span><strong>{target}</strong></p>)}
            <div className="pipeline-note"><strong>Management judgment</strong><p>{p.managementNote}</p></div>
          </article>
        </div>
      </section>

      <section className="private-section">
        <div className="private-section-title"><p className="eyebrow">Financial controls</p><h2>Historical forecasts do not replace current cash evidence.</h2><p>The July financial model remains a stress-test baseline. The Version 2.0 Current Financial View and recorded transactions govern present decisions.</p></div>
        <div className="compliance-grid">
          <article><h3>Current cash facts</h3><dl><div><dt>Collected revenue</dt><dd>{money.format(f.actualRevenueToDate)}</dd></div><div><dt>Owner draw</dt><dd>{money.format(f.actualOwnerDrawToDate)}</dd></div><div><dt>Business cash</dt><dd>{money.format(f.endingBusinessCash)}</dd></div><div><dt>Cash-conversion gate</dt><dd>{f.cashConversionGate}</dd></div></dl><p>{f.bridgeNote}</p></article>
          <article><h3>Historical July reference</h3><dl><div><dt>FY1 stretch reference</dt><dd>{money.format(f.historicalStretchReference)}</dd></div><div><dt>August plan</dt><dd>{money.format(f.augustPlan)}</dd></div><div><dt>August actual</dt><dd>{money.format(f.augustActual)}</dd></div><div><dt>September full-month plan</dt><dd>{money.format(f.septemberPlan)}</dd></div><div><dt>September actual MTD</dt><dd>{money.format(f.septemberActual)}</dd></div></dl><p>{f.historicalStretchLabel}</p></article>
          <article><h3>Household bridge control</h3><dl><div><dt>August legacy draw target</dt><dd>{money.format(f.augustLegacyDraw)}</dd></div><div><dt>September legacy draw target</dt><dd>{money.format(f.septemberLegacyDraw)}</dd></div></dl><p>Unemployment remains household bridge income. It is not business revenue and does not create a business win.</p></article>
        </div>
      </section>

      <section className="private-section">
        <div className="private-section-title"><p className="eyebrow">SEAP and compliance</p><h2>Submission is not acceptance, and scheduled training is not completed training.</h2></div>
        <div className="compliance-grid">
          <article><h3>Training status</h3><dl><div><dt>Actual ISP-listed</dt><dd>{t.actualHours.toFixed(2)} hours</dd></div><div><dt>Verified eligible</dt><dd>{t.verifiedHours.toFixed(2)} hours</dd></div><div><dt>Pending verification</dt><dd>{t.pendingHours.toFixed(2)} hours</dd></div><div><dt>Additional actual needed</dt><dd>{t.remainingActualHours.toFixed(2)} hours</dd></div><div><dt>Final due date</dt><dd>{t.finalVerificationDue}</dd></div></dl><p>{t.note}</p></article>
          <article><h3>Compliance deadlines</h3>{data.compliance.deadlines.map((item) => <div className="deadline" key={`${item.date}-${item.item}`}><span>{item.date}</span><div><strong>{item.item}</strong><p>{item.status}</p></div></div>)}</article>
          <article><h3>Professional review gates</h3>{data.professionalGates.length ? data.professionalGates.map((item) => <div className="gate" key={item.name}><span>{item.status}</span><div><strong>{item.name}</strong><p>{item.action}</p></div></div>) : <p>No additional gate rows are currently surfaced from the readiness register.</p>}</article>
        </div>
      </section>

      <section className="private-section">
        <div className="private-section-title"><p className="eyebrow">Corrective action</p><h2>What must happen next.</h2></div>
        <div className="action-grid">
          <article><h3>Priority actions</h3><ol>{data.actions.map((item) => <li key={item}>{item}</li>)}</ol></article>
          <article><h3>Current alerts</h3>{data.alerts.map((item) => <div className={`alert ${item.level}`} key={item.message}><strong>{item.level}</strong><p>{item.message}</p></div>)}</article>
          <article><h3>Live data sources</h3>{data.dataSources.map((item) => <p key={item.name}><span>{item.name}</span><strong>{item.status}</strong></p>)}</article>
        </div>
      </section>

      <section className="private-section">
        <div className="private-section-title"><p className="eyebrow">Current governance</p><h2>Open work, risk, and recent decisions stay visible.</h2></div>
        <div className="action-grid">
          <article><h3>Current PCC work</h3><ul>{data.projects.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article><h3>Active risks</h3>{data.risks.map((item) => <div className="gate" key={item.risk}><div><strong>{item.risk}</strong><p>{item.response}</p></div></div>)}</article>
          <article><h3>Recent decisions</h3><ul>{data.decisions.map((item) => <li key={item}>{item}</li>)}</ul></article>
        </div>
      </section>
    </main>

    <footer className="owner-footer"><strong>Confidential owner view</strong><p>No bank credentials, Social Security numbers, client secrets, or account-level transactions are stored in the browser application.</p></footer>
  </div>;
}

export default function OwnerPortal() {
  const [state, setState] = useState({ loading: true, authenticated: false, data: null, lockedMessage: '' });

  async function load() {
    setState((current) => ({ ...current, loading: true }));
    try {
      const sessionResponse = await fetch('/api/session', { credentials: 'same-origin', cache: 'no-store' });
      const session = await sessionResponse.json().catch(() => ({}));
      if (sessionResponse.status === 503) {
        setState({ loading: false, authenticated: false, data: null, lockedMessage: session.message || 'Secure environment variables have not been configured.' });
        return;
      }
      if (!sessionResponse.ok || !session.authenticated) {
        setState({ loading: false, authenticated: false, data: null, lockedMessage: '' });
        return;
      }
      const response = await fetch('/api/private-data', { credentials: 'same-origin', cache: 'no-store' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Protected data could not be loaded.');
      setState({ loading: false, authenticated: true, data: result, lockedMessage: '' });
    } catch (error) {
      setState({ loading: false, authenticated: false, data: null, lockedMessage: error.message });
    }
  }

  useEffect(() => { load(); }, []);

  async function logout() {
    await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' });
    setState({ loading: false, authenticated: false, data: null, lockedMessage: '' });
  }

  if (state.loading) return <main className="loading-screen">Verifying secure session…</main>;
  if (!state.authenticated) return <Login onSuccess={load} lockedMessage={state.lockedMessage}/>;
  return <OwnerView data={state.data} onLogout={logout}/>;
}
