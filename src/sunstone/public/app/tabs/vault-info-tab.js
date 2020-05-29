
define(function(require) {

    TAB_ID = require('./vault-info-tab/tabId');
    OPENNEBULA = require('opennebula');
    var HtmlTemplate = require('hbs!./vault-info-tab/html');
    var _table_dat;
    $.ajax('/hypercx/vault-info',
                {            
                    async: false,
                    success: function (data, status, xhr) {
                        _table_dat = data;
                    }
                });
    var _status = _table_dat.map(function (table) { return table.NAME; }).indexOf("Service running?")
    if(_status != -1 && _table_dat[_status]["DESC"]){
        _status = true;
    }
    else{
        
        _status = false;
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
            table_dat: _table_dat,
            isEnabled_Vault: true
        })
    };

    return Tab;
});
