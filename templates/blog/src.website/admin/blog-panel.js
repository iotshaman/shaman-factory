const BlogModel = Backbone.Model.extend({});
const BlogCollection = Backbone.Collection.extend({ model: BlogModel });
const BlogPanelView = Backbone.View.extend({
  el: '#blogs',
  initialize: function() {
    this.$el.html('');
    var template = _.template($('#blog-card').html());
    $(this.collection.models).each((_, model) => {
      this.$el.append(template(model.attributes))
    });
  }
});

$(document).ready(function() {
  BlogService.GetAllBlogs().then(blogs => {
    let blogModels = blogs.map(blog => new BlogModel(blog));
    let collection = new BlogCollection(blogModels);
    new BlogPanelView({collection: collection});
  });
});