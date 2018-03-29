import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/api/authentication/token',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/api/user/info',
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
