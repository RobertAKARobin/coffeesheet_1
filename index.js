const express = require('express')
const app = express()

app
	.use('/', express.static('./public'))
	.use('/vendor', express.static('./node_modules'))
	.listen('3000', () => console.log(Date().toLocaleString()))

app
	.get('/test', (req, res) => res.send('hello'))
