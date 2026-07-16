import React, { useMemo, useState } from 'react';
import {
  Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, Pie, PieChart,
  ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { dashboardData as data, money, number } from './dashboardData.js';

const palette = ['#123f5a', '#2f7d7b', '#cf9d3a', '#6d7f8b', '#8a5a44'];

function SectionTitle({ eyebrow, title, copy }) {
  return <div className="section-title"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{copy && <p>{copy}</p>}</div>;
}

function Kpi({ label, value, detail, tone = '' }) {
  return <article className={`kpi ${tone}`}><span>{label}</span><strong>{value}</strong><p>{detail}</p></article>;
}

function ChartCard({ title, copy, children, note }) {
  return <article className="chart-card"><header><h3>{title}</h3><p>{copy}</p></header><div className="chart-wrap">{children}</div>{note && <small>{note}</small>}</article>;
}

function CurrencyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return <div className="chart-tooltip"><strong>{label}</strong>{payload.map((item) => <span key={item.dataKey}>{item.name}: {money.format(item.value)}</span>)}</div>;
}

function PublicDashboard() {
  const [selectedYear, setSelectedYear] = useState(0);
  const year = data.fiscalYears[selectedYear];
  const fiveYearRevenue = useMemo(() => data.fiscalYears.reduce((sum, item) => sum + item.revenue, 0), []);
  const fiveYearDraw = useMemo(() => data.fiscalYears.reduce((sum, item) => sum + item.ownerDraw, 0), []);
  const annual = data.fiscalYears.map((item) => ({
    year: item.year.replace('FY ', ''), Revenue: item.revenue, 'Owner draw': item.ownerDraw, 'Ending cash': item.endingCash,
  }));
  const monthly = data.firstYearMonthly.map((item) => ({ ...item, 'Revenue target': item.revenue, 'Owner draw': item.draw }));
  const serviceMix = [
    { name: 'Recurring services', value: year.recurringMix },
    { name: 'Defined projects', value: year.projectMix },
    { name: 'Strategic engagements', value: year.strategicMix },
  ];

  return <div className="site-shell final-dashboard">
    <header className="topbar">
      <a className="brand" href="#overview"><span className="brand-mark">NS</span><span><strong>Next Steps</strong><small>Media & Digital Services</small></span></a>
      <nav><a href="#market">Market</a><a href="#services">Services</a><a href="#financials">Financials</a><a href="#sales">Sales</a><a href="#operations">Operations</a><a href="#risk">Risk</a></nav>
      <div className="toolbar"><button type="button" onClick={() => window.print()}>Print / PDF</button><a className="owner-link" href="/owner">Owner portal</a></div>
    </header>

    <main>
      <div className="data-strip"><span><strong>Data:</strong> {data.meta.dataMode}</span><span><strong>As of:</strong> {data.meta.asOf}</span><span><strong>Fiscal cycle:</strong> {data.meta.fiscalCycle}</span><span><strong>Privacy:</strong> Public approved summaries only</span></div>

      <section className="hero" id="overview">
        <div className="hero-copy-block"><p className="eyebrow">Executive business plan and performance dashboard</p><h1>{data.meta.promise}</h1><p className="hero-copy">Next Steps Media & Digital Services is a founder-led media and content company built to convert expertise, mission, and long-form ideas into credible content that audiences can understand, trust, and act upon.</p><div className="hero-actions"><a className="button primary" href="#financials">Examine the financial case</a><a className="button secondary" href="#verdict">Review the success standard</a></div></div>
        <aside className="hero-panel"><div><span>Controlled launch</span><strong>{data.meta.launchDate}</strong></div><div><span>Stabilization review</span><strong>{data.meta.stabilizationDate}</strong></div><div><span>Minimum August draw</span><strong>{money.format(2850)}</strong></div><div><span>July 2027 draw target</span><strong>{money.format(6550)}</strong></div></aside>
      </section>

      <section className="metrics-grid">
        <Kpi label="First-year revenue requirement" value={money.format(data.fiscalYears[0].revenue)} detail="The household-supporting base case—not a casual aspiration." tone="navy" />
        <Kpi label="Five-year modeled revenue" value={money.format(fiveYearRevenue)} detail="Cumulative revenue across five August-to-July fiscal years." />
        <Kpi label="Five-year owner draws" value={money.format(fiveYearDraw)} detail="Planned household distributions, subject to actual cash performance." />
        <Kpi label="Maximum first-year capacity" value={`${data.fiscalYears[0].capacity}%`} detail="Below the 80% warning threshold, but only if scope and hours remain controlled." />
      </section>

      <section className="section" id="case">
        <SectionTitle eyebrow="Executive business case" title="The opportunity is not merely content production. It is disciplined translation of expertise into trust." copy="The business succeeds only when a defined customer problem, a clear commercial offer, repeatable delivery, and dependable cash performance work together." />
        <div className="case-grid">
          {Object.entries(data.executiveCase).map(([key, value]) => <article key={key}><span>{key.replace(/([A-Z])/g, ' $1')}</span><p>{value}</p></article>)}
        </div>
      </section>

      <section className="section" id="market">
        <SectionTitle eyebrow="Market and customer fit" title="The customer does not need more noise. The customer needs a reliable way to communicate with authority." copy="The launch market is intentionally broad enough to create opportunity but narrow enough to share one recurring problem: valuable messages are trapped inside busy organizations and inconsistent workflows." />
        <div className="segment-grid">{data.marketSegments.map((item) => <article key={item.name}><h3>{item.name}</h3><p><strong>Need:</strong> {item.need}</p><p><strong>Best fit:</strong> {item.fit}</p></article>)}</div>
        <div className="positioning-callout"><div><p className="eyebrow">Competitive position</p><h3>Not an ad agency. Not a commodity editor. Not a do-it-yourself software subscription.</h3></div><p>Next Steps competes through founder access, message clarity, broadcast discipline, executive judgment, regional credibility, and the ability to carry one source idea across audio, video, social, web, and email assets.</p></div>
      </section>

      <section className="section" id="services">
        <SectionTitle eyebrow="Service architecture and unit economics" title="Clear offers create a low-risk entry point and a visible path toward higher-value recurring work." copy="Launch pricing is deliberately accessible. It must not become a permanent ceiling after customer value, scope, and outcomes are validated." />
        <div className="service-detail-grid">{data.services.map((item) => <article key={item.name}><header><div><p className="eyebrow">{item.bestFor}</p><h3>{item.name}</h3></div><strong>{money.format(item.price)}</strong></header><p>{item.deliverables}</p><dl><div><dt>Planned owner hours</dt><dd>{item.hours}</dd></div><div><dt>Direct cost allowance</dt><dd>{money.format(item.directCost)}</dd></div><div><dt>Contribution</dt><dd>{money.format(item.contribution)}</dd></div><div><dt>Contribution margin</dt><dd>{item.margin}%</dd></div></dl><footer><strong>Upgrade path:</strong> {item.upgrade}</footer></article>)}</div>
      </section>

      <section className="section" id="financials">
        <SectionTitle eyebrow="Five-year financial construction" title="The model measures livelihood, retained cash, and delivery capacity—not revenue alone." copy="Every fiscal year must support direct costs, operating expenses, taxes, owner compensation, retained cash, and the operational capacity required to deliver the work." />
        <div className="chart-grid two">
          <ChartCard title="Revenue, owner draw, and ending cash" copy="The owner draw grows only as revenue and retained cash expand." note="All figures are planning assumptions pending actual results and CPA review."><ResponsiveContainer width="100%" height={360}><ComposedChart data={annual}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="year"/><YAxis tickFormatter={(v) => `$${Math.round(v/1000)}k`}/><Tooltip content={<CurrencyTooltip/>}/><Legend/><Bar dataKey="Revenue" fill="#123f5a" radius={[6,6,0,0]}/><Line dataKey="Owner draw" stroke="#cf9d3a" strokeWidth={3}/><Line dataKey="Ending cash" stroke="#2f7d7b" strokeWidth={3}/></ComposedChart></ResponsiveContainer></ChartCard>
          <ChartCard title={`${year.year} revenue mix`} copy="The model becomes more stable as recurring revenue becomes a larger share of the total."><ResponsiveContainer width="100%" height={360}><PieChart><Pie data={serviceMix} dataKey="value" nameKey="name" innerRadius={76} outerRadius={125} label={({name,value}) => `${name}: ${value}%`}>{serviceMix.map((entry,index) => <Cell key={entry.name} fill={palette[index]}/>)}</Pie><Tooltip formatter={(value) => `${value}%`}/></PieChart></ResponsiveContainer></ChartCard>
        </div>

        <div className="year-selector" role="tablist">{data.fiscalYears.map((item,index) => <button type="button" key={item.year} className={selectedYear===index?'active':''} onClick={() => setSelectedYear(index)}><span>{item.year}</span><strong>{money.format(item.revenue)}</strong></button>)}</div>
        <article className="year-detail final-year-detail"><header><div><p className="eyebrow">Selected fiscal year</p><h3>{year.year}</h3></div><span className="status-pill">{year.status}</span></header><div className="detail-metrics expanded"><div><span>Revenue</span><strong>{money.format(year.revenue)}</strong></div><div><span>Direct costs</span><strong>{money.format(year.directCosts)}</strong></div><div><span>Operating expenses</span><strong>{money.format(year.operatingExpenses)}</strong></div><div><span>Operating profit</span><strong>{money.format(year.operatingProfit)}</strong></div><div><span>Tax reserve</span><strong>{money.format(year.taxReserve)}</strong></div><div><span>Owner draw</span><strong>{money.format(year.ownerDraw)}</strong></div><div><span>Net retained cash</span><strong>{money.format(year.retainedCash)}</strong></div><div><span>Ending cash</span><strong>{money.format(year.endingCash)}</strong></div><div><span>Ending monthly draw</span><strong>{money.format(year.endingMonthlyDraw)}</strong></div><div><span>Avg. delivery hours/mo.</span><strong>{number.format(year.ownerHours)}</strong></div><div><span>Max. capacity</span><strong>{year.capacity}%</strong></div><div><span>Recurring revenue mix</span><strong>{year.recurringMix}%</strong></div></div></article>
      </section>

      <section className="section" id="sales">
        <SectionTitle eyebrow="First-year monthly sales construction" title="The annual target is credible only when the monthly path and required selling activity are visible." copy="The first-year plan requires continuous prospecting, discovery, proposals, paid starter work, conversion to retainers, and disciplined collections." />
        <ChartCard title="FY 2026–27 monthly revenue and owner-draw ramp" copy="The draw increases from $2,850 in August to $6,550 in July only if revenue and cash support it."><ResponsiveContainer width="100%" height={390}><ComposedChart data={monthly}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="month"/><YAxis yAxisId="money" tickFormatter={(v)=>`$${Math.round(v/1000)}k`}/><YAxis yAxisId="clients" orientation="right" allowDecimals={false}/><Tooltip/><Legend/><Bar yAxisId="money" dataKey="Revenue target" fill="#123f5a" radius={[6,6,0,0]}/><Line yAxisId="money" dataKey="Owner draw" stroke="#cf9d3a" strokeWidth={3}/><Line yAxisId="clients" dataKey="retainers" name="Active retainers" stroke="#2f7d7b" strokeWidth={3}/></ComposedChart></ResponsiveContainer></ChartCard>
        <div className="sales-layout">
          <article className="funnel-card"><h3>Launch proof funnel</h3>{data.funnel.map((item,index) => <div key={item.stage} style={{width:`${Math.max(38,100-index*13)}%`}}><span>{item.stage}</span><strong>{item.value}</strong><small>{item.conversion}% of qualified prospects</small></div>)}</article>
          <article className="activity-card"><h3>Weekly operating standard</h3><ul><li>10–15 qualified prospects added</li><li>10–15 personalized contacts</li><li>At least 5 follow-ups</li><li>2 or more calls scheduled</li><li>1–2 discovery calls completed</li><li>At least 1 proposal issued</li><li>Revenue and collections reviewed weekly</li><li>Approximately 10 hours dedicated to prospecting</li></ul><p><strong>Core conversion test:</strong> 40 qualified prospects must produce 6 discovery calls, 3 proposals, 2 paid starters, and 1 converted retainer.</p></article>
        </div>
      </section>

      <section className="section" id="operations">
        <SectionTitle eyebrow="Operating system and accountability" title="The business must be managed as a repeatable company, not a collection of favors and improvised projects." copy="Commercial controls, production controls, financial controls, and professional-review gates protect margin, quality, client trust, and compliance." />
        <div className="workflow-grid">{data.workflow.map(([step,name,detail]) => <article key={step}><span>{step}</span><div><h3>{name}</h3><p>{detail}</p></div></article>)}</div>
        <div className="control-grid"><article><h3>Commercial controls</h3><ul><li>Written scope and deliverables</li><li>50% project deposit</li><li>Monthly retainer prepayment</li><li>One revision unless contracted otherwise</li><li>Change orders for added scope</li></ul></article><article><h3>Financial controls</h3><ul><li>Monthly close and forecast-versus-actual review</li><li>Separate tax reserve</li><li>Owner draw explicitly recorded</li><li>Minimum cash warning</li><li>Outside-income bridge quantified</li></ul></article><article><h3>Professional gates</h3><ul><li>Attorney review of contracts, privacy, IP, and releases</li><li>CPA review of entity, taxes, and accounting treatment</li><li>Insurance review for liability, E&O, cyber, and equipment</li><li>Cybersecurity review for credentials, backups, and incidents</li></ul></article><article><h3>Capacity controls</h3><ul><li>Founder-led delivery at launch</li><li>80% utilization warning</li><li>Standard procedures before delegation</li><li>Project contractors before fixed payroll</li><li>Decline low-value or poorly scoped work</li></ul></article></div>
      </section>

      <section className="section" id="scenarios">
        <SectionTitle eyebrow="Scenario and household sensitivity" title="The downside is quantified instead of disguised." copy="A zero-cash launch and immediate household draw create a real execution constraint. Revenue shortfalls must be translated into a visible working-capital or outside-income bridge." />
        <ChartCard title="Revenue attainment and cash after required draw" copy="Negative balances represent the amount that must be funded outside the business."><ResponsiveContainer width="100%" height={380}><BarChart data={data.scenarios}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="attainment" tickFormatter={(v)=>`${v}%`}/><YAxis tickFormatter={(v)=>`$${Math.round(v/1000)}k`}/><Tooltip content={<CurrencyTooltip/>}/><Legend/><Bar dataKey="revenue" name="Revenue" fill="#123f5a" radius={[6,6,0,0]}/><Bar dataKey="balance" name="Cash after required draw" fill="#cf9d3a" radius={[6,6,0,0]}/><ReferenceLine y={0} stroke="#8a5a44"/></BarChart></ResponsiveContainer></ChartCard>
        <div className="scenario-grid">{data.scenarios.map((item) => <article className={item.balance<0?'scenario-card warning':'scenario-card'} key={item.name}><span className="status-pill">{item.classification}</span><h3>{item.name}</h3><dl><div><dt>Revenue</dt><dd>{money.format(item.revenue)}</dd></div><div><dt>Cash before draw</dt><dd>{money.format(item.cashBeforeDraw)}</dd></div><div><dt>Required draw</dt><dd>{money.format(item.requiredDraw)}</dd></div><div><dt>{item.balance<0?'Unfunded gap':'Remaining cash'}</dt><dd>{money.format(Math.abs(item.balance))}</dd></div></dl><p>{item.action}</p></article>)}</div>
      </section>

      <section className="section" id="risk">
        <SectionTitle eyebrow="Risk and readiness" title="The highest risks are sales pace, pricing discipline, founder capacity, household cash, and compliance." copy="Each risk has a measurable trigger and a predetermined response so that pressure does not turn management into guesswork." />
        <div className="risk-table"><div className="risk-row risk-head"><span>Risk</span><span>Score</span><span>Trigger</span><span>Management response</span></div>{data.risks.map((item)=><div className="risk-row" key={item.risk}><strong>{item.risk}</strong><span className={`risk-score ${item.probability*item.impact>=16?'critical':''}`}>{item.probability*item.impact}/25</span><p>{item.trigger}</p><p>{item.response}</p></div>)}</div>
      </section>

      <section className="section" id="roadmap">
        <SectionTitle eyebrow="Milestones and proof" title="Confidence must be earned through evidence on a schedule." copy="The launch is a sequence of decision gates. Missing evidence is not hidden behind activity, training, or polished presentation." />
        <div className="milestone-grid final-milestones">{data.milestones.map((item,index)=><article key={item.name}><span>{String(index+1).padStart(2,'0')}</span><div><p>{item.date}</p><h3>{item.name}</h3><small>{item.evidence}</small></div></article>)}</div>
      </section>

      <section className="section verdict-section" id="verdict">
        <SectionTitle eyebrow="First-year verdict standard" title="The business is promising, but household support is not proven until customers pay, stay, and refer." copy="The plan, founder experience, low overhead, and service architecture justify proceeding. The decisive issue is whether the sales engine can create dependable recurring value without exhausting capacity or hiding a household cash gap." />
        <div className="success-grid">{data.successGates.map(([name,detail])=><article key={name}><h3>{name}</h3><p>{detail}</p></article>)}</div>
        <div className="verdict-callout"><div><p className="eyebrow">What success means by July 31, 2027</p><h2>A repeatable company producing dependable owner income—not merely a busy freelance practice.</h2></div><ul><li>Revenue trajectory supports the planned draw.</li><li>Recurring clients reduce dependence on one-off projects.</li><li>Delivery remains within scope, margin, and capacity.</li><li>Cash, taxes, compliance, and professional gates remain current.</li><li>The owner and household can see the truth every month.</li></ul></div>
      </section>
    </main>

    <footer><div><strong>{data.meta.businessName}</strong><p>Executive business plan and public approved dashboard</p></div><div><a href="/owner">Secure owner portal</a><p>{data.meta.notice}</p></div></footer>
  </div>;
}

export default PublicDashboard;
