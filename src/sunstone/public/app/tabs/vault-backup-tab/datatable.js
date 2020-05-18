
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
            "order": [[ 1, "desc" ]],
            "aoColumnDefs": [
                { "bSortable": false, "aTargets": ["check",2,3,4] },
                {"sWidth": "35px", "aTargets": [0]},
                {"bVisible": true, "aTargets": SunstoneConfig.tabTableColumns(TAB_NAME)},
                {"bVisible": false, "aTargets": ['_all']},
                {"sType": "num", "aTargets": [2]}
            ]
        };
        
    this.totalBups = 0;    
    
    this.columns = [
        "VM Name",
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
            '<a href="/#vms-tab/'+element_json.VMID+'">'+element_json.NAME+'</a>',
            new Date(parseInt(element_json.DATE)*1000).toISOString().slice(0,-5),
            element_json.STATUS,
            '<a href="/#marketplaceapps-tab/'+element_json.MPID+'">'+element_json.MPID+'</a>',
            ''
          ];
    }
    
    function _preUpdateView() {
        this.totalBups = 0;
        $(".total_vault").text(this.totalBups);
    }

    function _postUpdateView() {
        $(".total_vault").text(this.totalBups);
    }
    
});