// const dotaHeroes = require('./dota-heroes')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET')
		return res.status(200).json({})
	}

	next()
})

app.get('/', function (req, res) {
	res.json({ message: 'success' })
})

app.listen(port, function () {
	console.log('Node is running on port: ', port)
})