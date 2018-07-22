# netstedForms
nestedForms is an asynchronous Javascript CRUD (Create, Read, Update and Delete) to simplify the management of your table records.

This script require <a href="https://www.w3schools.com/JQuery/jquery_get_started.asp">Jquery</a> to work.
The great advantage of using this script is that you can use this separate system within an existing management.

An example:
You have the user table and a role table. User management are php pages, but in the user edit, you want manage roles.
You can use this script without having to rewrite your own asynchronous system in js simply by indicating the columns and, if necessary, 
your custom URLs.

This system works with rest url, if you need, you can build your php connection with your methos. All results to js must be JSON formatted

### EXPLANATION OF THE PARAMS:
- **model:** (string) [optional] Models are used to generate form urls, for example if you use 'users' as model name, form action url will be generated as '/users/' and '/users/{id}'. See code example in customurl section for defaults.
- **elementID:** (string) [needed] The ID of element to attach results and modal window, this is the main container.
- **filter:** (object) You can nest a form in relation with a column, specifying column and value of the main param. All crud operations will be based on this column.
  - **column:** (string) Name of the netsted column
  - **value:** (string) Value 
- **columns:** (object) [needed] The database columns structure for each column, you must indicate some params:
  - **key:** (true/false) if the column is the primary column key, set it to true.
  - **name:** (string) Display name of the column
  - **input_type:** (string) Put type of the column here. You can choose between: text, number and select (for now)
  - **defaultValue:** (string) If you want to set a default value for that column, use this.
  - **resources:** [needed if type is "select"] (json) If you are using select as input type, you must indicate a list of key=values
- **customurls:** (object)
- **labels:** (object) Overwrite common buttons
  - **button_send:** (string) custom name for Send Button
  - **button_close:** (string) custom name for Close Button
- **customButtons:** (array of objects)
  - **name:** (string) label name of button
  - **url:** (string) href destination of button


This is an Example of implementation:
```
<script src="nestedForms.js"></script>
<script>
        $( document ).ready(function()
        {
            let nest = new NestedForms({

                model: 'users',
                elementID: 'myUserList',
                columns: {
                    id: {
                        key: true,
                        name: "ID",
                        input_type: "text",
                        visible: false,
                        defaultValue: null,
                        resources: null,
                    },
                    name: {
                        key: false,
                        name: "Name",
                        input_type: "text",
                        visible: false,
                        defaultValue: null,
                        resources: null,
                    },
                    role_id: {
                        key: false,
                        name: "Role",
                        input_type: "select",
                        visible: true,
                        defaultValue: null,
                        resources: [
                            {"id": "1", "name": "manager"},
                            {"id": "2", "name": "commercial"},
                            {"id": "3", "name": "agent"}
                        ]
                    },
                },
                customurls: {
                    index: {
                        method: "GET",          // default: "GET"
                        url: "/users/"          // default: "/model/"
                    },
                    show: {
                        method: "GET",          // default: "GET"
                        url: "/users/{id}"      // default: "/model/{id}"
                    },
                    store: {
                        method: "PUSH",         // default: "PUSH"
                        url: "/users/"          // default: "/model/"
                    },
                    update: {
                        method: "PATCH",        // default: "PATCH"
                        url: "/users/{id}"      // default: "/model/{id}"
                    },
                    delete: {
                        method: "DELETE",       // default: "DELETE"
                        url: "/users/{id}"      // default: "/model/{id}"
                    }
                },
                labels: {
                    button_send: "Custom Send Text",    //defaultValue: "Send"
                    button_close: "Custom Close Text",  //defaultValue: "Close"
                },
                token: 'MySecretTokenText',
            });

        });
</script>
```

####If you're thinking that this documentation is not complete, you're right. 
####Soon I will try to write a more precise one. In the meantime, you can contact me for information on discord: https://discord.gg/S4jPyfk
