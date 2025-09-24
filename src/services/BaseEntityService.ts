import type {IResultObject} from '@/types/IResultObject'
import {BaseService} from './BaseService'
import { useUserDataStore } from '@/stores/userDataStore'

export abstract class BaseEntityService<TEntity>
    extends BaseService {

    private store = useUserDataStore()

    protected constructor(private basePath: string) {
        super()
    }

    private getAuthOptions() {
        if (!this.store.jwt) return {};

        return {
            headers: {
                Authorization: `Bearer ${this.store.jwt}`,
            },
        };
    }

    async getAsync(id: string): Promise<IResultObject<TEntity>> {
        try {

            const response = await BaseService.axios.get<TEntity>
            (this.basePath + "/" + id, this.getAuthOptions())

            if (response.status <= 300) {
                return {data: response.data}
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

    async getAllAsync(): Promise<IResultObject<TEntity[]>> {
        try {

            const response = await BaseService.axios.get<TEntity[]>(
                this.basePath, this.getAuthOptions())

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

    async addAsync(entity: TEntity): Promise<IResultObject<TEntity>> {
        try {
            const response = await BaseService.axios.post<TEntity>(
                this.basePath, entity, this.getAuthOptions())

            console.log('add Async response', response)

            if (response.status <= 300) {
                return {data: response.data}
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

    async updateAsync(id: string, entity: TEntity): Promise<IResultObject<TEntity>> {
        try {

            const response = await BaseService.axios.put<TEntity>(
                `${this.basePath}/${id}`, entity, this.getAuthOptions())

            console.log('update response')

            if (response.status <= 300) {
                return {data: response.data}
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

    async deleteAsync(id: string): Promise<IResultObject<void>> {
        try {

            const response = await BaseService.axios.delete<void>(
                `${this.basePath}/${id}`, this.getAuthOptions())

            console.log('delete response')

            if (response.status <= 300) {
                return {data: undefined}
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
}
