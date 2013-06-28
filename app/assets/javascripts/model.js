
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

var all_models = [];

var Model = function(params) {
  this.init(params);
  all_models.push(this);
};

Model.attribute_options = {};

Model.get_attribute_options = function(model_name, attribute_name)
{
  if (Model.attribute_options[model_name] == null) return false;
  if (Model.attribute_options[model_name][attribute_name] == null) return false;
  return Model.attribute_options[model_name][attribute_name];
};

Model.set_attribute_options = function(model_name, attribute_name, options)
{
  if (Model.attribute_options[model_name] == null)
    Model.attribute_options[model_name] = {};
  Model.attribute_options[model_name][attribute_name] = options;
};

Model.upload_finished = function(resp)
{
  $(all_models).each(function (i, m) {
    if (m.name == resp.name && m.id == resp.id) {
      $(m.attributes).each(function(j, attrib) {
        if (attrib.name == resp.attribute_name) {
          attrib.upload_finished(resp);
          return false;
        }
      });
      return false;
    }
  });
};

Model.dashed_to_camel_case = function(str) {
  var arr = []; 
  $.each(str.toLowerCase().split('-'), function(i, word) {
    arr[arr.length] = word.capitalize();
  });
  return arr.join('');
};

Model.parse_url = function(str, id)
{
  if (id)
    str = str.replace("{id}", id);
  arr = str.split(' ')
  if (arr.length == 1)
    return { verb: 'get', url: arr[0] };  
  return { verb: arr[0], url: arr[1] };
};
  
