model.js
========

Javascript library to handle CRUD actions for models via ajax.

Contains a model object, generic attribute object, and many common attribute types:

- checkbox-multiple
- checkbox
- date-time
- file
- image
- password
- radio
- rich-text
- select
- texarea
- textjs
- time

Adding new attribute types is simple.  Just create a new class that extends Model.Attribute and override the following methods:

- view: Returns a viewable representation of the attribute.
- form: Returns an editable form of the attribute.

Example of a new attribute type:
<pre>
Model.Attribute.MyNewAttribute = Model.Attribute.extend({
  view: function() {
  	return $('&lt;a/&gt;').html(this.value);
  },  
  form: function() {
    return $('&lt;form/&gt;').append($('&lt;input/&lt;').attr('type', 'text').attr('id', this.base).val(this.value));
  }
});
</pre>

How to include on your site separately:
<pre>
&lt;script src="/assets/jquery.js"                            type="text/javascript"&gt;&lt;/script&gt;
&lt;script src="/assets/jquery-ui.js"                         type="text/javascript"&gt;&lt;/script&gt;
&lt;script src="/assets/class.js"                             type="text/javascript"&gt;&lt;/script&gt;
&lt;script src="/assets/model/model.js"                       type="text/javascript"&gt;&lt;/script&gt;
&lt;script src="/assets/model/attribute.js"                   type="text/javascript"&gt;&lt;/script&gt;
&lt;script src="/assets/model/form.js"                        type="text/javascript"&gt;&lt;/script&gt;
&lt;script src="/assets/model/attribute/checkbox-multiple.js" type="text/javascript"&gt;&lt;/script&gt;
&lt;script src="/assets/model/attribute/checkbox.js"          type="text/javascript"&gt;&lt;/script&gt;
&lt;script src="/assets/model/attribute/date-time.js"         type="text/javascript"&gt;&lt;/script&gt;
&lt;script src="/assets/model/attribute/file.js"              type="text/javascript"&gt;&lt;/script&gt;
&lt;script src="/assets/model/attribute/image.js"             type="text/javascript"&gt;&lt;/script&gt;
&lt;script src="/assets/model/attribute/password.js"          type="text/javascript"&gt;&lt;/script&gt;
&lt;script src="/assets/model/attribute/radio.js"             type="text/javascript"&gt;&lt;/script&gt;
&lt;script src="/assets/model/attribute/rich-text.js"         type="text/javascript"&gt;&lt;/script&gt;
&lt;script src="/assets/model/attribute/select.js"            type="text/javascript"&gt;&lt;/script&gt;
&lt;script src="/assets/model/attribute/texarea.js"           type="text/javascript"&gt;&lt;/script&gt;
&lt;script src="/assets/model/attribute/textjs.js"            type="text/javascript"&gt;&lt;/script&gt;
&lt;script src="/assets/model/attribute/time.js"              type="text/javascript"&gt;&lt;/script&gt;
</pre>

Example when adding a model:
<pre>
&lt;div id='user_new_container'&gt;&lt;/div&gt;
</pre><pre>
&lt;script type='text/javascript'&gt;
$(document).ready(function() {
  user = new Model({
    name: 'User',
    id: 'new',
    attributes: [
      { name: 'username', type: 'text', value: '' }
    ]
  });
});
&lt;/script&gt;
</pre>

Example when editing a model:
<pre>
&lt;div id='user_27_container'&gt;&lt;/div&gt;
</pre><pre>
&lt;script type='text/javascript'&gt;
$(document).ready(function() {
  user = new Model({
    name: 'User',
    id: 27,
    attributes: [
      { name: 'first_name' , type: 'text', value: "&lt;%= @user.first_name %&gt;" },
      { name: 'last_name'  , type: 'text', value: "&lt;%= @user.last_name  %&gt;" },
      { name: 'username'   , type: 'text', value: "&lt;%= @user.username   %&gt;" },
      { name: 'email'      , type: 'text', value: "&lt;%= @user.email      %&gt;" },
      { name: 'password'   , type: 'password' },
      {
        name: 'roles', 
        type: 'checkbox-multiple',  
        value: [1, 14, 18],
        text: "Managers, Clients, Assistants",
        empty_text: '[No roles]',
        multiple: true,
        loading_message: 'Getting roles...',
        options_url: '/roles/options'
      },
      {
        name: 'pic', 
        type: 'image',  
        value: '',
        update_url: '/users/27/update-pic'
      },
      {
        name: 'resume', 
        type: 'file',  
        value: '',
        update_url: '/users/27/update-resume'
      }
    ]
  });
});
&lt;/script&gt;
</pre>

<h2>Update Responses</h2>

For attributes that don't require a file upload, Model.js expects the server to respond with the following json object:

<pre>
{
  success: true, // Whether or not the save was successful
  error: false,  // Any error to display to the user
  attribute: {}  // Any attribute values to set in the local attribute object
}
</pre>
 
The File and Image attributes allow for file uploads. Since a typical ajax call can't upload files, this is done with a hidden iframe.  Because of this, the response required for a file or image update is the following:

<pre>
parent.Model.upload_finished({
  name: 'user',           // The name of the model
  id: 27,                 // The id of the model 
  attribute_name: 'pic',  // The name of the attribute
  success: true,          // Whether or not the save was successful
  error: false,           // Any error to display to the user
  attribute: {}           // Any attribute values to set in the local attribute object
});
</pre>
