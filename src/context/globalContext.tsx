'use client';
import { createContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';

type HoveredProject = { scale: number; videoSrc: string } | null;

interface CursorContext {
  hoveredProject: HoveredProject;
  setHoveredProject: Dispatch<SetStateAction<HoveredProject>>;
  cursorHandleMouseEnter: (videoSrc: string) => void;
  cursorHandleMouseLeave: () => void;
}

export const Context = createContext<CursorContext | null>(null);

const AppContext = ({ children }: { children: ReactNode }) => {
  const [hoveredProject, setHoveredProject] = useState<HoveredProject>(null);

  const cursorHandleMouseEnter = (videoSrc: string) => {
    setHoveredProject({ scale: 15, videoSrc });
  };
  const cursorHandleMouseLeave = () => {
    setHoveredProject(null);
  };

  return (
    <Context.Provider
      value={{
        hoveredProject,
        setHoveredProject,
        cursorHandleMouseEnter,
        cursorHandleMouseLeave,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AppContext;
