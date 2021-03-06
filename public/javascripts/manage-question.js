Vue.component('alter-single',{
  template: '#alter-single-tpl',
  props: ['initQuestion'],
  data: function(){
    return {
      question: deepClone(this.initQuestion)
    }
  },
  created: function(){
    console.log('alter-single created');
  },
  methods: {
    giveUpAlter: function(){
      this.$emit('query');
    },
    addItem: function(){
      console.log('add item');
      this.question.itemList.push('');
    },
    removeItem: function(index){
      if(this.question.itemList.length <= 3){
        alert('至少需要三个选项');
        return;
      }
      if(index === this.question.answer){
        alert('正确答案无法删除');
        return;
      }
      this.question.itemList.splice(index, 1);
    },
    validateInput: function(){
      var question = this.question;
      if(question.title == ''){
        alert('请填写题目');
        return false;
      }

      for(var i = 0; i < question.itemList.length; i++){
        if(question.itemList[i].trim() === ''){
          alert('请填写选项');
          return false;
        }
      }

      if(question.answer === ''){
        alert('请填写正确答案');
        console.log(question.answer);
        return false;
      }

      if(question.diffculty == ''){
        alert('请填写难度');
        return false;
      }

      return true;
    },
    addQuestion: function(){
      var question = this.question;
      var question_data;
      if(this.validateInput()){
        question_data = {
          _id: question._id,
          title: question.title,
          itemList: question.itemList,
          diffculty: question.diffculty,
          answer: question.answer
        };
        console.log(question_data);
        question_data = JSON.stringify(question_data);
        this.$http.post('/api/alter-single-question', {question_data: question_data}).then(
          function(response){
            if(response.body === 'success'){
              alert('修改成功');
              this.$emit('finishAlter');
            }
          },
          function(response){
            console.log('fail');
          }
        );
      }
    }
  }
});

Vue.component('query-single', {
  template: '#query-single-tpl',
  props: ['initQuestion'],
  data: function(){
    return {}
  },
  methods: {
    alterQuestion: function(){
      console.log('alter question');
      this.$emit('alter');
    },
    deleteQuestion: function(){
      var id = this.initQuestion._id;
      this.$http.post('/api/remove-single-question',{id: id}).then(
        function(response){
          if(response.body == 'success'){
            alert('删除成功')
            this.$emit('finishDelete');
          }
        },
        function(response){
          console.log(response);
        }
      )
    },
    addToPaper: function(){
      console.log('addToPaper');
      var question_data = {
        title: this.initQuestion.title,
        itemList: this.initQuestion.itemList,
        answer: this.initQuestion.answer,
        diffculty: this.initQuestion.diffculty,
        type: 'single'
      }
      bus.$emit('addToPaper', question_data);
    }
  },
  created: function(){
    console.log('query-single created');
  }
});

Vue.component('single-panel', {
  template: '#single-panel-tpl',
  props: ['singleQuestion'],
  data: function(){
    return {
      currentView: 'query-single'
    }
  },
  methods: {
    toggleAlter: function(){
      this.currentView = 'alter-single';
    },
    toggleQuery: function(){
      this.currentView = 'query-single';
    },
    successAlter: function(){
      this.currentView = 'query-single';
      this.$emit('refreshList');
    },
    successDelete: function(){
      this.$emit('refreshList');
    }
  }
});

var single_list = Vue.component('single-list', {
  template: '#single-list-tpl',
  data: function(){
    return {
      loading: false,
      questionList: []
    }
  },
  updated: function(){
    console.log('updated');
  },
  created: function(){
    console.log('SingleList created');
    this.fetchData();
  },
  methods: {
    fetchData: function(){
      console.log('fetch data');
      this.loading = true;
      this.$http.get('/api/query-single-question').then(
        function(response){
          var list = response.body;
          this.loading = false;
          this.questionList = response.body;
        },
        function(response){
          console.log(response)
        }
      );
    }
  }
});

