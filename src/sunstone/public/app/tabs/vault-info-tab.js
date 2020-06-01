
define(function(require) {

    TAB_ID = require('./vault-info-tab/tabId');
    OPENNEBULA = require('opennebula')
    //var Buttons = require('./vault-info-tab/button');
    //var Actions = require('./vault-info-tab/action');
    //var TemplatePool = require('hbs!./hypercx-tab/html');
    //var Table = require('./vault-info-tab/datatable');
    //var DATATABLE_ID = "vault-info";
    var HtmlTemplate = require('hbs!./vault-info-tab/html');
    var _table_dat;
    $.ajax('/hypercx/vault-info',
                {            
                    async: false,
                    success: function (data, status, xhr) {
                        _table_dat = data;
                        console.log(_table_dat);
                    }
                });
    _status = false;
    if(_table_dat["info"]){
        var _status_ind = _table_dat["info"].map(function (table) { return table.NAME; }).indexOf("Service running?")
        if(_status != -1 && _table_dat["info"][_status_ind]["DESC"]){
            _status = true;
            _table_dat["info"].splice(_status_ind,1);
        }
        else{

            _status = false;
        }
    }
    var Tab = {
    tabId: TAB_ID,
    title: "Info",
    icon: 'fa-key',
    tabClass: "subTab",
    parentTab: "vault-top-tab",
    listHeader: "HyperCX Vault Status",
    lockable: false,
    content: HtmlTemplate({
        table_dat: _table_dat["info"],
        isEnabled_Vault: _status,
        table_dat_progress: _table_dat["BACKUPS_IN_PROGRESS"],
        table_dat_schedule: _table_dat["BACKUPS_SCHEDULE"]
        })
    };

    return Tab;
});
