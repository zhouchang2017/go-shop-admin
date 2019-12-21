export function getResources(query) {
  return axios({
    url: '/admins',
    method: 'get',
    params: query
  })
}

export function getResource(id, query = null) {
  return axios({
    url: `/admins/${id}`,
    method: 'get',
    params: query
  })
}

export function createResource(data) {
  return axios({
    url: '/admins',
    method: 'post',
    data
  })
}

export function updateResource(id, data) {
  return axios({
    url: `/admins/${id}`,
    method: 'put',
    data
  })
}

export function deleteResource(id) {
  return axios({
    url: `/admins/${id}`,
    method: 'delete'
  })
}

export function forceDeleteResource(id) {
  return axios({
    url: `/admins/${id}/force`,
    method: 'delete'
  })
}

export function restoreResource(id) {
  return axios({
    url: `/admins/${id}/restore`,
    method: 'put'
  })
}
