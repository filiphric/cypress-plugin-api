// test server

const verbose = require('debug')('verbose')
const info = require('debug')('info')
const debug = require('util').debuglog('hello')
const express = require('express')
const app = express()
const port = 3003

if (global.messages) {
  require('@bahmutov/all-logs/middleware/express')(app)
}

app.use(express.static('server-public'));

const answer = 'Hello World!'

app.get('/', (req, res) => {
  const answerJSON = { string: 'string', int: 1234, object: { array: [1, 2] } }
  res.send(answerJSON)
})

app.post('/', (req, res) => {
  const answerJSON = { string: 'string', int: 1234, object: { array: [1, 2] } }
  res.send(answerJSON)
})

app.put('/', (req, res) => {
  const answerJSON = { string: 'string', int: 1234, object: { array: [1, 2] } }
  res.send(answerJSON)
})
app.patch('/', (req, res) => {
  const answerJSON = { string: 'string', int: 1234, object: { array: [1, 2] } }
  res.send(answerJSON)
})

app.delete('/', (req, res) => {
  res.send()
})

app.head('/', (req, res) => {
  res.send()
})

app.get('/404', (req, res) => {
  res.status(404)
  res.send()
})

app.get('/400', (req, res) => {
  res.status(400)
  res.send()
})

app.get('/json', (req, res) => {
  const answerJSON = { string: 'string', int: 1234, object: { array: [1, 2] } }
  res.send(answerJSON)
})

app.get('/html', (req, res) => {
  const answerHTML = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    
  </body>
  </html>`
  res.send(answerHTML)
})

app.get('/json-white-space', (req, res) => {
  const answerJSON =  { "forwardTo": " " }
  res.send(answerJSON)
})

app.get('/xml', (req, res) => {
  const answerXML = "<xml>XML</xml>"
  res.set('Content-Type', 'text/xml');
  res.send(answerXML)
})

app.get('/empty', (req, res) => {
  res.send()
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
