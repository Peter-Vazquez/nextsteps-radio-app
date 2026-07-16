import React, { useMemo, useState } from 'react';
import { dashboardSnapshot, validateDashboardData } from './dashboardData';
import './DashboardEnhancements.css';

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const services = [
  ['Message-to-Media Starter Project', '$550 launch price', 'One source message or interview turned into a polished content package.'],
  ['Content Continuity Retainer', '$1,100 launch price', 'Prepaid recurring production, repurposing, planning, and digital support.'],
  ['Strategic Growth Engagements', '$2,000–$3,000+ target', 'Higher-value strategy, reporting, multi-channel execution, and measurable business value.'],
];

const strengths = [
  'Established media platform and production experience',
  'Executive nonprofit, business, and community leadership',
  'Owned commercial workspace and low-overhead launch structure',
  'Veteran credibility and strong regional relationships',
  'CRM, project management, training, risk, and decision controls',
  'Controlled launch that protects cash, quality, and compliance',
];

const milestones = [
  ['August 1, 2026', 'Controlled soft launch'],
  ['September 22, 2026', 'Initial stabilization review'],
  ['First 40 prospects', 'Qualified launch pipeline'],
  ['2 paid starter projects', 'Initial customer validation'],
  ['1 converted retainer', 'Recurring-revenue proof'],
  ['$9,690 monthly revenue', 'Threshold associated with the July 2027 owner-draw target'],
];

function Metric({ label, value, detail }) {
  return (
    <article className="metric-card">
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </article>
  );
}

function SectionHeading({ eyebrow, title, copy }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {copy && <p className="section-copy">{copy}</p>}
    </div>
  );
}

function ScenarioCard({ item }) {
  const warning = item.surplus < 0;
  return (
    <article className={`scenario-card ${warning ? 'scenario-warning' : ''}`}>
      <div className="scenario-header">
        <div>
          <p className="eyebrow">{item.attainment}% revenue attainment</p>
          <h3>{item.name}</h3>
        </div>
        <span className="status-pill">{item.status}</span>
      </div>
      <dl>
        <div><dt>FY1 revenue</dt><dd>{money.format(item.revenue)}</dd></div>
        <div><dt>Post-tax cash before draw</dt><dd>{money.format(item.postTaxCashBeforeDraw)}</dd></div>
        <div><dt>Required owner draw</dt><dd>{money.format(item.requiredOwnerDraw)}</dd></div>
        <div><dt>{warning ? 'Outside-income bridge' : 'Surplus after draw'}</dt><dd>{money.format(Math.abs(item.surplus))}</dd></div>
      </dl>
      <p>{item.action}</p>
    </article>
  );
}

