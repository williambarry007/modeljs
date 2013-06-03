
Model.Attribute.Hidden = Model.Attribute.extend({
   
  view: function()
  {
  	return false;
  },
  
  form: function()
  {
    return false;
  },
  
  form_value: function() 
  { 
    return this.value;
  }
  
});
