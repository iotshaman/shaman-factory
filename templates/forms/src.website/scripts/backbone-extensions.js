Backbone.View.prototype.dispose = function() {
  this.undelegateEvents();
  this.unbind()
}