module.exports = function(db) {

    return {
        join: function(req, res, next) {
            res.send('join');
        }
    }
}