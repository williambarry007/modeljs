
Model.Attribute.CheckboxMultiple = Model.Attribute.extend({

  text: '',
  show_controls: true,

  needs_options: function()
	{
	  return true;	  
	},
	
	view: function()
  {
    var html = this.text && this.text.length > 0 ? this.text : this.empty_text;
  	return $('<a/>')
  		.attr('title', 'Click to edit')
  		.attr('href', 'javascript:{};')
  		.html(html);
  },
  
  form: function()
  {
    var tbody = $('<tbody/>');
    var this2 = this;
    var options = Model.get_attribute_options(this.model.name, this.name);    
		$.each(options, function(i, option) {
		  var cb = $('<input/>')
			  .attr('name', this2.base)
			  .attr('id', this2.base + '_' + i)
			  .attr('type', 'checkbox')
			  .val(option.value);
			if (this2.in_value(option.value))
			  cb.attr('checked', true);
		  
			tbody.append($('<tr/>')
				.append($('<td/>').append(cb))
				.append($('<td/>')
				  .append($('<label/>')
				    .attr('for', this2.base + '_' + i)
				    .html(option.text)
				))
			);
		});
		return $('<form/>').append($('<table/>').append(tbody));
  },
  
  form_value: function()
  {
		val = [];
		$('#' + this.container + ' input[type=checkbox]:checked').each(function(i, checkbox) {
			val[val.length] = $(checkbox).val();
		});
		return val;
  },
  
  in_value: function(val)
  {
    var count = this.value.count;
    for (var v in this.value)
      if (val == this.value[v])
        return true;
    return false;
  },
  
  needs_options: function()
	{
	  if (!this.options) 
	    return true;
	  return false;
	}
   
});
