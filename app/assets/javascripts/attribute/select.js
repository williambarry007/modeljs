
Model.Attribute.Select = Model.Attribute.extend({

  text: '',
  multiple: false,

  needs_options: function()
	{
	  return true;	  
	},
	
	view: function()
  {
    var html = this.text && this.text.length > 0 ? this.text : this.empty_text;
  	//return $('<a/>')
  	//	.attr('title', 'Click to edit')
  	//	.attr('href', 'javascript:{};')
  	//	.addClass('model_attribute_select')
  	//	.html(html);
  	return $('<div/>')
  		.html(html);
  },
	
  form: function()
  {
    var form = $('<form/>')    
  	var select = $('<select></select>')
			.attr('id', this.base)
			.attr('name', this.base);
			
		if (this.multiple)
		{
			select.attr('multiple', 'multiple');
			select.attr('size', '9');
		}
 	
		var this2 = this;
		var options = Model.get_attribute_options(this.model.name, this.name);
		$.each(options, function(i, option) 
		{
			if (option.children != null) // Option group
			{
				var optgroup = $('<optgroup></optgroup>');
				optgroup.attr('label', option.title);
		
				$.each(option.children, function(j, option2) 
				{
					var opt = $('<option></option>')
						.attr('text', option2.text)
						.val(option2.value);
					
					if (!this2.multiple)
						opt.attr('selected', (option2.value == this2.value));
					else
					{
						opt.attr('selected', false);
						for (var k=0; k<this2.value.length; k++)
							if (option2.value == this2.value[k])
							{
								opt.attr('selected', true);
								break;
							}
					}
					optgroup.append(opt);
				});
				
				select.append(optgroup);
			}
			else
			{
				var opt = $('<option></option>')
					.val(option.value)
					.text(option.text);
									
				if (!this2.multiple)
				{
					opt.attr('selected', (option.value == this2.value));
				}
				else
				{
					opt.attr('selected', false);
					for (var j=0; j<this2.value.length; j++)
						if (option.value == this2.value[j])
						{
							opt.attr('selected', true);
							break;
						}
				}
				select.append(opt);
			}
		});
		form.append(select);
		if (this.multiple)
		{
		  form.append("<br/>");
			form.append(
				$('<input/>')
					.attr('type', 'button')
					.val('Clear')
					.addClass('update_btn')
					.click(function() { $('#' + this.base).selectedIndex = -1; })
			);
		}
		
		return form;
  },
  
  form_value: function()
  {
    if (!this.multiple)
		  return $('#' + this.base + ' option:selected').val();
		
		var select = $('#' + this.base);
		val = [];
		$('#' + this.base + ' option:selected').each(function(i, opt) {
			val[val.length] = $(opt).val();
		});
		return val;
  }
   
});
