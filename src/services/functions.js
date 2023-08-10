let timeout
export function debounce (func, wait = 300) {
  if (timeout !== null) clearTimeout(timeout)
  timeout = setTimeout(function () {
    typeof func === 'function' && func()
  }, wait)
}
