
define(function(require) {

    var TemplatePool = require('hbs!./hypercx-tab/html');
    console.log(TemplatePool());
    var _table_dat;
    TAB_ID = 'hypercx-tab';
    $.ajax('/hypercx',
              {            
                  async: false,
                  success: function (data, status, xhr) {
                          _table_dat = data;
                  }
              });
    console.log(_table_dat);
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
