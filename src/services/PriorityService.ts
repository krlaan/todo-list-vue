import { BaseEntityService } from './BaseEntityService'
import type { ITodoPriority } from '@/domain/ITodoPriority.ts'

export class PriorityService extends BaseEntityService<ITodoPriority> {
    constructor() {
        super('TodoPriorities')
    }
}
