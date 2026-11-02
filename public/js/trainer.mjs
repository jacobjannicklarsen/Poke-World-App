import { api, status, fillSelect, pokemonCard, element } from './shared.mjs';
const trainer = document.getElementById('trainer');
const pokemon = document.getElementById('catch-pokemon');
const button = document.getElementById('catch-button');
const team = document.getElementById('trainer-team');
const details = document.getElementById('trainer-details');
let trainers = [], request = 0;
async function showTeam() {
  const current = ++request;
  const selected = trainers.find(t => String(t.trainer_id) === trainer.value);
  team.replaceChildren();
  details.textContent = selected ? `${selected.trainer_name} · ${selected.hometown || 'Unknown hometown'} · Age ${selected.age ?? 'unknown'}` : '';
  if (!selected) { status('Choose a trainer to view their team.'); return; }
  status('Loading team…');
  try {
    const rows = await api(`/api/trainers/${encodeURIComponent(trainer.value)}/pokemon`);
    if (current !== request) return;
    team.replaceChildren(...rows.map(pokemonCard));
    status(rows.length ? `${rows.length} Pokémon in this trainer’s collection.` : 'No catches yet. Choose a Pokémon to catch.');
  } catch (error) { if (current === request) status(error.message, true); }
}
trainer.addEventListener('change', showTeam);
document.getElementById('catch-form').addEventListener('submit', async event => {
  event.preventDefault(); button.disabled = true;
  const trainerId = trainer.value;
  try {
    const result = await api('/api/catches', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ trainer_id: Number(trainerId), pokedex_number: Number(pokemon.value) }) });
    if (trainer.value === trainerId) { await showTeam(); status(result.message); }
  } catch (error) { status(error.message, true); }
  finally { button.disabled = false; }
});
try {
  status('Loading trainers and Pokémon…');
  const [trainerRows, pokemonRows] = await Promise.all([api('/api/trainers'), api('/api/pokemon')]);
  trainers = trainerRows;
  fillSelect(trainer, trainers, 'trainer_id', 'trainer_name');
  fillSelect(pokemon, pokemonRows, 'pokedex_number', 'name');
  button.disabled = false;
  status(trainers.length ? 'Choose a trainer to view their team.' : 'No trainers found in the database.');
} catch (error) { status(error.message, true); }
