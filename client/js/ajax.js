'use strict';

//formatting
$('#to-do-list').on('click', '.edit-button, .cancel-update-button', function () {
  var $this = $(this).parents('.list-group-item');
  $this.find('.edit-item-form').toggle();
  $this.find('span').toggle();
  $this.find('.edit-button, .delete-button').toggle();
});

$('#show-new-item-form').on('click', function () {
  $('#new-todo-form, #show-new-item-form').toggle();
});

//// ajax requests
// page load
$.get('http://localhost:3000/todos', function (todos) {
  todos.forEach(function (todo) {
    $('#to-do-list').append('\n      <li class="list-group-item">\n        <form action="/todos/' + todo._id + '" method="POST" class="edit-item-form">\n          <div class="form-group">\n            <label for="' + todo._id + '">Item Text</label>\n            <input type="text" value="' + todo.text + '" name="todo[text]" id="' + todo._id + '" class="form-control">\n          </div>\n          <button class="btn btn-primary">Update Item</button>\n          <button type="button" class="btn btn-danger cancel-update-button">Cancel</button>\n        </form>\n        <span class="lead">\n          ' + todo.text + '\n        </span>\n        <div class="pull-right">\n          <button href="/todos/' + todo._id + '/edit" class="btn btn-sm btn-warning edit-button">Edit</button>\n          <form style="display: inline" method="POST" action="/todos/' + todo._id + '" class="delete-item-form">\n            <button type="submit" class="btn btn-sm btn-danger delete-button">Delete</button>\n          </form>\n        </div>\n        <div class="clearfix"></div>\n      </li>      \n      ');
  });
});

// POST
$('#new-todo-form').submit(function (e) {
  e.preventDefault();
  var toDoItem = $(this).serialize();
  $.post('http://localhost:3000/todos', toDoItem, function (data) {
    $('#to-do-list').append('\n      <li class="list-group-item">\n        <form action="/todos/' + data._id + '" method="POST" class="edit-item-form">\n          <div class="form-group">\n            <label for="' + data._id + '">Item Text</label>\n            <input type="text" value="' + data.text + '" name="todo[text]" id="' + data._id + '" class="form-control">\n          </div>\n          <button class="btn btn-primary">Update Item</button>\n          <button type="button" class="btn btn-danger cancel-update-button">Cancel</button>\n        </form>\n        <span class="lead">\n          ' + data.text + '\n        </span>\n        <div class="pull-right">\n          <button href="/todos/' + data._id + '/edit" class="btn btn-sm btn-warning edit-button">Edit</button>\n          <form style="display: inline" method="POST" action="/todos/' + data._id + '" class="delete-item-form">\n            <button type="submit" class="btn btn-sm btn-danger delete-button">Delete</button>\n          </form>\n        </div>\n        <div class="clearfix"></div>\n      </li>\n      ');
    $('#new-todo-form').find('.form-control').val('');
    $('#new-todo-form, #show-new-item-form').toggle();
  });
});

// PUT
$('#to-do-list').on('submit', '.edit-item-form', function (e) {
  e.preventDefault();
  var toDoItem = $(this).serialize();
  var actionUrl = 'http://localhost:3000' + $(this).attr('action');
  var $originalItem = $(this).parent('.list-group-item');
  $.ajax({
    url: actionUrl,
    data: toDoItem,
    type: 'PUT',
    originalItem: $originalItem,
    success: function success(data) {
      this.originalItem.html('\n        <form action="/todos/' + data._id + '" method="POST" class="edit-item-form">\n          <div class="form-group">\n            <label for="' + data._id + '">Item Text</label>\n            <input type="text" value="' + data.text + '" name="todo[text]" id="' + data._id + '" class="form-control">\n          </div>\n          <button class="btn btn-primary">Update Item</button>\n          <button type="button" class="btn btn-danger cancel-update-button">Cancel</button>\n        </form>\n        <span class="lead">\n          ' + data.text + '\n        </span>\n        <div class="pull-right">\n          <button href="/todos/' + data._id + '/edit" class="btn btn-sm btn-warning edit-button">Edit</button>\n          <form style="display: inline" method="POST" action="/todos/' + data._id + '" class="delete-item-form">\n            <button type="submit" class="btn btn-sm btn-danger delete-button">Delete</button>\n          </form>\n        </div>\n        <div class="clearfix"></div>\n        ');
    }
  });
});

// DELETE
$('#to-do-list').on('submit', '.delete-item-form', function (e) {
  e.preventDefault();
  var confirmResponse = confirm('Are you sure you want to remove this item?');
  if (confirmResponse) {
    var actionUrl = 'http://localhost:3000' + $(this).attr('action');
    var $itemtoDelete = $(this).closest('.list-group-item');
    $.ajax({
      url: actionUrl,
      type: 'DELETE',
      itemtoDelete: $itemtoDelete,
      success: function success(data) {
        this.itemtoDelete.remove();
      }
    });
  } else {
    $(this).find('button').blur();
  }
});