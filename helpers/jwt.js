let { expressjwt: jwt } = require("express-jwt");

async function isRevoked(req, payload) {
  if (!payload.payload.isAdmin) {
    return payload !== "undefined";
  }
}

function authJwt() {
  const secret = process.env.secret;
  const api = process.env.API_URL;
  return jwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/users(.*)/, methods: ["POST", "GET", "OPTIONS"] },
      `${api}/users/login`,
      `${api}/users/register`,
      { url: /public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      `${api}/agents`,
      `${api}/agents/login`,
      { url: /\/api\/v1\/students(.*)/, methods: ["POST", "GET", "OPTIONS"] },
      { url: /\/api\/v1\/cities(.*)/, methods: ["POST", "GET", "OPTIONS"] },
      {
        url: /\/api\/v1\/decode-vietqr(.*)/,
        methods: ["POST", "GET", "OPTIONS"],
      },
    ],
  });
}

module.exports = authJwt;
