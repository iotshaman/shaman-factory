const FormModel = Backbone.Model.extend({});
const FormCollection = Backbone.Collection.extend({ model: FormModel });
const FormPanelView = Backbone.View.extend({
  el: '#forms',
  initialize: function() {
    this.$el.html('');
    var template = _.template($('#form-card').html());
    $(this.collection.models).each((_, model) => {
      this.$el.append(template(model.attributes))
    });
  }
});

$(document).ready(function() {
  loadFormCards();
});

let formPanelView;
function loadFormCards() {
  FormService.GetAllForms().then(forms => {
    let formModels = forms.map(form => new FormModel(form));
    let collection = new FormCollection(formModels);
    formPanelView = new FormPanelView({collection: collection});
  });
}

function createForm() {
  let name = $('input[name="form-name"]').val();
  let desc = $('input[name="form-desc"]').val();
  if (!name) {
    alert('Please provide a name for the form.');
    return;
  }
  $('#addFormModal').modal('hide');
  FormService.AddForm(name, desc)
    .then(rslt => location.href=`/admin/forms/edit-form.html?name=${rslt.name}`);
}

function deleteForm(name) {
  if (confirm('Are you sure you want to delete this form?')) {
    
  }
}