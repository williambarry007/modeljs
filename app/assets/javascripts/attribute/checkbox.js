
Model.Attribute.Checkbox = Model.Attribute.extend({
 
  show_controls: true,
    
  view: function()
  {
  	return $('<a/>')
  		.attr('title', 'Click to edit')
  		.attr('href', 'javascript:{};')
  		.addClass('model_attribute_text')
  		.html(this.value == 1 ? 'Yes' : 'No');
  },
  
  form: function()
  {
    return $('<form/>')
      .append($('<input/>')
					.attr('id', this.base)
					.attr('name', this.base)
					.attr('type', 'checkbox')
					.val('1')
					.attr('checked', this.value == 1)
			);
  },
  
  form_value: function()
  {
    return $('#' + this.base).is(':checked') ? 1 : 0; 
  }
  
});
