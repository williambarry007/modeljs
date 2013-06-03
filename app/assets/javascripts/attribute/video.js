
Model.Attribute.Video = Model.Attribute.extend({
    
  show_reminder: true,
  thumb_width: 320,
  thumb_height: 240,
	
  view: function()
  {
    var html = false;
    if (typeof(this.value) == 'string')
      html = this.value && this.value.length > 0 ? this.value : this.empty_text;
    else if (typeof(this.value) == 'number')
      html = this.value != null ? this.value : this.empty_text;
    else
      html = this.value;
    var div = $('<div/>').html(html);
    var iframe = this.video_iframe(this.value);
    if (iframe)
      div.append($('<br/>')).append(iframe);
    return div;
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
  	
  	var iframe = this.video_iframe(this.value);
    if (iframe)
      form.append($('<br/>')).append(iframe);

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
  },
  
  video_iframe: function()
  {
    if (this.value == null || this.value.length == 0)
      return false;
    
    if (this.value.match(/youtube\.com/))
  	{
  	  var v = this.value.replace("youtube.com/watch?v=", '');  	  
  	  return $('<iframe/>')
  	    .attr('type', 'text/html')
  	    .attr('width', this.thumb_width)
  	    .attr('height', this.thumb_height)
  	    .attr('frameborder', '0')
  	    .attr('src', "http://www.youtube.com/embed/" + v + "?autoplay=0"); 	  
  	}
  	if (this.value.match(/vimeo\.com/))
  	{
  	  var v = this.value.replace("vimeo.com/", '');  	  
  	  return $('<iframe/>')
  	    .attr('type', 'text/html')
  	    .attr('width', this.thumb_width)
  	    .attr('height', this.thumb_height)
  	    .attr('frameborder', '0')
  	    .attr('src', "http://player.vimeo.com/video/" + v); 	  
  	}
  	return false;
  }
  
});