Vue.component('alter-mutiple', {
  template: '#alter-mutiple-tpl',
  props: ['initQuestion'],
  data: function(){
    return {
      question: deepClone(this.initQuestion)
    }
  },
  created: function(){
    console.log('add-mutiple created');
  },
  methods: {
    giveUpAlter: function(){
      this.$emit('query');
    },
    addItem: function(){
      this.question.itemList.push('');
    },
    removeItem: function(index){
      if(this.question.answer.indexOf(index) != -1){
        alert('不能删除正确答案');
        return;
      }
      if(this.question.itemList.length <= 3){
        alert('至少需要三个选项');
        return;
      }
      if(index === this.question.answer){
        alert('正确答案无法删除');
        return;
      }
      this.question.itemList.splice(index, 1);
    },
    validateInput: function(){
      var question = this.question;
      if(question.title == ''){
        alert('请填写题目');
        return false;
      }

      for(var i = 0; i < question.itemList.length; i++){
        if(question.itemList[i].trim() === ''){
          alert('请填写选项');
          return false;
        }
      }

      if(question.answer.length < 2){
        alert('请选择多个正确答案');
        console.log(question.answer);
        return false;
      }

      if(question.diffculty == ''){
        alert('请填写难度');
        return false;
      }

      return true;
    },
    addQuestion: function(){
      var question = this.question;
      var question_data;
      if(this.validateInput()){
        question_data = {
          _id: question._id,
          title: question.title,
          itemList: question.itemListß,
          diffculty: question.diffculty,
          answer: question.answer.sort()
        };
        console.log(question_data);
        question_data = JSON.stringify(question_data);
        this.$http.post('/api/alter-mutiple-question', {question_data: question_data}).then(
          function(response){
            if(response.body === 'success'){
              alert('修改成功');
              this.$emit('finishAlter');
            }
          },
          function(response){
            console.log('fail');
          }
        );
      }
    }
  }
});

Vue.component('query-mutiple', {
  template: '#query-mutiple-tpl',
  props: ['initQuestion'],
  data: function(){
    return {

    }
  },
  methods: {
    alterQuestion: function(id, index){
      console.log('alter question');
      this.$emit('alter');
    },
    deleteQuestion: function(id, index){
      var id = this.initQuestion._id;
      this.$http.post('/api/remove-mutiple-question',{id: id}).then(
        function(response){
          if(response.body == 'success'){
            alert('删除成功')
            this.$emit('finishDelete');
          }
        },
        function(response){
          console.log(response);
        }
      )
    },
    addToPaper: function(){
      console.log('addToPaper');
      var question_data = {
        title: this.initQuestion.title,
        itemList: this.initQuestion.itemList,
        answer: this.initQuestion.answer,
        diffculty: this.initQuestion.diffculty,
        type: 'mutiple'
      }
      bus.$emit('addToPaper', question_data);
    }
  },
  created: function(){
    console.log('query-mutiple created');
  }
});

Vue.component('mutiple-panel', {
  template: '#mutiple-panel-tpl',
  props: ['mutipleQuestion'],
  data: function(){
    return {
      currentView: 'query-mutiple'
    }
  },
  methods: {
    toggleAlter: function(){
      this.currentView = 'alter-mutiple';
    },
    toggleQuery: function(){
      this.currentView = 'query-mutiple';
    },
    successAlter: function(){
      this.currentView = 'query-mutiple';
      this.$emit('refreshList');
    },
    successDelete: function(){
      this.$emit('refreshList');
    }
  },
  created: function(){
    console.log('mutiple-panel created');
  }
});

var mutiple_list = Vue.component('mutiple-list', {
  template: '#mutiple-list-tpl',
  data: function(){
    return {
      loading: false,
      questionList: []
    }
  },
  created: function(){
    console.log('MutipleList created');
    this.fetchData();
  },
  methods: {
    fetchData: function(){
      console.log('fetch data');
      this.loading = true;
      this.$http.get('/api/query-mutiple-question').then(
        function(response){
          var list = response.body;
          this.loading = false;
          this.questionList = response.body;
        },
        function(response){
          console.log(response)
        }
      );
    }
  }
})

