// test server

import express from 'express'
const app = express()
const port = 3003
const answerJSON = { string: 'string', int: 1234, object: { array: [1, 2] } }

app.use(express.static('server-public'));

app.get('/', (req, res) => {
  res.send(answerJSON)
})

app.get('/delay', (req, res) => {

  setTimeout(() => {
    res.send('delayed by 5000ms')
  }, 5000)
  
})

app.post('/', (req, res) => {
  res.send(answerJSON)
})

app.put('/', (req, res) => {
  res.send(answerJSON)
})
app.patch('/', (req, res) => {
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

app.get('/redirect', (req, res) => {
  res.redirect(301, '/')
})

app.get('/json', (req, res) => {
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

app.get('/json-weird', (req, res) => {
  res.set('Content-Type', 'application/abcd+json');
  res.send(answerJSON)
})

app.get('/undefined', (req, res) => {
  const answerXML = "<xml>XML</xml>"
  res.send(answerXML)
})

app.get('/text', (req, res) => {
  const answerText = "Hey there 👋"
  res.send(answerText)
})

app.get('/empty', (req, res) => {
  res.status(204)
  res.send()
})

app.get('/cookies', (req, res) => {
  res.cookie('hello', 'cookie')
  res.send()
})

app.post('/auth', (req, res) => {
  if (req.headers['authorization'] === "abcd" || req.headers['authorization'] === "Basic YWRtaW46c2VjcmV0") {
    res.cookie('token', 'Bearer 1234')
    res.status(200)
  } else {
    res.status(403)
  }
  res.send()
})

// Handle file uploads (simplified - no multer needed for test)
app.post('/upload', (req, res) => {
  res.status(201)
  res.send('File uploaded successfully')
})

app.get('/binary', (req, res) => {
  const binaryContent = new TextEncoder().encode('Binary content response')
  res.set('Content-Type', 'application/octet-stream')
  res.send(Buffer.from(binaryContent))
})

app.get('/binary-decoded', (req, res) => {
  res.set('Content-Type', 'text/plain')
  res.send('Decoded binary content')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
