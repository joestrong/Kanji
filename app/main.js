const {promisify} = require('util')
const express = require('express')
const readFile = promisify(require('fs').readFile)
const mustache = require('mustache')
const request = promisify(require('request'))

const app = express()
app.use(express.static('public'))

const apiRoot = 'https://www.wanikani.com/api/user/'

app.get('/', function (req, res) {
  index().then(response => {
    res.send(response)
  })
})

async function index() {
  try {
    const apiKey = JSON.parse(await readFile('config.json', 'utf-8')).api_key
    const apiResponse = request(apiRoot + apiKey + '/kanji')
    const template = readFile('resources/index.html', 'utf-8')

    const kanji = JSON.parse((await apiResponse).body).requested_information
    return mustache.render(await template, {kanji: kanji})
  } catch (e) {
    console.log(e)
  }
}

app.listen(8000)
