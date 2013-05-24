
Model.Attribute.Radio = Model.Attribute.extend({
 
  text: '',
  show_controls: true,
  
  needs_options: function()
	{
	  return true;	  
	},
  
  view: function()
  {
    html = this.text && this.text.length > 0 ? this.text : this.empty_text;
  	return $('<a/>')
  		.attr('title', 'Click to edit')
  		.attr('href', 'javascript:{};')
  		.addClass('model_attribute_text')
  		.html(html);
  },
  
  form: function()
  {
    var tbody = $('<tbody/>');
    var this2 = this;
    var options = Model.get_attribute_options(this.model.name, this.name);
		$.each(options, function(i, option) {
			tbody.append($('<tr/>')
				.append($('<td/>')
					.append($('<input/>')
						.attr('name', this2.base)
						.attr('id', this2.base + '_' + i)
						.attr('type', 'radio')
						.val(option.value)
				))
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
    value = '';
		$('#' + this.base + '_form input:radio').each(function(i, r) {
		  if (r.checked)
		  {
		    value = r.val();
				return false;
			}
		});
		return value;
		/* Note: if for some reason a value is not selected, value becomes empty. */ 
  }
  
});
