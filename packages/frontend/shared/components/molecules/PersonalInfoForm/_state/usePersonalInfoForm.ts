import { create } from 'zustand';

interface PersonalInfoFormState {
  phoneNumber: string | undefined;
  setPhoneNumber: (phoneNumber: string) => void;
}

const usePersonalInfoForm = create<PersonalInfoFormState>()((set) => {
  return {
    phoneNumber: undefined,
    setPhoneNumber: (phoneNumber: string) => set({ phoneNumber }),
  };
});

export default usePersonalInfoForm;
