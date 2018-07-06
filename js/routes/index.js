module.exports = function(db) {

    return {
        index: function(req, res, next) {
            res.send('index');
        }
    }
}