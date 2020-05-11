
define(function(require) {

    var OpenNebulaHelper = require("opennebula");

    var TemplatePool = require('hbs!./hypercx-tab/html');
    var _table_dat;
    TAB_ID = 'hypercx-tab';
    $.ajax(
              {
                  url: "/hypercx/vault",
                  type: "GET",
                  dataType: "json",   
                  async: false,
                  success: function (data, status, xhr) {
                          _table_dat = data;
                  }
              });
    var Tab = {
        tabId: TAB_ID,
        title: 'HyperCX Services',
        listHeader: 'HyperCX Services',
        content: TemplatePool({
            "table_dat": _table_dat
        })
    };

    return Tab;
});
