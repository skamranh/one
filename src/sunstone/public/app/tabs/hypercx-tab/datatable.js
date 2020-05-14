
define(function(require) {

    /*
    DEPENDENCIES
    */

    var TabDataTable = require('utils/tab-datatable');
    var SunstoneConfig = require('sunstone-config');
    
    var RESOURCE = "Vault";
    var XML_ROOT = "Vault";
    var TAB_NAME = require('./tabId'); 

    function Table(dataTableId, conf) {
        this.conf = conf || {};
        this.tabId = TAB_NAME;
        this.dataTableId = dataTableId;
        this.resource = RESOURCE;
        this.xmlRoot = XML_ROOT;
        this.dataTableOptions = {
            "bSortClasses" : false,
            "bDeferRender": true,
            "aoColumnDefs": [
                { "bSortable": false, "aTargets": ["check",2,3,4,5] },
                {"sWidth": "35px", "aTargets": [0]},
                {"bVisible": true, "aTargets": SunstoneConfig.tabTableColumns(TAB_NAME)},
                {"bVisible": false, "aTargets": ['_all']},
                {"sType": "num", "aTargets": [2]}
            ]
        };
        
    this.totalBups = 0;    
    
    this.columns = [
        "VM Name",
        "VM ID",
        "Backup Date",
        "Status",
        "Marketplace ID"
      ];
    
    this.selectOptions = {
        "id_index": 1,
        "name_index": 1,
        "select_resource": "Please select an ACL rule from the list",
        "you_selected": "You selected the following ACL rule:",
        "select_resource_multiple": "Please select one or more ACL rules from the list",
        "you_selected_multiple": "You selected the following ACL rules:"
        };

    TabDataTable.call(this);
    }
    
    Table.prototype = Object.create(TabDataTable.prototype);
    Table.prototype.constructor = Table;
    Table.prototype.elementArray = _elementArray;
    Table.prototype.preUpdateView = _preUpdateView;
    Table.prototype.postUpdateView = _postUpdateView;

    return Table;

    function _elementArray(element_json) {
        this.totalBups++;
        return [
            '<input class="check_item" type="checkbox" '+
                                'style="vertical-align: inherit;" id="'+this.resource.toLowerCase()+'_' +
                                 element_json.MPID + '" name="selected_items" value="' +
                                 element_json.MPID + '"/>',
            element_json.NAME,
            element_json.VMID,
            element_json.DATE,
            element_json.STATUS,
            element_json.MPID,
            element_json
          ];
    }
    
    function _preUpdateView() {
        this.totalACLs = 0;
    }

    function _postUpdateView() {
        $(".total_Vault").text(this.totalBups);
    }
    
});