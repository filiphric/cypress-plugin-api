// test server

import express from 'express'
const app = express()
const port = 3003
const answerJSON = { string: 'string', int: 1234, object: { array: [1, 2] } }

app.use(express.static('server-public'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.text({ type: 'application/octet-stream', limit: '10mb' }));
app.use(express.raw({ type: 'application/octet-stream', limit: '10mb' }));

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

app.post('/json-with-commas', (req, res) => {
  const responseWithCommas = {
    message: 'Response with commas',
    data: {
      items: [1, 2, 3],
      nested: {
        array: [4, 5],
        value: 'test'
      }
    },
    metadata: {
      count: 2
    }
  }
  res.send(responseWithCommas)
})

app.post('/arraybuffer-request', (req, res) => {
  let bodyText = ''
  
  if (Buffer.isBuffer(req.body)) {
    try {
      const str = req.body.toString('utf8')
      const parsed = JSON.parse(str)
      if (parsed && typeof parsed === 'object' && parsed !== null && parsed.type === 'Buffer' && Array.isArray(parsed.data)) {
        const buffer = Buffer.from(parsed.data)
        bodyText = buffer.toString('utf8')
      } else {
        bodyText = str
      }
    } catch {
      bodyText = req.body.toString('utf8')
    }
  } else if (typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body)
      if (parsed && typeof parsed === 'object' && parsed !== null && parsed.type === 'Buffer' && Array.isArray(parsed.data)) {
        const buffer = Buffer.from(parsed.data)
        bodyText = buffer.toString('utf8')
      } else {
        bodyText = req.body
      }
    } catch {
      bodyText = req.body
    }
  } else if (req.body && typeof req.body === 'object' && req.body !== null && req.body.type === 'Buffer' && Array.isArray(req.body.data)) {
    const buffer = Buffer.from(req.body.data)
    bodyText = buffer.toString('utf8')
  } else if (req.body instanceof Uint8Array) {
    const decoder = new TextDecoder()
    bodyText = decoder.decode(req.body)
  } else {
    bodyText = String(req.body)
  }
  
  res.status(200).json({ 
    message: 'ArrayBuffer request received',
    bodyLength: bodyText.length,
    bodyContent: bodyText
  })
})

app.get('/arraybuffer-response', (req, res) => {
  const content = 'This is an ArrayBuffer response'
  const encoder = new TextEncoder()
  const arrayBuffer = encoder.encode(content).buffer
  res.set('Content-Type', 'application/octet-stream')
  res.send(Buffer.from(arrayBuffer))
})

app.get('/empty-object', (req, res) => {
  res.json({})
})

app.get('/empty-array', (req, res) => {
  res.json([])
})

app.get('/nested-empty', (req, res) => {
  res.json({
    items: [],
    metadata: {},
    data: {
      empty: {},
      list: []
    }
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${port} is already in use.`)
      console.error(`   Please stop the process using port ${port} or use a different port.\n`)
      console.error(`   To find and kill the process on Windows:`)
      console.error(`   netstat -ano | findstr :${port}`)
      console.error(`   taskkill /PID <PID> /F\n`)
      process.exit(1)
    } else {
      console.error('Server error:', err)
      process.exit(1)
    }
  })
