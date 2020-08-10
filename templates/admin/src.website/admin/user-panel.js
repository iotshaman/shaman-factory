const UserModel = Backbone.Model.extend({});
const UserCollection = Backbone.Collection.extend({ model: UserModel });
const UserPanelView = Backbone.View.extend({
  el: '#users',
  initialize: function() {
    this.$el.html('');
    var template = _.template($('#user-card').html());
    $(this.collection.models).each((_, model) => {
      this.$el.append(template(model.attributes))
    });
  }
});

$(document).ready(function() {
  loadUserCards();
});

function loadUserCards() {
  UserService.GetAllUsers().then(users => {
    let userModels = users.map(user => new UserModel(user));
    let collection = new UserCollection(userModels);
    new UserPanelView({collection: collection});
  });
}

function createUser() {
  let name = $('input[name="user-name"]').val();
  let email = $('input[name="email"]').val();
  let password = $('input[name="password"]').val();
  if (!name) {
    alert('Please provide a full name.');
    return;
  }
  if (!email) {
    alert('Please provide an email.');
    return;
  }
  if (!password) {
    alert('Please provide an password.');
    return;
  }
  UserService.AddUser(email, name, password)
    .then(_ => $('#addUserModal').modal('hide'))
    .then(_ => loadUserCards());
}

function deleteUser(email) {
  if (confirm("Are you sure you want to delete this user?")) {
    UserService.DeleteUser(email).then(_ => loadUserCards());
  }  
}