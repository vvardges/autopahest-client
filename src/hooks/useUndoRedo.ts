import { useCallback, useEffect, useRef, useState } from "react";

type Options = {
  maxHistory?: number; // default: 20
};

export function useUndoRedo<T>(initialState: T, options: Options = {}) {
  const { maxHistory = 5 } = options;

  const [state, setState] = useState<T>(initialState);
  const undoStack = useRef<string[]>([JSON.stringify(initialState)]);
  const redoStack = useRef<string[]>([]);

  const saveState = useCallback(
    (newState: T) => {
      const json = JSON.stringify(newState);
      undoStack.current.push(json);
      if (undoStack.current.length > maxHistory) undoStack.current.shift();
      redoStack.current.length = 0; // clear redo history
      setState(newState);
    },
    [maxHistory],
  );

  const undo = useCallback(() => {
    if (undoStack.current.length > 1) {
      redoStack.current.push(undoStack.current.pop()!);
      const previous = JSON.parse(
        undoStack.current[undoStack.current.length - 1],
      ) as T;
      setState(previous);
    }
  }, []);

  const redo = useCallback(() => {
    if (redoStack.current.length > 0) {
      const next = redoStack.current.pop()!;
      undoStack.current.push(next);
      setState(JSON.parse(next) as T);
    }
  }, []);

  // Keyboard shortcuts:
  // ✅ Windows/Linux: Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z
  // ✅ macOS: ⌘Z / ⌘⇧Z
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isUndo =
        (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey;
      const isRedoY = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y";
      const isRedoShiftZ =
        (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && e.shiftKey;

      if (isUndo) {
        e.preventDefault();
        undo();
      } else if (isRedoY || isRedoShiftZ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  return {
    state,
    setState: saveState,
    undo,
    redo,
    canUndo: undoStack.current.length > 1,
    canRedo: redoStack.current.length > 0,
  };
}
