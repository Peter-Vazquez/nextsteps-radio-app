import React, { useMemo, useState } from 'react';

const fiscalYears = [
  {
    year: 'FY 2026–27',
    period: 'Aug. 1, 2026–July 31, 2027',
    stage: 'Launch and validation',
    revenue: 85386,
    ownerDraw: 56400,
    endingRunRate: 116284,
    objective: 'Prove demand, establish recurring clients, and fund the owner-draw ramp.',
    status: 'Required operating target',
  },
  {
    year: 'FY 2027–28',
    period: 'Aug. 1, 2027–July 31, 2028',
    stage: 'Recurring-revenue growth',
    revenue: 132000,
    ownerDraw: 78600,
    endingRunRate: 156000,
    objective: 'Strengthen retention, raise average client value, and stabilize monthly income.',
    status: 'Planning case',
  },
  {
    year: 'FY 2028–29',
    period: 'Aug. 1, 2028–July 31, 2029',
    stage: 'Pricing and service expansion',
    revenue: 180000,
    ownerDraw: 96000,
    endingRunRate: 204000,
    objective: 'Move beyond launch pricing and add higher-value strategic engagements.',
    status: 'Planning case',
  },
  {
    year: 'FY 2029–30',
    period: 'Aug. 1, 2029–July 31, 2030',
    stage: 'Mature solo practice',
    revenue: 225000,
    ownerDraw: 120000,
    endingRunRate: 252000,
    objective: 'Maintain a profitable premium practice with disciplined capacity control.',
    status: 'Strategic growth case',
  },
  {
    year: 'FY 2030–31',
    period: 'Aug. 1, 2030–July 31, 2031',
    stage: 'Selective scale',
    revenue: 275000,
    ownerDraw: 144000,
    endingRunRate: 300000,
    objective: 'Choose between a premium solo model and selective contractor-supported growth.',
    status: 'Strategic growth case',
  },
];

const services = [
  {
    name: 'Message-to-Media Starter Project',
    price: '$550 launch price',
    description: 'A defined entry engagement that turns one source message or interview into a polished content package.',
  },
  {
    name: 'Content Continuity Retainer',
    price: '$1,100 launch price',
    description: 'A prepaid recurring engagement for consistent production, repurposing, planning, and digital support.',
  },
  {
    name: 'Strategic Growth Engagements',
    price: '$2,000–$3,000+ target',
    description: 'Higher-value partnerships built around strategy, reporting, multi-channel execution, and measurable business value.',
  },
];

const strengths = [
  'Established media platform and production experience',
  'Executive nonprofit, business, and community leadership',
  'Owned commercial workspace and low-overhead launch structure',
  'Veteran credibility and strong regional relationships',
  'Clear operating controls, CRM, project management, and training logs',
  'A controlled launch that protects cash, quality, and compliance',
];

const milestones = [
  ['August 1, 2026', 'Controlled soft launch'],
  ['September 22, 2026', 'Initial stabilization review'],
  ['First 40 prospects', 'Qualified launch pipeline'],
  ['2 paid starter projects', 'Initial customer validation'],
  ['1 converted retainer', 'Recurring-revenue proof'],
  ['$9,690 monthly revenue', 'Target needed to support the July 2027 owner draw'],
];

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

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

