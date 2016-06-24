var EditableTable = function () {

    return {

        //main function to initiate the module
        init: function () {
            function restoreRow(oTable, nRow) {
                var aData = oTable.fnGetData(nRow);
                var jqTds = $('>td', nRow);

                for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
                    oTable.fnUpdate(aData[i], nRow, i, false);
                }

                oTable.fnDraw();
            }

            function editRow(oTable, nRow) {
                var aData = oTable.fnGetData(nRow);
                var jqTds = $('>td', nRow);
                jqTds[0].innerHTML = '<input type="text" class="form-control small" value="' + aData[0] + '">';
                jqTds[1].innerHTML = '<input type="text" class="form-control small" value="' + aData[1] + '">';
                jqTds[2].innerHTML = '<input type="text" class="form-control small" value="' + aData[2] + '">';
                jqTds[4].innerHTML = '<a class="edit" href="">保存</a>';
                jqTds[5].innerHTML = '<a class="cancel" href="">放弃</a>';
            }

            function saveRow(oTable, nRow) {

                var data = {};
                    var jqInputs = $('input', nRow);
                    data.name = jqInputs[0].value;
                    data.eui = jqInputs[1].value;
                    data.mac = jqInputs[2].value;
                    var url = window.location.href;
                    url = url.substr(0, url.lastIndexOf('/')) + '/parking-edit';
                    // update row
                    if($(nRow).data('parking-id') !== undefined) {
                        data.parking_id = $(nRow).data('parking-id');
                    }

                    $.ajax({
                        url: url,
                        type: 'post',
                        data: data,
                        success: function(res){
                            $(nRow).data('parking-id', res.data.parking.id);
                            var jqInputs = $('input', nRow);
                            oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
                            oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
                            oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
                            oTable.fnUpdate(res.data.parking.status, nRow, 3, false);
                            oTable.fnUpdate('<a class="" href="">详情</a>', nRow, 4, false);
                            oTable.fnUpdate('<a class="edit" href="">编辑</a>', nRow, 5, false);
                            oTable.fnUpdate('<a class="delete" href="">删除</a>', nRow, 6, false);
                            oTable.fnDraw();
                            nEditing = null;

                        },
                        error: function(){
                            restoreRow(oTable, nEditing);
                            nEditing = null;
                            console.log('failed')
                        }
                    });


            }


            //$('#editable-sample').DataTable();
            var oTable = $('#editable-sample').dataTable({
                "aLengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
                // set the initial value
                "iDisplayLength": 15,
                "oLanguage": {
                    "sLengthMenu": "_MENU_ 条记录每页",
                    "oPaginate": {
                        "sPrevious": "上一页",
                        "sNext": "下一页"
                    },
                },
                "aoColumnDefs": [{
                        'bSortable': false,
                        'aTargets': [0]
                    }
                ]
            });

            jQuery('#editable-sample_wrapper .dataTables_filter input').addClass("form-control medium"); // modify table search input
            jQuery('#editable-sample_wrapper .dataTables_length select').addClass("form-control xsmall"); // modify table per page dropdown

            var nEditing = null;

            $('#packing_new').click(function (e) {
                e.preventDefault();
                var aiNew = oTable.fnAddData(['', '', '', '',
                       '','<a class="edit" href="">编辑</a>','<a class="cancel" data-mode="new" href="">删除</a>'
                ]);
                var nRow = oTable.fnGetNodes(aiNew[0]);
                editRow(oTable, nRow);
                nEditing = nRow;
            });

            $('#editable-sample').on('click', 'a.delete', function (e) {
                e.preventDefault();

                if (confirm("确定要删除吗?") == false) {
                    return;
                }
                var data;
                var nRow = $(this).parents('tr')[0];
                 if($(nRow).data('parking-id') !== undefined) {
                        var parking_id = $(nRow).data('parking-id');
                 }

                var url = window.location.href;
                url = url.substr(0, url.lastIndexOf('/')) + '/parking-delete';

                $.ajax({
                    url: url,
                    type: 'post',
                    data: {parking_id: parking_id},
                    success: function(res){
                        oTable.fnDeleteRow(nRow);
                    },
                    error: function(res){

                    }
                });
            });

            $('#editable-sample').on('click','a.cancel', function (e) {
                e.preventDefault();
                if ($(this).attr("data-mode") == "new") {
                    var nRow = $(this).parents('tr')[0];
                    oTable.fnDeleteRow(nRow);
                } else {
                    restoreRow(oTable, nEditing);
                    nEditing = null;
                }
            });

            $('#editable-sample').on('click', 'a.edit', function (e) {
                e.preventDefault();

                /* Get the row as a parent of the link that was clicked ` */
                var nRow = $(this).parents('tr')[0];

                if (nEditing !== null && nEditing != nRow) {
                    /* Currently editing - but not this row - restore the old before continuing to edit mode */
                    restoreRow(oTable, nEditing);
                    editRow(oTable, nRow);
                    nEditing = nRow;
                } else if (nEditing == nRow && this.innerHTML == "保存") {
                    /* Editing this row and want to save it */
                    saveRow(oTable, nEditing);
                    nEditing = null;
                } else {
                    /* No edit in progress - let's start one */
                    editRow(oTable, nRow);
                    nEditing = nRow;
                }
            });
        }

    };

}();