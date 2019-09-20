function isMobile(mobile) {
  const patt = /^1[3456789]\d{9}$/;
  return patt.test(mobile);
}

module.exports = {
  isMobile, // 是否为手机号
}