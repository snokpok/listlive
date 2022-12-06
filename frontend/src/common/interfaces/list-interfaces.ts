import { ITodoItem } from './todo-interfaces';

export interface TodoListInterface {
  id: string;
  title: string;
  description: string | null;
  items: ITodoItem[];
}
