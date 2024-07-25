const jwt = require("jsonwebtoken");
const User = require("../model/usersAuth")

const requireAuth = async (req, res, next) => {
  const SECRET = `InenwiNIWb39Nneol?s.mee39nshoosne(3n)`;
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json( "Authorization token required");
  } else {
    const token = authorization.split(" ")[1];
    try {
      const {_id} = jwt.verify(token, SECRET);
      const user_id = await User.findOne({user_id:_id}).select("user_id")
      req.id = user_id?.user_id
      next()
    } catch (error) {
      res.status(404).json("Request not authorized");
    }
  }
};

module.exports = requireAuth;