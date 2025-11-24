import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Project, Objective, Initiative, Milestone, RedFlag } from '../types';

interface AppContextType {
  projects: Project[];
  objectives: Objective[];
  initiatives: Initiative[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addObjective: (objective: Omit<Objective, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateObjective: (id: string, updates: Partial<Objective>) => void;
  deleteObjective: (id: string) => void;
  addInitiative: (initiative: Omit<Initiative, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInitiative: (id: string, updates: Partial<Initiative>) => void;
  deleteInitiative: (id: string) => void;
  addMilestone: (projectId: string, milestone: Omit<Milestone, 'id' | 'projectId'>) => void;
  toggleMilestone: (projectId: string, milestoneId: string) => void;
  addRedFlag: (projectId: string, redFlag: Omit<RedFlag, 'id' | 'projectId'>) => void;
  resolveRedFlag: (projectId: string, redFlagId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'okr-portfolio-data';

interface StorageData {
  projects: Project[];
  objectives: Objective[];
  initiatives: Initiative[];
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: StorageData = JSON.parse(stored);
        setProjects(data.projects.map(p => ({
          ...p,
          startDate: new Date(p.startDate),
          targetEndDate: p.targetEndDate ? new Date(p.targetEndDate) : undefined,
          actualEndDate: p.actualEndDate ? new Date(p.actualEndDate) : undefined,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          milestones: p.milestones.map(m => ({ ...m, date: new Date(m.date) })),
          redFlags: p.redFlags.map(r => ({ ...r, createdAt: new Date(r.createdAt) })),
        })));
        setObjectives(data.objectives.map(o => ({
          ...o,
          createdAt: new Date(o.createdAt),
          updatedAt: new Date(o.updatedAt),
        })));
        setInitiatives(data.initiatives.map(i => ({
          ...i,
          createdAt: new Date(i.createdAt),
          updatedAt: new Date(i.updatedAt),
        })));
      } catch (error) {
        console.error('Failed to load data from localStorage:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const data: StorageData = { projects, objectives, initiatives };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [projects, objectives, initiatives]);

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Project operations
  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...project,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(projects.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
    ));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  // Objective operations
  const addObjective = (objective: Omit<Objective, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newObjective: Objective = {
      ...objective,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setObjectives([...objectives, newObjective]);
  };

  const updateObjective = (id: string, updates: Partial<Objective>) => {
    setObjectives(objectives.map(o =>
      o.id === id ? { ...o, ...updates, updatedAt: new Date() } : o
    ));
  };

  const deleteObjective = (id: string) => {
    setObjectives(objectives.filter(o => o.id !== id));
  };

  // Initiative operations
  const addInitiative = (initiative: Omit<Initiative, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newInitiative: Initiative = {
      ...initiative,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setInitiatives([...initiatives, newInitiative]);
  };

  const updateInitiative = (id: string, updates: Partial<Initiative>) => {
    setInitiatives(initiatives.map(i =>
      i.id === id ? { ...i, ...updates, updatedAt: new Date() } : i
    ));
  };

  const deleteInitiative = (id: string) => {
    setInitiatives(initiatives.filter(i => i.id !== id));
  };

  // Milestone operations
  const addMilestone = (projectId: string, milestone: Omit<Milestone, 'id' | 'projectId'>) => {
    const newMilestone: Milestone = {
      ...milestone,
      id: generateId(),
      projectId,
    };
    updateProject(projectId, {
      milestones: [...(projects.find(p => p.id === projectId)?.milestones || []), newMilestone],
    });
  };

  const toggleMilestone = (projectId: string, milestoneId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      const updatedMilestones = project.milestones.map(m =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      );
      updateProject(projectId, { milestones: updatedMilestones });
    }
  };

  // RedFlag operations
  const addRedFlag = (projectId: string, redFlag: Omit<RedFlag, 'id' | 'projectId'>) => {
    const newRedFlag: RedFlag = {
      ...redFlag,
      id: generateId(),
      projectId,
      createdAt: new Date(),
    };
    updateProject(projectId, {
      redFlags: [...(projects.find(p => p.id === projectId)?.redFlags || []), newRedFlag],
    });
  };

  const resolveRedFlag = (projectId: string, redFlagId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      const updatedRedFlags = project.redFlags.map(r =>
        r.id === redFlagId ? { ...r, resolved: true } : r
      );
      updateProject(projectId, { redFlags: updatedRedFlags });
    }
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        objectives,
        initiatives,
        addProject,
        updateProject,
        deleteProject,
        addObjective,
        updateObjective,
        deleteObjective,
        addInitiative,
        updateInitiative,
        deleteInitiative,
        addMilestone,
        toggleMilestone,
        addRedFlag,
        resolveRedFlag,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
