const getId = id => document.getElementById(id)
const log = console.log
// const playerData = localStorage.getItem('players') ?? []

const storeDummyData = getId('test-store')
const clearDummyData = getId('clear-data')
const readDummyData = getId('test-read')
const display = getId('data-display')

window.onload = displayPlayerData();

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

function displayPlayerData() {
  const currentPlayers = localStorage.getItem('players') ? JSON.parse(localStorage.getItem('players')) : 'No Player Information'
  const newPlayerList = []

  if(!currentPlayers) {
    display.innerText = 'No Players Currently'
    return
  }
  // temporarily gone to test displaying users visuals
  // display.innerText = currentPlayers
  currentPlayers.forEach(player => {
    const newPlayer = document.createElement('div')
    const newPlayerName = document.createElement('p')
    const newPlayerHPNum = document.createElement('p')
    const newPlayerHP = document.createElement('div')
    const newPlayerCurrentHP = document.createElement('div')
    
    newPlayer.innerText = player.name
    newPlayerHPNum.innerText = `${player.currentHP} / ${player.maxHP}`
    newPlayerCurrentHP.style.width = `${Math.floor((player.currentHP / player.maxHP)*100)}%`
    
    newPlayerName.classList.add('player-name')
    newPlayerHP.classList.add('player-hp')
    
    newPlayer.appendChild(newPlayerName)
    newPlayerHP.appendChild(newPlayerCurrentHP)
    newPlayer.appendChild(newPlayerHP)

    newPlayerList.push(newPlayer)
  });

  display.innerHTML = ''
  display.append(...newPlayerList)
}