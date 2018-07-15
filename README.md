# netstedForms
nestedForms is an asynchronous Javascript CRUD (Create, Read, Update and Delete) to simplify the management of your table records.

This script require <a href="https://www.w3schools.com/JQuery/jquery_get_started.asp">Jquery</a> to work.
The great advantage of using this script is that you can use this separate system within an existing management.

An example:
You have the user table and a role table. User management are php pages, but in the user edit, you want manage roles.
You can use this script without having to rewrite your own asynchronous system in js simply by indicating the columns and, if necessary, 
your custom URLs.

This system works with rest url, if you need, you can build your php connection with your methos. All results to js must be JSON formatted

This is an Example of implementation:
```
<script src="nestedForms.js"></script>
<script>
    $( document ).ready(function()
    {
        let columns =
            {
                id:
                    {
                        key: true,
                        name: "ID",
                        input_type: "text",
                        visible: false,
                        defaultValue: null,
                        resources: null,
                    },
                name:
                    {
                        key: false,
                        name: "Name",
                        input_type: "text",
                        visible: false,
                        defaultValue: null,
                        resources: null,
                    },
                role_id:
                    {
                        key: false,
                        name: "Role",
                        input_type: "select",
                        visible: true,
                        defaultValue: null,
                        resources: [
                            {"id":"1", "name":"manager"},
                            {"id":"2", "name":"commercial"},
                            {"id":"3", "name":"agent"}
                        ]
                    },
            };

        let customurls =
            {
                index:
                    {
                        method: "GET",
                        url: "/users/"
                    },
                show:
                    {
                        method: "GET",
                        url: "/users/{id}"
                    },
                store:
                    {
                        method: "PUSH",
                        url: "/users/"
                    },
                update:
                    {
                        method: "PATCH",
                        url: "/users/{id}"
                    },
                delete:
                    {
                        method: "DELETE",
                        url: "/users/{id}"
                    }
            }

            // constructor(model, elementID, columns, customurls = null, token)
            let nest = new NestedForms('users', 'myUserList', columns, customurls, "mytoken");

    });
</script>
```
