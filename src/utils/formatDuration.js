const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;
const ONE_MINUTE = 60 * 1000;
const ONE_SECOND = 1000;

/**
 * 格式化持续时间为“xx天xx小时xx分xx秒”
 * @param  {number} duration 以毫秒为单位的数字
 * @return {string}
 */
export function formatDuration(duration) {
  let ms = duration;
  const parts = [];

  if (ms >= ONE_DAY) {
    parts.push(`${Math.floor(ms / ONE_DAY)} 天`);
    ms %= ONE_DAY;
  }

  if (ms >= ONE_HOUR) {
    parts.push(`${Math.floor(ms / ONE_HOUR)} 时`);
    ms %= ONE_HOUR;
  }

  if (ms >= ONE_MINUTE) {
    parts.push(`${Math.floor(ms / ONE_MINUTE)} 分`);
    ms %= ONE_MINUTE;
  }

  if (ms >= ONE_SECOND) {
    parts.push(`${Math.floor(ms / ONE_SECOND)} 秒`);
    ms %= ONE_SECOND;
  } else {
    parts.push('0 秒');
  }

  return parts.join(' ');
}
