
Model.Attribute.RichText = Model.Attribute.extend({

  show_controls: true,
    
  view: function()
  {
    //tinyMCE.execCommand('mceRemoveControl', null, $('#' + this.base));
    tinyMCE.execCommand('mceRemoveControl', null, this.base);
    var html = this.value && this.value.length > 0 ? this.value : this.empty_text;
		return $('<div/>')
			.addClass('model_attribute_container')
			.html(html);
  },
  
  form: function()
  {
    return $('<form/>')
      .append($('<textarea/>')
				.addClass('tinymce')
				.attr('id', this.base)
				.attr('name', this.base)
				.val(this.value)
			);
  },
  
  form_value: function()
  {
    tinyMCE.triggerSave();
    //tinyMCE.execCommand('mceRemoveControl', null, $('#' + this.base));
    tinyMCE.execCommand('mceRemoveControl', null, this.base);
    return $('#' + this.base).val();
  },
  
  post_form_display: function()
	{		
		$('#' + this.base).css('display', 'block');
		//tinyMCE.execCommand('mceAddControl', null, $('#' + this.base));
		tinyMCE.execCommand('mceAddControl', null, this.base);
		$('#' + this.base).focus();
	}
  
});
