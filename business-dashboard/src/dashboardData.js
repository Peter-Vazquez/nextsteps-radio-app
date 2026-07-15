export const dashboardSnapshot = {
  meta: {
    businessName: 'Next Steps Media & Digital Services',
    dataMode: 'approved-snapshot',
    dataLabel: 'Manual approved snapshot',
    asOf: '2026-07-15',
    fiscalCycle: 'August 1–July 31',
    notice: 'Planning assumptions are not guarantees. Actual results replace assumptions monthly.',
  },
  launch: {
    date: 'August 1, 2026',
    stabilizationReview: 'September 22, 2026',
    minimumMonthlyDraw: 2850,
    july2027DrawTarget: 6550,
  },
  fiscalYears: [
    { year: 'FY 2026–27', period: 'Aug. 1, 2026–July 31, 2027', stage: 'Launch and validation', revenue: 118400, yoy: null, operatingProfit: 102525, taxReserve: 25631, ownerDraw: 57050, endingMonthlyDraw: 6550, endingCash: 19844, capacity: 75.6, averageMonthlyRevenue: 9867, objective: 'Prove demand, establish recurring clients, and fund the owner-draw ramp.', status: 'Required operating target' },
    { year: 'FY 2027–28', period: 'Aug. 1, 2027–July 31, 2028', stage: 'Recurring-revenue growth', revenue: 174000, yoy: 47.0, operatingProfit: 142992, taxReserve: 35748, ownerDraw: 84300, endingMonthlyDraw: 7500, endingCash: 42788, capacity: 60.1, averageMonthlyRevenue: 14500, objective: 'Strengthen retention, raise average client value, and stabilize monthly income.', status: 'Household-supporting base case' },
    { year: 'FY 2028–29', period: 'Aug. 1, 2028–July 31, 2029', stage: 'Pricing and service expansion', revenue: 228000, yoy: 31.0, operatingProfit: 169344, taxReserve: 42336, ownerDraw: 99000, endingMonthlyDraw: 9000, endingCash: 70796, capacity: 61.8, averageMonthlyRevenue: 19000, objective: 'Move beyond launch pricing and add higher-value strategic engagements.', status: 'Household-supporting base case' },
    { year: 'FY 2029–30', period: 'Aug. 1, 2029–July 31, 2030', stage: 'Mature premium practice', revenue: 262800, yoy: 15.3, operatingProfit: 182970, taxReserve: 45743, ownerDraw: 117000, endingMonthlyDraw: 10500, endingCash: 91023, capacity: 58.8, averageMonthlyRevenue: 21900, objective: 'Maintain a profitable premium practice with disciplined capacity control.', status: 'Strategic growth case' },
    { year: 'FY 2030–31', period: 'Aug. 1, 2030–July 31, 2031', stage: 'Selective scale', revenue: 325800, yoy: 24.0, operatingProfit: 216730, taxReserve: 54183, ownerDraw: 138000, endingMonthlyDraw: 12500, endingCash: 115571, capacity: 60.6, averageMonthlyRevenue: 27150, objective: 'Use higher-value retainers, disciplined project pricing, and selective contractor leverage.', status: 'Strategic growth case' },
  ],
  scenarios: [
    { name: 'Delayed sales', attainment: 75, revenue: 88800, postTaxCashBeforeDraw: 55878, requiredOwnerDraw: 57050, surplus: -1172, status: 'Warning', action: 'Quantify the outside-income bridge, reduce discretionary cost, and intensify presales.' },
    { name: 'Household-supporting base', attainment: 100, revenue: 118400, postTaxCashBeforeDraw: 76979, requiredOwnerDraw: 57050, surplus: 19929, status: 'Required base', action: 'Execute the monthly client and pricing plan and review actuals weekly.' },
    { name: 'Above-plan execution', attainment: 120, revenue: 142080, postTaxCashBeforeDraw: 93860, requiredOwnerDraw: 57050, surplus: 36810, status: 'Upside sensitivity', action: 'Preserve scope and capacity; do not add cost before repeatability is proven.' },
  ],
  actuals: {
    currentFiscalYear: 'FY 2026–27',
    monthsEntered: 0,
    plannedRevenueToDate: 0,
    actualRevenueToDate: null,
    revenueVariance: null,
    requiredOwnerDrawToDate: 0,
    actualOwnerDrawToDate: null,
    ownerDrawVariance: null,
    outsideIncomeUsed: null,
    endingCash: null,
    status: 'No actuals entered',
  },
};

export function validateDashboardData(value) {
  if (!value || typeof value !== 'object') return false;
  if (!value.meta || !Array.isArray(value.fiscalYears) || value.fiscalYears.length !== 5) return false;
  return value.fiscalYears.every((item) => item.year && Number.isFinite(Number(item.revenue)));
}
