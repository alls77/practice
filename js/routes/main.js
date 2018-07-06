exports.get = function(req, res)
{
  res.render("main", {
    email: "saruman"
  });
};