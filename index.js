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

if(app.get('env') === 'development'){
  app.use(morgan('tiny'))
  debug('Morgan is enabled...')
}

// DB work...
//dbDebugger('Connected to the database...')

const courses = [
  { id: 1, name: 'Python'},
  { id: 2, name: 'Elixir'},
  { id: 3, name: 'Javascript'},
]

app.get('/', (req, res) => {
  res.send('Hello World')
})
app.get('/api/courses', (req, res) => {
  res.send(courses);
})

app.post('/api/courses', (req, res) => {

    const { error } = validateCourse(req.body)
    if(error){
      return res.status(400).send(error.details[0].message)
    }

    const course = {
    id: courses.length + 1,
    name: req.body.name
    }
    courses.push(course)
    res.send(course)
})

// /api/courses/1
app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id))
  if(!course) res.status(404).send('The course was not found.')// 404
  res.send(course)
})

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})

app.put('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id))
  if(!course) return res.status(404).send('The course was not found')

  const { error } = validateCourse(req.body)
  if(error){
    return res.status(400).send(error.details[0].message)
  }

  course.name = req.body.name;
  res.send(course);
})

function validateCourse(course){
  const schema = {
    name: Joi.string().min(3).required()
  }
  return Joi.validate(course, schema)
}

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) res.status(404).send('The course was not found')

    const index = courses.indexOf(course)
    courses.splice(index, 1)

    res.send(course)
})

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id))
  if(!course) return res.status(404).send('The course was not found')
  res.send(course)
})