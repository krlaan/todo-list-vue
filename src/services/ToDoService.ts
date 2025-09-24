import { BaseEntityService } from './BaseEntityService'
import type { ITodoTask } from '@/domain/ITodoTask.ts'

export class ToDoService extends BaseEntityService<ITodoTask> {
    constructor() {
        super('TodoTasks')
    }
}
