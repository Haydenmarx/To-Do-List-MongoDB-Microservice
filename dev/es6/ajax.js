//formatting
$('#to-do-list').on('click', '.edit-button, .cancel-update-button', function() {
  let $this = $(this).parents('.list-group-item');
  $this.find('.edit-item-form').toggle();
  $this.find('span').toggle();
  $this.find('.edit-button, .delete-button').toggle();
});

$('#show-new-item-form').on('click', function(){
  $('#new-todo-form, #show-new-item-form').toggle();
})

//// ajax requests
// page load
$.get('http://localhost:3000/todos', function(todos) {
  todos.forEach(function(todo) {
    $('#to-do-list').append(
      `
      <li class="list-group-item">
        <form action="/todos/${todo._id}" method="POST" class="edit-item-form">
          <div class="form-group">
            <label for="${todo._id}">Item Text</label>
            <input type="text" value="${todo.text}" name="todo[text]" id="${todo._id}" class="form-control">
          </div>
          <button class="btn btn-primary">Update Item</button>
          <button type="button" class="btn btn-danger cancel-update-button">Cancel</button>
        </form>
        <span class="lead">
          ${todo.text}
        </span>
        <div class="pull-right">
          <button href="/todos/${todo._id}/edit" class="btn btn-sm btn-warning edit-button">Edit</button>
          <form style="display: inline" method="POST" action="/todos/${todo._id}" class="delete-item-form">
            <button type="submit" class="btn btn-sm btn-danger delete-button">Delete</button>
          </form>
        </div>
        <div class="clearfix"></div>
      </li>      
      `
    ) 
  })
});

// POST
$('#new-todo-form').submit(function(e) {
  e.preventDefault();
  let toDoItem = $(this).serialize();
  $.post('http://localhost:3000/todos', toDoItem, function(data) {
    $('#to-do-list').append(
      `
      <li class="list-group-item">
        <form action="/todos/${data._id}" method="POST" class="edit-item-form">
          <div class="form-group">
            <label for="${data._id}">Item Text</label>
            <input type="text" value="${data.text}" name="todo[text]" id="${data._id}" class="form-control">
          </div>
          <button class="btn btn-primary">Update Item</button>
          <button type="button" class="btn btn-danger cancel-update-button">Cancel</button>
        </form>
        <span class="lead">
          ${data.text}
        </span>
        <div class="pull-right">
          <button href="/todos/${data._id}/edit" class="btn btn-sm btn-warning edit-button">Edit</button>
          <form style="display: inline" method="POST" action="/todos/${data._id}" class="delete-item-form">
            <button type="submit" class="btn btn-sm btn-danger delete-button">Delete</button>
          </form>
        </div>
        <div class="clearfix"></div>
      </li>
      `
    )
  $('#new-todo-form').find('.form-control').val('');
  $('#new-todo-form, #show-new-item-form').toggle();
  });
});

// PUT
$('#to-do-list').on('submit', '.edit-item-form', function(e) {
  e.preventDefault();
  let toDoItem = $(this).serialize();
  let actionUrl = 'http://localhost:3000' + $(this).attr('action');
  let $originalItem = $(this).parent('.list-group-item');
  $.ajax({
    url : actionUrl,
    data : toDoItem,
    type : 'PUT',
    originalItem : $originalItem,
    success : function(data) {
      this.originalItem.html(
        `
        <form action="/todos/${data._id}" method="POST" class="edit-item-form">
          <div class="form-group">
            <label for="${data._id}">Item Text</label>
            <input type="text" value="${data.text}" name="todo[text]" id="${data._id}" class="form-control">
          </div>
          <button class="btn btn-primary">Update Item</button>
          <button type="button" class="btn btn-danger cancel-update-button">Cancel</button>
        </form>
        <span class="lead">
          ${data.text}
        </span>
        <div class="pull-right">
          <button href="/todos/${data._id}/edit" class="btn btn-sm btn-warning edit-button">Edit</button>
          <form style="display: inline" method="POST" action="/todos/${data._id}" class="delete-item-form">
            <button type="submit" class="btn btn-sm btn-danger delete-button">Delete</button>
          </form>
        </div>
        <div class="clearfix"></div>
        `
      )
    }
  })
});

// DELETE
$('#to-do-list').on('submit', '.delete-item-form', function(e) {
  e.preventDefault();
  let confirmResponse = confirm('Are you sure you want to remove this item?');
  if (confirmResponse) {
    let actionUrl = 'http://localhost:3000' + $(this).attr('action');
    let $itemtoDelete = $(this).closest('.list-group-item');
    $.ajax ({
      url : actionUrl,
      type : 'DELETE',
      itemtoDelete : $itemtoDelete,
      success : function(data) {
        this.itemtoDelete.remove();
      }
    })
  } else {
    $(this).find('button').blur();
  }
})



