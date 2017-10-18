
const express = require('express')
const bodyParser = require('body-parser')

const Handler = require('./libs/handler')

const app = express()

const handler = new Handler(1 * 60 * 1000)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.post('/hook', (req, res) => {

  handler.run(req.body)

  res.end()
})


app.listen(9527, '0.0.0.0', () => {
  console.log('Webhook listening on port 9527!')
})
