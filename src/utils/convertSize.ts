export function convertSize(size: number) {
  const i: number = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return <never>(size / Math.pow(1024, i)).toFixed(2) * 1 + '\u00A0' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}