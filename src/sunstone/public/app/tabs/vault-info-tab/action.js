
define(function(require) {
    var Sunstone = require('sunstone');
    var DataTable = require('./datatable');
    var OpenNebulaResource = require('opennebula/vault-info');
    var CommonActions = require('utils/common-actions');

    var TAB_ID = require('./tabId');

    var XML_ROOT = "vault-backup"
    var RESOURCE = "vault-backup"

    var _commonActions = new CommonActions(OpenNebulaResource, RESOURCE, TAB_ID,
        XML_ROOT, "Vault created");

    var _actions = {
        "vault-info.list" : _commonActions.list(),
        "vault-info.refresh" : _commonActions.refresh()
    };

    return _actions;
});