const getId = id => document.getElementById(id);
const createElement = tag => document.createElement(tag);
const log = console.log;
Array.prototype.swap = function (x, y) {
  let b = this[x]
  this[x] = this[y]
  this[y] = b
  return this
}

const storeCharacterData = getId('add-character');
const clearCharacterData = getId('clear-data');
const furtherInitiative = getId('further-initiative');
const reverseInitiative = getId('reverse-initiative');
const initiativeDisplay = getId('initiative');
const display = getId('data-display');
const dialog = getId('add-character-dialog');
const closeDialog = getId('close-dialog');
const addCharacter = getId('add-player');
const newCharacterName = getId('character-name');
const newCharacterHP = getId('character-hp');

const lowHealth = 'red';
const midHealth = 'yellow';
const highHealth = 'greenyellow';

const selected = 'rgba(46, 16, 86, 0.7)';
const unselected = 'rgba(46, 16, 86, 0.4)';

//! add an option for updating a player's information by clicking on the health or name section of the card and create a modal popup with places to change the values, as well as an option to save or delete the character. upon deletion shift to the previous position in initiative order

let initiativeIndex = localStorage.getItem('initiativeIndex') ? Number(localStorage.getItem('initiativeIndex')) : 0;
log(typeof localStorage.getItem('initiativeIndex'));

window.onload = displayPlayerData();
storeCharacterData.addEventListener('mousedown', e => {
	e.preventDefault();
	dialog.showModal();
});

closeDialog.addEventListener('mousedown', e => {
	dialog.close();
});

addCharacter.addEventListener('mousedown', e => {
	e.preventDefault();
	
  const players = localStorage.getItem('players') ? JSON.parse(localStorage.getItem('players')) : []

  const maxHP = Number(newCharacterHP.value);
  players.push({name: newCharacterName.value, maxHP, currentHP: maxHP });

	newCharacterName.value = '';
	newCharacterHP.value = '';
  
	savePlayers(players);
	dialog.close();
});

clearCharacterData.addEventListener('mousedown', e => {
  e.preventDefault();
  localStorage.removeItem('players')
	initiativeIndex = 1;
  displayPlayerData();
})

furtherInitiative.addEventListener('mousedown', e => {
  e.preventDefault();
  initiativeIndex < playerLength ? initiativeIndex++ : initiativeIndex = 0;
	localStorage.setItem('initiativeIndex', initiativeIndex);
  displayPlayerData();
})

reverseInitiative.addEventListener('mousedown', e => {
  e.preventDefault();
  initiativeIndex === 0 ? initiativeIndex = playerLength : initiativeIndex--;
	localStorage.setItem('initiativeIndex', initiativeIndex);
  displayPlayerData();
})

function displayPlayerData() {
  const currentPlayers = localStorage.getItem('players') ? JSON.parse(localStorage.getItem('players')) : [];
  const newPlayerList = [];

  if(!currentPlayers[0]) {
    display.innerText = 'No Players Currently';
    return;
  }

  playerLength = currentPlayers.length - 1;
  
  currentPlayers.forEach((player, index) => {
    const newPlayer = generatePlayerCard(player, index, currentPlayers);
    newPlayerList.push(newPlayer);
  });

  display.innerHTML = '';
  display.append(...newPlayerList);
}

