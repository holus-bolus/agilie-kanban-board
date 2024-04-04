export type Task = {
    title: string,
    id: string,
    status: 'todo' | 'in-progress' | 'done',
    points: number
}