export default function ExecutiveDashboard() {
  const data = dashboardSnapshot;
  const valid = validateDashboardData(data);
  const [selectedYear, setSelectedYear] = useState(0);
  const [presentationMode, setPresentationMode] = useState(false);
  const year = data.fiscalYears[selectedYear];
  const fiveYearDraw = useMemo(
    () => data.fiscalYears.reduce((sum, item) => sum + item.ownerDraw, 0),
    [data.fiscalYears],
  );

  const togglePresentation = () => {
    setPresentationMode((current) => {
      document.body.classList.toggle('presentation-mode', !current);
      return !current;
    });
  };

  if (!valid) {
    return <main className="data-error">Dashboard data failed validation. The approved snapshot was not displayed.</main>;
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#overview" aria-label="Next Steps Media and Digital Services dashboard home">
          <span className="brand-mark">NS</span>
          <span><strong>Next Steps</strong><small>Media & Digital Services</small></span>
        </a>
        <nav aria-label="Dashboard navigation">
          <a href="#overview">Overview</a>
          <a href="#financials">Financials</a>
          <a href="#scenarios">Scenarios</a>
          <a href="#monitoring">Monitoring</a>
          <a href="#roadmap">Roadmap</a>
        </nav>
        <div className="toolbar">
          <button type="button" onClick={togglePresentation}>{presentationMode ? 'Exit presentation' : 'Presentation mode'}</button>
          <button type="button" onClick={() => window.print()}>Print / Save PDF</button>
        </div>
      </header>

      <main>
        <div className="data-strip" role="status">
          <span><strong>Data status:</strong> {data.meta.dataLabel}</span>
          <span><strong>As of:</strong> July 15, 2026</span>
          <span><strong>Source:</strong> Revised FY financial model</span>
        </div>

        <section className="hero" id="overview">
          <div className="hero-copy-block">
            <p className="eyebrow">Executive Business Dashboard</p>
            <h1>Helping meaningful voices be seen, heard, trusted, and found.</h1>
            <p className="hero-copy">Next Steps Media & Digital Services is a disciplined, low-overhead media and content business built to serve small businesses, nonprofits, ministries, professional practices, public voices, and podcast creators.</p>
            <div className="hero-actions">
              <a className="button primary" href="#financials">Review the financial path</a>
              <a className="button secondary" href="#monitoring">Review operating readiness</a>
            </div>
          </div>
          <aside className="hero-panel" aria-label="Business launch summary">
            <div><span>Launch</span><strong>{data.launch.date}</strong></div>
            <div><span>Fiscal year</span><strong>{data.meta.fiscalCycle}</strong></div>
            <div><span>Minimum monthly draw</span><strong>{money.format(data.launch.minimumMonthlyDraw)}</strong></div>
            <div><span>July 2027 draw target</span><strong>{money.format(data.launch.july2027DrawTarget)}</strong></div>
          </aside>
        </section>

        <section className="metrics-grid" aria-label="Key business metrics">
          <Metric label="FY 2026–27 revenue requirement" value={money.format(data.fiscalYears[0].revenue)} detail="Household-supporting base case for the first complete fiscal year." />
          <Metric label="FY1 average monthly revenue" value={money.format(data.fiscalYears[0].averageMonthlyRevenue)} detail="Average across the first August-to-July operating cycle." />
          <Metric label="FY 2030–31 revenue target" value={money.format(data.fiscalYears[4].revenue)} detail="Higher-value retainers, disciplined pricing, and selective contractor leverage." />
          <Metric label="Five-year owner draws" value={money.format(fiveYearDraw)} detail="Total planned household distributions across five complete fiscal years." />
        </section>

        <section className="section" id="financials">
          <SectionHeading eyebrow="Five-year fiscal forecast" title="The model measures livelihood, not merely survival." copy="Each year is supported by explicit revenue, owner compensation, tax reserve, retained cash, and capacity assumptions." />
          <div className="financial-layout">
            <div className="year-selector" role="tablist" aria-label="Fiscal year selection">
              {data.fiscalYears.map((item, index) => (
                <button key={item.year} type="button" className={index === selectedYear ? 'active' : ''} onClick={() => setSelectedYear(index)} role="tab" aria-selected={index === selectedYear}>
                  <span>{item.year}</span><strong>{money.format(item.revenue)}</strong>
                </button>
              ))}
            </div>
            <article className="year-detail" aria-live="polite">
              <div className="year-detail-header">
                <div><p className="eyebrow">{year.period}</p><h3>{year.stage}</h3></div>
                <span className="status-pill">{year.status}</span>
              </div>
              <div className="detail-metrics detail-metrics-expanded">
                <div><span>Revenue</span><strong>{money.format(year.revenue)}</strong></div>
                <div><span>Operating profit</span><strong>{money.format(year.operatingProfit)}</strong></div>
                <div><span>Owner draw</span><strong>{money.format(year.ownerDraw)}</strong></div>
                <div><span>Tax reserve</span><strong>{money.format(year.taxReserve)}</strong></div>
                <div><span>Ending retained cash</span><strong>{money.format(year.endingCash)}</strong></div>
                <div><span>Ending monthly draw</span><strong>{money.format(year.endingMonthlyDraw)}</strong></div>
                <div><span>YoY growth</span><strong>{year.yoy === null ? 'Baseline' : `${year.yoy.toFixed(1)}%`}</strong></div>
                <div><span>Maximum capacity</span><strong>{year.capacity.toFixed(1)}%</strong></div>
              </div>
              <div className="progress-track" aria-label={`${year.year} revenue relative to five-year target`}><span style={{ width: `${Math.min((year.revenue / data.fiscalYears.at(-1).revenue) * 100, 100)}%` }} /></div>
              <p className="objective"><strong>Primary objective:</strong> {year.objective}</p>
            </article>
          </div>
          <div className="financial-note"><strong>Important:</strong><p>The former $122,498 calendar-year projection is no longer the five-year definition of success. The revised base begins at $118,400 and reaches $325,800. These are planning assumptions, not guarantees, and require monthly replacement with actual results.</p></div>
        </section>

        <section className="section" id="scenarios">
          <SectionHeading eyebrow="Scenario sensitivity" title="The downside is exposed instead of hidden." copy="The scenarios change revenue attainment and show the resulting household-support impact. The upside case is a sensitivity test, not a guaranteed forecast." />
          <div className="scenario-grid">{data.scenarios.map((item) => <ScenarioCard item={item} key={item.name} />)}</div>
        </section>

        <section className="section" id="monitoring">
          <SectionHeading eyebrow="Actuals monitoring" title="Forecasts must surrender to reality every month." copy="The public dashboard shows only approved summary information. Client names, detailed expenses, account data, and household records remain private." />
          <div className="monitoring-layout">
            <article className="monitor-card monitor-primary">
              <div className="scenario-header"><div><p className="eyebrow">Current fiscal year</p><h3>{data.actuals.currentFiscalYear}</h3></div><span className="status-pill">{data.actuals.status}</span></div>
              <div className="monitor-grid">
                <div><span>Months entered</span><strong>{data.actuals.monthsEntered}</strong></div>
                <div><span>Actual revenue to date</span><strong>{data.actuals.actualRevenueToDate === null ? 'Not entered' : money.format(data.actuals.actualRevenueToDate)}</strong></div>
                <div><span>Actual owner draw</span><strong>{data.actuals.actualOwnerDrawToDate === null ? 'Not entered' : money.format(data.actuals.actualOwnerDrawToDate)}</strong></div>
                <div><span>Outside income used</span><strong>{data.actuals.outsideIncomeUsed === null ? 'Not entered' : money.format(data.actuals.outsideIncomeUsed)}</strong></div>
              </div>
              <p className="monitor-note">Actuals will appear here only after they are entered, reviewed, and approved for public presentation.</p>
            </article>
            <aside className="control-panel">
              <p className="eyebrow">Monitoring controls</p>
              <h3>Management review must remain disciplined.</h3>
              <ul>
                <li>Review revenue, expenses, owner draw, and cash monthly.</li>
                <li>Quantify any outside-income bridge immediately.</li>
                <li>Flag capacity at or above 80%.</li>
                <li>Reprice when delivery hours or client value justify it.</li>
                <li>Keep public data separate from confidential operating records.</li>
              </ul>
            </aside>
          </div>
        </section>

        <section className="section split-section" id="services">
          <div>
            <SectionHeading eyebrow="Commercial model" title="Start with clear offers. Grow through demonstrated value." copy="Launch prices create an entry point, not a permanent ceiling." />
            <div className="service-list">{services.map(([name, price, description]) => <article className="service-card" key={name}><div><h3>{name}</h3><p>{description}</p></div><strong>{price}</strong></article>)}</div>
          </div>
          <aside className="strength-panel"><p className="eyebrow">Why the business can win</p><h2>Built on experience, relationships, and disciplined execution.</h2><ul>{strengths.map((item) => <li key={item}>{item}</li>)}</ul></aside>
        </section>

        <section className="section" id="roadmap">
          <SectionHeading eyebrow="Execution roadmap" title="The positive outcome must be earned through measurable proof." copy="The next operating layer will connect approved summaries from the financial model, CRM, project-control center, and training records without exposing confidential data." />
          <div className="milestone-grid">{milestones.map(([label, text], index) => <article className="milestone" key={label}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{label}</strong><p>{text}</p></div></article>)}</div>
        </section>

        <section className="outcome-section"><div><p className="eyebrow">The intended outcome</p><h2>A profitable, credible company that supports the household and preserves strategic choice.</h2></div><div className="outcome-points"><p>Meaningful and increasingly reliable owner income</p><p>Low debt and controlled overhead</p><p>Recurring clients and measurable retention</p><p>The option to remain premium-solo or scale selectively</p></div></section>
      </main>

      <footer><div><strong>{data.meta.businessName}</strong><p>Executive dashboard • Fiscal planning cycle begins August 1</p></div><p>{data.meta.notice}</p></footer>
    </div>
  );
}