export default function App() {
  const [selectedYear, setSelectedYear] = useState(0);
  const year = fiscalYears[selectedYear];

  const growth = useMemo(() => {
    if (selectedYear === 0) return null;
    const prior = fiscalYears[selectedYear - 1].revenue;
    return ((year.revenue - prior) / prior) * 100;
  }, [selectedYear, year.revenue]);

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#overview" aria-label="Next Steps Media and Digital Services dashboard home">
          <span className="brand-mark">NS</span>
          <span>
            <strong>Next Steps</strong>
            <small>Media & Digital Services</small>
          </span>
        </a>
        <nav aria-label="Dashboard navigation">
          <a href="#overview">Overview</a>
          <a href="#financials">Financials</a>
          <a href="#services">Services</a>
          <a href="#roadmap">Roadmap</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="overview">
          <div className="hero-copy-block">
            <p className="eyebrow">Executive Business Dashboard</p>
            <h1>Helping meaningful voices be seen, heard, trusted, and found.</h1>
            <p className="hero-copy">
              Next Steps Media & Digital Services is a disciplined, low-overhead media and content business built to serve small businesses, nonprofits, ministries, professional practices, public voices, and podcast creators.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#financials">Review the financial path</a>
              <a className="button secondary" href="#roadmap">See launch milestones</a>
            </div>
          </div>
          <aside className="hero-panel" aria-label="Business launch summary">
            <div>
              <span>Launch</span>
              <strong>August 1, 2026</strong>
            </div>
            <div>
              <span>Fiscal year</span>
              <strong>August 1–July 31</strong>
            </div>
            <div>
              <span>Minimum monthly draw</span>
              <strong>$2,850</strong>
            </div>
            <div>
              <span>July 2027 draw target</span>
              <strong>$6,550</strong>
            </div>
          </aside>
        </section>

        <section className="metrics-grid" aria-label="Key business metrics">
          <Metric label="FY 2026–27 revenue requirement" value="$85,386" detail="Supports the planned owner-draw ramp under current operating assumptions." />
          <Metric label="July 2027 monthly revenue target" value="$9,690" detail="Required to support the $6,550 monthly draw target." />
          <Metric label="Five-year strategic revenue target" value="$275,000" detail="A disciplined premium-practice or selective-scale outcome." />
          <Metric label="Launch structure" value="Low overhead" detail="Owner-led delivery, no unnecessary debt, and controlled spending." />
        </section>

        <section className="section" id="financials">
          <SectionHeading
            eyebrow="Five-year fiscal forecast"
            title="The model now measures livelihood, not merely survival."
            copy="The forecast is organized by full August-to-July fiscal years. Owner compensation is treated as a required operating target, and each year must be supported by explicit pricing, client volume, delivery capacity, tax reserves, and cash controls."
          />

          <div className="financial-layout">
            <div className="year-selector" role="tablist" aria-label="Fiscal year selection">
              {fiscalYears.map((item, index) => (
                <button
                  key={item.year}
                  type="button"
                  className={index === selectedYear ? 'active' : ''}
                  onClick={() => setSelectedYear(index)}
                  role="tab"
                  aria-selected={index === selectedYear}
                >
                  <span>{item.year}</span>
                  <strong>{money.format(item.revenue)}</strong>
                </button>
              ))}
            </div>

            <article className="year-detail" aria-live="polite">
              <div className="year-detail-header">
                <div>
                  <p className="eyebrow">{year.period}</p>
                  <h3>{year.stage}</h3>
                </div>
                <span className="status-pill">{year.status}</span>
              </div>

              <div className="detail-metrics">
                <div><span>Revenue</span><strong>{money.format(year.revenue)}</strong></div>
                <div><span>Owner draw</span><strong>{money.format(year.ownerDraw)}</strong></div>
                <div><span>Ending annual run rate</span><strong>{money.format(year.endingRunRate)}</strong></div>
                <div><span>YoY growth</span><strong>{growth === null ? 'Baseline' : `${growth.toFixed(1)}%`}</strong></div>
              </div>

              <div className="progress-track" aria-label={`${year.year} revenue relative to five-year target`}>
                <span style={{ width: `${Math.min((year.revenue / fiscalYears.at(-1).revenue) * 100, 100)}%` }} />
              </div>

              <p className="objective"><strong>Primary objective:</strong> {year.objective}</p>
            </article>
          </div>

          <div className="financial-note">
            <strong>Important:</strong>
            <p>The former $122,498 calendar-year projection represented a cautious solo-owner floor. It is no longer presented as the five-year definition of success. The revised model must be validated monthly against actual sales and reviewed by a CPA or tax professional.</p>
          </div>
        </section>

        <section className="section split-section" id="services">
          <div>
            <SectionHeading
              eyebrow="Commercial model"
              title="Start with clear offers. Grow through demonstrated value."
              copy="The launch prices create an easy entry point. They are not permanent ceilings. Pricing must advance as results, testimonials, reporting, and strategic value are proven."
            />
            <div className="service-list">
              {services.map((service) => (
                <article className="service-card" key={service.name}>
                  <div>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                  </div>
                  <strong>{service.price}</strong>
                </article>
              ))}
            </div>
          </div>

          <aside className="strength-panel">
            <p className="eyebrow">Why the business can win</p>
            <h2>Built on experience, relationships, and disciplined execution.</h2>
            <ul>
              {strengths.map((strength) => <li key={strength}>{strength}</li>)}
            </ul>
          </aside>
        </section>

        <section className="section" id="roadmap">
          <SectionHeading
            eyebrow="Execution roadmap"
            title="The positive outcome must be earned through measurable proof."
            copy="The dashboard will eventually draw approved summary data from the CRM, project-control center, training log, and financial model. Sensitive names and records will remain private."
          />
          <div className="milestone-grid">
            {milestones.map(([label, text], index) => (
              <article className="milestone" key={label}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{label}</strong>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="outcome-section">
          <div>
            <p className="eyebrow">The intended outcome</p>
            <h2>A profitable, credible company that supports the household and preserves strategic choice.</h2>
          </div>
          <div className="outcome-points">
            <p>Meaningful and increasingly reliable owner income</p>
            <p>Low debt and controlled overhead</p>
            <p>Recurring clients and measurable retention</p>
            <p>The option to remain premium-solo or scale selectively</p>
          </div>
        </section>
      </main>

      <footer>
        <div>
          <strong>Next Steps Media & Digital Services</strong>
          <p>Executive dashboard prototype • Fiscal planning cycle begins August 1</p>
        </div>
        <p>Planning assumptions are not guarantees. Actual results replace assumptions monthly.</p>
      </footer>
    </div>
  );
}
