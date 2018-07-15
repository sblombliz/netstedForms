class NestedForms
{
    // VARIABLES
    constructor(model, elementID, columns)
    {
        this.error = false;

        // Check for missing Key
        this.key = "";
        for(var c in columns)
            if(columns[c].key)
                this.key = c;

        if(this.key == "")
            this.reportError("Missing Key! You must put a key = true on a column!");

        this.resourceModel = model;
        this.elementDiv = $('#' + elementID);
        this.columns = columns;
        this.token = '{{ csrf_token() }}';
        this.resourceIndex();
        this.renderModal();

    }

    resourceIndex()
    {
        if(!this.error)
        {
            $.ajax({
                context: this,
                type: "GET",
                url: '/' + this.resourceModel + '/',
                contentType: false,
                success: function (raw_data) {
                    var data = $.parseJSON(raw_data);
                    this.resourceRender(data);
                },
                error: function (xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    }

    resourceClickCreate()
    {
        this.renderModal();
        $('#modal-form').modal('show');
    }

    resourceClickEdit(id)
    {
        $.ajax({
            context: this,
            type: "GET",
            url: '/' + this.resourceModel + '/'+id,
            contentType: false,
            success: function (raw_data)
            {
                var data = $.parseJSON(raw_data);
                this.render_modal(data);
                $('#modal-form').modal('show');
            },
            error: function (xhr, status, error)
            {
                alert(xhr.responseText);
            }
        });

    }

    resourceStoreUpdate(id)
    {
        event.preventDefault();

        // TODO: actually using $('frm') but i need to take form from func param
        var _this = $('#frm');

        if(id)
        {
            var action = '/'+this.resourceModel+'/'+id;
            var method = 'PATCH';
        }
        else
        {
            var action = '/'+this.resourceModel+'/';
            var method = 'POST';
        }

        $.ajax({
            context: this,
            type: method,
            url: action,
            data: _this.serialize(),
            headers: {
                'X-CSRF-TOKEN': '{{ csrf_token() }}',
                'Content-type': 'application/x-www-form-urlencoded'
            },
            cache: false,
            contentType: false,
            processData: false,
            success: function (data)
            {
                if (data.fail)
                {
                    for (control in data.errors)
                        $('#error-' + control).html(data.errors[control]);
                }
                else
                {
                    $('#modal-form').modal('hide');
                    $(".modal-backdrop").remove(); //TODO: Bug, forcing to remove modal-backdrop, or it still remain
                    this.resourceReloadRender();

                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log("Error: " + errorThrown);
            }
        });
        return false;
    }

    resourceActionDelete(id)
    {
        var result = confirm("Want to delete?");
        if (result)
        {
            $.ajax({
                context: this,
                type: 'POST',
                data: {_method: 'DELETE', _token: this.token},
                url: '/' + this.resourceModel + '/' + id,
                success: function (data) {
                    this.resourceReloadRender();
                },
                error: function (xhr, status, error) {
                    console.log(xhr.responseText);
                }
            });
        }
    }

    resourceReloadRender()
    {
        this.elementDiv.empty();
        this.resourceIndex();
    }


    // RENDERERS
    renderModal(data = null)
    {
        // Empty old modal-form
        $('#modal-form').remove();

        var content =  '<div class="modal fade" id="modal-form" role="dialog">';
            content += '    <div class="modal-dialog">';
            content += '        <div class="modal-content">';

            content += '            {!! Form::open(["autocomplete" => "off", "id"=>"frm"]) !!}';

            content += '            <div class="modal-header">';
            content += '               <button type="button" class="close" data-dismiss="modal">&times;</button>';
            content += '                <h4 class="modal-title">Add / Edit</h4>';
            content += '            </div>';

            content += '            <div class="modal-body">';
            content += '                <div id="form-fields" class="row"></div>';
            content += '            </div>';

            content += '            <div class="modal-footer">';
            content += '            </div>';

            content += '            {!! Form::close() !!}';

            content += '        </div>';
            content += '    </div>';
            content += '</div>';

        this.elementDiv.append(content);

        // make send button
        var sendButton = document.createElement('input');
        sendButton.className = 'btn btn-primary';
        sendButton.type = 'submit';
        sendButton.value = '@lang("general.button_submit")';
        if(data)
            sendButton.addEventListener("click", this.resourceStoreUpdate.bind(this, data[this.key])); // TODO: pref use 'this' to pass the form
        else
            sendButton.addEventListener("click", this.resourceStoreUpdate.bind(this, null));

        $('.modal-footer').append(sendButton);

        // make close button
        var closeButton = document.createElement('input');
        closeButton.className = 'btn btn-primary m-t-10';
        closeButton.type = 'button';
        closeButton.setAttribute('data-dismiss', 'modal');
        closeButton.value = '@lang("general.button_close")';
        $('.modal-footer').append(closeButton);




        var attachTo = document.getElementById('form-fields');

        // Attaching form inputs
        for(var c in this.columns)
        {
            if(this.columns[c].visible)
            {
                var divcol = document.createElement('div');
                divcol.className = "col-xs-12";
                attachTo.append(divcol);

                var divgroup = document.createElement('div');
                divgroup.className = "form-group";
                divcol.append(divgroup);

                var label = document.createElement('strong');
                label.innerHTML = this.columns[c].name;
                divgroup.append(label);

                switch (this.columns[c].input_type)
                {
                    case('text'):
                        var input = document.createElement('input');
                        input.type = 'text';
                        input.placeholder = this.columns[c].name;
                        input.id = c;
                        input.className = 'form-control';
                        input.name = c;
                        if (data)
                            input.value = data[c];
                        else
                            input.value = this.columns[c].defaultValue;
                        divgroup.append(input);
                        break;

                    case('number'):
                        var input = document.createElement('input');
                        input.type = 'number';
                        input.placeholder = this.columns[c].name;
                        input.id = c;
                        input.className = 'form-control';
                        input.name = c;
                        if (data)
                            input.value = data[c];
                        else
                            input.value = this.columns[c].defaultValue;
                        divgroup.append(input);
                        break;

                    case('select'):
                        var input = document.createElement('select');
                        input.placeholder = this.columns[c].name;
                        input.id = c;
                        input.className = 'form-control';
                        input.name = c;

                        //Create and append the options
                        var options = this.columns[c].resources;

                        var option = document.createElement("option");
                        option.value = null;
                        option.text = "Select: " + this.columns[c].name;
                        input.appendChild(option);

                        for (var o in options)
                        {
                            var option = document.createElement("option");
                            option.value = o;
                            option.text = options[o];

                            input.appendChild(option);
                        }
                        if (data)
                            input.selectedIndex = data[c];
                        else
                            input.selectedIndex = this.columns[c].defaultValue;
                        divgroup.append(input);
                        break;
                }
            }
        }

    }

    resourceRender(data)
    {
        if(!this.error)
        {
            var content = '<table id="table_index" class="table table-bordered">';

            // rendering headers
            content += '<tr class="table-row-id">';
            for (var key in this.columns)
            {
                if (this.columns[key].visible)
                    content += '<th>' + this.columns[key].name + '</th>';
            }

            content += '<th style="margin:auto; text-align:center;" id="create_column" width="1%"></th>';
            content += '</tr>';
            content += '</table>';
            this.elementDiv.append(content);


            var addBtn = document.createElement('a');
            addBtn.style = "margin: 0px 2px;";
            addBtn.className = "btn btn-success inline";
            addBtn.href = "#";
            addBtn.innerHTML = "Create";
            addBtn.addEventListener("click", this.resourceClickCreate.bind(this));
            document.getElementById("create_column").appendChild(addBtn);


            // redering content
            for (var row in data)
            {
                var contentValues = '';
                for (var col in data[row])
                {
                    var columnKeys = Object.keys(this.columns);
                    if (columnKeys.includes(col) && this.columns[col].visible)
                    {
                        //console.log(this.columns[col].resources);
                        if (this.columns[col].resources != null)
                        {
                            if (this.isJSON(this.columns[col].resources))
                                var res = this.columns[col].resources;

                            contentValues += '<td>' + res[data[row][col]] + '</td>';
                        }
                        else
                        {
                            contentValues += '<td>' + data[row][col] + '</td>';
                        }

                    }
                }

                contentValues += '<td id="action_buttons_' + row + '">';

                var delBtn = document.createElement('a');
                delBtn.style = "margin: 0px 2px;";
                delBtn.className = "btn btn-danger inline";
                delBtn.href = "#";
                delBtn.innerHTML = "Delete";
                delBtn.addEventListener("click", this.resourceActionDelete.bind(this, data[row][this.key]));

                var editBtn = document.createElement('a');
                editBtn.style = "margin: 0px 2px;";
                editBtn.className = "btn btn-primary inline";
                editBtn.href = "#";
                editBtn.innerHTML = "Edit";
                editBtn.addEventListener("click", this.resourceClickEdit.bind(this, data[row][this.key]));

                contentValues += '</td>';

                // Create the new row
                var newElement = document.createElement('tr');
                newElement.className = "table-row-id";
                newElement.innerHTML = contentValues;

                var trElements = document.getElementsByClassName('table-row-id');
                var lastTR = trElements[trElements.length - 1];

                lastTR.parentNode.insertBefore(newElement, lastTR.nextSibling);

                document.getElementById("action_buttons_" + row).appendChild(editBtn);
                document.getElementById("action_buttons_" + row).appendChild(delBtn);
            }
        }
    }


    // HELPERS
    isJSON(data)
    {
        var isJson = false;

        isJson = typeof data === 'object' ;
        if(!isJson)
            this.reportError("Invalid JSON! You must use json object as resource!");

        return isJson;
    }

    reportError(error_message)
    {
        this.error = true;
        alert("NestedForms Error! "+error_message);
        this.elementDiv.empty();
    }

}