
define(function(require) {

    var Handlebars = require('hbs/handlebars');
    var humanizeTime = function(seconds) {
    if (seconds == undefined || seconds == ""){
      return "-";
    }
    return new Date(seconds * 1000).toLocaleDateString("en-US")
    };

    Handlebars.registerHelper('prettyTime', humanizeTime);

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
