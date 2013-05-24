
Model.Attribute.Image = Model.Attribute.extend({
	
  show_thumb: true,
  thumb_width: 100,
  custom_form: true, // Tells the model to not do the traditional ajax_update.
                     // This means we control the entire update process

  view: function()
  { 
    return $('<a/>')
  	  .attr('href', 'javascript:{};')
  	  .html('[Upload new image]');
  },
  
  post_view_display: function() 
  {
    if (!this.show_thumb)
      return;
    
    if (!this.value || this.value.length == 0)
    {
      $('#' + this.container).append("No image has been uploaded.");
      return;
  	}
  	$('#' + this.container).append($('<p/>')
    	.append($('<img />')
    	  .attr('src', this.value + '?' + Math.random())
    	  .attr('width', this.thumb_width)
    	)
    );
  },
  
  form: function()
  {
    var form = $('<form/>')
      .attr('action', this.update_url)
      .attr('method', 'post')
      .attr('enctype', 'multipart/form-data')
      .attr('encoding', 'multipart/form-data')
      .attr('target', this.base + '_iframe');
      
    // Add the csrf-token
    form.append($('<input/>')
      .attr('type', 'hidden')
      .attr('name', 'authenticity_token')
      .val($("meta[name=csrf-token]").attr('content'))
    );
						
    if (this.show_thumb)
    {
    	form.append($('<p/>')
    	  .append($('<img />')
    	    .attr('src', this.value + '?' + Math.random())
    	    .attr('width', this.thumb_width)
    	  ));
    }

		form.append($('<input />')
		  .attr('type', 'file')
			.attr('id', this.base)
			.attr('name', this.base)
		);
		
		this2 = this;
		var controls = $('<span/>')
      .attr('id', this.controls) 
      .append($('<input/>').attr('type', 'submit').val('Update').addClass('update_btn').click(function() { this2.loading('Uploading...');     }))
      .append($('<input/>').attr('type', 'button').val('Cancel').addClass('cancel_btn').click(function() { this2.model.show_attribute(this2); }));
    form.append(controls);
    form.append($('<span/>').attr('id', attrib.message));
    return form;
  },
  
  post_form_display: function()
  {
    // Create the iframe  
    $('#' + this.container).append($('<iframe></iframe>')
      .attr('id', this.base + '_iframe')
      .attr('name', this.base + '_iframe')
      .css('width', '0')
		  .css('height', '0')
		  .css('border', '0')
      //.css('width', 600)
      //.css('height', 400)
      //.css('border', '#000 1px solid')
    );   
  },
  
  upload_finished: function(resp) 
  {
    if (resp.error)
		{
		  this.error(resp.error);
		}
		if (resp.success)
		{
		  if (resp.attribute)
		    for (var thing in resp.attribute)
		      attrib[thing] = resp.attribute[thing];
			this.model.show_attribute(this);
		}
  }
  
});
