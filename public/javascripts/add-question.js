//表单提交检查
var $single_form = $('#single_form'),
    $mutiple_form = $('#mutiple_form'),
    $blank_form = $('#blank_form');

var checkSingle = function(){
  var itemList = [];
  var author = 'default';
  var answer;
  var title = $single_form.find('#single_question_title').val();
  var diffculty = parseFloat($single_form.find("#single-diffculty").rating()[0].value, 10);

  if(title.trim().length === 0){
    alert('输入题目!');
    return false;
  }

  $single_form.find('.j-item').each(function(){
    itemList.push(this.value.trim());
  })
  for(var i = 0; i < itemList.length; i++){
    if(itemList[i].length === 0){
      alert('填写选项！');
      return false;
    }
  }

  var $radioList = $single_form.find('input[name="single_radio"]')
  $radioList.each(function(){
    if(this.checked){
      answer = $radioList.index($(this));
    }
  })

  if(diffculty === 0){
    alert('选择难度');
    return false;
  }

  var question_data = {
    type: 'single',
    title : title,
    itemList : itemList,
    answer: answer,
    diffculty: diffculty,
    author: author
  };
  var question_data = JSON.stringify(question_data);
  console.log(question_data);
  $.post('api/add-single', {question_data: question_data},
    function(data){
      console.log(data);
      if(data = 'success'){
        alert('添加成功');
        location.reload();
      }
    }, 'json');

  return false;
};

var checkMutiple = function(){
  var itemList = [];
  var author = 'default';
  var answer = [];
  var title = $mutiple_form.find('#mutiple_question_title').val();
  var diffculty = parseFloat($mutiple_form.find("#mutiple-diffculty").rating()[0].value, 10);

  if(title.trim().length === 0){
    alert('输入题目!');
    return false;
  }

  $mutiple_form.find('.j-item').each(function(){
    itemList.push(this.value.trim());
  })
  for(var i = 0; i < itemList.length; i++){
    if(itemList[i].length === 0){
      alert('填写选项！');
      return false;
    }
  }

  var $checkboxList = $mutiple_form.find('input[name="mutiple_checkbox"]')
  $checkboxList.each(function(){
    if(this.checked){
      answer.push($checkboxList.index($(this)));
    }
  })

  if(answer.length <= 1){
    alert('请选择多个正确答案');
    return false;
  }

  if(diffculty === 0){
    alert('选择难度');
    return false;
  }

  var question_data = {
    type: 'mutiple',
    title : title,
    itemList : itemList,
    answer: answer,
    diffculty: diffculty,
    author: author
  };
  var question_data = JSON.stringify(question_data);
  console.log(question_data);
  $.post('api/add-mutiple', {question_data: question_data},
    function(data){
      console.log(data);
      if(data = 'success'){
        alert('添加成功');
        location.reload();
      }
    }, 'json');
  return false;
}

var checkBlank = function(){
  var answer = [];
  var author = 'default';
  var title = $blank_form.find('#blank_question_title').val();
  var diffculty = parseFloat($blank_form.find("#blank-diffculty").rating()[0].value, 10);

  if(title.trim().length === 0){
    alert('输入题目!');
    return false;
  }

  $blank_form.find('.j-item').each(function(){
    answer.push(this.value.trim());
  })
  for(var i = 0; i < answer.length; i++){
    if(answer[i].length === 0){
      alert('填写答案！');
      return false;
    }
  }

  var $checkboxList = $blank_form.find('input[name="mutiple_checkbox"]')
  $checkboxList.each(function(){
    if(this.checked){
      answer.push($checkboxList.index($(this)));
    }
  })

  if(diffculty === 0){
    alert('选择难度');
    return false;
  }

  var question_data = {
    type: 'blank',
    title : title,
    answer: answer,
    diffculty: diffculty,
    author: author
  };
  var question_data = JSON.stringify(question_data);
  console.log(question_data);
  $.post('api/add-blank', {question_data: question_data},
    function(data){
      console.log(data);
      if(data = 'success'){
        alert('添加成功');
        location.reload();
      }
    }, 'json');
  return false;
};


$(document).ready(function(){
  //tab栏选择
  var $nav = $('.nav li');
  var $add_panel = $('.add');
  $nav.on('click', function(){
    var index = $nav.index($(this));
    $(this).addClass('active')
           .siblings().removeClass('active');
    $add_panel.hide();
    $add_panel.eq(index).show();
  })
})
//难度选择
var starOption = {
  starCaptions: function(value){
    if(value <= 1.5){
      return '简单';
    }else if(value <= 3.5){
      return '一般';
    }else{
      return '困难';
    }
  },
  starCaptionClasses: function(value){
    if(value <= 1.5){
      return 'label label-success';
    }else if(value <= 3.5){
      return 'label label-primary';
    }else{
      return 'label label-danger';
    }
  },
  size: 'xs',
  showClear: false,
  clearCaption: '未评困难分'
};

$("#single-diffculty").rating(starOption);
$("#mutiple-diffculty").rating(starOption);
$("#blank-diffculty").rating(starOption);
