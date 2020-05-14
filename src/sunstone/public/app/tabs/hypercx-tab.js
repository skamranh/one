
define(function(require) {

    TAB_ID = require('./hypercx-tab/tabId');
    var Buttons = require('./hypercx-tab/button');
    var Actions = require('./hypercx-tab/action');
    //var TemplatePool = require('hbs!./hypercx-tab/html');
    var Table = require('./hypercx-tab/datatable');
    var DATATABLE_ID = "Vault";
    
    var _dialogs = [
    ];

    var _panels = [
    ];
    
    var Tab = {
        tabId: TAB_ID,
        title: "HyperCX Vault",
        listHeader: "Backups",
        lockable: false,
        subheader: '<span>\
            <span class="total_vault"/> <small>'+Locale.tr("TOTAL")+'</small>\
        </span>',
        resource: 'Vault',
        buttons: Buttons,
        actions: Actions,
        dataTable: new Table(DATATABLE_ID, {actions: true, info: false}),
        panels: _panels,
        dialogs: _dialogs
    };

    return Tab;
});
