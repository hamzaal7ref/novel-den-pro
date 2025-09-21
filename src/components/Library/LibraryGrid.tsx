import { Novel } from '@/types/novel';
import { NovelCard } from './NovelCard';
import { useLibrary } from '@/contexts/LibraryContext';

interface LibraryGridProps {
  novels: Novel[];
}

export function LibraryGrid({ novels }: LibraryGridProps) {
  const { librarySettings } = useLibrary();
  
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }[librarySettings.gridColumns] || 'grid-cols-4';

  if (novels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <svg
            className="h-8 w-8 text-muted-foreground"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">Your library is empty</h3>
        <p className="text-muted-foreground max-w-md">
          Start building your collection by browsing novels from various sources or importing your existing library.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols} gap-4 p-4`}>
      {novels.map((novel) => (
        <NovelCard key={novel.id} novel={novel} />
      ))}
    </div>
  );
}