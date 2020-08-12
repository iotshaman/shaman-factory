let formView;
$(document).ready(function() {
  let params = getQueryParams();
  if (!params.name) {
    alert('Form name not provided.');
    return;
  }
  $('#form_name').val(params.name);
  FormService.GetForm(params.name).then(form => {
    formView = new FormView({model: new FormModel(form)})
  });
});

const FormModel = Backbone.Model.extend({});
const FormView = Backbone.View.extend({
  el: '#form',
  events: {
    'click #btnExit': 'exit',
    'click #btnAddFormInput': 'onClickAddFormInput',
    'click .form-input': 'onClickEditFormInput'
  },
  initialize: function() {
    this.reload = (model) => { 
      if (this.addFormInputView) this.addFormInputView.dispose();
      this.model.set(model);
    }
    this.model.on('change', this.render, this);
    this.render();
  },
  render: function() {
    $('#display_name').html(this.model.get('name'));
    let inputTemplate = _.template($('#form-input').html());
    let selectTemplate = _.template($('#form-select').html());
    let panel = $('.panel-body .row', this.$el);
    panel.html('');
    $(this.model.get('inputs')).each((_,model) => {
      let size = 'col-md-6';
      if (model.size == 'sm') size = 'col-md-3';
      else if (model.size == 'xl') size = 'col-12';
      model['sizeClass'] = size;
      let template;
      if (model.type == 'input') template = $(inputTemplate(model));
      else template = $(selectTemplate(model));
      panel.append(template);
    });
  },
  exit: function() {
    location.href = '/admin/form-panel.html';
  },
  addFormInputView: null,
  onClickAddFormInput: function() {
    let model = new AddFormInputModel({
      uuid: '',
      label: '',
      size: 'lg',
      type: 'input',
      options: []
    });
    if (this.addFormInputView) this.addFormInputView.dispose();
    this.addFormInputView = new AddFormInputView({model});
  },
  onClickEditFormInput: function(e) {
    let uuid = $(e.currentTarget).attr('data-uuid');
    let inputs = this.model.get('inputs');
    let input = inputs.find(i => i.uuid == uuid);
    let model = new AddFormInputModel({
      uuid: input.uuid,
      label: input.label,
      size: input.size,
      type: input.type,
      options: input.options
    });
    if (this.addFormInputView) this.addFormInputView.dispose();
    this.addFormInputView = new AddFormInputView({model});
  }
});

const AddFormInputModel = Backbone.Model.extend({});
const AddFormInputView = Backbone.View.extend({
  el: '#addFormInputModal',
  events: {
    'input input': 'onInput',
    'change': 'onInput',
    'click .btn-primary': 'saveChanges',
    'click .btn-outline-secondary': 'addSelectOption',
    'click .btn-danger': 'deleteInput'
  }, 
  initialize: function() {
    $('#add_option_list').html('');
    $('#addFormInputModal').modal('show');
    if (this.model.get('uuid')) $('.btn-danger', this.$el).show();
    else $('.btn-danger', this.$el).hide();
    this.render();
  },
  render: function() {
    $('input[name="label"]').val(this.model.get('label'));
    $('select[name="size"]').val(this.model.get('size'));
    let type = this.model.get('type');
    $('select[name="type"]').val(type);
    type == 'input' ? $('#select_options').hide() : $('#select_options').show();
    let options = this.model.get('options');
    options.forEach(option => this._updateOptionList(option));
  },
  onInput: function(e) {
    const name = $(e.target).attr('name');
    const val = $(e.target).val();
    this.model.set({[name]: val}, {silent: true});
    if (name != 'type') return;
    $('#select_options').toggle();
  },
  addSelectOption: function() {
    let options = this.model.get('options');
    let val = $('input[name="add-option"]').val();
    this.model.set({options: options.concat(val)}, {silent: true});
    $('input[name="add-option"]').val('');
    this._updateOptionList(val);
  },
  _updateOptionList(val) {
    let elem = `<input type="text" class="form-control fw mb-3" value="${val}" disabled />`
    $('#add_option_list').append(elem);
  },
  saveChanges: function() {
    let uuid = this.model.get('uuid');
    !uuid ? this.addFormInput() : this.editFormInput()
  },
  addFormInput: function() {
    let name = $('#form_name').val();
    let model = this.model.toJSON();
    model.uuid = uuidv4();
    FormService.GetForm(name)
      .then(form => {
        form.inputs.push(model);
        return FormService.UpdateForm(form);
      })
      .then(form => formView.reload(form))
      .then(_ => $('#addFormInputModal').modal('hide'))
  },
  editFormInput: function() {
    let name = $('#form_name').val();
    let model = this.model.toJSON();
    FormService.GetForm(name)
      .then(form => {
        let index = form.inputs.findIndex(i => i.uuid == model.uuid)
        form.inputs[index] = model;
        return FormService.UpdateForm(form);
      })
      .then(form => formView.reload(form))
      .then(_ => $('#addFormInputModal').modal('hide'))
  },
  deleteInput: function() {
    if (confirm('Are you sure you want to delete this input?')) {
      let name = $('#form_name').val();
      let model = this.model.toJSON();
      FormService.GetForm(name)
        .then(form => {
          form.inputs = form.inputs.filter(i => i.uuid != model.uuid);
          return FormService.UpdateForm(form);
        })
        .then(form => formView.reload(form))
        .then(_ => $('#addFormInputModal').modal('hide'))
    }
  }
});