Vue.component('alter-blank', {
  template: '#alter-blank-tpl',
  props: ['initQuestion'],
  data: function(){
    return {
      question: deepClone(this.initQuestion)
    }
  },
  created: function(){
    console.log('alter-blank created');
  },
  methods: {
    giveUpAlter: function(){
      this.$emit('query');
    },
    addItem: function(){
      this.question.answer.push('');
    },
    removeItem: function(index){
      if(this.question.answer.length <= 1){
        alert('至少需要一个答案');
        return;
      }
      this.question.answer.splice(index, 1);
    },
    validateInput: function(){
      var question = this.question;
      if(question.title == ''){
        alert('请填写题目');
        return false;
      }

      for(var i = 0; i < question.answer.length; i++){
        if(question.answer[i].trim() === ''){
          alert('请填写答案');
          return false;
        }
      }

      if(question.diffculty == ''){
        alert('请填写难度');
        return false;
      }

      return true;
    },
    addQuestion: function(){
      var question = this.question;
      var question_data;
      if(this.validateInput()){
        question_data = {
          _id: question._id,
          title: question.title,
          diffculty: question.diffculty,
          answer: question.answer
        };
        console.log(question_data);
        question_data = JSON.stringify(question_data);
        this.$http.post('/api/alter-blank-question', {question_data: question_data}).then(
          function(response){
            if(response.body === 'success'){
              alert('修改成功');
              this.$emit('finishAlter');
            }
          },
          function(response){
            console.log('fail');
          }
        );
      }
    }
  }
});

Vue.component('query-blank', {
  template: '#query-blank-tpl',
  props: ['initQuestion'],
  data: function(){
    return {}
  },
  methods: {
    alterQuestion: function(id, index){
      console.log('alter question');
      this.$emit('alter');
    },
    deleteQuestion: function(id, index){
      var id = this.initQuestion._id;
      this.$http.post('/api/remove-blank-question',{id: id}).then(
        function(response){
          if(response.body == 'success'){
            alert('删除成功')
            this.$emit('finishDelete');
          }
        },
        function(response){
          console.log(response);
        }
      )
    },
    addToPaper: function(){
      console.log('addToPaper');
      var question_data = {
        title: this.initQuestion.title,
        answer: this.initQuestion.answer,
        diffculty: this.initQuestion.diffculty,
        type: 'blank'
      }
      bus.$emit('addToPaper', question_data);
    }
  },
  created: function(){
    console.log('query-blank created');
  }
});

Vue.component('blank-panel', {
  template: '#blank-panel-tpl',
  props: ['blankQuestion'],
  data: function(){
    return {
      currentView: 'query-blank'
    }
  },
  methods: {
    toggleAlter: function(){
      this.currentView = 'alter-blank';
    },
    toggleQuery: function(){
      this.currentView = 'query-blank';
    },
    successAlter: function(){
      this.currentView = 'query-blank';
      this.$emit('refreshList');
    },
    successDelete: function(){
      this.$emit('refreshList');
    }
  },
  created: function(){
    console.log('mutiple-panel created');
  }
});

var blank_list = Vue.component('blank-list', {
  template: '#blank-list-tpl',
  data: function(){
    return {
      loading: false,
      questionList: []
    }
  },
  created: function(){
    console.log('fetch Data');
    this.fetchData()
  },
  methods: {
    fetchData: function(){
      console.log('fetch data');
      this.loading = true;
      this.$http.get('/api/query-blank-question').then(
        function(response){
          var list = response.body;
          this.loading = false;
          this.questionList = response.body;
        },
        function(response){
          console.log(response)
        }
      );
    }
  }
});

