export interface ITodoPriority {
    id?: string;
    appUserId?: string;
    priorityName: string;
    prioritySort: number;
    syncDt?: string;
    tag?: string;
}
