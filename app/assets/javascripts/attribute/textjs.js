
Model.Attribute.Text = Model.Attribute.extend({
    
  show_reminder: true,
	
  view: function()
  {
    var html = false;
    if (typeof(this.value) == 'string')
      html = this.value && this.value.length > 0 ? this.value : this.empty_text;
    else if (typeof(this.value) == 'number')
      html = this.value != null ? this.value : this.empty_text;
    else
      html = this.value;
    
  	//return $('<a/>')
  	//	.attr('title', 'Click to edit')
  	//	.attr('href', 'javascript:{};')
  	//	.html(html);
  	return $('<div/>')
  		.html(html);
  },
  
  form: function()
  {
    var this2 = this;
    var input = $('<input/>')
  		.attr('type', 'text')
  		.attr('id', this.base)
  		.attr('name', this.base)
  		.val(this.value);
  	if (this.show_reminder)
  		input.keyup(function (){ this2.flash_reminder(); })
  	if (this.css)
  	  input.css(this.css);
  	var form = $('<form/>').append(input);
  	if (this.show_reminder)
  	  form.append($('<span/>').attr('id', this.base + '_reminder').css('font-size', '75%'));

  	return form;
  },
  
  flash_reminder: function()
  {
    $('#' + this.base + '_reminder')
      .html(' (Enter to update, Escape to cancel)')
      .delay(1000)
      .fadeOut({ done: function() { $(this).empty().show(); }});
  },
  
  post_form_display: function()
  {
    // Put the focus at the end of the string
    $('#' + this.base).focus();
    val = $('#' + this.base).val();
    $('#' + this.base).val('');
    $('#' + this.base).val(val);
    
    if (this.show_reminder)
      this.flash_reminder();   
  }
  
});
