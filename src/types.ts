export type Priority = 'low' | 'medium' | 'high';

export type Category = 'Work' | 'Personal' | 'Shopping' | 'Health' | 'Projects' | 'General';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: Priority;
  category?: Category;
  dueDate?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  category?: Category;
  dueDate?: string;
}

export interface TodoFilter {
  search?: string;
  status?: 'all' | 'active' | 'completed';
  category?: string;
  priority?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  highPriority: number;
  completionRate: number;
}