var add_single = Vue.component('add-single', {
  template: '#add-single-tpl',
  data: function(){
    return {
      question: {
        _id: 'q1',
        title: '',
        itemList: ['', '', '', ''],
        diffculty: 3,
        answer: 0
      }
    }
  },
  created: function(){
    console.log('add-single created');
  },
  methods: {
    addItem: function(){
      this.question.itemList.push('');
    },
    removeItem: function(index){
      if(this.question.itemList.length <= 3){
        alert('至少需要三个选项');
        return;
      }
      if(index === this.question.answer){
        alert('正确答案无法删除');
        return;
      }
      this.question.itemList.splice(index, 1);
    },
    validateInput: function(){
      var question = this.question;
      if(question.title == ''){
        alert('请填写题目');
        return false;
      }

      for(var i = 0; i < question.itemList.length; i++){
        if(question.itemList[i].trim() === ''){
          alert('请填写选项');
          return false;
        }
      }

      if(question.answer === ''){
        alert('请填写正确答案');
        console.log(question.answer);
        return false;
      }

      if(question.diffculty == ''){
        alert('请填写难度');
        return false;
      }

      return true;
    },
    addQuestion: function(){
      var question = this.question;
      var question_data;
      if(this.validateInput()){
        question_data = {
          title: question.title,
          itemList: question.itemList,
          diffculty: question.diffculty,
          answer: question.answer,
          author: 'default',
          type: 'single'
        };
        console.log(question_data);
        question_data = JSON.stringify(question_data);
        this.$http.post('/api/add-single-question',{question_data: question_data}).then(
          function(response){
            if(response.body === 'success'){
              alert('添加成功')
              router.push('/my-single');
            }
          },
          function(response){
            console.log('fail');
          }
        )
      }
    }
  }
});

var add_mutiple = Vue.component('add-mutiple', {
  template: '#add-mutiple-tpl',
  data: function(){
    return {
      question: {
        _id: 'q1',
        title: '',
        itemList: ['', '', '', ''],
        diffculty: 3,
        answer: [0, 1]
      }
    }
  },
  created: function(){
    console.log('add-mutiple created');
  },
  methods: {
    addItem: function(){
      this.question.itemList.push('');
    },
    removeItem: function(index){
      if(this.question.answer.indexOf(index) != -1){
        alert('不能删除正确答案');
        return;
      }
      if(this.question.itemList.length <= 3){
        alert('至少需要三个选项');
        return;
      }
      if(index === this.question.answer){
        alert('正确答案无法删除');
        return;
      }
      this.question.itemList.splice(index, 1);
    },
    validateInput: function(){
      var question = this.question;
      if(question.title == ''){
        alert('请填写题目');
        return false;
      }

      for(var i = 0; i < question.itemList.length; i++){
        if(question.itemList[i].trim() === ''){
          alert('请填写选项');
          return false;
        }
      }

      if(question.answer.length < 2){
        alert('请选择多个正确答案');
        console.log(question.answer);
        return false;
      }

      if(question.diffculty == ''){
        alert('请填写难度');
        return false;
      }

      return true;
    },
    addQuestion: function(){
      var question = this.question;
      var question_data;
      if(this.validateInput()){
        question_data = {
          title: question.title,
          itemList: question.itemList,
          diffculty: question.diffculty,
          answer: question.answer,
          author: 'default',
          type: 'mutiple'
        };
        console.log(question_data);
        question_data = JSON.stringify(question_data);
        this.$http.post('/api/add-mutiple-question',{question_data: question_data}).then(
          function(response){
            if(response.body === 'success'){
              alert('添加成功')
              router.push('/my-mutiple');
            }
          },
          function(response){
            console.log('fail');
          }
        )
      }
    }
  }
});

