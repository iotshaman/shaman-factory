const BlogModel = Backbone.Model.extend({});
const BlogView = Backbone.View.extend({
  el: '#blog',
  events: {
    'input': 'onInput',
    'click #btnExit': 'exit',
    'click #btnSave': 'save',
    'click #btnPreview': 'preview',
    'change #sl_status': 'onChangeStatus'
  },
  initialize: function() {
    this.model.on('change', this.render, this);
  },
  render: function() {
    let published = this.model.get('published');
    $('#blog_title').html(this.model.get('title'));
    $('input[name="title"]').val(this.model.get('title'));
    $('input[name="description"]').val(this.model.get('description'));
    $('select[name="status"]').val(published ? 'true' : 'false');
    $('input[name="image"]').val(this.model.get('image'));
    $('input[name="tags"]').val(this.model.get('tags'));
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
  },
  onChangeStatus: function(e) {
    var val = $('select[name="status"]').val();
    let published = val == 'true' ? true : false;
    this.model.set({published}, {silent: true});
  }
});

$(document).ready(function() {
  let model = new BlogModel();
  new BlogView({model});

  var params = getQueryParams();
  if (!params.name) {
    alert('Blog name not provided.');
    return;
  }
  BlogService.GetBlog(params.name).then(blog => {
    model.set(blog);
  });
});