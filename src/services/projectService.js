import { INITIAL_PROJECTS } from '../data/defaultProjects';

const STORAGE_KEY = 'ai_video_prompt_studio_projects_v1';

export const projectService = {
  /**
   * Retrieves all projects from local storage or seeds with default projects
   */
  getProjects() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored projects, resetting to defaults', e);
    }

    // Seed defaults
    this.saveProjects(INITIAL_PROJECTS);
    return INITIAL_PROJECTS;
  },

  /**
   * Retrieves a single project by ID
   */
  getProjectById(id) {
    const projects = this.getProjects();
    return projects.find(p => p.id === id) || null;
  },

  /**
   * Saves or updates a project
   */
  saveProject(project) {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    const updated = {
      ...project,
      updatedAt: new Date().toISOString()
    };

    if (index >= 0) {
      projects[index] = updated;
    } else {
      projects.unshift(updated);
    }

    this.saveProjects(projects);
    return updated;
  },

  /**
   * Saves full list of projects
   */
  saveProjects(projects) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Error saving projects to localStorage', e);
    }
  },

  /**
   * Duplicates an existing project
   */
  duplicateProject(id) {
    const projects = this.getProjects();
    const existing = projects.find(p => p.id === id);
    if (!existing) return null;

    const duplicated = {
      ...JSON.parse(JSON.stringify(existing)),
      id: `proj-${Date.now()}`,
      title: `${existing.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    projects.unshift(duplicated);
    this.saveProjects(projects);
    return duplicated;
  },

  /**
   * Deletes a project by ID
   */
  deleteProject(id) {
    const projects = this.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    this.saveProjects(filtered);
    return filtered;
  },

  /**
   * Renames a project
   */
  renameProject(id, newTitle) {
    const project = this.getProjectById(id);
    if (!project) return null;
    project.title = newTitle;
    return this.saveProject(project);
  },

  /**
   * Resets projects to initial demo state
   */
  resetToDefaults() {
    this.saveProjects(INITIAL_PROJECTS);
    return INITIAL_PROJECTS;
  }
};
