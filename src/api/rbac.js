import request from '@/utils/request'

export function list(token, pageIndex, pageSize) {
  return request({
    url: '/api/user/page',
    method: 'get',
    params: {
      pageIndex: pageIndex,
      pageSize: pageSize
    },
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
}

export function search(token, field, keyword) {
  return request({
    url: '/api/user/search',
    method: 'get',
    params: {
      field: field,
      keyword: keyword
    },
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
}
