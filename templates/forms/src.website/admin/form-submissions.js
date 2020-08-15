$(document).ready(function() {
  loadSubmissionTable();
  $('#formSubmissionModal').on('hidden.bs.modal', _ => {
    loadSubmissionTable();
  });
});

function loadSubmissionTable() {
  FormService.GetAllFormSubmissions().then(submissions => {
    let models = submissions.map(submission => new SubmissionModel(submission));
    let collection = new SubmissionCollection(models);
    formSubmissionTable = new SubmissionTableView({collection: collection});
  });
}

let formSubmissionTable;
const SubmissionModel = Backbone.Model.extend({});
const SubmissionCollection = Backbone.Collection.extend({ model: SubmissionModel });
const SubmissionTableView = Backbone.View.extend({
  el: 'table',
  events: {
    'click tbody tr': 'onClickViewSubmission'
  },
  formSubmissionView: null,
  initialize: function() {
    this.reload = (model) => { 
      if (this.formSubmissionView) this.formSubmissionView.dispose();
      this.collection.set(model);
    }
    this.collection.on('change', this.render, this);
    this.render();
  },
  render: function() {
    var template = _.template($('#table-row').html());
    let body = $("tbody", this.$el);
    body.html('');
    $(this.collection.models).each((_, model) => {
      body.append(template(model.attributes))
    });
  },
  onClickViewSubmission: function(e) {
    var uuid = $(e.currentTarget).attr('data-uuid');
    FormService.GetFormSubmission(uuid).then(submission => {
      let model = new SubmissionModel(submission);
      if (this.formSubmissionView) this.formSubmissionView.dispose();
      this.formSubmissionView = new FormSubmissionView({model});
    });
  }
});

const FormSubmissionView = Backbone.View.extend({
  el: '#formSubmissionModal',
  initialize: function() {
    $(this.$el).modal('show');
    this.render();
  },
  render: function() {
    let values = this.model.get('values');
    var template = _.template($('#form-input').html());
    let body = $(".modal-body", this.$el);
    body.html('');
    $(values).each((_, value) => {
      body.append(template(value));
    });
  }
});