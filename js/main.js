const getId = id => document.getElementById(id)
const log = console.log
Array.prototype.swap = function (x, y) {
  let b = this[x]
  this[x] = this[y]
  this[y] = b
  return this
}
// const playerData = localStorage.getItem('players') ?? []

const storeDummyData = getId('test-store')
const clearDummyData = getId('clear-data')
const readDummyData = getId('test-read')
const furtherInitiative = getId('further-initiative')
const reverseInitiative = getId('reverse-initiative')
const display = getId('data-display')

let playerLength = 0
let initiativeIndex = 0

window.onload = displayPlayerData();
// track the "current turn" and highlight the player, starting from the top of initiative. probably have some sort of button to show that the combat will begin and highlight the player

storeDummyData.addEventListener('click', e => {
  e.preventDefault()
  log('storing data')

  const currentPlayers = localStorage.getItem('players') ? JSON.parse(localStorage.getItem('players')) : []

  log({currentPlayers})

  const maxHP = Math.floor(Math.random()*100)+1
  currentPlayers.push({name: `Player ${Math.random().toString().slice(-4)}`, maxHP, currentHP: Math.floor(Math.random()*maxHP)+1 })

  localStorage.setItem('players', JSON.stringify(currentPlayers))

  displayPlayerData()
})

clearDummyData.addEventListener('click', e => {
  e.preventDefault()
  log('clearing data')
  localStorage.setItem('players', '')
  displayPlayerData()
})

readDummyData.addEventListener('click', e => {
  e.preventDefault()
  log('reading data')
  displayPlayerData()
})

furtherInitiative.addEventListener('click', e => {
  e.preventDefault()
  log('advancing initiative')
  initiativeIndex < playerLength ? initiativeIndex++ : initiativeIndex = 0
  displayPlayerData()
})

reverseInitiative.addEventListener('click', e => {
  e.preventDefault()
  log('reversing initiative')
  initiativeIndex === 0 ? initiativeIndex = playerLength : initiativeIndex--
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

  log({currentPlayers})

  display.innerHTML = ''
  display.append(...newPlayerList)
}

function generatePlayerCard(player, index, currentPlayers) {
  const newPlayer = document.createElement('div')
  const newPlayerName = document.createElement('p')
  const newPlayerHPNum = document.createElement('p')
  const newPlayerHP = document.createElement('div')
  const newPlayerCurrentHP = document.createElement('div')
  const upInitiative = document.createElement('button')
  const downInitiative = document.createElement('button')
  const healthChange = document.createElement('input')
  const addHealthBtn = document.createElement('button')
  const loseHealthBtn = document.createElement('button')
  
  newPlayerName.innerText = player.name
  newPlayerHP.style.backgroundColor = index === initiativeIndex ? 'red' : 'black'
  newPlayerHPNum.innerText = `${player.currentHP} / ${player.maxHP}`
  newPlayerCurrentHP.style.width = `${Math.floor((player.currentHP / player.maxHP)*100)}%`
  upInitiative.innerText = '↑'
  downInitiative.innerText = '↓'
  addHealthBtn.innerText = '+'
  loseHealthBtn.innerText = '-'
  healthChange.type = 'number'

  upInitiative.addEventListener('click', e => {
    e.preventDefault()
    increaseInitiative(currentPlayers, index)
  })
  downInitiative.addEventListener('click', e => {
    e.preventDefault()
    decreaseInitiative(currentPlayers, index)
  })
  addHealthBtn.addEventListener('click', e => {
    e.preventDefault()
    addHealth(currentPlayers, index, healthChange.value)
    healthChange.value = null
  })
  loseHealthBtn.addEventListener('click', e => {
    e.preventDefault()
    loseHealth(currentPlayers, index, healthChange.value)
    healthChange.value = null
  })
  
  newPlayer.classList.add('player')
  newPlayerName.classList.add('player-name')
  newPlayerHPNum.classList.add('player-hp-num')
  newPlayerHP.classList.add('player-hp')
  
  newPlayer.appendChild(newPlayerName)
  newPlayer.appendChild(newPlayerHPNum)
  newPlayer.appendChild(upInitiative)
  newPlayer.appendChild(downInitiative)
  newPlayer.appendChild(healthChange)
  newPlayer.appendChild(addHealthBtn)
  newPlayer.appendChild(loseHealthBtn)
  newPlayerHP.appendChild(newPlayerCurrentHP)
  newPlayer.appendChild(newPlayerHP)

  return newPlayer
}

function increaseInitiative(players, current) {
  log(`move the player [${players[current].name}] up in initiative by 1, then re-render`)
  log({players})
  target = current > 0 ? current-- : players.length - 1
  players.swap(current, target)
  log({players})
  localStorage.setItem('players', JSON.stringify(players))
  initiativeIndex === 0 ? initiativeIndex = playerLength : null
  displayPlayerData()
}

function decreaseInitiative(players, current) {
  log(`move the player [${players[current].name}] down in initiative by 1, then re-render`)
  
}

function addHealth(players, current, amount) {
  log(`add ${amount} health to ${players[current].currentHP}, then re-render`)

}

function loseHealth(players, current, amount) {
  log(`remove ${amount} health from ${players[current].currentHP}, minumum 1, then re-render. if the health goes to zero, move them above the person who placed them at 0 health as tracked by the "current turn"`)
}