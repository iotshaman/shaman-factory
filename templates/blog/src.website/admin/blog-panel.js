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
  loadBlogCards();
});

function loadBlogCards() {
  BlogService.GetAllBlogs().then(blogs => {
    let blogModels = blogs.map(blog => new BlogModel(blog));
    let collection = new BlogCollection(blogModels);
    new BlogPanelView({collection: collection});
  });
}

function createBlog() {
  let title = $('input[name="blog-name"]').val();
  if (!title) {
    alert('Please provide a title.');
    return;
  }
  BlogService.AddBlog(title)
    .then(rslt => location.href=`/admin/edit-blog/edit-blog.html?name=${rslt.filename}`)
}

function deleteBlog(filename) {
  if (confirm("Are you sure you want to delete this blog?")) {
    BlogService.DeleteBlog(filename).then(_ => loadBlogCards());
  }  
}