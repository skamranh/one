define(function(require) {
  
  var opennebula = require("opennebula");
  var RESOURCE = "Vault";

  var Vault = {
    "resource": RESOURCE,
    "list" : function(params, RESOURCE) {
      var callback = params.success;
      var _table_dat;
      $.ajax('/hypercx/vault-info',
                {            
                    async: false,
                    success: function (data, status, xhr) {
                            return callback? callback('/hypercx/vault-info', data): null
                    }
                });
    },
    "getName": function(id){
      return "";
    }
  }

  return Vault;
})