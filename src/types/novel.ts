export interface Novel {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  genres: string[];
  status: 'Ongoing' | 'Completed' | 'Hiatus';
  rating: number;
  totalChapters: number;
  readChapters: number;
  lastReadChapter?: number;
  lastReadDate?: Date;
  dateAdded: Date;
  source: string;
  url: string;
  bookmarked: boolean;
  downloaded: boolean;
  tags: string[];
  language: string;
  releaseDate?: Date;
  lastUpdate?: Date;
}

export interface Chapter {
  id: string;
  novelId: string;
  title: string;
  number: number;
  content?: string;
  url: string;
  releaseDate?: Date;
  read: boolean;
  bookmarked: boolean;
  downloaded: boolean;
  wordCount?: number;
}

export interface NovelSource {
  id: string;
  name: string;
  baseUrl: string;
  language: string;
  version: string;
  icon: string;
  enabled: boolean;
  supportsGenres: boolean;
  supportsSearch: boolean;
  supportsLatest: boolean;
}

export interface ReadingProgress {
  novelId: string;
  chapterId: string;
  position: number;
  timestamp: Date;
}

export interface Bookmark {
  id: string;
  novelId: string;
  chapterId: string;
  position: number;
  text: string;
  note?: string;
  timestamp: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  novelIds: string[];
}

export const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Ecchi', 'Fantasy',
  'Gender Bender', 'Harem', 'Historical', 'Horror', 'Josei',
  'Martial Arts', 'Mature', 'Mecha', 'Mystery', 'Psychological',
  'Romance', 'School Life', 'Sci-fi', 'Seinen', 'Shoujo',
  'Shounen', 'Slice of Life', 'Smut', 'Sports', 'Supernatural',
  'Tragedy', 'Wuxia', 'Xianxia', 'Xuanhuan', 'Yaoi', 'Yuri'
] as const;

export type Genre = typeof GENRES[number];

export interface LibrarySettings {
  sortBy: 'title' | 'author' | 'dateAdded' | 'lastRead' | 'progress';
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'list';
  gridColumns: number;
  showGenres: boolean;
  showProgress: boolean;
  filterGenres: Genre[];
  filterStatus: ('Ongoing' | 'Completed' | 'Hiatus')[];
  hideRead: boolean;
}

export interface ReaderSettings {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  paragraphSpacing: number;
  backgroundColor: string;
  textColor: string;
  theme: 'light' | 'dark' | 'sepia' | 'custom';
  pageWidth: number;
  padding: number;
  textAlign: 'left' | 'center' | 'justify';
  columnCount: number;
  autoScroll: boolean;
  scrollSpeed: number;
  bionicReading: boolean;
  immersiveMode: boolean;
}