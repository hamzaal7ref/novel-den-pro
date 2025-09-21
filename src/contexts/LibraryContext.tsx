import React, { createContext, useContext, useEffect } from 'react';
import { Novel, Chapter, Category, LibrarySettings, NovelSource, Bookmark } from '@/types/novel';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/components/ui/sonner';

interface LibraryContextType {
  novels: Novel[];
  chapters: Chapter[];
  categories: Category[];
  sources: NovelSource[];
  bookmarks: Bookmark[];
  librarySettings: LibrarySettings;
  addNovel: (novel: Novel) => void;
  removeNovel: (novelId: string) => void;
  updateNovel: (novel: Novel) => void;
  addChapter: (chapter: Chapter) => void;
  updateChapter: (chapter: Chapter) => void;
  markChapterAsRead: (novelId: string, chapterId: string) => void;
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (bookmarkId: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  addSource: (source: NovelSource) => void;
  toggleSource: (sourceId: string) => void;
  updateLibrarySettings: (settings: Partial<LibrarySettings>) => void;
  searchNovels: (query: string) => Novel[];
  getNovelsByCategory: (categoryId: string) => Novel[];
  getNovelsByGenre: (genre: string) => Novel[];
  exportLibrary: () => string;
  importLibrary: (data: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

const DEFAULT_LIBRARY_SETTINGS: LibrarySettings = {
  sortBy: 'dateAdded',
  sortOrder: 'desc',
  viewMode: 'grid',
  gridColumns: 4,
  showGenres: true,
  showProgress: true,
  filterGenres: [],
  filterStatus: [],
  hideRead: false,
};

const DEFAULT_SOURCES: NovelSource[] = [
  {
    id: 'novelupdates',
    name: 'Novel Updates',
    baseUrl: 'https://www.novelupdates.com',
    language: 'English',
    version: '1.0.0',
    icon: '📚',
    enabled: true,
    supportsGenres: true,
    supportsSearch: true,
    supportsLatest: true,
  },
  {
    id: 'boxnovel',
    name: 'BoxNovel',
    baseUrl: 'https://boxnovel.com',
    language: 'English',
    version: '1.0.0',
    icon: '📖',
    enabled: true,
    supportsGenres: true,
    supportsSearch: true,
    supportsLatest: true,
  },
  {
    id: 'wuxiaworld',
    name: 'WuxiaWorld',
    baseUrl: 'https://wuxiaworld.online',
    language: 'English',
    version: '1.0.0',
    icon: '⚔️',
    enabled: true,
    supportsGenres: true,
    supportsSearch: true,
    supportsLatest: true,
  },
];

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [novels, setNovels] = useLocalStorage<Novel[]>('lnreader-novels', []);
  const [chapters, setChapters] = useLocalStorage<Chapter[]>('lnreader-chapters', []);
  const [categories, setCategories] = useLocalStorage<Category[]>('lnreader-categories', []);
  const [sources, setSources] = useLocalStorage<NovelSource[]>('lnreader-sources', DEFAULT_SOURCES);
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('lnreader-bookmarks', []);
  const [librarySettings, setLibrarySettings] = useLocalStorage<LibrarySettings>(
    'lnreader-settings', 
    DEFAULT_LIBRARY_SETTINGS
  );

  const addNovel = (novel: Novel) => {
    setNovels(prev => [...prev, novel]);
    toast.success(`Added "${novel.title}" to library`);
  };

  const removeNovel = (novelId: string) => {
    const novel = novels.find(n => n.id === novelId);
    setNovels(prev => prev.filter(n => n.id !== novelId));
    setChapters(prev => prev.filter(c => c.novelId !== novelId));
    setBookmarks(prev => prev.filter(b => b.novelId !== novelId));
    if (novel) {
      toast.success(`Removed "${novel.title}" from library`);
    }
  };

  const updateNovel = (novel: Novel) => {
    setNovels(prev => prev.map(n => n.id === novel.id ? novel : n));
  };

  const addChapter = (chapter: Chapter) => {
    setChapters(prev => [...prev, chapter]);
  };

  const updateChapter = (chapter: Chapter) => {
    setChapters(prev => prev.map(c => c.id === chapter.id ? chapter : c));
  };

  const markChapterAsRead = (novelId: string, chapterId: string) => {
    setChapters(prev => prev.map(c => 
      c.id === chapterId ? { ...c, read: true } : c
    ));
    
    const readChapters = chapters.filter(c => c.novelId === novelId && c.read).length + 1;
    setNovels(prev => prev.map(n => 
      n.id === novelId 
        ? { ...n, readChapters, lastReadChapter: parseInt(chapterId), lastReadDate: new Date() }
        : n
    ));
  };

  const addBookmark = (bookmark: Bookmark) => {
    setBookmarks(prev => [...prev, bookmark]);
    toast.success('Bookmark added');
  };

  const removeBookmark = (bookmarkId: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    toast.success('Bookmark removed');
  };

  const addCategory = (category: Category) => {
    setCategories(prev => [...prev, category]);
    toast.success(`Created category "${category.name}"`);
  };

  const updateCategory = (category: Category) => {
    setCategories(prev => prev.map(c => c.id === category.id ? category : c));
  };

  const deleteCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    if (category) {
      toast.success(`Deleted category "${category.name}"`);
    }
  };

  const addSource = (source: NovelSource) => {
    setSources(prev => [...prev, source]);
    toast.success(`Added source "${source.name}"`);
  };

  const toggleSource = (sourceId: string) => {
    setSources(prev => prev.map(s => 
      s.id === sourceId ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const updateLibrarySettings = (settings: Partial<LibrarySettings>) => {
    setLibrarySettings(prev => ({ ...prev, ...settings }));
  };

  const searchNovels = (query: string) => {
    return novels.filter(novel => 
      novel.title.toLowerCase().includes(query.toLowerCase()) ||
      novel.author.toLowerCase().includes(query.toLowerCase()) ||
      novel.genres.some(genre => genre.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const getNovelsByCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return [];
    return novels.filter(novel => category.novelIds.includes(novel.id));
  };

  const getNovelsByGenre = (genre: string) => {
    return novels.filter(novel => novel.genres.includes(genre));
  };

  const exportLibrary = () => {
    const data = {
      novels,
      chapters,
      categories,
      bookmarks,
      librarySettings,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };
    return JSON.stringify(data, null, 2);
  };

  const importLibrary = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.novels) setNovels(parsed.novels);
      if (parsed.chapters) setChapters(parsed.chapters);
      if (parsed.categories) setCategories(parsed.categories);
      if (parsed.bookmarks) setBookmarks(parsed.bookmarks);
      if (parsed.librarySettings) setLibrarySettings(parsed.librarySettings);
      toast.success('Library imported successfully');
    } catch (error) {
      toast.error('Failed to import library data');
    }
  };

  const value: LibraryContextType = {
    novels,
    chapters,
    categories,
    sources,
    bookmarks,
    librarySettings,
    addNovel,
    removeNovel,
    updateNovel,
    addChapter,
    updateChapter,
    markChapterAsRead,
    addBookmark,
    removeBookmark,
    addCategory,
    updateCategory,
    deleteCategory,
    addSource,
    toggleSource,
    updateLibrarySettings,
    searchNovels,
    getNovelsByCategory,
    getNovelsByGenre,
    exportLibrary,
    importLibrary,
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
}