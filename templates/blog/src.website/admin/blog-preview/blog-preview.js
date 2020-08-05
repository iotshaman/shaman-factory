const BlogPreviewModel = Backbone.Model.extend({});
const BlogPreviewView = Backbone.View.extend({
  el: '#preview_container',
  initialize: function() { this.render(); },
  render: function() {
    this.$el.html('');
    $(this.$el).append(`<h1>${this.model.get('title')}</h1>`);
    $(this.$el).append(this.model.get('html'));
  }
});

$(document).ready(function() {
  var params = getQueryParams();
  if (!params.name) {
    alert('Blog name not provided.');
    return;
  }
  BlogService.GetBlog(params.name).then(blog => {
    let model = new BlogPreviewModel(blog);
    new BlogPreviewView({model});
  });
});