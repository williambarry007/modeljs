/*
Class: Model.Form
Author: William Barry (william@nine.is)
Description: Abstract form class to encapsulate add and edit forms for models.
*/

Model.Form = Class.extend({
    
  class_name: 'Model.Form',
  model: false,
  message: false, 
  adding_message: null,
  deleting_message: null,
  delete_message: null,
  
  // Listing info
  listing_models: false,
  
  init: function(model, params) 
  {
    this.model = model;    
    if (params)
      for (var thing in params)
	  	  this[thing] = params[thing];
	  
	  if (!this.message         ) this.message = model.name + '_message';
    if (!this.adding_message  ) this.adding_message   = 'Adding ' + this.model.name + '...';
    if (!this.deleting_message) this.deleting_message = 'Deleting ' + this.model.name + '...';
    if (!this.delete_message  ) this.delete_message   = "Are you sure you want to delete the " + this.model.name + "?  This can't be undone.";
  },

  // Returns the form for adding the model or false for an embedded form.
  add: function() 
  {
    var m = this.model;
    var tbody = $('<tbody/>');
    $(m.attributes).each(function(i, a) {
      if (a.type == 'hidden')
        return;
      tbody.append($('<tr/>')
        .append($('<td/>').css('vertical-align', 'top').html(a.nice_name + ':'))
        .append($('<td/>').css('vertical-align', 'top').attr('id', m.name + '_' + m.id + '_' + a.name + '_container')
          .append(a.form().children())
        )
      );
    });
    var form = $('<form/>')
      .attr('id', 'new_' + m.name + '_form')
      .submit(function() { return false; })
      .append($('<table/>').append(tbody))
      .append($('<div/>').attr('id', this.message_div))
      .append($('<p/>')
        .append($('<input/>').attr('type', 'button').val('Back').click(function() {
          obj = Model.parse_url(m.listing_url);
          window.location = obj.url; 
        }))
        .append(' ')
        .append($('<input/>').attr('type', 'submit').val('Add ' + m.name).click(function() { m.ajax_add(); }))        
      );
    return form;
  },
  
  // Runs after the add form has been displayed
  post_add_display: function() {},
  
  // Returns the form for editing a model or false for an embedded form.
  edit: function() 
  {
    var m = this.model;
    
    var this2 = this;
    var tbody = $('<tbody/>');
    $(m.attributes).each(function(i, a) {
      if (a.type == 'hidden')
        return;
      tbody.append($('<tr/>')
        .append($('<td/>').css('vertical-align', 'top').html(a.nice_name + ':'))
        .append($('<td/>').css('vertical-align', 'top').attr('id', m.name + '_' + m.id + '_' + a.name + '_container'))
      );
    });
    
    var div = $('<div/>')
      .append($('<table/>').append(tbody))
      .append($('<div/>').attr('id', this.message));
    var p = $('<p/>')
    var back = $('<input/>')
      .attr('type', 'button')
      .val('Back')
      .click(m.back_button_click ? m.back_button_click : function() { window.location = Model.parse_url(m.listing_url).url; });
    p.append(back).append(' ');
    if (m.show_delete_button)
      p.append($('<input/>').attr('type', 'button').val('Delete ' + m.name).click(function() { m.ajax_delete(); }));
    div.append(p);
    return div;
  },
  
  // Runs after the edit form has been displayed
  post_edit_display: function() {},
  
  listing_view: function()
  {
    var tr = $('<tr/>');
    var m = this.model;
    $(this.model.attributes).each(function(i, a) {
      if (a.type == 'hidden') return;
      tr.append(
        $('<td/>')
          .attr('id', m.name + '_' + m.id + '_' + a.name + '_container')
          .append(a.view())
      );
    });
    return tr;    
  },
  
  post_listing_view_display: function() {},
  
  // Returns a listing table of models or false for an embedded listing
  listing_form: function() 
  {
    var m = this.model;
    var count = m.unhidden_attribute_count();
    var tr = $('<tr/>').attr('id', m.name + '_' + m.id + '_listing_container');
    $(this.model.attributes).each(function(i, a) {
      if (a.type == 'hidden')
        return;
      var c = '';
      if (i == 0)             c = 'edit_listing_first_cell';
      else if (i == count-1)  c = 'edit_listing_last_cell';
      else                    c = 'edit_listing_cell';
      
      tr.append($('<td/>')
        .css('vertical-align', 'top')
        .addClass(c)
        .attr('id', m.name + '_' + m.id + '_' + a.name + '_container')
      );
    });    
    return tr;
  },
   
  // Runs after the listing has been displayed
  post_listing_form_display: function() {},
  
  listing_view: function() 
  {
    var m = this.model;
    var tr = $('<tr/>').attr('id', m.name + '_' + m.id + '_listing_container');
    $(this.model.attributes).each(function(i, a) {
      if (a.type == 'hidden')
        return;
      tr.append($('<td/>').css('vertical-align', 'top').attr('id', m.name + '_' + m.id + '_' + a.name + '_container'));
    });
    return tr;
  },
  
  post_listing_view_display: function() {},
  
  // Gets the latest rows for the listing
  refresh_listing_models: function(done)
  {
    var this2 = this;
    var obj = Model.parse_url(this.model.listing_url);
    $.ajax({
      url: obj.url,
      type: obj.verb,
      success: function(models) {
        this2.refresh_listing_models_helper(models);
        done();
      },
      error: function() {
        this2.ajax_error('Error');
      }
    });
  },
  
  refresh_listing_models_helper: function(models)
  { 
    var this2 = this; 
    this.listing_models = [];
    $(models).each(function(i, m) {
        
      var attribs = [];
      $(m.attributes).each(function(i, a) {
        
        // Find the original attribute with the same name
        var attrib = false;
        $(this2.model.attributes_original).each(function(j, a2) {
          if (a2.name == a.name)
          {
            attrib = $.extend(true, {}, a2);
            return false;
          }
        });
        
        // Copy new data into the original attribute hash
        for (var thing in a)
          attrib[thing] = a[thing];
        attrib.base = this2.model.name + '_' + m.id + '_' + attrib.name;

        attribs.push(attrib);
      });        
      var params = {
        name:               this2.model.name,
        id:                 m.id,
        form:               this2.class_name,
        attributes:         attribs,
        create_url:         this2.model.create_url,
        update_url:         this2.model.update_url,
        delete_url:         this2.model.delete_url,
        listing_url:        this2.model.listing_url,
        listing_edit:       this2.model.listing_edit,
        listing_delete:     this2.model.listing_delete, 
        listing_empty_text: this2.model.listing_empty_text,
        is_listing:         true
      };
      var m2 = new Model(params); 
      this2.listing_models.push(m2);
    });
  },
  
  // Returns the values of the add form that will be sent to model.ajax_add 
  add_values: function()
  {
    var m = this.model;
    var data = {}; 
    $(m.attributes).each(function(i, a) {
      data[a.name] = a.form_value();
    });
    return data;
  },

  // Show a confirmation screen
  confirm: function(params)
  {
    var this2 = this;
    $('#' + this.message).empty()    
      .append($('<div/>')
        .addClass('note2 error')
        .append($('<p/>').append(params.message))
        .append($('<p/>')
          .append($('<input />').attr('type', 'button').val('Yes').click(params.yes))
          .append(" ")
          .append($('<input />').attr('type', 'button').val('No').click(function() { $('#' + this2.message).empty(); }))
        )
      );
  },
  
  ajax_success: function(resp)
  {
    if (resp.text)            $('#' + this.message).empty().append($('<p/>').addClass('note'        ).html(resp.text));
    else if (resp.success)    $('#' + this.message).empty().append($('<p/>').addClass('note success').html(resp.success));
    else if (resp.error)		  $('#' + this.message).empty().append($('<p/>').addClass('note error'  ).html(resp.error));
    else if (resp.flash)      $('#' + this.message).empty().append($('<p/>').html(resp.flash).delay(2000).fadeOut().delay(2000).queue(function() { $(this).remove(); }));
    else if (resp.redirect)   window.location = resp.redirect;
    else                      $('#' + this.message).empty();
  },

  ajax_error: function(str) { this.error(str); },

  // Notes
  loading: function(str) { this.show_message('loading'      , str); },
  note:    function(str) { this.show_message('note'         , str); },
  success: function(str) { this.show_message('note success' , str); },
  error:   function(str) { this.show_message('note error'   , str); },
  show_message: function(class_names, str) { $('#' + this.message).empty().append($('<p/>').addClass(class_names).html(str)); }
});
