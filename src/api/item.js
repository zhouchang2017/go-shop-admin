export function getResources(query) {
  return axios({
    url: '/items',
    method: 'get',
    params: query
  })
}

export function getResource(id, query = null) {
  return axios({
    url: `/items/${id}`,
    method: 'get',
    params: query
  })
}

export function createResource(data) {
  return axios({
    url: '/items',
    method: 'post',
    data
  })
}

export function updateResource(id, data) {
  return axios({
    url: `/items/${id}`,
    method: 'put',
    data
  })
}

export function deleteResource(id) {
  return axios({
    url: `/items/${id}`,
    method: 'delete'
  })
}

export function forceDeleteResource(id) {
  return axios({
    url: `/items/${id}/force`,
    method: 'delete'
  })
}

export function restoreResource(id) {
  return axios({
    url: `/items/${id}/restore`,
    method: 'put'
  })
}
