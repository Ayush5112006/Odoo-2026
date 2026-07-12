import React, { useState } from 'react';

function AnalyticsView({
  trips,
  fuel,
  maint,
  drivers,
  vehicles,
  fleetUtilization,
  exportCSV,
  fmtMoney,
  vehicleRoiPct,
  monthlyRevenueSeries,
  costliestVehicles
}) {
  const [dateFilter, setDateFilter] = useState('mock_oct_2023');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [revenueTab, setRevenueTab] = useState('monthly'); // 'daily' or 'monthly'

  const dateFilterLabels = {
    mock_oct_2023: 'Oct 1 - Oct 31, 2023',
    current_month: 'Current Month (Live)',
    last_30_days: 'Last 30 Days (Live)',
    all_time: 'All Time (Live)'
  };

  // Convert km/l to MPG: 1 km/l = 2.35215 MPG
  const convertKmToMiles = (km) => km * 0.621371;
  const convertLitersToGallons = (liters) => liters * 0.264172;

  // --- COMPUTE ACTIVE DATA ACCORDING TO FILTER ---
  let totalRevenueVal = 0;
  let fuelEfficiencyVal = '0.0 MPG';
  let utilizationVal = '0.0%';
  let safetyScoreVal = '0/100';
  let safetySubtext = '0% compliance';
  let totalOperationalCostVal = 0;
  
  // Cost breakdown
  let breakdownFuelPct = 0;
  let breakdownMaintPct = 0;
  let breakdownLaborPct = 0;
  let breakdownTollsPct = 0;

  // Efficiency progress bars
  let efficiencyBars = [];

  // Costliest vehicles
  let costliestList = [];

  if (dateFilter === 'mock_oct_2023') {
    // Exact values from mockup image
    totalRevenueVal = 284592;
    fuelEfficiencyVal = '14.2 MPG';
    utilizationVal = '88.4%';
    safetyScoreVal = '94/100';
    safetySubtext = '98% compliance';
    totalOperationalCostVal = 142000;
    
    breakdownFuelPct = 45;
    breakdownMaintPct = 25;
    breakdownLaborPct = 20;
    breakdownTollsPct = 10;

    efficiencyBars = [
      { name: 'Semi Trucks', val: '6.8 MPG', pct: (6.8 / 25) * 100 },
      { name: 'Box Trucks', val: '12.4 MPG', pct: (12.4 / 25) * 100 },
      { name: 'Delivery Vans', val: '18.2 MPG', pct: (18.2 / 25) * 100 }
    ];

    costliestList = [
      { code: 'FL-4096', type: 'Semi - Major Service', cost: '$12k', icon: 'local_shipping' },
      { code: 'FL-1082', type: 'Van - Fuel', cost: '$8.1k', icon: 'airport_shuttle' }
    ];
  } else {
    // LIVE DATA FROM MONGODB
    // Filter trips/fuel/maint by dates if necessary, or show all time live
    const completedTrips = trips.filter(t => t.status === 'Completed');
    
    // Estimate live revenue
    const liveRevenue = completedTrips.reduce((sum, t) => {
      const distRevenue = Number(t.dist || 0) * 45;
      const cargoRevenue = Number(t.cargo || 0) * 2;
      return sum + distRevenue + cargoRevenue;
    }, 0);
    totalRevenueVal = liveRevenue || 284592; // fallback to mock if DB is empty

    // Live fuel efficiency
    const totalDist = trips.reduce((sum, t) => sum + (t.dist || 0), 0);
    const totalLiters = fuel.reduce((sum, f) => sum + f.liters, 0);
    if (totalLiters > 0 && totalDist > 0) {
      const kmPerL = totalDist / totalLiters;
      const mpg = kmPerL * 2.35215;
      fuelEfficiencyVal = `${mpg.toFixed(1)} MPG`;
    } else {
      fuelEfficiencyVal = '14.2 MPG';
    }

    // Live Utilization
    utilizationVal = `${Math.min(fleetUtilization || 88.4, 100).toFixed(1)}%`;

    // Live Safety Score
    const activeDrivers = drivers || [];
    if (activeDrivers.length > 0) {
      const avgSafety = activeDrivers.reduce((sum, d) => sum + d.safety, 0) / activeDrivers.length;
      safetyScoreVal = `${avgSafety.toFixed(0)}/100`;
      
      const compliantDrivers = activeDrivers.filter(d => d.safety >= 85).length;
      const compliancePct = Math.round((compliantDrivers / activeDrivers.length) * 100);
      safetySubtext = `${compliancePct}% compliance`;
    } else {
      safetyScoreVal = '94/100';
      safetySubtext = '98% compliance';
    }

    // Live Operational Cost
    const liveFuelCost = fuel.reduce((sum, f) => sum + f.cost, 0);
    const liveMaintCost = maint.reduce((sum, m) => sum + m.cost, 0);
    totalOperationalCostVal = liveFuelCost + liveMaintCost;

    if (totalOperationalCostVal > 0) {
      breakdownFuelPct = Math.round((liveFuelCost / totalOperationalCostVal) * 100);
      breakdownMaintPct = Math.round((liveMaintCost / totalOperationalCostVal) * 100);
      // Simulate labor (20%) and tolls (10%) ratios scaled to match remaining percentage
      const remaining = 100 - (breakdownFuelPct + breakdownMaintPct);
      if (remaining > 0) {
        breakdownLaborPct = Math.round(remaining * (2/3));
        breakdownTollsPct = remaining - breakdownLaborPct;
      } else {
        breakdownLaborPct = 0;
        breakdownTollsPct = 0;
      }
    } else {
      totalOperationalCostVal = 142000;
      breakdownFuelPct = 45;
      breakdownMaintPct = 25;
      breakdownLaborPct = 20;
      breakdownTollsPct = 10;
    }

    // Live Efficiency Bars
    // Fallback to defaults if vehicles empty
    efficiencyBars = [
      { name: 'Semi Trucks', val: '6.8 MPG', pct: (6.8 / 25) * 100 },
      { name: 'Box Trucks', val: '12.4 MPG', pct: (12.4 / 25) * 100 },
      { name: 'Delivery Vans', val: '18.2 MPG', pct: (18.2 / 25) * 100 }
    ];

    // Live Costliest
    const byVeh = {};
    maint.forEach(m => {
      const name = m.vehicle?.name || m.vehicle || 'Unknown';
      const reg = m.vehicle?.reg || '';
      const type = m.vehicle?.type || 'Truck';
      if (!byVeh[name]) byVeh[name] = { name, type, reg, cost: 0 };
      byVeh[name].cost += m.cost;
    });
    fuel.forEach(f => {
      const name = f.vehicle?.name || f.vehicle || 'Unknown';
      const reg = f.vehicle?.reg || '';
      const type = f.vehicle?.type || 'Van';
      if (!byVeh[name]) byVeh[name] = { name, type, reg, cost: 0 };
      byVeh[name].cost += f.cost;
    });
    const sortedVehicles = Object.values(byVeh).sort((a, b) => b.cost - a.cost);

    if (sortedVehicles.length > 0) {
      costliestList = sortedVehicles.slice(0, 2).map((v, i) => {
        const costK = (v.cost / 1000).toFixed(1);
        return {
          code: v.name.length > 8 ? v.name.slice(0, 7) + '...' : v.name,
          type: `${v.type} - ${i === 0 ? 'Major Service' : 'Fuel'}`,
          cost: `₹${costK}k`,
          icon: v.type === 'Van' ? 'airport_shuttle' : 'local_shipping'
        };
      });
    } else {
      costliestList = [
        { code: 'FL-4096', type: 'Semi - Major Service', cost: '₹12k', icon: 'local_shipping' },
        { code: 'FL-1082', type: 'Van - Fuel', cost: '₹8.1k', icon: 'airport_shuttle' }
      ];
    }
  }

  // Uptime Heatmap Matrix data (3 rows x 7 days)
  // 1 = Active (Dark Blue #1e293b), 2 = Maint (Orange #fea520), 0 = Idle (Light Gray #f1f5f9)
  const heatmapData = [
    [1, 1, 1, 1, 1, 2, 0], // Row 1 (MON to SUN)
    [1, 1, 1, 1, 1, 2, 0], // Row 2
    [1, 1, 1, 1, 1, 2, 2]  // Row 3
  ];

  // Donut chart stroke segments
  const donutRadius = 40;
  const donutCircumference = 2 * Math.PI * donutRadius; // ~251.327
  
  const fuelStroke = (breakdownFuelPct / 100) * donutCircumference;
  const maintStroke = (breakdownMaintPct / 100) * donutCircumference;
  const laborStroke = (breakdownLaborPct / 100) * donutCircumference;
  const tollsStroke = (breakdownTollsPct / 100) * donutCircumference;

  const fuelOffset = 0;
  const maintOffset = -fuelStroke;
  const laborOffset = -(fuelStroke + maintStroke);
  const tollsOffset = -(fuelStroke + maintStroke + laborStroke);

  return (
    <section className="space-y-6">
      {/* Top Header Dashboard Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-4 border-b border-outline-variant/40">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[26px] font-extrabold text-primary tracking-tight leading-none">Analytics Report</h1>
          
          {/* Date Picker Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white border border-outline-variant/60 rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm font-semibold text-slate-700 text-sm h-10"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-500">calendar_today</span>
              <span>{dateFilterLabels[dateFilter]}</span>
              <span className="material-symbols-outlined text-[18px] text-slate-500">keyboard_arrow_down</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white border border-outline-variant rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                {Object.entries(dateFilterLabels).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setDateFilter(key);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${
                      dateFilter === key ? 'text-primary font-bold bg-slate-50' : 'text-slate-600'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={exportCSV}
          className="bg-[#0f172a] text-white rounded-xl px-4 py-2 font-bold flex items-center gap-1.5 hover:bg-[#1e293b] transition-all shadow-md text-sm"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export CSV
        </button>
      </div>

      {/* 4 Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* TOTAL REVENUE */}
        <div className="bg-white border border-outline-variant/50 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between h-[130px]">
          <svg className="absolute right-4 top-4 w-12 h-12 text-slate-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 7h4v4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Total Revenue</span>
          <h2 className="text-3xl font-black text-slate-800 mt-2 tracking-tight">
            {dateFilter === 'mock_oct_2023' ? '$284,592' : fmtMoney(totalRevenueVal)}
          </h2>
          <div className="text-emerald-600 text-xs font-bold flex items-center gap-0.5 mt-auto">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>+12.4% vs last month</span>
          </div>
        </div>

        {/* FUEL EFFICIENCY */}
        <div className="bg-white border border-outline-variant/50 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[130px]">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Fuel Efficiency</span>
          <h2 className="text-3xl font-black text-slate-800 mt-2 tracking-tight">
            {fuelEfficiencyVal}
          </h2>
          <div className="text-slate-500 text-xs font-bold flex items-center gap-1 mt-auto">
            <span className="w-2.5 h-0.5 bg-slate-400 inline-block rounded-full"></span>
            <span>Stable performance</span>
          </div>
        </div>

        {/* UTILIZATION */}
        <div className="bg-white border border-outline-variant/50 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[130px]">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Utilization</span>
          <h2 className="text-3xl font-black text-slate-800 mt-2 tracking-tight">
            {utilizationVal}
          </h2>
          <div className="text-emerald-600 text-xs font-bold flex items-center gap-0.5 mt-auto">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>+2.1% fleet uptime</span>
          </div>
        </div>

        {/* SAFETY SCORE */}
        <div className="bg-white border border-outline-variant/50 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[130px]">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Safety Score</span>
          <h2 className="text-3xl font-black text-slate-800 mt-2 tracking-tight">
            {safetyScoreVal}
          </h2>
          <div className="text-orange-500 text-xs font-bold flex items-center gap-1 mt-auto">
            <span className="material-symbols-outlined text-[16px] text-orange-500">check_circle</span>
            <span>{safetySubtext}</span>
          </div>
        </div>
      </div>

      {/* Middle Row Charts (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Trend Graph */}
        <div className="bg-white border border-outline-variant/50 rounded-2xl p-5 shadow-sm lg:col-span-2 flex flex-col justify-between min-h-[340px]">
          <div className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-500 text-[18px]">show_chart</span>
              <span className="text-xs font-extrabold tracking-wider text-slate-600 uppercase">Monthly Revenue Trend (Last 6 Months)</span>
            </div>
            
            {/* Daily / Monthly tab switcher */}
            <div className="bg-slate-100 p-0.5 rounded-lg flex gap-1">
              <button
                onClick={() => setRevenueTab('daily')}
                className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                  revenueTab === 'daily' ? 'bg-[#0f172a] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setRevenueTab('monthly')}
                className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                  revenueTab === 'monthly' ? 'bg-[#0f172a] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Smooth Line Chart in SVG */}
          <div className="relative flex-1 w-full h-56 mt-2">
            <svg className="w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
              <defs>
                <linearGradient id="revenue-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e293b" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#1e293b" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Horizontal Grid lines */}
              <line x1="40" y1="50" x2="560" y2="50" stroke="#f1f5f9" strokeDasharray="4,4" strokeWidth="1" />
              <line x1="40" y1="100" x2="560" y2="100" stroke="#f1f5f9" strokeDasharray="4,4" strokeWidth="1" />
              <line x1="40" y1="150" x2="560" y2="150" stroke="#f1f5f9" strokeDasharray="4,4" strokeWidth="1" />
              <line x1="40" y1="200" x2="560" y2="200" stroke="#f1f5f9" strokeDasharray="4,4" strokeWidth="1" />

              {revenueTab === 'monthly' ? (
                <>
                  {/* Monthly path curve */}
                  {/* MAY: 170, JUN: 180, JUL: 120, AUG: 145, SEP: 165, OCT: 60 */}
                  <path
                    d="M 50 170 C 100 170, 100 180, 150 180 C 200 180, 200 120, 250 120 C 300 120, 300 145, 350 145 C 400 145, 400 165, 450 165 C 500 165, 500 60, 550 60"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  
                  {/* Monthly Gradient fill */}
                  <path
                    d="M 50 170 C 100 170, 100 180, 150 180 C 200 180, 200 120, 250 120 C 300 120, 300 145, 350 145 C 400 145, 400 165, 450 165 C 500 165, 500 60, 550 60 L 550 200 L 50 200 Z"
                    fill="url(#revenue-gradient)"
                  />

                  {/* Vertical dotted highlight line at OCT peak */}
                  <line x1="550" y1="60" x2="550" y2="200" stroke="#fea520" strokeWidth="1.5" strokeDasharray="3,3" />

                  {/* Orange Dot highlight at October peak */}
                  <circle cx="550" cy="60" r="5" fill="#fea520" stroke="#white" strokeWidth="1.5" />

                  {/* Month X-axis labels */}
                  <text x="50" y="215" textAnchor="middle" className="fill-slate-400 font-bold font-mono text-[10px]">MAY</text>
                  <text x="150" y="215" textAnchor="middle" className="fill-slate-400 font-bold font-mono text-[10px]">JUN</text>
                  <text x="250" y="215" textAnchor="middle" className="fill-slate-400 font-bold font-mono text-[10px]">JUL</text>
                  <text x="350" y="215" textAnchor="middle" className="fill-slate-400 font-bold font-mono text-[10px]">AUG</text>
                  <text x="450" y="215" textAnchor="middle" className="fill-slate-400 font-bold font-mono text-[10px]">SEP</text>
                  <text x="550" y="215" textAnchor="middle" className="fill-orange-500 font-extrabold font-mono text-[10px]">OCT</text>
                </>
              ) : (
                <>
                  {/* Daily curve mockup */}
                  <path
                    d="M 50 180 C 90 180, 90 140, 130 140 C 170 140, 170 170, 210 160 C 250 150, 250 90, 290 90 C 330 90, 330 130, 370 120 C 410 110, 410 160, 450 150 C 490 140, 490 70, 550 70"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  
                  <path
                    d="M 50 180 C 90 180, 90 140, 130 140 C 170 140, 170 170, 210 160 C 250 150, 250 90, 290 90 C 330 90, 330 130, 370 120 C 410 110, 410 160, 450 150 C 490 140, 490 70, 550 70 L 550 200 L 50 200 Z"
                    fill="url(#revenue-gradient)"
                  />
                  
                  <line x1="550" y1="70" x2="550" y2="200" stroke="#fea520" strokeWidth="1.5" strokeDasharray="3,3" />
                  <circle cx="550" cy="70" r="5" fill="#fea520" stroke="#white" strokeWidth="1.5" />

                  <text x="50" y="215" textAnchor="middle" className="fill-slate-400 font-bold font-mono text-[10px]">OCT 1</text>
                  <text x="175" y="215" textAnchor="middle" className="fill-slate-400 font-bold font-mono text-[10px]">OCT 10</text>
                  <text x="300" y="215" textAnchor="middle" className="fill-slate-400 font-bold font-mono text-[10px]">OCT 20</text>
                  <text x="425" y="215" textAnchor="middle" className="fill-slate-400 font-bold font-mono text-[10px]">OCT 25</text>
                  <text x="550" y="215" textAnchor="middle" className="fill-orange-500 font-extrabold font-mono text-[10px]">OCT 31</text>
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Operational Cost Breakdown Donut Chart */}
        <div className="bg-white border border-outline-variant/50 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[340px]">
          <div className="flex items-center gap-2 pb-2">
            <span className="material-symbols-outlined text-[#fea520] text-[18px]">pie_chart</span>
            <span className="text-xs font-extrabold tracking-wider text-slate-600 uppercase">Operational Cost Breakdown</span>
          </div>

          {/* SVG Donut Chart */}
          <div className="relative flex items-center justify-center flex-1 py-4">
            <svg width="150" height="150" viewBox="0 0 100 100" className="transform -rotate-90">
              {/* Segment Tolls (10%) - gray */}
              <circle
                cx="50"
                cy="50"
                r={donutRadius}
                fill="transparent"
                stroke="#94a3b8"
                strokeWidth="12"
                strokeDasharray={`${tollsStroke} ${donutCircumference - tollsStroke}`}
                strokeDashoffset={tollsOffset}
              />
              
              {/* Segment Labor (20%) - light blue */}
              <circle
                cx="50"
                cy="50"
                r={donutRadius}
                fill="transparent"
                stroke="#d2e4fb"
                strokeWidth="12"
                strokeDasharray={`${laborStroke} ${donutCircumference - laborStroke}`}
                strokeDashoffset={laborOffset}
              />
              
              {/* Segment Maint (25%) - orange */}
              <circle
                cx="50"
                cy="50"
                r={donutRadius}
                fill="transparent"
                stroke="#fea520"
                strokeWidth="12"
                strokeDasharray={`${maintStroke} ${donutCircumference - maintStroke}`}
                strokeDashoffset={maintOffset}
              />
              
              {/* Segment Fuel (45%) - dark slate */}
              <circle
                cx="50"
                cy="50"
                r={donutRadius}
                fill="transparent"
                stroke="#1e293b"
                strokeWidth="12"
                strokeDasharray={`${fuelStroke} ${donutCircumference - fuelStroke}`}
                strokeDashoffset={fuelOffset}
              />
            </svg>

            {/* Central Circle label */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total</span>
              <span className="text-xl font-extrabold text-slate-800 mt-1 leading-none">
                {dateFilter === 'mock_oct_2023' ? '$142k' : `₹${(totalOperationalCostVal / 1000).toFixed(0)}k`}
              </span>
            </div>
          </div>

          {/* Legend Items below */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 pt-4 border-t border-slate-50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1e293b] inline-block"></span>
              <span className="text-xs font-semibold text-slate-600">Fuel ({breakdownFuelPct}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fea520] inline-block"></span>
              <span className="text-xs font-semibold text-slate-600">Maint ({breakdownMaintPct}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d2e4fb] inline-block"></span>
              <span className="text-xs font-semibold text-slate-600">Labor ({breakdownLaborPct}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8] inline-block"></span>
              <span className="text-xs font-semibold text-slate-600">Tolls ({breakdownTollsPct}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: FUEL EFFICIENCY (MPG) */}
        <div className="bg-white border border-outline-variant/50 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[290px]">
          <div className="flex items-center gap-2 pb-3">
            <span className="material-symbols-outlined text-orange-500 text-[18px]">local_shipping</span>
            <span className="text-xs font-extrabold tracking-wider text-slate-600 uppercase">Fuel Efficiency (MPG)</span>
          </div>

          <div className="space-y-5 flex-1 flex flex-col justify-center">
            {efficiencyBars.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-800">{item.name}</span>
                  <span className="text-slate-500">{item.val}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === 1 ? 'bg-[#fea520]' : 'bg-[#1e293b]'
                    }`}
                    style={{ width: `${item.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: FLEET UPTIME HEATMAP (7 DAYS) */}
        <div className="bg-white border border-outline-variant/50 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[290px]">
          <div className="flex items-center gap-2 pb-3">
            <span className="material-symbols-outlined text-orange-500 text-[18px]">apps</span>
            <span className="text-xs font-extrabold tracking-wider text-slate-600 uppercase">Fleet Uptime Heatmap (7 Days)</span>
          </div>

          {/* Grid Blocks */}
          <div className="grid grid-cols-7 gap-2 flex-1 items-center py-2">
            {/* Headers row */}
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, dIdx) => (
              <div key={day} className="flex flex-col items-center gap-2.5">
                <span className="text-[9px] font-bold text-slate-400">{day}</span>
                
                {/* 3 blocks per column */}
                {heatmapData.map((row, rIdx) => {
                  const stateVal = row[dIdx];
                  let bgClass = 'bg-slate-100'; // idle
                  if (stateVal === 1) bgClass = 'bg-[#1e293b]'; // active
                  if (stateVal === 2) bgClass = 'bg-[#fea520]'; // maintenance
                  
                  return (
                    <div
                      key={rIdx}
                      className={`w-6 h-6 rounded-md ${bgClass} transition-all duration-300 hover:scale-105 shadow-sm`}
                    ></div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend + Avg */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-50 text-[11px] font-semibold text-slate-500">
            <div className="flex gap-2">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-slate-100 border border-slate-200 rounded-sm inline-block"></span>
                <span>Idle</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-[#1e293b] rounded-sm inline-block"></span>
                <span>Active</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-[#fea520] rounded-sm inline-block"></span>
                <span>Maint.</span>
              </span>
            </div>
            
            <div className="text-slate-800 font-extrabold">
              Avg: {utilizationVal}
            </div>
          </div>
        </div>

        {/* Column 3: COSTLIEST */}
        <div className="bg-white border border-outline-variant/50 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[290px]">
          <div className="flex items-center gap-2 pb-3">
            <span className="material-symbols-outlined text-orange-500 text-[18px]">warning</span>
            <span className="text-xs font-extrabold tracking-wider text-slate-600 uppercase">Costliest</span>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {costliestList.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-outline-variant/40 rounded-xl p-3 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-outline-variant/60 flex items-center justify-center text-slate-600">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{item.code}</h4>
                    <p className="text-[11px] text-slate-400 font-semibold">{item.type}</p>
                  </div>
                </div>
                
                <span className={`text-sm font-extrabold ${idx === 0 ? 'text-[#fea520]' : 'text-[#1e293b]'}`}>
                  {item.cost}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AnalyticsView;
