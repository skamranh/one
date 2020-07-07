
define(function(require) {

    TAB_ID = require('./vault-backup-tab/tabId');
    var Buttons = require('./vault-backup-tab/button');
    var Actions = require('./vault-backup-tab/action');
    var Table = require('./vault-backup-tab/datatable');
    var DATATABLE_ID = "vault-backup";
    
    var _dialogs = [
    ];

    var _panels = [
    ];
    
    var Tab = {
        tabId: TAB_ID,
        title: "HyperCX Vault",
        icon: 'fa-key',
        tabClass: "subTab",
        parentTab: "vault-info-tab",
        listHeader: "Backups",
        lockable: false,
        subheader: '<span>\
            <span class="total_vault"/> <small>Total</small>\
        </span>',
        resource: 'vault-backup',
        buttons: Buttons,
        actions: Actions,
        dataTable: new Table(DATATABLE_ID, {actions: true, info: false}),
        panels: _panels,
        dialogs: _dialogs
    };

    return Tab;
});
