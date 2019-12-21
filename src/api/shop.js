export function getResources(query) {
  return axios({
    url: '/shops',
    method: 'get',
    params: query
  })
}

export function getResource(id, query = null) {
  return axios({
    url: `/shops/${id}`,
    method: 'get',
    params: query
  })
}

export function createResource(data) {
  return axios({
    url: '/shops',
    method: 'post',
    data
  })
}

export function updateResource(id, data) {
  return axios({
    url: `/shops/${id}`,
    method: 'put',
    data
  })
}

export function deleteResource(id) {
  return axios({
    url: `/shops/${id}`,
    method: 'delete'
  })
}

export function forceDeleteResource(id) {
  return axios({
    url: `/shops/${id}/force`,
    method: 'delete'
  })
}

export function restoreResource(id) {
  return axios({
    url: `/shops/${id}/restore`,
    method: 'put'
  })
}
