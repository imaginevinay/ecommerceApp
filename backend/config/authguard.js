const errorJson = require("../commons/response").errorJson;
const property = require("../commons/propertyFile");
module.exports = {
  ensureAuthenticated: function (req, res, next) {
    console.log("authenticated > ", req.isAuthenticated());
    if (req.isAuthenticated()) {
      return next();
    }
    errorJson.status = property.forbiddenCode;
    errorJson.msg = property.F004;
    res.send(errorJson);
  }
};
