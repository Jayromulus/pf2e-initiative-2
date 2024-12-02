const getId = document.getElementById
const log = console.log

const storeData = getId('test-store')
const rewriteData = getId('test-rewrite')
const readData = getId('test-read')
const display = getId('data-display')

storeData.addEventListener(e => {
  e.preventDefault()
  log('storing data')
})

rewriteData.addEventListener(e => {
  e.preventDefault()
  log('rewriting data')
})

readData.addEventListener(e => {
  e.preventDefault()
  log('reading data')
})