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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ margin: 0 }}>Monthly Revenue</h3>
            <span style={{ fontWeight: '600', color: 'var(--green)', fontSize: '13.5px' }}>
              Total: {fmtMoney(trips.filter(t => t.status === 'Completed').reduce((sum, t) => sum + (t.dist || 0) * (t.cargo || 1) * 0.05, 0))}
            </span>
          </div>
          <div className="chart-bars">
            {(() => {
              const baseWeights = [15, 20, 18, 22, 25, 28, 30];
              const totalRevenue = trips
                .filter(t => t.status === 'Completed')
                .reduce((sum, t) => sum + (t.dist || 0) * (t.cargo || 1) * 0.05, 0);
              
              const scaledRev = totalRevenue > 0
                ? baseWeights.map(w => (w / 158) * totalRevenue)
                : baseWeights.map(w => w * 10);
              
              const maxVal = Math.max(...scaledRev);

              return scaledRev.map((r, i) => {
                const pct = maxVal > 0 ? (r / maxVal) * 100 : 0;
                return (
                  <div key={i} className="cb" style={{ height: `${pct}%` }}>
                    <span>W{i + 1}</span>
                  </div>
                );
              });
            })()}
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
              const byVeh = {};
              maint.forEach(m => {
                const name = m.vehicle?.name || m.vehicle || 'Unknown';
                byVeh[name] = (byVeh[name] || 0) + m.cost;
              });
              fuel.forEach(f => {
                const name = f.vehicle?.name || f.vehicle || 'Unknown';
                byVeh[name] = (byVeh[name] || 0) + f.cost;
              });
              const entries = Object.entries(byVeh).sort((a, b) => b[1] - a[1]).slice(0, 3);
              const topMax = entries.length ? entries[0][1] : 1;
              const barColors = ['var(--red)', 'var(--amber)', 'var(--blue)'];

              return entries.map(([name, value], i) => (
                <div key={`${name}-${i}`} className="brow">
                  <span>{name}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(value / topMax * 100)}%`, backgroundColor: barColors[i] || 'var(--blue)' }}></div>
                  </div>
                  <span className="n" style={{ width: '70px' }}>{fmtMoney(value)}</span>
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
