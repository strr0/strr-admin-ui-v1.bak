import axios from 'axios'
import { Message } from "element-ui"

axios.interceptors.response.use(
  response => {
    if(response.status && response.status == 200) {
      //Message.success({message: response.data.message})
      return response.data
    }
    else {
      Message.error({message: response.data.message})
      return
    }
  },
  error => {
    Message.error({message: error.response.data.message})
    return
  }
)

export const getRequest = (url, token) => {
  let _headers = {}
  if (token) {
    _headers = headers(token.key, token.value)
  }
  return axios({
    method: 'GET',
    url: url,
    headers: _headers
  })
}

export const postRequest = (url, params, token) => {
  let _headers = {}
  if (token) {
    _headers = headers(token.key, token.value)
  }
  return axios({
    method: 'POST',
    url: url,
    data: params,
    transformRequest: [ transformRequest ],
    headers: _headers
  })
}

export const putRequest = (url, params, token) => {
  let _headers = {}
  if (token) {
    _headers = headers(token.key, token.value)
  }
  return axios({
    method: 'PUT',
    url: url,
    data: params,
    transformRequest: [ transformRequest ],
    headers: _headers
  })
}

export const deleteRequest = (url, token) => {
  let _headers = {}
  if (token) {
    _headers = headers(token.key, token.value)
  }
  return axios({
    method: 'DELETE',
    url: url,
    headers: _headers
  })
}

const headers = (key, value) => {
  return {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': key + ' ' + value
  }
}

const transformRequest = data => {
  let ret = '';
  for (let key in data) {
    if (data[key] && data[key] != 'null') {
      ret += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
    }
  }
  return ret;
}