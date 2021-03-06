let express = require('express');
let app = express();
// let router = express.Router();
let doAddUsers = require('./src/doAddUsers');
let getTest = require('./src/getTest');
let getList = require('./src/getList');
let doDelete = require('./src/doDelete');
let getUserInfo = require('./src/getUserInfo');
let userInfoUpdate = require('./src/userInfoUpdate');




app.use(express.static('./static'));
// app.use('/static',express.static('./static'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  res.render('index', {
    msg: 'welcome!'
  });
});
app.get('/userlist', (req, res) => {
  res.render('userlist', {});
});
app.get('/addusers', (req, res) => {
  res.render('addusers', {});
});
app.get('/getTestPage', (req, res) => {
  res.render('getTestPage', {});
});
app.get('/userInfo', (req, res) => {
  res.render('userInfo', {});
});
app.post('/api/doAddUsers', (req, res) => {
  doAddUsers(req, res);
});
app.post('/api/userInfoUpdate', (req, res) => {
  userInfoUpdate(req, res);
});
app.get('/api/getUserList', (req, res) => {
  // console.log(req)
  getList(req, res);
});
app.get('/api/getTest', (req, res) => {
  getTest(req, res);
});
app.get('/api/doDelete', (req, res) => {
  doDelete(req, res);
});
app.get('/api/getUserInfo', (req, res) => {
  getUserInfo(req, res);
});
app.listen(5400);