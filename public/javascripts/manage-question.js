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
      // question: deepClone(this.initQuestion)
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
