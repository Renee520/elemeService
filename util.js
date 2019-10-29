var str = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

function isMobile(mobile) {
  const patt = /^1[3456789]\d{9}$/;
  return patt.test(mobile);
}

/**
 * 
 * @param {昵称个数} num 
 */
function getRandomName(num = 5) {
  let name = '';
  for (let i = 0; i < num; i ++) {
    const random = parseInt(Math.random() * 26);
    name += `${str[random]}`;
  }
  return name;
}

/**
 * 复选框值on转变
 * @param {*} value 
 * @param {转变成的类型} type |number|boolean 
 */
function checkboxValue(value, type = 'boolean') {
  if (type === 'number') {
    return value ? 1 : 0;
  }
  return !!value;
}

module.exports = {
  isMobile, // 是否为手机号
  getRandomName, // 随机生成昵称
  checkboxValue,
}