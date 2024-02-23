'use client';

import { persist, PersistOptions } from 'zustand/middleware';
import { create, StateCreator } from 'zustand';
import { useEffect } from 'react';

export function createPersistedStore<StateType>(
  createStore: StateCreator<StateType>,
  persistOptions: PersistOptions<StateType>,
) {
  const usePersistedStore = create(persist(createStore, persistOptions));

  const useMounted = create(() => false);

  const initialState = createStore(
    () => void 0,
    // @ts-expect-error Type 'undefined' is not assignable to type 'StateType'.
    () => void 0,
    () => void 0,
  );
  const initialStore = createStore(
    () => void 0,
    () => initialState,
    // @ts-expect-error Type 'undefined' is not assignable to type 'StateType'.
    () => void 0,
  );

  const useStore = (
    selector: <ExtractedState = StateType>(
      state: StateType,
      // @ts-expect-error Type 'StateType' is not assignable to type 'ExtractedState'.
    ) => ExtractedState = (state) => state,
  ) => {
    const store = usePersistedStore(selector);
    const mounted = useMounted();

    useEffect(() => {
      if (!mounted) {
        useMounted.setState(true);
      }
    }, [mounted]);

    return mounted ? store : selector(initialStore);
  };

  useStore.getState = usePersistedStore.getState;
  useStore.setState = usePersistedStore.setState;

  return useStore;
}
