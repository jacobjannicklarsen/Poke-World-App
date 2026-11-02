const createForm = document.getElementById('create-trainer-form');
const catchForm = document.getElementById('catch-pokemon-form');
const trainerList = document.getElementById('trainer-list');
const trainerSelect = document.getElementById('trainer-select');
const collection = document.getElementById('trainer-pokemon');

async function request(url, body) {
    const response = await fetch(url, body ? {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    } : undefined);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'The request failed.');
    return data;
}
async function loadCollection() {
    collection.replaceChildren();
    if (!trainerSelect.value) return;
    try {
        const pokemon = await request('/all/trainers/pokemon/' + encodeURIComponent(trainerSelect.value));
        collection.textContent = pokemon.length ? pokemon.map(p => p.name).join(', ') : 'No Pokémon caught yet.';
    } catch (error) { collection.textContent = error.message; }
}
async function loadTrainers() {
    try {
        const trainers = await request('/all/trainers');
        const selected = trainerSelect.value;
        trainerList.replaceChildren();
        trainerSelect.replaceChildren(new Option('Choose a trainer', ''));
        trainers.forEach(trainer => {
            const item = document.createElement('li');
            item.textContent = trainer.trainer_name + ' — ID: ' + trainer.trainer_id + ', ' + trainer.hometown + ', age ' + trainer.age;
            trainerList.appendChild(item);
            trainerSelect.add(new Option(trainer.trainer_name, trainer.trainer_name));
        });
        if (!trainers.length) trainerList.textContent = 'No trainers yet. Create the first one above.';
        trainerSelect.value = selected;
    } catch (error) { trainerList.textContent = error.message; }
}
createForm.addEventListener('submit', async event => {
    event.preventDefault();
    const button = createForm.querySelector('button');
    const status = document.getElementById('create-status');
    button.disabled = true;
    try {
        const data = await request('/all/trainers/new', {
            name: document.getElementById('TrainerName').value,
            age: Number(document.getElementById('TrainerAge').value),
            hometown: document.getElementById('TrainerHometown').value
        });
        status.textContent = data.message + '. Trainer ID: ' + data.trainer_id;
        document.getElementById('TrainerID').value = data.trainer_id;
        createForm.reset();
        await loadTrainers();
    } catch (error) { status.textContent = error.message; }
    finally { button.disabled = false; }
});
catchForm.addEventListener('submit', async event => {
    event.preventDefault();
    const button = catchForm.querySelector('button');
    const status = document.getElementById('catch-status');
    button.disabled = true;
    try {
        const data = await request('/all/trainers/pokemon/new', {
            trainer_id: Number(document.getElementById('TrainerID').value),
            pokedex_number: Number(document.getElementById('PokedexNumber').value)
        });
        status.textContent = data.message;
        await loadCollection();
    } catch (error) { status.textContent = error.message; }
    finally { button.disabled = false; }
});
trainerSelect.addEventListener('change', loadCollection);
loadTrainers();
