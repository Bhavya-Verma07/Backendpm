const jwt = require("jsonwebtoken");
const key = process.env.JWT_SECRET || "$$demoUserDevSECRET%%";

const verifyToken = (token) => {
  if (!token) return {};
  return new Promise((resolve, reject) =>
    jwt.verify(token, key, (err, decoded) =>
      err ? reject({ message: err }) : resolve(decoded.id)
    )
  );
};

module.exports.verifyJWT = async function (jwt) {
  return await verifyToken(jwt);
};

module.exports.signJWT = async function (payload) {
  return jwt.sign(payload, key, { expiresIn: 10800 * 8 });
};

module.exports.setCookie = async function (res, token) {
  var date = new Date();
  date.setTime(date.getTime() + 24 * 60 * 60 * 1000);

  let cookieAuthObj = {
    expires: date,
  };
  res.cookie("auth_tk", token, cookieAuthObj);
};

module.exports.clearCookie = async function (res) {
  let cookieAuthObj;
  if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
    cookieAuthObj = {
      expires: new Date(),
    };
  }
  res.cookie("auth_tk", "deleted", cookieAuthObj);
};