Model.prototype = {
  
  id: '',
  name: '',
  attributes: [],
  attributes_original: false,
  ca: false, // current attribute being edited
  container: false,
  form: 'Model.Form', // Name of the class that generates add/edit forms for the model
  back_button_click: false, // Click handler for the back button
  show_delete_button: true, // Whether or not we should show the delete button on the main model
  show_back_button: true, // Whether or not we should show the back button on the main model
  finished_loading: false, // When the model finishes loading initially
  
  // Urls of CRUD events
  create_url: false,
  update_url: false,
  delete_url: false,
  listing_url: false,
  
  // After ajax events
  post_add: function() {},
  post_update: function() {},
  post_delete: function() {},
  
  // Listings
  listing_edit: false,    // Should we allow edits?   true, false, or 'inline'
  listing_delete: false,  // Should we allow deletes? true, false, or 'inline' 
  listing_empty_text: false,
  is_listing: false,
  cl: false, // current listing
  
  init: function(params)
  {
    var this2 = this;
    
    for (var thing in params)
	  	this[thing] = params[thing];
    
    // Set some defaults
    this.name = this.name.toLowerCase();
    if (!this.create_url        ) this.create_url = 'post /'   + this.name + 's';
    if (!this.update_url        ) this.update_url = 'put /'    + this.name + 's/{id}';
    if (!this.delete_url        ) this.delete_url = 'delete /' + this.name + 's/{id}';
    if (!this.container         ) this.container = this.name.toLowerCase() + '_' + this.id + '_container';
    if (!this.listing_empty_text) this.listing_empty_text = "There are no " + this.name + "s yet.";
    
    // Create the model form generator
    if (typeof(this.form) == 'string')
      eval("this.form = new " + this.form + "(this" + (params.form_params ? ", params.form_params": "") + ");");
    
    // Attach the model to the dom
    var this2 = this; 
    $('input.' + this.name + '_add').click(function() { this2.ajax_add(); });
    $('input.' + this.name + '_' + this.id + '_delete').click(function() { this2.ajax_delete(); });
    
    // Create any attributes
    this.attributes_original = this.attributes;
    this.attributes = [];
    $(this.attributes_original).each(function(i, attrib) {
      attrib.base = this2.name + '_' + this2.id + '_' + attrib.name;
      eval("var a = new Model.Attribute." + Model.dashed_to_camel_case(attrib.type) + "(attrib);");
      a.model = this2;
      this2.attributes[this2.attributes.length] = a;
    });
    
    if      (!this.is_listing && $('#' + this.name + '_listing_container').length && this.listing_url)  this.listing();
    if      ($('#' + this.name + '_new_container').length)                          this.add_form();
    else if ($('#' + this.name + '_' + this.id + '_container').length)              this.edit_form();

    if (this.finished_loading)
      this.finished_loading();
  },
  
  listing: function()
  {
    var this2 = this;
    this.verify_attribute_options(function() {
      this2.listing_helper();
    }); 
  },
  
  listing_helper: function()
  {
    var this2 = this;
    this.form.refresh_listing_models(function() {
      this2.listing_helper2();
    });
  },
  
  listing_helper2: function()
  {
    var this2 = this;
    if (this2.form.listing_models.length == 0)
    {
      $('#' + this2.name + '_listing_container')
        .empty().append($('<p/>').html(this.listing_empty_text));
      return;
    }
      
    var table = $('<table/>').addClass('data');
    var tbody = $('<tbody/>');
    var tr = $('<tr/>');
    $(this2.attributes).each(function(i, a) {
      if (a.type == 'hidden') return;
      tr.append($('<th/>').html(a.nice_name));
    });
    tbody.append(tr);
    
    $(this2.form.listing_models).each(function(i, m) {
      var tr = m.form.listing_view();
      tr.attr('id', m.name + '_' + m.id + '_listing_container')
        .addClass('model_listing');
      tbody.append(tr);
    });
    table.append(tbody);
    $('#' + this2.name + '_listing_container').empty().append(table);
    
    // Show each attribute
    $(this2.form.listing_models).each(function(i, m) {
      $(m.attributes).each(function(j, a) { 
        if (a.type == 'hidden') return;
        m.show_attribute(a);
        $('#' + a.container).children().unbind('click');
        $('#' + a.container).click(function() { m.edit_listing(); });
      });
    });
  },
  
  add_form: function()
  {
    // Make sure all the attribute options are populated first
    var this2 = this;    
    this.verify_attribute_options(function() {
        
      // Then add the form to the DOM
      var div = this2.form.add();
      if (div)
      {
        div.attr('id', this2.name + '_new_form');
        div.submit(function() { return false; });
        $('#' + this2.container).append(div);
      }
      
      // Then make each attribute editable
      $(this2.attributes).each(function(i, a) {
        if (a.type != 'hidden')
          this2.edit_attribute_helper(a); 
      });
      
      // Finally run any post add functionality
      this2.form.post_add_display();
    });
  },
  
  edit_form: function()
  { 
    // Add the form to the DOM
    var div = this.form.edit();
    if (div)
    {
      div.attr('id', this.container);
      $('#' + this.container).replaceWith(div);
    }
    
    // Show each attribute
    var this2 = this;
    $(this.attributes).each(function(i, a) { this2.show_attribute(a); });
    
    // Set the escape key to cancel the edit
    $(document).keyup(function(e) {
      if (e.keyCode == 27 && this2.ca)
        this2.show_attribute(this2.ca);
    });
    
    // Finally run any post edit functionality
    this.form.post_edit_display();
  },
  
  edit_listing: function()
  {
    var this2 = this;
    var tr = this.form.listing_form();
    tr.attr('id', this.name + '_' + this.id + '_listing_container')
      .addClass('edit_listing_form')
    $('#' + this.name + '_' + this.id + '_listing_container').replaceWith(tr);
    
    // Add our controls
    var count = this.unhidden_attribute_count();
    controls = $('<tr/>')
      .attr('id', this.name + '_' + this.id + '_listing_controls')
      .addClass('edit_listing_controls')
      .append($('<td/>')
        .attr('colspan', count)
        .append($('<div/>').attr('id', this.form.message))
        .append($('<p/>')
          .append($('<input/>').attr('type', 'button').val('Cancel').click(function() { this2.cancel_edit_listing(); }))
          .append(' ')
          .append($('<input/>').attr('type', 'button').val('Update').click(function() { this2.update_listing(); }))
          .append(' ')
          .append($('<input/>').attr('type', 'button').val('Delete').click(function() {
            this2.post_delete = function() { this2.listing(); };
            this2.ajax_delete(); 
          }))
        )
      );
    $('#' + this.name + '_' + this.id + '_listing_container').after(controls);

    // Then make each attribute editable    
    $(this.attributes).each(function(i, a) {
      if (a.type != 'hidden')
        this2.edit_attribute_helper(a); 
    });      
      
    // Finally run any post functionality
    this.form.post_listing_form_display();
  },
  
  cancel_edit_listing: function()
  {
    var this2 = this;
    var tr = this.form.listing_view();
    tr.attr('id', this.name + '_' + this.id + '_listing_container')
      .addClass('model_listing');
    $('#' + this.name + '_' + this.id + '_listing_container').replaceWith(tr);
    $('#' + this.name + '_' + this.id + '_listing_controls').remove();
 
    // Show each attribute
    $(this.attributes).each(function(i, a) { 
      if (a.type == 'hidden') return;
      this2.show_attribute(a);
      $('#' + a.container).children().unbind('click');
      $('#' + a.container).click(function() { this2.edit_listing(); });
    });
      
    // Finally run any post functionality
    this.form.post_listing_view_display();
  },
  
  update_listing: function()
  {
    this.form.loading('Updating...');
    this2 = this;    
    obj = Model.parse_url(this.update_url, this.id)
    $.ajax({
      url: obj.url,
      type: obj.verb,
      data: this2.form.add_values(),
      success: function(resp) {
        if (resp.error)
          this2.form.ajax_success(resp);
        else
        {
          $(this2.attributes).each(function(i, a) {
            a.value = a.form_value();
            if (resp.attributes && resp.attributes[a.name])
              for (var thing in resp.attributes[a.name])
                a[thing] = resp.attributes[a.name][thing];
				  });
				  this2.cancel_edit_listing();
        }
        //this2.form.post_update_listing();
      },
      error: function() {
        this2.form.ajax_error('Error')
      }
    });
  },
  
  /****************************************************************************/
    
  ajax_add: function()
  {
    this.form.loading(this.form.adding_message);
    this2 = this;    
    obj = Model.parse_url(this.create_url, this.id)
    $.ajax({
      url: obj.url,
      type: obj.verb,
      data: this2.form.add_values(),
      success: function(resp) {
        this2.form.ajax_success(resp);
        this2.post_add();
      },
      error: function() {
        this2.form.ajax_error('Error')
      }
    });
  },

  ajax_update: function(attrib)
  { 
    if (attrib.show_controls)
      $('#' + attrib.controls).hide();
    
    attrib.loading();
    this2 = this;
    data = attrib.form_values();
    
    for (var thing in data)
      if (data[thing].constructor.name == 'Array' && data[thing].length == 0)
        data[thing] = null;
    
		obj = Model.parse_url(attrib.update_url ? attrib.update_url : this.update_url, this.id);
    $.ajax({
      url: obj.url,
      type: obj.verb,
      data: data,
			success: function(resp) {
			  if (resp.error)
			  {
			    if (attrib.show_controls)
			      $('#' + attrib.controls).show();
				  attrib.error(resp.error);
				}
				if (resp.success)
				{
				  attrib.value = attrib.form_value();
				  if (resp.attributes && resp.attributes[attrib.name])
				  {
				    var a = resp.attributes[attrib.name];
				    for (var thing in a)
				      attrib[thing] = a[thing];
				  }
					this2.show_attribute(attrib);
					this2.post_update();
				}
			},
			error: function() {
			  if (attrib.show_controls)
			    $('#' + attrib.controls).show();
				attrib.error("Error during update.");
			}
		});
  },
  
  ajax_delete: function(confirm)
  {
    if (!confirm)
    {
      var this2 = this;
      this.form.confirm({
        message: this.form.delete_message,
        yes: function() { this2.ajax_delete(true); }
      });
      return;    
    }
    
    this.form.loading(this.form.deleting_message);
    this2 = this;
    obj = Model.parse_url(this.delete_url, this.id)
  	$.ajax({
  	  url: obj.url,
      type: obj.verb,
  		success: function(resp) {
  		  this2.form.ajax_success(resp);
  		  this2.post_delete();
  		},
      error: function() {
        this2.form.ajax_error('Error');
      }
  	}); 
  },
  
  /****************************************************************************/
  
  get_attribute: function(attribute_name)
  {
    var count = this.attributes.length;
    for (var i=0; i<count; i++)
      if (this.attributes[i].name == attribute_name)
        return this.attributes[i];
    return false;
  },
  
  // Populate attribute options
  verify_attribute_options: function(done, i)
  {
    if (i >= this.attributes.length)
    {
      done();
      return;
    }
    if (!i) i = 0;
    var a = this.attributes[i];
    
    if (!a.needs_options() || Model.get_attribute_options(this.name, a.name))
    {
      this.verify_attribute_options(done, i+1);
      return;
    }
    
    var this2 = this;
		$.ajax({
			url: a.options_url,
			success: function(resp) {
			  Model.set_attribute_options(this2.name, a.name, resp);
				this2.verify_attribute_options(done, i+1);
			}
		});
	},
  
  show_attribute: function(attrib)
  {    
    if (typeof(attrib) == 'string')
      attrib = this.get_attribute(attrib);
    
    var this2 = this;
    var div = attrib.view();
    if (!this.is_listing && div.html().length == 0)
      div.html('[Empty]');
    div.addClass('model_attribute model_attribute_' + attrib.type);
    div.click(function() { this2.edit_attribute(attrib.name); });
        
		$('#' + attrib.container).empty().append(div);
		this.ca = false;
		attrib.post_view_display();
  },
  
  edit_attribute: function(attrib)
  {
    if (typeof(attrib) == 'string')
      attrib = this.get_attribute(attrib);
    
    if (this.id != 'new' && this.ca)
      this.show_attribute(this.ca);
    this.ca = attrib;
    
    if (attrib.custom_form)
    {
      var form = attrib.form();
      $('#' + attrib.container).empty().append(form);
      attrib.post_form_display();
      return;
    }
    
    if (!attrib.needs_options() || Model.get_attribute_options(this.name, attrib.name))
    {
      this.edit_attribute_helper(attrib);
      return;
    }
    
    $('#' + attrib.container).empty().append($('<p/>').addClass('loading_small').html(attrib.loading_message));
    
    this2 = this;
		$.ajax({
			url: attrib.options_url,
			success: function(resp) {
			  Model.set_attribute_options(this2.name, attrib.name, resp);
				this2.edit_attribute_helper(attrib);
			}
		});
	},
	
	edit_attribute_helper: function(attrib)
	{
	  var this2 = this;
    var form = attrib.form();
    form.attr('id', attrib.base + '_form')
      .addClass('model_attribute_form model_attribute_form_' + attrib.type)
  		.submit(function () { return false;	});
    
  	if (this.id != 'new')
  	{
      var controls = $('<div/>')
        .attr('id', attrib.controls) 
        .append($('<input/>').attr('type', 'submit').val('Update').addClass('update_btn').click(function() { this2.ajax_update(attrib);    }))
        .append($('<input/>').attr('type', 'button').val('Cancel').addClass('cancel_btn').click(function() { this2.show_attribute(attrib); }));
      form.append(controls);
    }
    form.append($('<span/>').attr('id', attrib.message));
		
    if (this.id == 'new')
      $('#' + attrib.container).empty().append(form.children());
    else
    {
      $('#' + attrib.container).empty().append(form);
      if (!attrib.show_controls)
        $('#' + attrib.controls).hide();
    }    
    attrib.post_form_display();
  },
  
  unhidden_attribute_count: function()
  {
    var count = 0;
    $(this.attributes).each(function(i, a) { 
      if (a.type == 'hidden') return; 
      count++; 
    });
    return count;
  }
 
};
