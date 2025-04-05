const getId = id => document.getElementById(id);
const log = console.log;
Array.prototype.swap = function (x, y) {
  let b = this[x]
  this[x] = this[y]
  this[y] = b
  return this
}
// const playerData = localStorage.getItem('players') ?? []

const storeDummyData = getId('test-store');
const clearDummyData = getId('clear-data');
const furtherInitiative = getId('further-initiative');
const reverseInitiative = getId('reverse-initiative');
const initiativeDisplay = getId('initiative');
const display = getId('data-display');
const dialog = document.getElementById('add-character-dialog');
const closeDialog = document.getElementById('close-dialog');
const addCharacter = document.getElementById('add-player');
const newCharacterName = document.getElementById('character-name');
const newCharacterHP = document.getElementById('character-hp');

// let playerLength = 0;
// move initiativeIndex to localstorage so that it retains between sessions as needed
// with a button to reset position to top as well as button to reset board but keeping party
// maybe with a tag on players to indicate they are party
let initiativeIndex = localStorage.getItem('initiativeIndex') ? Number(localStorage.getItem('initiativeIndex')) : 0;
log(typeof localStorage.getItem('initiativeIndex'));

window.onload = displayPlayerData();
// track the "current turn" and highlight the player, starting from the top of initiative.
// probably have some sort of button to show that the combat will begin and highlight the player

/*
storeDummyData.addEventListener('click', e => {
  e.preventDefault()
  log('storing data')

  const players = localStorage.getItem('players') ? JSON.parse(localStorage.getItem('players')) : []

  log({players})

  const maxHP = Math.floor(Math.random()*100)+1
  players.push({name: `Player ${Math.random().toString().slice(-4)}`, maxHP, currentHP: Math.floor(Math.random()*maxHP)+1 })

  savePlayers(players)
})
*/
storeDummyData.addEventListener('mousedown', e => {
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

clearDummyData.addEventListener('mousedown', e => {
  e.preventDefault()
  log('clearing data')
  localStorage.removeItem('players')
  displayPlayerData()
})

furtherInitiative.addEventListener('mousedown', e => {
  e.preventDefault()
  log('advancing initiative')
  initiativeIndex < playerLength ? initiativeIndex++ : initiativeIndex = 0
	localStorage.setItem('initiativeIndex', initiativeIndex);
  displayPlayerData()
})

reverseInitiative.addEventListener('mousedown', e => {
  e.preventDefault()
  log('reversing initiative')
  initiativeIndex === 0 ? initiativeIndex = playerLength : initiativeIndex--
	localStorage.setItem('initiativeIndex', initiativeIndex);
  displayPlayerData()
})

function displayPlayerData() {
  const currentPlayers = localStorage.getItem('players') ? JSON.parse(localStorage.getItem('players')) : []
  const newPlayerList = []

  if(!currentPlayers[0]) {
    display.innerText = 'No Players Currently'
    return
  }

  playerLength = currentPlayers.length - 1
  
  currentPlayers.forEach((player, index) => {
    const newPlayer = generatePlayerCard(player, index, currentPlayers)
    newPlayerList.push(newPlayer)
  });

  // log({currentPlayers})

  display.innerHTML = ''
  // initiativeDisplay.innerText = initiativeIndex
  display.append(...newPlayerList)
}

function generatePlayerCard(player, index, currentPlayers) {
  const newPlayer = document.createElement('div');
  const newPlayerName = document.createElement('p');
  const newPlayerHPNum = document.createElement('p');
  const newPlayerHP = document.createElement('div');
  const newPlayerCurrentHP = document.createElement('div');
  const upInitiative = document.createElement('button');
  const downInitiative = document.createElement('button');
  const healthChange = document.createElement('input');
  const addHealthBtn = document.createElement('button');
  const loseHealthBtn = document.createElement('button');
  
  newPlayerName.innerText = player.name;
  newPlayerHP.style.backgroundColor = index === initiativeIndex ? 'red' : 'black';
  newPlayerHPNum.innerText = `${player.currentHP} / ${player.maxHP}`;
  newPlayerCurrentHP.style.width = `${Math.floor((player.currentHP / player.maxHP)*100)}%`;
  upInitiative.innerText = '↑';
  downInitiative.innerText = '↓';
  addHealthBtn.innerText = '+';
  loseHealthBtn.innerText = '-';
  healthChange.type = 'number';

  upInitiative.addEventListener('mousedown', e => {
    e.preventDefault();
    increaseInitiativeOrder(currentPlayers, index);
  })
  downInitiative.addEventListener('mousedown', e => {
    e.preventDefault();
    decreaseInitiativeOrder(currentPlayers, index);
  })
  addHealthBtn.addEventListener('mousedown', e => {
    e.preventDefault();
    addHealth(currentPlayers, index, healthChange.value);
    healthChange.value = null;
  })
  loseHealthBtn.addEventListener('mousedown', e => {
    e.preventDefault();
    loseHealth(currentPlayers, index, healthChange.value);
    healthChange.value = null;
  })
  
  newPlayer.classList.add('player');
  newPlayerName.classList.add('player-name');
  newPlayerHPNum.classList.add('player-hp-num');
  newPlayerHP.classList.add('player-hp');
  
  newPlayer.appendChild(newPlayerName);
  newPlayer.appendChild(newPlayerHPNum);
  newPlayer.appendChild(upInitiative);
  newPlayer.appendChild(downInitiative);
  newPlayer.appendChild(healthChange);
  newPlayer.appendChild(addHealthBtn);
  newPlayer.appendChild(loseHealthBtn);
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
  null

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
  null
  
  players.swap(current, target);

	localStorage.setItem('initiativeIndex', initiativeIndex);
  
  savePlayers(players);
}

function addHealth(players, current, amount) {
  log(`add ${amount} health to ${players[current].currentHP}, then re-render`);
  // overheal bar should just be an optional extra bar nested within the hp bar,
  // similar styling but yellow rather than green
  max = players[current].maxHP;
  cur = players[current].currentHP;
  amount = Number(amount);
  let newHealth = cur + amount >= max ? max : cur + amount;

  log({newHealth});

  players[current].currentHP = newHealth;
  savePlayers(players);
}

function loseHealth(players, current, amount) {
  log(`remove ${amount} health from ${players[current].currentHP}, minumum 1, then re-render. if the health goes to zero, move them above the person who placed them at 0 health as tracked by the "current turn"`);
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
  // let i = 0
  // while(i < 2) {
  //   increaseInitiativeOrder(players, current)
  //   i++
  // }
  log('repeat the swap command, until the current player is above the initiativeIndex position, making space if needed at top of initiative');
}

function savePlayers(players) {
  localStorage.setItem('players', JSON.stringify(players));
  displayPlayerData();
}