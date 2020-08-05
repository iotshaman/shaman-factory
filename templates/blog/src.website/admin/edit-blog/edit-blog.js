const BlogModel = Backbone.Model.extend({});
const BlogView = Backbone.View.extend({
  el: '#blog',
  events: {
    'input': 'onInput',
    'click #btnExit': 'exit',
    'click #btnSave': 'save',
    'click #btnPreview': 'preview'
  },
  initialize: function() {
    this.model.on('change', this.render, this);
  },
  render: function() {
    $('input[name="title"]').val(this.model.get('title'));
    $('input[name="description"]').val(this.model.get('description'));
    $('input[name="author"]').val(this.model.get('author'));
    $('input[name="image"]').val(this.model.get('image'));
    $('textarea[name="text"]').val(this.model.get('text'));
  },
  onInput: function(e) {
    const name = $(e.target).attr('name');
    const val = $(e.target).val();
    this.model.set({[name]: val}, {silent: true});
  },
  exit: function(e) {
    location.href = '/admin/blog-panel.html';
  },
  save: function(e) {
    var model = this.model.toJSON();
    BlogService.UpdateBlog(model).then(rslt => {
      this.model.set(rslt);
      alert('Blog successfuly updated!');
    });
  },
  preview: function(e) {
    let filename = this.model.get('filename');
    let previewUrl = `/admin/blog-preview/blog-preview.html?name=${filename}`;
    window.open(previewUrl, true);
  }
});

$(document).ready(function() {
  let model = new BlogModel();
  new BlogView({model});
  BlogService.GetBlog($('#filename').val()).then(blog => {
    model.set(blog);
  });
});