/* global $ */
$(document).ready(function(){
  $.getJSON("/api/todos")
  .then(addTodos);
  
  $('#todoInput').keypress(function(event){
    if(event.which === 13) {
      createTodo();
    }
  });
  
  $('.list').on('click', 'li', function(){
    updateTodo($(this));
  });
  
  $('.list').on('click', 'span', function(e){
    e.stopPropagation();
    removeTodo($(this).parent());
  });
});

function addTodos(todos) {
  //add todos to page here
  todos.forEach(function(todo){
    addTodo(todo);
  });
}

function addTodo(todo){
  var newTodo = $('<li class="task">'+todo.name +' <span>X</span></li>');
  newTodo.data('id', todo._id);
  newTodo.data('completed', todo.completed);
  if(todo.completed){
    newTodo.addClass("done");
  }
  $('.list').append(newTodo);
}

function createTodo(){
  //send request to create new todo
  var usrInput = $('#todoInput').val();
   acall({
    method:'POST',
    data:{name: usrInput},
    dataType:"json",
    url: '/api/todos',
    ok:function(newTodo){
      $('#todoInput').val('');
     addTodo(newTodo);
    }
  });
}

function removeTodo(todo){
  var clickedId = todo.data('id');
  var deleteUrl = '/api/todos/' + clickedId; 
  acall({
    method: 'DELETE',
    url: deleteUrl,
    ok:function(){
    todo.remove();
  }
  });
}

function updateTodo(todo){
  var updateUrl = '/api/todos/' + todo.data('id');
  var isDone = !todo.data('completed');
  var updateData = {completed: isDone};
  acall({
    method:'PUT',
    url: updateUrl,
    data: updateData,
    ok:function(){
    todo.toggleClass("done");
    todo.data('completed', isDone);
  }
  });
}

//acall///////////////
function acall(obj) {	
 var asyncr = obj.asyn || true,
	   method = obj.method || "GET",
	      url = obj.url,
	 datasend;
  if(obj.data){
	  if(typeof obj.data === 'string'){
	    datasend = obj.data;			  
	    }else{
		  var str = "";
       for (var prop in obj.data) {
         if(!obj.data.hasOwnProperty(prop)){ continue; }
          str += prop + "=" + obj.data[prop] + "&";	 
         }
		   datasend = str.slice(0,-1);		   	
	      }		
		  if(method === "GET"){
		  url = url+"?"+datasend;  
		  }	
    }else{
	   datasend = '';
      }
      var xhr = new XMLHttpRequest();	   
	       xhr.onreadystatechange = function(){
	        if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 201) ){ 
	         if(obj.dataType==="json"){
			       obj.ok(JSON.parse(xhr.responseText));	    
	         }else{
		        obj.ok(xhr.responseText);
	        }
         }
       };
	  xhr.open(method,url,asyncr);
   if(method==="POST" || method==="PUT"){xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");}
 xhr.send(datasend);
}