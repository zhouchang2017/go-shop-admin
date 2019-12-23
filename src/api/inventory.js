export function aggregate(query) {
  return axios({
    url: '/aggregate/inventories',
    method: 'get',
    params: query
  })
}

export function getResources(query) {
  return axios({
    url: '/inventories',
    method: 'get',
    params: query
  })
}

export function getResource(id, query = null) {
  return axios({
    url: `/inventories/${id}`,
    method: 'get',
    params: query
  })
}

export function createResource(data) {
  return axios({
    url: '/inventories',
    method: 'post',
    data
  })
}

export function updateResource(id, data) {
  return axios({
    url: `/inventories/${id}`,
    method: 'put',
    data
  })
}

export function deleteResource(id) {
  return axios({
    url: `/inventories/${id}`,
    method: 'delete'
  })
}

export function forceDeleteResource(id) {
  return axios({
    url: `/inventories/${id}/force`,
    method: 'delete'
  })
}

export function restoreResource(id) {
  return axios({
    url: `/inventories/${id}/restore`,
    method: 'put'
  })
}
