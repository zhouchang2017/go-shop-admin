export function getRouters() {
  return axios({
    url: '/routers',
    method: 'get'
  })
}

// 文件服务接口
export function getQiniuToken() {
  return axios({
    url: `/qiniu`,
    method: 'get'
  })
}

// lenses
export function getLenses(resourceUri) {
  return axios({
    url: `/lenses/${resourceUri}`,
    method: 'get'
  })
}

// links
export function getLinks(resourceUri) {
  return axios({
    url: `/links/${resourceUri}`,
    method: 'get'
  })
}
