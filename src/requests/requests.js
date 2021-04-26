import axios from "axios";

// Variável que contém dados específicos para modo desenvolvimento, modo de produção e para ambos.
import envVar from '@/environment/variables.js'


async function req(method, token, route, body, isJson = true) {

  // Deixando método com todas as letras maiúsculas.
  method = method.toUpperCase();

  // Montando objeto para request.
  var o = {
    method: method,
    url: route,
    headers: {
      "Content-Type": isJson ? "application/json" : "multipart/form-data"
    }
  };

  // Adicionando token.
  if (token) {
    o.headers["Authorization"] = `Bearer ${token}`
  }

  // Adicionando body caso o método seja diferente de um GET.
  if (method !== "GET" && body) {
    o.data = body
  }

  try {
    // Realizando a requisição.
    var reqResponse = await axios(o).then(resp => {
      return resp
    })
    .catch(error => {
      let responseError = {error: true, message: error.message}

      if (error.response) {
        // A request foi feita e o servidor respondeu com um status fora do range 2xx.
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);

        responseError.status = error.response.status
        responseError.data = error.response.data

      } else if (error.request) {
        // A request foi feita mas não recebemos a reposta.
        // `error.request` é uma instância XMLHttpRequest no
        // browser e uma instância de http.ClientRequest no node.js.
        console.log(error.request);
      } else {
        // Algo aconteceu na configuração da request e lançou um erro.
        console.log('Error', error.message);
      }
      console.log(error.config);

      return responseError
    })

    return reqResponse
  } catch (error) {
    return error;
  }
}

// ============================================== //
// ----------- WORKFLOW API REQUESTS ------------ //
// ============================================== //

export const getModules = async function () {
  let response = null
  let route = `http://localhost:4000/api/module/list`

  response = await req('get', null, route, {})

  return response
}

export const getFunctions = async function () {
  let response = null
  let route = `http://localhost:4000/api/modules-functions`

  response = await req('get', null, route, {})

  return response
}

export const getSequences = async function () {
  let response = null
  let route = `http://localhost:4000/api/sequence/list`

  response = await req('get', null, route, {})

  return response
}

export const setSequence = async function (sequence) {
  let response = null
  let route = `http://localhost:4000/api/sequence/create`

  response = await req('post', null, route, sequence)

  return response
}

export const updateSequence = async function (sequence) {
  let response = null
  let route = `http://localhost:4000/api/sequence/update/${sequence.id}`

  response = await req('put', null, route, sequence)

  return response
}

export const registerClient = async function (clientData) {
  let response = null
  let route = `http://localhost:4000/api/register-client`

  response = await req('post', null, route, clientData)

  return response
}

// ============================================== //
// -------------- REQUESTS GERAIS --------------- //
// ============================================== //

export const getAddressByPostalCode = async function (postalCode) {
  let response = null
  let route = `https://viacep.com.br/ws/${postalCode}/json/`

  response = await req('get', null, route, {})

  return response
}