import { BaseEntityService } from './BaseEntityService'
import type { ITodoCategory } from '@/domain/ITodoCategory.ts'

export class CategoryService extends BaseEntityService<ITodoCategory> {
    constructor() {
        super('TodoCategories')
    }
}
