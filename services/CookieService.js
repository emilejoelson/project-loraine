const { REFRESH_TOKEN_EXPIRY_MS } = require('./TokenService');
const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_EXPIRY_MS
  });
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken');
};

module.exports = {
  setRefreshTokenCookie,
  clearRefreshTokenCookie
};