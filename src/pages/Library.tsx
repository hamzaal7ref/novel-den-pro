import { useState, useMemo } from 'react';
import { useLibrary } from '@/contexts/LibraryContext';
import { LibraryToolbar } from '@/components/Library/LibraryToolbar';
import { LibraryGrid } from '@/components/Library/LibraryGrid';
import { Novel } from '@/types/novel';
import { toast } from '@/components/ui/sonner';

export default function Library() {
  const { 
    novels, 
    librarySettings, 
    searchNovels, 
    exportLibrary, 
    importLibrary 
  } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort novels
  const filteredNovels = useMemo(() => {
    let filtered = searchQuery ? searchNovels(searchQuery) : novels;

    // Apply genre filter
    if (librarySettings.filterGenres.length > 0) {
      filtered = filtered.filter(novel =>
        novel.genres.some(genre => librarySettings.filterGenres.includes(genre as any))
      );
    }

    // Apply status filter
    if (librarySettings.filterStatus.length > 0) {
      filtered = filtered.filter(novel =>
        librarySettings.filterStatus.includes(novel.status)
      );
    }

    // Apply hide read filter
    if (librarySettings.hideRead) {
      filtered = filtered.filter(novel => novel.readChapters < novel.totalChapters);
    }

    // Sort novels
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (librarySettings.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'author':
          comparison = a.author.localeCompare(b.author);
          break;
        case 'dateAdded':
          comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
          break;
        case 'lastRead':
          const aLastRead = a.lastReadDate ? new Date(a.lastReadDate).getTime() : 0;
          const bLastRead = b.lastReadDate ? new Date(b.lastReadDate).getTime() : 0;
          comparison = aLastRead - bLastRead;
          break;
        case 'progress':
          const aProgress = a.totalChapters > 0 ? a.readChapters / a.totalChapters : 0;
          const bProgress = b.totalChapters > 0 ? b.readChapters / b.totalChapters : 0;
          comparison = aProgress - bProgress;
          break;
      }

      return librarySettings.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [novels, searchQuery, librarySettings, searchNovels]);

  const handleExport = () => {
    try {
      const data = exportLibrary();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lnreader-library-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Library exported successfully');
    } catch (error) {
      toast.error('Failed to export library');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            importLibrary(content);
          } catch (error) {
            toast.error('Failed to import library file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-col h-full">
      <LibraryToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onImport={handleImport}
        onExport={handleExport}
      />
      
      <div className="flex-1 overflow-auto">
        <LibraryGrid novels={filteredNovels} />
      </div>
      
      {/* Stats Footer */}
      <div className="border-t bg-muted/30 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {filteredNovels.length} of {novels.length} novels
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
          <span>
            Total chapters read: {novels.reduce((sum, novel) => sum + novel.readChapters, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}