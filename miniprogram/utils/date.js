const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  const second = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second);
};

const formatTime = (date) => {
  return formatDate(date, 'YYYY-MM-DD HH:mm:ss');
};

const formatShortTime = (date) => {
  return formatDate(date, 'MM-DD HH:mm');
};

const getWeekDay = (date) => {
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekDays[new Date(date).getDay()];
};

const isToday = (date) => {
  const today = new Date();
  const d = new Date(date);
  return today.getFullYear() === d.getFullYear() &&
    today.getMonth() === d.getMonth() &&
    today.getDate() === d.getDate();
};

const isTomorrow = (date) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const d = new Date(date);
  return tomorrow.getFullYear() === d.getFullYear() &&
    tomorrow.getMonth() === d.getMonth() &&
    tomorrow.getDate() === d.getDate();
};

const getRelativeTime = (date) => {
  const now = new Date();
  const d = new Date(date);
  const diff = now - d;
  
  if (diff < 60000) {
    return '刚刚';
  } else if (diff < 3600000) {
    return Math.floor(diff / 60000) + '分钟前';
  } else if (diff < 86400000) {
    return Math.floor(diff / 3600000) + '小时前';
  } else if (diff < 2592000000) {
    return Math.floor(diff / 86400000) + '天前';
  } else {
    return formatDate(date, 'YYYY-MM-DD');
  }
};

module.exports = {
  formatDate,
  formatTime,
  formatShortTime,
  getWeekDay,
  isToday,
  isTomorrow,
  getRelativeTime
};