var add_blank = Vue.component('add-blank', {
  template: '#add-blank-tpl',
  data: function(){
    return {
      question: {
        _id: 'q1',
        title: '',
        diffculty: 3,
        answer: ['', '']
      }
    }
  },
  created: function(){
    console.log('add-mutiple created');
  },
  methods: {
    addItem: function(){
      this.question.answer.push('');
    },
    removeItem: function(index){
      if(this.question.answer.length <= 1){
        alert('至少需要一个答案');
        return;
      }
      this.question.answer.splice(index, 1);
    },
    validateInput: function(){
      var question = this.question;
      if(question.title == ''){
        alert('请填写题目');
        return false;
      }

      for(var i = 0; i < question.answer.length; i++){
        if(question.answer[i].trim() === ''){
          alert('请填写答案');
          return false;
        }
      }

      if(question.diffculty == ''){
        alert('请填写难度');
        return false;
      }

      return true;
    },
    addQuestion: function(){
      var question = this.question;
      var question_data;
      if(this.validateInput()){
        question_data = {
          title: question.title,
          diffculty: question.diffculty,
          answer: question.answer,
          author: 'default',
          type: 'blank'
        };
        console.log(question_data);
        question_data = JSON.stringify(question_data);
        this.$http.post('/api/add-blank-question',{question_data: question_data}).then(
          function(response){
            if(response.body === 'success'){
              alert('添加成功')
              router.push('/my-blank');
            }
          },
          function(response){
            console.log('fail');
          }
        )
      }
    }
  }
});

Vue.filter('numToChar', function (value) {
  return String.fromCharCode(value + 65);
});

Vue.filter('numArrToChar', function (arr) {
  var res = [];
  for(var i = 0; i < arr.length; i++){
    res.push(String.fromCharCode(arr[i] + 65));
  }
  return res.join(', ');
});

Vue.component('paper-car', {
  template: '#paper-car-tpl',
  data: function(){
    return {
      showQuestionList: false,
      paperName: '',
      questionList: []
    }
  },
  created: function(){
    console.log('paper-car created');
    var list = this.questionList
    bus.$on('addToPaper', function(question){
      list.push(question);
    })
  },
  methods: {
    removeQuestion: function(index){
      this.questionList.splice(index, 1);
    },
    validatePaper: function(){
      if(this.paperName.trim() == ''){
        alert('请输入试卷名字');
        return false;
      }

      if(this.questionList.length < 1){
        alert('请加入试题');
        return false;
      }

      return true;
    },
    submitPaper: function(){
      var paper;
      if(this.validatePaper()){
        paper = {
          name: this.paperName,
          singleQuestions: [],
          mutipleQuestions: [],
          blankQuestions: []
        }

        for(var i = 0; i < this.questionList.length; i++){
          if(this.questionList[i].type === 'single'){
            paper.singleQuestions.push(this.questionList[i]);
          }else if(this.questionList[i].type === 'mutiple'){
            paper.mutipleQuestions.push(this.questionList[i]);
          }else if(this.questionList[i].type === 'blank'){
            paper.blankQuestions.push(this.questionList[i]);
          }
        }

        paper = JSON.stringify(paper);
        console.log(paper);

        this.$http.post('/api/add-paper', {paper: paper}).then(
          function(response){
            if(response.body == 'success'){
              alert('添加试卷成功');
              this.questionList.splice(0, this.questionList.length);
              this.paperName = '';
            }else{
              alert('添加试卷失败');
            }
          },
          function(response){
            console.log(response);
          }
        )
      }
    },
    clearPaper: function(){
      this.questionList.splice(0, this.questionList.length);
      this.paperName = '';
    }
  }
})

