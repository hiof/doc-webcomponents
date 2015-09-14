module.exports = function(Handlebars) {

    Handlebars.registerHelper('convertObjectToString', function(data) {
        var stringify = JSON.stringify(data);
        return stringify;
    });
};
