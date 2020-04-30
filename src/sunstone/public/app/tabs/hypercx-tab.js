define(function(require) {

    require('jquery');
      _html = "<table><tr><th>Backup VM Name</th><th>Backup Date</th><th>Status</th></tr>";
      TAB_ID = 'hypercx-tab';
      $.ajax('/hypercx',
              {            
                  async: false,
                  success: function (data, status, xhr) {
                          jQuery.each(data, function(key, val) {
                              _html += "<tr><td>"+ val +"</td><td>"+ key +"</td><td>FAILED</td></tr>";
                          });
                  }
              });
      _html += "</table>";
      console.log(_html);
      var Tab = {
          tabId: TAB_ID,
          title: 'HyperCX Services',
          listHeader: 'HyperCX Services',
          content:_html
      };
  
      return Tab;
  
  });