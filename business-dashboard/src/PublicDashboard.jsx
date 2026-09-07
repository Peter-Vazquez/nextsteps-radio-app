import React, { useState } from 'react';
import { dashboardData as data, money, number } from './dashboardData.js';

function SectionTitle({ eyebrow, title, copy }) {
  return <div className="section-title"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{copy && <p>{copy}</p>}</div>;
}

function Kpi({ label, value, detail, tone = '' }) {
  return <article className={`kpi ${tone}`}><span>{label}</span><strong>{value}</strong><p>{detail}</p></article>;
}

function PublicDashboard() {
  const [selectedYear, setSelectedYear] = useState(0);
  const year = data.fiscalYears[selectedYear];
  const progress = data.operatingSnapshot;

  return <div className="site-shell final-dashboard">
    <header className="topbar">
      <a className="brand" href="#overview"><span className="brand-mark">NS</span><span><strong>Next Steps</strong><small>Media & Digital Marketing Services</small></span></a>
      <nav><a href="#progress">Progress</a><a href="#case">Business Case</a><a href="#services">Services</a><a href="#financials">Financials</a><a href="#sales">Sales</a><a href="#operations">Operations</a><a href="#risk">Risk</a></nav>
      <div className="toolbar"><button type="button" onClick={() => window.print()}>Print / PDF</button><a className="owner-link" href="/owner">Owner portal</a></div>
    </header>

    <main>
      <div className="data-strip"><span><strong>Data:</strong> {data.meta.dataMode}</span><span><strong>As of:</strong> {data.meta.asOf}</span><span><strong>Fiscal cycle:</strong> {data.meta.fiscalCycle}</span><span><strong>Privacy:</strong> Public approved summaries only</span></div>

      <section className="hero" id="overview">
        <div className="hero-copy-block">
          <p className="eyebrow">Executive business plan and performance dashboard</p>
          <h1>{data.meta.promise}</h1>
          <p className="hero-copy">Next Steps Media & Digital Marketing Services helps meaningful voices turn valuable ideas, interviews, sermons, expertise, and long-form messages into professional media and digital content that can keep working after the original moment ends.</p>
          <div className="hero-actions"><a className="button primary" href="#progress">View current progress</a><a className="button secondary" href="#sales">View the conversion test</a></div>
        </div>
        <aside className="hero-panel">
          <div><span>Current phase</span><strong>{progress.phase}</strong></div>
          <div><span>Revenue conversion</span><strong>{progress.outreachStart}</strong></div>
          <div><span>Controlled launch</span><strong>{data.meta.launchDate}</strong></div>
          <div><span>Stabilization review</span><strong>{data.meta.stabilizationDate}</strong></div>
        </aside>
      </section>

      <section className="metrics-grid">
        <Kpi label="CRM prospect records" value={number.format(progress.qualifiedProspects)} detail="Research, closed records, and nurture records are not automatically active opportunities." tone="navy" />
        <Kpi label="Active cash pipeline" value={money.format(progress.preliminaryPipelineValue)} detail="Current dated cash opportunities only. Barter and closed/nurture records are excluded." />
        <Kpi label="Collected cash revenue" value={money.format(0)} detail="Cash proof remains the immediate commercial test. The current client win is a noncash barter relationship." />
        <Kpi label="Actual ISP-listed training" value={`${progress.trainingLoggedHours.toFixed(2)} / ${progress.trainingRequiredHours}`} detail={`${progress.trainingEligibleHours.toFixed(2)} hours are verified eligible; 9.22 remain pending explicit verification/acceptance.`} />
      </section>

      <section className="section progress-section" id="progress">
        <SectionTitle eyebrow="Live startup progress and accountability" title="The business has launched. Now the evidence has to catch up with the plan." copy="Current records distinguish pipeline from cash, submission from acceptance, a client win from a cash-paying win, and scheduled training from completed training." />
        <div className="progress-status-banner"><div><span>Current status</span><strong>{progress.status}</strong></div><p>{progress.updateCadence}</p><small>Last synchronized: {progress.lastSync}</small></div>
        <div className="live-progress-grid">
          <Kpi label="Personalized contacts" value={number.format(progress.personalizedContacts)} detail="Verified delivered personalized outreach. Unsent drafts and research do not count." tone="navy" />
          <Kpi label="Discovery calls completed" value={number.format(progress.discoveryCalls)} detail="Qualified conversations where need, fit, authority, timing, and value are tested." />
          <Kpi label="Proposals sent" value={number.format(progress.proposals)} detail="Eight proposals have been issued; cash conversion remains the next test." />
          <Kpi label="Clients won" value={number.format(progress.clientsWon)} detail="One active client win is a noncash barter relationship. Cash-paying wins remain zero." />
        </div>
        <div className="accountability-layout">
          <article className="accountability-card"><p className="eyebrow">Current operating priorities</p><h3>Revenue first, without losing compliance discipline.</h3><ol>{progress.currentPriorities.map((item) => <li key={item}>{item}</li>)}</ol></article>
          <article className="accountability-card"><p className="eyebrow">Verified progress</p><h3>What has materially changed.</h3><ul>{progress.accomplishments.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article className="accountability-card cadence-card"><p className="eyebrow">Reporting discipline</p><h3>Outcome-based accountability</h3><dl><div><dt>Track</dt><dd>Pipeline movement, delivered outreach, proposals, cash, compliance, training evidence, client delivery, risks, and next actions.</dd></div><div><dt>Do not track</dt><dd>Owner business start time, end time, breaks, or ordinary work hours.</dd></div><div><dt>Training exception</dt><dd>Actual SEAP instructional duration is recorded only because verified training hours are a program requirement.</dd></div><div><dt>Next sync</dt><dd>{progress.nextSync}</dd></div><div><dt>Counselor / SEAP</dt><dd>{progress.counselorStatus}</dd></div></dl></article>
        </div>
      </section>

      <section className="section" id="case">
        <SectionTitle eyebrow="Executive business case" title="The opportunity is not more content. It is giving valuable messages a longer life." copy="The business succeeds when a real communication problem meets a clear offer, disciplined production, measurable client value, and collected cash." />
        <div className="case-grid">{Object.entries(data.executiveCase).map(([key, value]) => <article key={key}><span>{key.replace(/([A-Z])/g, ' $1')}</span><p>{value}</p></article>)}</div>
      </section>

      <section className="section" id="market">
        <SectionTitle eyebrow="Market and customer fit" title="The strongest clients already have something worth saying. They need a system that keeps it from disappearing." copy="The launch market centers on established professionals, service businesses, nonprofits, ministries, and other trusted voices with recurring source material and a practical need for production and repurposing support." />
        <div className="segment-grid">{data.marketSegments.map((item) => <article key={item.name}><h3>{item.name}</h3><p><strong>Need:</strong> {item.need}</p><p><strong>Best fit:</strong> {item.fit}</p></article>)}</div>
        <div className="positioning-callout"><div><p className="eyebrow">Competitive position</p><h3>Focused media production and content continuity, not open-ended agency work.</h3></div><p>Next Steps competes through founder access, broadcast discipline, message judgment, regional credibility, and the ability to turn one approved source message into coordinated podcast, web, social, email, and search-ready content.</p></div>
      </section>

      <section className="section" id="services">
        <SectionTitle eyebrow="Approved standard offers" title="Start with a defined paid test. Continue only when the work proves recurring value." copy="The $550 Starter and $1,100 prepaid Retainer remain the standard/default offers. Prospect-specific custom offers may be approved separately without silently repricing the standard architecture." />
        <div className="service-detail-grid">{data.services.map((item) => <article key={item.name}><header><div><p className="eyebrow">{item.bestFor}</p><h3>{item.name}</h3></div><strong>{money.format(item.price)}</strong></header><p>{item.deliverables}</p><footer><strong>Next step:</strong> {item.upgrade}</footer></article>)}</div>
      </section>

      <section className="section" id="financials">
        <SectionTitle eyebrow="Historical planning baseline" title="The July financial model remains a stress test, not a current sales forecast." copy="Version 2.0 now separates current cash evidence from the original July household-stretch model. Current decisions are governed by collected cash, the active cash pipeline, actual expenses, and the Current Financial View." />
        <div className="metrics-grid">
          <Kpi label="Current collected cash" value={money.format(0)} detail="Verified business cash revenue since the August 1 launch." tone="navy" />
          <Kpi label="Current active cash pipeline" value={money.format(progress.preliminaryPipelineValue)} detail="Cash opportunity value only." />
          <Kpi label="Historical FY1 stretch reference" value={money.format(data.fiscalYears[0].revenue)} detail="July 15 household-stretch / livelihood stress test only. It is not the current sales forecast." />
          <Kpi label="Current owner draw" value={money.format(0)} detail="No owner draw has been taken from business cash." />
        </div>
        <div className="year-selector" role="tablist">{data.fiscalYears.map((item, index) => <button type="button" key={item.year} className={selectedYear === index ? 'active' : ''} onClick={() => setSelectedYear(index)}><span>{item.year}</span><strong>{money.format(item.revenue)}</strong></button>)}</div>
        <article className="year-detail final-year-detail"><header><div><p className="eyebrow">Historical modeled year</p><h3>{year.year}</h3></div><span className="status-pill">{year.status}</span></header><div className="detail-metrics expanded"><div><span>Modeled revenue</span><strong>{money.format(year.revenue)}</strong></div><div><span>Modeled operating expenses</span><strong>{money.format(year.operatingExpenses)}</strong></div><div><span>Modeled owner draw</span><strong>{money.format(year.ownerDraw)}</strong></div><div><span>Modeled ending cash</span><strong>{money.format(year.endingCash)}</strong></div><div><span>Recurring revenue mix</span><strong>{year.recurringMix}%</strong></div></div></article>
      </section>

      <section className="section" id="sales">
        <SectionTitle eyebrow="Current conversion test" title="Plans and proposals do not pay the bills. Collected cash does." copy="The weekly standard protects consistent selling while keeping the quality of qualification more important than raw activity volume." />
        <div className="sales-layout">
          <article className="funnel-card"><h3>Current proof funnel</h3>{data.funnel.map((item, index) => <div key={item.stage} style={{ width: `${Math.max(38, 100 - index * 13)}%` }}><span>{item.stage}</span><strong>{item.value}</strong><small>{item.conversion}% of CRM prospect records</small></div>)}</article>
          <article className="activity-card"><h3>Weekly operating standard</h3><ul><li>10–15 qualified personalized contacts</li><li>5 or more follow-ups</li><li>2 or more discovery calls</li><li>1 or more proposal</li><li>Every active lead has a dated next action</li><li>Cash collections reviewed weekly</li><li>Research and unsent drafts do not count as contacts</li></ul><p><strong>Current management test:</strong> Eight proposals and one barter client win have produced $0 collected cash. The immediate priority is conversion, not more infrastructure.</p></article>
        </div>
      </section>

      <section className="section" id="operations">
        <SectionTitle eyebrow="Operating system and accountability" title="The business is managed through source records, not memory or activity theater." copy="Drive/source records feed the Project Control Center, CRM, training and financial records, the Daily Operating Summary, and then OD Strategy. Calendar is a plan, not proof." />
        <div className="workflow-grid">{data.workflow.map(([step, name, detail]) => <article key={step}><span>{step}</span><div><h3>{name}</h3><p>{detail}</p></div></article>)}</div>
        <div className="control-grid"><article><h3>Commercial controls</h3><ul><li>Written scope and deliverables</li><li>50% project deposit where applicable</li><li>Monthly retainer prepayment</li><li>One revision unless contracted otherwise</li><li>Custom offers documented separately</li></ul></article><article><h3>Financial controls</h3><ul><li>Cash transactions recorded as they occur</li><li>Barter kept outside cash revenue</li><li>Owner draw explicitly recorded</li><li>Historical forecasts labeled as planning references</li><li>No new business debt without approval</li></ul></article><article><h3>SEAP controls</h3><ul><li>Submission is not acceptance</li><li>Scheduled training is not completed training</li><li>Actual instructional time only</li><li>Evidence retained for every countable session</li><li>Final verification due September 21</li></ul></article><article><h3>Scope controls</h3><ul><li>Podcast Production and Digital Content Support remains primary</li><li>No automatic full-service agency expansion</li><li>Media-property editorial firewall preserved</li><li>Client value and cash proof before expansion</li><li>Slack remains retired</li></ul></article></div>
      </section>

      <section className="section" id="risk">
        <SectionTitle eyebrow="Risk and readiness" title="The largest current risk is simple: qualified activity has not yet become cash." copy="Risk controls stay visible so pressure does not create invented revenue, premature expansion, missed compliance, or loose scope." />
        <div className="risk-table"><div className="risk-row risk-head"><span>Risk</span><span>Score</span><span>Trigger</span><span>Management response</span></div>{data.risks.map((item) => <div className="risk-row" key={item.risk}><strong>{item.risk}</strong><span className={`risk-score ${item.probability * item.impact >= 16 ? 'critical' : ''}`}>{item.probability * item.impact}/25</span><p>{item.trigger}</p><p>{item.response}</p></div>)}</div>
      </section>

      <section className="section" id="roadmap">
        <SectionTitle eyebrow="Milestones and proof" title="Confidence is earned through dated evidence." copy="The current roadmap records what was submitted, what is live, what remains pending, and the next external deadlines." />
        <div className="milestone-grid final-milestones">{data.milestones.map((item, index) => <article key={`${item.date}-${item.name}`}><span>{String(index + 1).padStart(2, '0')}</span><div><p>{item.date}</p><h3>{item.name}</h3><small>{item.evidence}</small></div></article>)}</div>
      </section>

      <section className="section verdict-section" id="verdict">
        <SectionTitle eyebrow="Current verdict standard" title="The business has real infrastructure, real activity, and real proof of execution. Cash demand is still unproven." copy="The next stage is not another rebuild. It is disciplined conversion: paid work, recurring value, final SEAP compliance, and evidence that the business can support itself." />
        <div className="success-grid">{data.successGates.map(([name, detail]) => <article key={name}><h3>{name}</h3><p>{detail}</p></article>)}</div>
        <div className="verdict-callout"><div><p className="eyebrow">What success means now</p><h2>Turn the operating system into collected cash without sacrificing quality, compliance, or scope discipline.</h2></div><ul><li>Convert the nearest qualified opportunities.</li><li>Protect the two standard offers while allowing documented custom deals.</li><li>Complete and verify the remaining SEAP training.</li><li>Deliver the active barter relationship without treating it as cash.</li><li>Expand services only after demand and delivery are proven.</li></ul></div>
      </section>
    </main>

    <footer><div><strong>{data.meta.businessName}</strong><p>Executive business plan and public approved dashboard</p></div><div><a href="/owner">Secure owner portal</a><p>{data.meta.notice}</p></div></footer>
  </div>;
}

export default PublicDashboard;
