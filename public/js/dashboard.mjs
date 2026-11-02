import { api, status, element } from './shared.mjs';
import { statLabels } from './pokemon.mjs';
function chart(target, rows, maximum) {
  const container = document.getElementById(target);
  container.replaceChildren(...rows.map(([label, value]) => {
    const row = element('div', undefined, 'chart-row');
    const meter = element('meter'); meter.min = 0; meter.max = Math.max(1, maximum); meter.value = value;
    meter.setAttribute('aria-label', `${label}: ${value}`);
    row.append(element('span', label), meter, element('span', value));
    return row;
  }));
}
async function refresh() {
  const button = document.getElementById('refresh'); button.disabled = true;
  try {
    status('Loading database statistics…');
    const data = await api('/api/stats');
    for (const [key, value] of Object.entries(data.counts)) document.getElementById(`count-${key}`).textContent = Number(value).toLocaleString();
    chart('type-chart', data.types.map(row => [row.type || 'Unknown', Number(row.count)]), Math.max(1, ...data.types.map(row => Number(row.count))));
    chart('stat-chart', Object.entries(statLabels).map(([key, label]) => [label, Math.round(Number(data.averages[key]) || 0)]), 255);
    status('Statistics updated from the database. Type counts use primary type.');
  } catch (error) { status(error.message, true); }
  finally { button.disabled = false; }
}
document.getElementById('refresh').addEventListener('click', refresh);
await refresh();
