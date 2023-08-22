import { create } from "zustand";
import type { BoardWithLists, TaskWithSubtasks } from "./types";

type TaskModalData = {
  selectedTask: TaskWithSubtasks | null;
  taskBoard: BoardWithLists;
};

type BearStore = {
  taskModalOpen: boolean;
  taskModalData: TaskModalData | null;
  openTaskModal: (data: TaskModalData) => void;
  closeTaskModal: () => void;

  boardModalOpen: boolean;
  boardModalData: BoardWithLists | null;
  openBoardModal: (data: BoardWithLists | null) => void;
  closeBoardModal: () => void;
};

const useStore = create<BearStore>()((set) => ({
  taskModalOpen: false,
  taskModalData: null,
  openTaskModal: (data) => set({ taskModalOpen: true, taskModalData: data }),
  closeTaskModal: () => {
    set({ taskModalOpen: false });
    setTimeout(() => set({ taskModalData: null }), 300);
  },

  boardModalOpen: false,
  boardModalData: null,
  openBoardModal: (data) => set({ boardModalOpen: true, boardModalData: data }),
  closeBoardModal: () => {
    set({ boardModalOpen: false });
    setTimeout(() => set({ boardModalData: null }), 300);
  },
}));

export const useTaskModal = () =>
  useStore((state) => ({
    taskModalOpen: state.taskModalOpen,
    taskModalData: state.taskModalData,
    openTaskModal: state.openTaskModal,
    closeTaskModal: state.closeTaskModal,
  }));

export const useBoardModal = () =>
  useStore((state) => ({
    boardModalOpen: state.boardModalOpen,
    boardModalData: state.boardModalData,
    openBoardModal: state.openBoardModal,
    closeBoardModal: state.closeBoardModal,
  }));
