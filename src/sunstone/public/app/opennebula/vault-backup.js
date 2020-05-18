define(function(require) {
  
  var opennebula = require("opennebula");
  var RESOURCE = "Vault";

  var Vault = {
    "resource": RESOURCE,
    "list" : function(params, RESOURCE) {
      var callback = params.success;
      var _table_dat;
      $.ajax('/hypercx/vault-backup',
                {            
                    async: false,
                    success: function (data, status, xhr) {
                            return callback? callback('/hypercx/vault-backup', data): null
                    }
                });
    },
    "getName": function(id){
      return "";
    }
  }

  return Vault;
})