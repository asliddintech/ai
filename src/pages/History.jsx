import React, { useState } from 'react';
import { 
  History as HistoryIcon, 
  Search, 
  Film, 
  Clock, 
  Copy, 
  Trash2, 
  Edit2, 
  FolderOpen, 
  Check, 
  X,
  AlertTriangle
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

export function History() {
  const { 
    projects, 
    openProject, 
    duplicateProject, 
    deleteProject, 
    renameProject,
    navigateTo,
    t
  } = useStudio();

  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Generated' | 'Draft' | 'Archived'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Inline rename state
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  // Delete confirmation modal state
  const [projectToDelete, setProjectToDelete] = useState(null);

  const filtered = projects.filter((p) => {
    const matchesFilter = activeFilter === 'All' || (p.status || 'Generated') === activeFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.idea.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStartRename = (project) => {
    setRenamingId(project.id);
    setRenameValue(project.title);
  };

  const handleSaveRename = (id) => {
    if (renameValue.trim()) {
      renameProject(id, renameValue.trim());
    }
    setRenamingId(null);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  const getFilterLabel = (status) => {
    switch (status) {
      case 'All': return t('filterAll') || 'All';
      case 'Generated': return t('filterGenerated') || 'Generated';
      case 'Draft': return t('filterDraft') || 'Draft';
      case 'Archived': return t('filterArchived') || 'Archived';
      default: return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">{t('projectArchiveBadge')}</span>
            <Badge variant="outline" size="sm">{projects.length} Total</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            {t('historyHeaderTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-studio-400 mt-1">
            {t('historyHeaderSub')}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-studio-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchHistoryPlaceholder')}
            className="w-full bg-studio-900 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-studio-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
        {['All', 'Generated', 'Draft', 'Archived'].map((status) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
              activeFilter === status
                ? 'bg-studio-800 text-white font-medium border border-white/15'
                : 'text-studio-400 hover:text-white hover:bg-studio-900'
            }`}
          >
            {getFilterLabel(status)}
          </button>
        ))}
      </div>

      {/* Projects Table / Card List */}
      <div className="space-y-3">
        {filtered.map((proj) => {
          const isRenaming = renamingId === proj.id;
          const sceneCount = proj.scenes?.length || 0;
          const dateStr = new Date(proj.updatedAt || proj.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          return (
            <div
              key={proj.id}
              className="p-4 sm:p-5 rounded-xl bg-studio-900 border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              {/* Project Meta Left */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-studio-800 border border-white/10 flex items-center justify-center shrink-0 text-indigo-400 group-hover:border-indigo-500/40 transition-colors">
                  <Film className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  {isRenaming ? (
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        autoFocus
                        className="bg-studio-800 border border-indigo-500/50 rounded px-2.5 py-1 text-xs text-white font-medium focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveRename(proj.id)}
                        className="p-1 text-emerald-400 hover:text-emerald-300"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setRenamingId(null)}
                        className="p-1 text-studio-500 hover:text-studio-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mb-1">
                      <h3 
                        onClick={() => openProject(proj.id)}
                        className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors cursor-pointer truncate font-display"
                      >
                        {proj.title}
                      </h3>
                      <button
                        onClick={() => handleStartRename(proj)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-studio-500 hover:text-studio-200 transition-opacity"
                        title="Rename"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-studio-400 truncate max-w-xl">
                    {proj.idea}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] font-mono text-studio-500">
                    <span className="text-cyan-400/90">{proj.aspectRatio}</span>
                    <span>•</span>
                    <span className="uppercase text-amber-400/90">{proj.model}</span>
                    <span>•</span>
                    <span>{sceneCount} {t('scenesCountLabel')}</span>
                    <span>•</span>
                    <span>{proj.duration}</span>
                    <span>•</span>
                    <span>{t('updatedOn')} {dateStr}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge & Action Toolbar Right */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <Badge 
                  variant={proj.status === 'Generated' ? 'emerald' : 'outline'} 
                  size="sm"
                  className="mr-2"
                >
                  {proj.status || 'Generated'}
                </Badge>

                <Button
                  variant="primary"
                  size="sm"
                  icon={FolderOpen}
                  onClick={() => openProject(proj.id)}
                >
                  {t('openInStudioBtn')}
                </Button>

                <button
                  onClick={() => duplicateProject(proj.id)}
                  title={t('duplicateTooltip')}
                  className="p-2 rounded-lg bg-studio-800 text-studio-400 hover:text-white hover:bg-studio-750 border border-white/5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setProjectToDelete(proj)}
                  title={t('deleteTooltip')}
                  className="p-2 rounded-lg bg-studio-800 text-studio-400 hover:text-red-400 hover:bg-red-950/30 border border-white/5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-12 text-center rounded-xl bg-studio-900 border border-white/5">
            <p className="text-xs text-studio-400">{t('noProjectsYet')}</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        title={t('confirmDeleteTitle')}
        subtitle={t('confirmDeleteSub')}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-red-950/40 border border-red-500/20 text-red-300 text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
            <p>
              {t('confirmDeleteQuestion')} <span className="font-semibold text-white">"{projectToDelete?.title}"</span>?
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button variant="secondary" size="md" onClick={() => setProjectToDelete(null)}>
              {t('cancelBtn')}
            </Button>
            <Button variant="danger" size="md" onClick={handleConfirmDelete}>
              {t('deleteProjectBtn')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
