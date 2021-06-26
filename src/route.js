const route = require('express').Router();
const QuestionController = require('./controllers/QuestionController');
const RoomController = require('./controllers/RoomController');


route.get('/', (req, res) => res.render("index", {page: 'enter-room', title: 'Página inicial'}))
route.get('/create-pass', (req,res) => res.render("index", {page: 'create-pass', title: 'Criar sala'}))

route.post('/create-room', RoomController.create)
route.get('/room/:room', RoomController.open)
route.post('/enterroom', RoomController.enter)


route.post('/question/create/:room', QuestionController.create)
route.post('/question/:roomId/:questionId/:action', QuestionController.index)

module.exports = route
