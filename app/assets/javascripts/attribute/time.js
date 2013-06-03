
Model.Attribute.Time = Model.Attribute.extend({
	
  view: function()
  {
  	var html = this.value && this.value.length > 0 ? this.value : this.empty_text;  	
  	return $('<a/>')
  		.attr('title', 'Click to edit')
  		.attr('href', 'javascript:{};')
  		.addClass('model_attribute_text')
  		.html(html);
  },
  
  form: function()
  {
    return $('<form/>')
      .append($('<input/>')
        .attr('type', 'text')
        .attr('id', this.base)
        .attr('name', this.base)
        .val(this.value)
        .addClass('text_box')
      );
  },
  
  post_form_display: function()
  {
    $('#' + this.base).timepicker({ ampm: true }); 
  }
  
});
