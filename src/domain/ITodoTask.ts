export interface ITodoTask {
    id?: string;
    taskName: string;
    taskSort: number;
    createdDt: string;
    dueDt?: string | null;
    isCompleted: boolean;
    isArchived: boolean;
    todoCategoryId: string;
    todoPriorityId: string;
    syncDt: string;
}
