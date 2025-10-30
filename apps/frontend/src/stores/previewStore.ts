import { Store } from '@tanstack/store';

type PreviewState = {
  isPreview: boolean;
  isDraftsPerspective: boolean; // Tracks Studio's perspective: true for drafts, false for published
};

// Create the preview store with initial state
export const previewStore = new Store<PreviewState>({
  isPreview: false,
  isDraftsPerspective: false,
});

// Helper functions for updating the store
export const setPreviewMode = (isPreview: boolean) => {
  previewStore.setState((state) => ({
    ...state,
    isPreview,
    // When entering preview mode, default to drafts perspective
    isDraftsPerspective: isPreview ? true : false,
  }));
};

export const setPreviewPerspective = (isDrafts: boolean) => {
  previewStore.setState((state) => ({
    ...state,
    isDraftsPerspective: isDrafts,
  }));
};

export const getPreviewMode = () => {
  return previewStore.state.isPreview;
};

export const getPreviewPerspective = () => {
  return previewStore.state.isDraftsPerspective;
};
