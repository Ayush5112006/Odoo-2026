import React from 'react';

function AnalyticsView({
  trips,
  fuel,
  maint,
  fleetUtilization,
  exportCSV,
  fmtMoney
}) {
  return (
    <section className="view" id="page-analytics" style={{ display: 'block' }}>
      <div className="page-head">
        <div><span className="eyebrow">Reports</span><h1>Reports &amp; Analytics</h1></div>
        <button className="btn btn-ghost btn-sm" onClick={exportCSV}>⤓ Export CSV</button>
      </div>

      <div className="kpi-row">
        <div className="kpi-card acc-blue">
          <div className="kpi-label">Fuel Efficiency</div>
          <div className="kpi-value">
            {(trips.reduce((sum, t) => sum + (t.dist || 0), 0) / (fuel.reduce((sum, f) => sum + f.liters, 0) || 1)).toFixed(1)} km/l
          </div>
        </div>
        <div className="kpi-card acc-green">
          <div className="kpi-label">Fleet Utilization</div>
          <div className="kpi-value">{Math.min(fleetUtilization, 99)}%</div>
        </div>
        <div className="kpi-card acc-amber">
          <div className="kpi-label">Operational Cost</div>
          <div className="kpi-value">
            {fmtMoney(
              fuel.reduce((sum, f) => sum + f.cost, 0) + maint.reduce((sum, m) => sum + m.cost, 0)
            )}
          </div>
        </div>
        <div className="kpi-card acc-green">
          <div className="kpi-label">Vehicle ROI (est.)</div>
          <div className="kpi-value">14.2%</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Monthly Revenue</h3>
          <div className="chart-bars">
            {[58, 71, 52, 84, 68, 92, 80].map((r, i) => {
              const maxVal = Math.max(58, 71, 52, 84, 68, 92, 80);
              const pct = (r / maxVal) * 100;
              return (
                <div key={i} className="cb" style={{ height: `${pct}%` }}>
                  <span>W{i + 1}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3>Top Costliest Vehicles</h3>
          <div className="status-bars">
            {(() => {
              const byVeh = {};
              maint.forEach(m => byVeh[m.vehicle] = (byVeh[m.vehicle] || 0) + m.cost);
              fuel.forEach(f => byVeh[f.vehicle] = (byVeh[f.vehicle] || 0) + f.cost);
              const entries = Object.entries(byVeh).sort((a, b) => b[1] - a[1]).slice(0, 3);
              const topMax = entries.length ? entries[0][1] : 1;
              const barColors = ['var(--red)', 'var(--amber)', 'var(--blue)'];

              return entries.map(([name, val], i) => (
                <div key={name} className="brow">
                  <span>{name}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(val / topMax * 100)}%`, backgroundColor: barColors[i] || 'var(--blue)' }}></div>
                  </div>
                  <span className="n" style={{ width: '70px' }}>{fmtMoney(val)}</span>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AnalyticsView;
