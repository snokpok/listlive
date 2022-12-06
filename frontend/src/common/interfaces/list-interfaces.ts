import { ITodoItem } from './todo-interfaces';

export interface TodoListInterface {
    _id: string;
    title: string;
    description: string | null;
    items: ITodoItem[];
}
