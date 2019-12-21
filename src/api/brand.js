export function getResources(query) {
  return axios({
    url: '/brands',
    method: 'get',
    params: query
  })
}

export function getResource(id, query = null) {
  return axios({
    url: `/brands/${id}`,
    method: 'get',
    params: query
  })
}

export function createResource(data) {
  return axios({
    url: '/brands',
    method: 'post',
    data
  })
}

export function updateResource(id, data) {
  return axios({
    url: `/brands/${id}`,
    method: 'put',
    data
  })
}

export function deleteResource(id) {
  return axios({
    url: `/brands/${id}`,
    method: 'delete'
  })
}

export function forceDeleteResource(id) {
  return axios({
    url: `/brands/${id}/force`,
    method: 'delete'
  })
}

export function restoreResource(id) {
  return axios({
    url: `/brands/${id}/restore`,
    method: 'put'
  })
}
