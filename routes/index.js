var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
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

var PaperSchema = new mongoose.Schema({
  name: {type:String},
  singleQuestions: [SingleQuestionSchema],
  mutipleQuestions: [MutipleQuestionSchema],
  blankQuestions:[BlankQuestionSchema]
});

var SingleQuestionModel = db.model('SingleQuestions', SingleQuestionSchema);
var MutipleQuestionModel = db.model('MutipleQuestions', MutipleQuestionSchema);
var BlankQuestionModel = db.model('BlankQuestions', BlankQuestionSchema);
var PaperModel = db.model('Papers', PaperSchema);

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

router.get('/api/query-mutiple-question', function(req, res, next){
  MutipleQuestionModel.find({}, function(err, data){
    res.json(data);
  });
})

router.get('/api/query-blank-question', function(req, res, next){
  BlankQuestionModel.find({}, function(err, data){
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

router.post('/api/alter-mutiple-question', function(req, res, next){
  var question_data = JSON.parse(req.body.question_data);
  MutipleQuestionModel.findById(question_data._id, function(err, question){
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

router.post('/api/alter-blank-question', function(req, res, next){
  var question_data = JSON.parse(req.body.question_data);
  BlankQuestionModel.findById(question_data._id, function(err, question){
    if (err) {
      return console.log(err);
    }else{
      question.title = question_data.title;
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

router.post('/api/remove-single-question', function(req, res, next){
  var id = ObjectId(req.body.id);
  SingleQuestionModel.remove({_id: id}, function(err){
    if(err){
      console.log(err);
      res.json('fail');
    }else{
      res.json('success');
    }
  })
});

router.post('/api/remove-mutiple-question', function(req, res, next){
  var id = ObjectId(req.body.id);
  MutipleQuestionModel.remove({_id: id}, function(err){
    if(err){
      console.log(err);
      res.json('fail');
    }else{
      res.json('success');
    }
  })
});

router.post('/api/remove-blank-question', function(req, res, next){
  var id = ObjectId(req.body.id);
  BlankQuestionModel.remove({_id: id}, function(err){
    if(err){
      console.log(err);
      res.json('fail');
    }else{
      res.json('success');
    }
  })
});

router.post('/api/add-paper', function(req, res, next){
  var paper_data = JSON.parse(req.body.paper);

  var paper = new PaperModel({
    name: paper_data.name
  });

  //添加单选
  for(var i = 0; i < paper_data.singleQuestions.length; i++){
    var q = paper_data.singleQuestions[i];
    var question = {
      title: q.title,
      itemList: q.itemList,
      answer: q.answer,
      diffculty: q.diffculty
    }
    paper.singleQuestions.push(question);
  }

  //添加多选
  for(var j = 0; j < paper_data.mutipleQuestions.length; j++){
    var q = paper_data.mutipleQuestions[j];
    var question = {
      title: q.title,
      itemList: q.itemList,
      answer: q.answer,
      diffculty: q.diffculty
    }
    paper.mutipleQuestions.push(question);
  }

  //添加填空
  for(var k = 0; k < paper_data.blankQuestions.length; k++){
    var q = paper_data.blankQuestions[k];
    var question = {
      title: q.title,
      answer: q.answer,
      diffculty: q.diffculty
    }
    paper.blankQuestions.push(question);
  }

  paper.save(function(err, ques){
    if(err){
      console.log(err);
      res.json('fail');
    }else{
      res.json('success');
    }
  });
})

router.get('/api/get-papers', function(req, res, next){
  PaperModel.find({}, function(err, data){
    res.json(data);
  })
})

module.exports = router;
