import React from 'react';

function AnalyticsView({
  trips,
  fuel,
  maint,
  fleetUtilization,
  exportCSV,
  fmtMoney,
  vehicleRoiPct,
  monthlyRevenueSeries,
  costliestVehicles
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
          <div className="kpi-value">{vehicleRoiPct.toFixed(1)}%</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Monthly Revenue</h3>
          <div className="chart-bars">
            {(monthlyRevenueSeries.length ? monthlyRevenueSeries : [{ label: 'No Data', value: 0 }]).map((point, i, arr) => {
              const maxVal = Math.max(...arr.map((p) => p.value), 1);
              const pct = (point.value / maxVal) * 100;
              return (
                <div key={i} className="cb" style={{ height: `${pct}%` }}>
                  <span>{point.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3>Top Costliest Vehicles</h3>
          <div className="status-bars">
            {(() => {
              const entries = costliestVehicles;
              const topMax = entries.length ? entries[0].value : 1;
              const barColors = ['var(--red)', 'var(--amber)', 'var(--blue)'];

              return entries.map((entry, i) => (
                <div key={`${entry.name}-${i}`} className="brow">
                  <span>{entry.name}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(entry.value / topMax * 100)}%`, backgroundColor: barColors[i] || 'var(--blue)' }}></div>
                  </div>
                  <span className="n" style={{ width: '70px' }}>{fmtMoney(entry.value)}</span>
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
