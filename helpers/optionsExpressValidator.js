module.exports = function (app) {
    
    var expressValidator = require('express-validator');
    
    app.use(expressValidator({
        errorFormatter: function (param, msg, value) {
            var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;
            
            while (namespace.length) {
                formParam += '[' + namespace.shift() + ']';
            }
            return (Array.isArray(msg))? {
                errorCode: msg[1],
                errorMsg: param.toUpperCase() + " - " + msg[0]
            }:{
                errorCode: -1,
                errorMsg: param.toUpperCase() + " - " + msg
            };
        },
        customValidators: {
            isArray: function (value) {
                return Array.isArray(value);
            },
            gte: function (param, num) {
                return param >= num;
            }
        }
    }));
};
