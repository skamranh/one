
define(function(require) {

    TAB_ID = require('./hypercx-tab/tabId');
    var Buttons = require('./hypercx-tab/button');
    var Actions = require('./hypercx-tab/action');
    //var TemplatePool = require('hbs!./hypercx-tab/html');
    var Table = require('./hypercx-tab/datatable');
    var DATATABLE_ID = "dataTableVault";
    
    var _dialogs = [
    ];

    var _panels = [
    ];
    
    var Tab = {
        tabId: TAB_ID,
        title: "HyperCX Vault Backups",
        icon: 'fa-key',
        listHeader: "Backups",
        lockable: false,
        subheader: '<span>\
            <span class="total_acl"/> <small>'+Locale.tr("TOTAL")+'</small>\
        </span>',
        resource: 'VaultBackups',
        buttons: Buttons,
        actions: Actions,
        dataTable: new Table(DATATABLE_ID, {actions: true, info: false}),
        panels: _panels,
        dialogs: _dialogs
    };

    return Tab;
});
