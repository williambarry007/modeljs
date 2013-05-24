
Model.Attribute.Password = Model.Attribute.extend({
    
  view: function()
  {
  	return $('<a/>')
  		.attr('title', 'Click to edit')
  		.attr('href', 'javascript:{};')
  		.html('Change Password');  		
  },
    
  form: function()
  {
    return $('<form/>')
      .append($('<input/>')
  		  .attr('type', 'password')
  		  .attr('id', this.base)
  		  .attr('name', this.base)
  		)
  		.append($('<br/>'))
  		.append($('<input/>')
  			.attr('type', 'password')
  			.attr('id', this.base + '_confirm')
  			.attr('name', this.base + '_confirm')
  		)
  		.append($('<span> (Confirm)</span>'));
  },
  
  form_values: function()
  {
    values = this._super();
    values.confirm = $('#' + this.base + '_confirm').val();
    return values;
  }
  
});
