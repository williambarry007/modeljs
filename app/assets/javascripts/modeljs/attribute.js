
Model.Attribute = Class.extend({
  name: '',
  nice_name: '',
  value: '',	
  model: false,
  base: '', // model.name + '_' + model.id + '_' + attribute.name
  type: false,
  container: false,
  controls: false,
  show_controls: false,
  message: false,
  empty_text: '',
  update_url: false, // If this attribute has a special update URL
  custom_form: false, // If the attribute needs a custom form (used in file and image)
  css: false, 
  
  init: function(params)
  {
    for (var thing in params)
      this[thing] = params[thing];     
    this.set_base(this.base);
    if (!this.nice_name)  this.nice_name  = this.name.replace('_', ' ').capitalize();
  },
  
  set_base: function(base)
  {
    this.base = base;
    if (!this.container)  this.container 	= this.base + '_container';
    if (!this.controls)   this.controls 	= this.base + '_controls';
    if (!this.message)    this.message    = this.base + '_message';
  },
			
  // Whether or not the attribute needs to go get options via ajax
  needs_options: function() { return false; },
	
  // Returns the viewable representation of the attribute.
  view: function() { return false; },
  
  // Returns a form  without update or cancel buttons (Assumes options already populated)
  form: function() { return false; },
  
  // Returns the current value in the visible form.
  form_value: function() { return $('#' + this.base).val(); },
  
  // Returns the values form the form that will be sent to ajax_update
  form_values: function() {
    var vals = {};
    vals[this.name] = this.form_value();
    return vals;
  },
   
  // Runs after the view or form is displayed on the screen.
  post_view_display: function() {},
  post_form_display: function() { $('#' + this.base).focus(); },
  
  // Notes
  loading: function(str) { this.show_message('loading_small', str); },
  note:    function(str) { this.show_message('note_small'         , str); },
  success: function(str) { this.show_message('note_small success' , str); },
  error:   function(str) { this.show_message('note_small error'   , str); },
  show_message: function(class_names, str) { 
    $('#' + this.message).empty().removeClass('loading_small');
    $('#' + this.message).addClass(class_names).html(str); 
  },
  
  // If the attribute needs to handle any finished uploads
  upload_finished: function(e, data) {}
});