var paper_list = Vue.component('paper-list', {
  template: '#paper-list-tpl',
  data: function(){
    return {
      loading: false,
      // paperList: [
      //   {
      //       "_id" : "583fc4343c5c757741b92b41",
      //       "name" : "def",
      //       "blankQuestions" : [
      //           {
      //               "title" : "qwerqwerqwerqwe",
      //               "diffculty" : 3,
      //               "_id" : "583fc4343c5c757741b92b44",
      //               "answer" : [
      //                   "asd"
      //               ]
      //           }
      //       ],
      //       "mutipleQuestions" : [
      //           {
      //               "title" : "65489asdfasdf",
      //               "diffculty" : 12,
      //               "_id" : "583fc4343c5c757741b92b43",
      //               "answer" : [
      //                   0,
      //                   1
      //               ],
      //               "itemList" : [
      //                   "qwe",
      //                   "asd",
      //                   "a"
      //               ]
      //           }
      //       ],
      //       "singleQuestions" : [
      //           {
      //               "title" : "pqwe",
      //               "answer" : 0,
      //               "diffculty" : 3.5,
      //               "_id" : "583fc4343c5c757741b92b42",
      //               "itemList" : [
      //                   "asdf",
      //                   "we",
      //                   "er"
      //               ]
      //           }
      //       ],
      //       "__v" : 0
      //   },
      //   {
      //     "_id" : "583fd31b3c5c757741b92b45",
      //     "name" : "seco",
      //     "blankQuestions" : [
      //         {
      //             "title" : "qwerqwerqwerqwe",
      //             "diffculty" : 3,
      //             "_id" : "583fd31b3c5c757741b92b47",
      //             "answer" : [
      //                 "asd"
      //             ]
      //         },
      //         {
      //             "title" : "5488qwerqwe",
      //             "diffculty" : 3,
      //             "_id" : "583fd31b3c5c757741b92b48",
      //             "answer" : [
      //                 "asd",
      //                 "5488"
      //             ]
      //         },
      //         {
      //             "title" : "12afsdfasfd",
      //             "diffculty" : 3,
      //             "_id" : "583fd31b3c5c757741b92b49",
      //             "answer" : [
      //                 "sdf",
      //                 "ad",
      //                 "568795"
      //             ]
      //         }
      //     ],
      //     "mutipleQuestions" : [],
      //     "singleQuestions" : [
      //         {
      //             "title" : "pqwe",
      //             "answer" : 0,
      //             "diffculty" : 3.5,
      //             "_id" : "583fd31b3c5c757741b92b46",
      //             "itemList" : [
      //                 "asdf",
      //                 "we",
      //                 "er"
      //             ]
      //         }
      //     ],
      //     "__v" : 0
      //   }
      // ]
      paperList: []
    }
  },
  created: function(){
    console.log('query-paper created');
    this.fetchData()
  },
  methods: {
    toPaper: function(index){
      console.log('toPaper');
      router.push({
        // path: '/query-paper',
        name: 'queryPaper',
        params: {
          paper: this.paperList[index]
        }
      })
    },
    fetchData: function(){
      this.loading = true;
      this.$http.get('/api/get-papers').then(
        function(response){
          this.loading = false;
          this.paperList = response.body;
        },
        function(response){
          console.log(response);
        }
      )
    }
  }
})

var query_paper = Vue.component('query-paper', {
  template: '#query-paper-tpl',
  data: function(){
    return {
      paper: this.$route.params.paper
    }
  },
  created: function(){
    console.log(this.$route.params.paper);
  }
})

Vue.component('single-read-only', {
  template: '#single-read-only-tpl',
  props: ['question'],
  data: function(){
    return {

    }
  }
})

Vue.component('mutiple-read-only', {
  template: '#mutiple-read-only-tpl',
  props: ['question'],
  data: function(){
    return {

    }
  }
})

Vue.component('blank-read-only', {
  template: '#blank-read-only-tpl',
  props: ['question'],
  data: function(){
    return {

    }
  }
})

var bus = new Vue();

var router = new VueRouter({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/my-single'
    },
    {
      path: '/my-single',
      component: single_list
    },
    {
      path: '/my-mutiple',
      component: mutiple_list
    },
    {
      path: '/my-blank',
      component: blank_list
    },
    {
      path: '/add-single',
      component: add_single
    },
    {
      path: '/add-mutiple',
      component: add_mutiple
    },
    {
      path: '/add-blank',
      component: add_blank
    },
    {
      path: '/paper-list',
      component: paper_list
    },
    {
      path: '/query-paper',
      name: 'queryPaper',
      component: query_paper
    }
  ]
})

var app = new Vue({
  el: '#query-app',
  router: router,
  data: {

  },
  methods: {

  }
});

function deepClone(initalObj) {
    var obj = {};
    try {
        obj = JSON.parse(JSON.stringify(initalObj));
    }catch(err){
      console.log(err);
    }
    return obj;
}
