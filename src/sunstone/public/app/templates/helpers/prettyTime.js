define(function(require) {
    var Handlebars = require('hbs/handlebars');
    var prettyTime = function(seconds) {
        if (seconds == undefined || seconds == ""){
            return "-";
        }
        return new Date(seconds * 1000).toLocaleDateString("en-US")
    };

    Handlebars.registerHelper('prettyTime', prettyTime);

    return prettyTime;
})
