import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

// 获取 -> cookie:name=Admin-Token
export function getToken() {
  return Cookies.get(TokenKey)
}

// 设置 -> cookie:name=Admin-Token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 移除 -> cookie:name=Admin-Token
export function removeToken() {
  return Cookies.remove(TokenKey)
}
