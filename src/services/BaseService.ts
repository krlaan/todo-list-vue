import axios from 'axios'

export abstract class BaseService {
  protected static axios = axios.create({
    baseURL: 'https://taltech.akaver.com/api/v1/',
    headers: {
      common: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  })
}
