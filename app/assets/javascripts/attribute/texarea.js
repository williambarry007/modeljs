
Model.Attribute.Textarea = Model.Attribute.extend({

  show_controls: true,
  normal_text: false,
  width: 200,
  height: 100,
    
  view: function()
  {
    html = this.empty_text;
    if (this.text && this.text.length > 0)			  html = this.text;
    else if (this.value && this.value.length > 0) html = this.value;
  	//return $('<a/>')
  	//	.attr('title', 'Click to edit')
  	//	.attr('href', 'javascript:{};')
  	//	.css({
  	//	  display: 'block',
  	//	  width: this.width
  	//	})
  	//	.html(html);
  	return $('<div/>')
  		.css({
  		  display: 'block',
  		  width: this.width
  		})
  		.html(html);
  },
  
  form: function()
  {
    return $('<form/>')
      .append($('<textarea/>')
			  .attr('id', this.base)
			  .attr('name', this.base)
			  .val(this.value)
			  .css('width', this.width)
			  .css('height', this.height)
			);
  }
  
});
