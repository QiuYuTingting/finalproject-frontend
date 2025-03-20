const ONE_GB = 1024 * 1024 * 1024;
const ONE_MB = 1024 * 1024;
const ONE_KB = 1024;

/**
 * 格式化字节大小（KB, MB, GB）
 * @param  {number} size 以字节（byte）为单位的数字
 * @return {string}
 */
export function formatSize(size) {
  if (size >= ONE_GB) {
    return (size / ONE_GB).toFixed(2) + ' GB';
  }

  if (size >= ONE_MB) {
    return (size / ONE_MB).toFixed(2) + ' MB';
  }

  if (size >= ONE_KB) {
    return (size / ONE_KB).toFixed(2) + ' KB';
  }

  return size + ' B';
};
