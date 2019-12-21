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
