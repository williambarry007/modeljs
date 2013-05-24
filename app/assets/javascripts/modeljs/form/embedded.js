/*
Class: Model.Form
Author: William Barry (william@nine.is)
Description: Abstract form class to encapsulate add and edit forms for models.
*/

Model.Form.Embedded = Class.extend({

  add: function() { return false; },   
  edit: function() { return false; },
  listing: function() { return false; }, 
  
});