function generatePlayerCard(player, index, currentPlayers) {
  const newPlayer = createElement('div');
	const topPlayerSection = createElement('div');
  const newPlayerName = createElement('p');
  const newPlayerHPNum = createElement('p');
  const newPlayerHP = createElement('div');
  const newPlayerCurrentHP = createElement('div');
  const upInitiative = createElement('button');
  const downInitiative = createElement('button');
	const healthAdjustmentGroup = createElement('div');
  const healthChange = createElement('input');
  const addHealthBtn = createElement('button');
  const loseHealthBtn = createElement('button');
  
	const currentHealthPercent = Math.floor((player.currentHP / player.maxHP)*100);

	healthChange.type = "number";
	healthChange.min = 1;

  newPlayerName.innerText = player.name;
  newPlayer.style.backgroundColor = index === initiativeIndex ? selected : unselected;
  newPlayerHPNum.innerText = `${player.currentHP} / ${player.maxHP}`;
  newPlayerCurrentHP.style.width = `${currentHealthPercent > 100 ? 100 : currentHealthPercent}%`;
	newPlayerCurrentHP.style.backgroundColor = currentHealthPercent < 21 ? lowHealth : currentHealthPercent < 46 ? midHealth : highHealth;

  upInitiative.innerText = '↑';
  downInitiative.innerText = '↓';
  addHealthBtn.innerText = '+';
  loseHealthBtn.innerText = '-';
  healthChange.type = 'number';
	
  upInitiative.addEventListener('mousedown', e => {
    e.preventDefault();
    increaseInitiativeOrder(currentPlayers, index);
  });

  downInitiative.addEventListener('mousedown', e => {
    e.preventDefault();
    decreaseInitiativeOrder(currentPlayers, index);
  });

  addHealthBtn.addEventListener('mousedown', e => {
    e.preventDefault();
    addHealth(currentPlayers, index, Math.abs(healthChange.value));
    healthChange.value = null;
  });

  loseHealthBtn.addEventListener('mousedown', e => {
    e.preventDefault();
    loseHealth(currentPlayers, index, Math.abs(healthChange.value));
    healthChange.value = null;
  });
  
  newPlayer.classList.add('player');
  newPlayerHP.classList.add('player-hp');
  newPlayerName.classList.add('player-name');
	addHealthBtn.classList.add('change-health');
	loseHealthBtn.classList.add('change-health');
	upInitiative.classList.add('move-initiative');
  newPlayerHPNum.classList.add('player-hp-num');
	downInitiative.classList.add('move-initiative');
	healthChange.classList.add('change-health-input');
	topPlayerSection.classList.add('top-player-section');
	healthAdjustmentGroup.classList.add('change-health-group');
  
  topPlayerSection.appendChild(newPlayerName);
  topPlayerSection.appendChild(newPlayerHPNum);
	
  healthAdjustmentGroup.appendChild(addHealthBtn);
  healthAdjustmentGroup.appendChild(healthChange);
  healthAdjustmentGroup.appendChild(loseHealthBtn);

	topPlayerSection.appendChild(healthAdjustmentGroup);
  topPlayerSection.appendChild(upInitiative);
  topPlayerSection.appendChild(downInitiative);

	newPlayer.appendChild(topPlayerSection);
  newPlayerHP.appendChild(newPlayerCurrentHP);
  newPlayer.appendChild(newPlayerHP);

  return newPlayer;
}

function increaseInitiativeOrder(players, current) {
  target = current > 0 ? current-- : players.length - 1;

  initiativeIndex === 0 && current === initiativeIndex && target === playerLength ? 
    initiativeIndex = playerLength :
  initiativeIndex === playerLength && target === playerLength && current === 0 ?
    initiativeIndex = 0 :
  initiativeIndex === target && current < playerLength ?
    initiativeIndex-- :
  initiativeIndex === current ?
    initiativeIndex++ :
  null;

  players.swap(current, target);

	localStorage.setItem('initiativeIndex', initiativeIndex);

  savePlayers(players);
}

function decreaseInitiativeOrder(players, current) {
  target = current < playerLength ? current++ : 0;

  initiativeIndex+1 > playerLength && current === initiativeIndex && target < 1 ?
    initiativeIndex = 0 :
  initiativeIndex === 0 && current === playerLength && target < 1 ?
    initiativeIndex = playerLength :
  initiativeIndex === target && current >= 0 && initiativeIndex >= 0 ?
    initiativeIndex++ :
  initiativeIndex === current ?
    initiativeIndex-- :
  null;
  
  players.swap(current, target);

	localStorage.setItem('initiativeIndex', initiativeIndex);
  
  savePlayers(players);
}

function addHealth(players, current, amount) {
  max = players[current].maxHP;
  cur = players[current].currentHP;
  amount = Number(amount);
  let newHealth = cur + amount >= max ? max : cur + amount;

  log({newHealth});

  players[current].currentHP = newHealth;
  savePlayers(players);
}

function loseHealth(players, current, amount) {
  max = players[current].maxHP;
  cur = players[current].currentHP;
  amount = Number(amount);
  let newHealth = cur - amount < 0 ? 0 : cur - amount;

  log({newHealth});

  players[current].currentHP = newHealth;

  if(newHealth === 0)
    movePlayerPosition(players, current, initiativeIndex);
  savePlayers(players);
}

function movePlayerPosition(players, current, goal) {
  if(goal >= players.length) {
    log('failed to move');
    return;
  }
 
  log('repeat the swap command, until the current player is above the initiativeIndex position, making space if needed at top of initiative');
}

function savePlayers(players) {
  localStorage.setItem('players', JSON.stringify(players));
  displayPlayerData();
}
