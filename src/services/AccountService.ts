import type { IResultObject } from '@/types/IResultObject'
import { BaseService } from './BaseService'
import type { ILoginDto } from '@/types/ILoginDto.ts'

export abstract class AccountService extends BaseService {
  static async login(email: string, password: string): Promise<IResultObject<ILoginDto>> {
    const url = 'account/login'

    try {
      const loginData = {
        email,
        password,
      }

      const response = await this.axios.post<ILoginDto>(url, loginData)
      console.log('login response', response)

      if (response.status <= 300) {
        return { data: response.data }
      }

      return {
        errors: [(response.status.toString() + ' ' + response.statusText).trim()],
      }
    } catch (error) {
      console.log('error: ', (error as Error).message)
      return {
        errors: [JSON.stringify(error)],
      }
    }
  }

  static async register(email: string, firstName: string, lastName: string, password: string): Promise<IResultObject<ILoginDto>> {
    const url = 'account/register';
    try {
      const registerData = {
        email,
        firstName,
        lastName,
        password
      }

      const response = await this.axios.post<ILoginDto>(url, registerData)

      console.log('register response', response)

      if (response.status <= 300) {
        return { data: response.data }
      }

      return {
        errors: [(response.status.toString() + ' ' + response.statusText).trim()],
      }
    } catch (error) {
      console.log('register error: ', (error as Error).message)
      return {
        errors: [JSON.stringify(error)],
      }
    }
  }
}
