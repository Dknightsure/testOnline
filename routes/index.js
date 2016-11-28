var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
//创建数据库连接
var db = mongoose.connect('mongodb://localhost:27017/testOnline');

//检查是否连接成功
db.connection.on("error",function(error){
    console.log("数据库连接失败："+error);
});

db.connection.on("open",function(error){
    console.log("++++++数据库连成功++++++");
});

var SingleQuestionSchema = new mongoose.Schema({
  title: { type:String },
  itemList: { type: Array },
  answer: { type: Number},
  diffculty: { type: Number},
  author: { type:String },
  type: {type:String}
});

var MutipleQuestionSchema = new mongoose.Schema({
  title: { type:String },
  itemList: { type: Array },
  answer: { type: Array},
  diffculty: { type: Number},
  author: { type:String },
  type: {type:String}
});

var BlankQuestionSchema = new mongoose.Schema({
  title: { type:String },
  answer: {type: Array},
  diffculty: {type: Number},
  author: {type:String},
  type: {type:String}
});

var SingleQuestionModel = db.model('SingleQuestions', SingleQuestionSchema);
var MutipleQuestionModel = db.model('MutipleQuestions', MutipleQuestionSchema);
var BlankQuestionModel = db.model('BlankQuestions', BlankQuestionSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.send('respond with a index');
  res.render('manage-question');
});

router.get('/add-question', function(req, res, next) {
  res.render('add-question');
});

router.get('/api/query-single-question', function(req, res, next){
  SingleQuestionModel.find({}, function(err, data){
    res.json(data);
  });
})

router.post('/api/alter-single-question', function(req, res, next){
  var question_data = JSON.parse(req.body.question_data);
  SingleQuestionModel.findById(question_data._id, function(err, question){
    if (err) {
      return console.log(err);
    }else{
      question.title = question_data.title;
      question.itemList = question_data.itemList;
      question.answer = question_data.answer;
      question.diffculty = question_data.diffculty;

      question.save(function(err){
        if(err){
          console.log(err);
          res.json('fail');
        }
        res.json('success');
      })
    }
  })
})

router.post('/api/add-single-question', function(req, res, next){
  var question_data = JSON.parse(req.body.question_data);
  var question = new SingleQuestionModel({
    title: question_data.title,
    itemList: question_data.itemList,
    answer: question_data.answer,
    diffculty: question_data.diffculty,
    author: question_data.author,
    type: question_data.type
  });

  question.save(function(err, ques){
    if(err){
      console.log(err);
      res.json('fail');
    }else{
      res.json('success');
    }
  })
});

router.post('/api/add-mutiple-question', function(req, res, next){
  var question_data = JSON.parse(req.body.question_data);
  var question = new MutipleQuestionModel({
    title: question_data.title,
    itemList: question_data.itemList,
    answer: question_data.answer,
    diffculty: question_data.diffculty,
    author: question_data.author,
    type: question_data.type
  });

  question.save(function(err, ques){
    if(err){
      console.log(err);
      res.json('fail');
    }else{
      res.json('success');
    }
  });
});

router.post('/api/add-blank-question', function(req, res, next){
  var question_data = JSON.parse(req.body.question_data);
  console.log(question_data);
  var question = new BlankQuestionModel({
    title: question_data.title,
    answer: question_data.answer,
    diffculty: question_data.diffculty,
    author: question_data.author,
    type: question_data.type
  });

  question.save(function(err, ques){
    if(err){
      console.log(err);
      res.json('fail');
    }else{
      res.json('success');
    }
  });
});

router.post('/api/add-mutiple', function(req, res, next) {
  var question_data = JSON.parse(req.body.question_data);
  var question = new MutipleQuestionModel({
    title: question_data.title,
    itemList: question_data.itemList,
    answer: question_data.answer,
    diffculty: question_data.diffculty,
    author: question_data.author,
    type: question_data.type
  });

  question.save(function(err, ques){
    if(err) return console.error(err);
  });
  res.json('success');
});

router.post('/api/add-blank', function(req, res, next) {
  var question_data = JSON.parse(req.body.question_data);
  console.log(question_data);
  var question = new BlankQuestionModel({
    title: question_data.title,
    answer: question_data.answer,
    diffculty: question_data.diffculty,
    author: question_data.author,
    type: question_data.type
  });

  question.save(function(err, ques){
    if(err) return console.error(err);
  });
  res.json('success');
});

module.exports = router;
