import { create } from 'zustand';
import { Task } from '@/data/mockData';

interface TaskStore {
  tasks: Task[];
  addTask: (task: Task) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
}));
