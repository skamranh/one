
define(function(require) {

    TAB_ID = require('./vault-info-tab/tabId');
    var Buttons = require('./vault-info-tab/button');
    var Actions = require('./vault-info-tab/action');
    //var TemplatePool = require('hbs!./hypercx-tab/html');
    var Table = require('./vault-info-tab/datatable');
    var DATATABLE_ID = "vault-info";
    
    var _dialogs = [
    ];

    var _panels = [
    ];
    
    var Tab = {
        tabId: TAB_ID,
        title: "Info",
        icon: 'fa-key',
        tabClass: "subTab",
        parentTab: "vault-top-tab",
        listHeader: "Backups",
        lockable: false,
        subheader: '<span>\
            <span class="total_vault_info"/> <small>Total</small>\
        </span>',
        resource: 'vault-info',
        buttons: Buttons,
        actions: Actions,
        dataTable: new Table(DATATABLE_ID, {actions: true, info: false}),
        panels: _panels,
        dialogs: _dialogs
    };

    return Tab;
});
