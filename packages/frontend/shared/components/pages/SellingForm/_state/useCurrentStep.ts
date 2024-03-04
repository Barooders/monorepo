import { create } from 'zustand';
import { FormStepType } from '../types';

interface SearchPageState {
  currentEditingStep: FormStepType | null;
  goBackToMenu: () => void;
  onStepPress: (item: FormStepType) => void;
}

const useCurrentStep = create<SearchPageState>()((set) => {
  return {
    currentEditingStep: null,
    goBackToMenu: () => {
      set({ currentEditingStep: null });
      window.scrollTo({ top: 0, left: 0 });
    },
    onStepPress: (currentEditingStep: FormStepType | null) => {
      set({ currentEditingStep });
      window.scrollTo({ top: 0, left: 0 });
    },
  };
});

export default useCurrentStep;
