const config = require('config')
const morgan = require('morgan')
const Joi = require('joi')
const express = require('express')
const app = express()
const logger = require('./logger')
const authentication = require('./authentication')
const helmet = require('helmet')
const debug = require('debug')('app:startup')
//const dbDebugger = require('debug')('app:db')
const courses = require('./routes/courses')
const general = require('./routes/general')

// View engine
app.set('view engine', 'pug')
app.set('views', './views')

// Configuration
console.log('Application Name: ' + config.get('name'))
console.log('Mail Server: ' + config.get('mail.host'))
//console.log('Mail Password: ' + config.get('mail.password'))


app.use(express.json()) // req.body
app.use(express.urlencoded({ extended: true}))
app.use(express.static('public'))

app.use(logger)
app.use(authentication)

app.use(helmet())
app.use(morgan('tiny'))
app.use('/api/courses', courses)

if(app.get('env') === 'development'){
  app.use(morgan('tiny'))
  debug('Morgan is enabled...')
}



// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
