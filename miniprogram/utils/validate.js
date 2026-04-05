const validatePhone = (phone) => {
  if (!phone) return false;
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(phone);
};

const validateWechat = (wechat) => {
  if (!wechat) return false;
  const reg = /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/;
  return reg.test(wechat);
};

const validateName = (name) => {
  if (!name) return false;
  return name.trim().length >= 2 && name.trim().length <= 20;
};

const validateRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

const validateForm = (rules, data) => {
  const errors = [];
  
  for (const field in rules) {
    const rule = rules[field];
    const value = data[field];
    
    if (rule.required && !validateRequired(value)) {
      errors.push({ field, message: rule.message || `${field}不能为空` });
      continue;
    }
    
    if (value && rule.type === 'phone' && !validatePhone(value)) {
      errors.push({ field, message: rule.message || '手机号格式不正确' });
      continue;
    }
    
    if (value && rule.type === 'wechat' && !validateWechat(value)) {
      errors.push({ field, message: rule.message || '微信号格式不正确' });
      continue;
    }
    
    if (value && rule.minLength && value.length < rule.minLength) {
      errors.push({ field, message: rule.message || `${field}长度不能少于${rule.minLength}个字符` });
      continue;
    }
    
    if (value && rule.maxLength && value.length > rule.maxLength) {
      errors.push({ field, message: rule.message || `${field}长度不能超过${rule.maxLength}个字符` });
      continue;
    }
    
    if (value && rule.validator) {
      const result = rule.validator(value, data);
      if (result !== true) {
        errors.push({ field, message: result });
      }
    }
  }
  
  return errors;
};

module.exports = {
  validatePhone,
  validateWechat,
  validateName,
  validateRequired,
  validateForm
};
