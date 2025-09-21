import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useLibrary } from '@/contexts/LibraryContext';
import { GENRES, LibrarySettings } from '@/types/novel';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SortAsc, 
  SortDesc, 
  Download, 
  Upload,
  Settings,
  MoreHorizontal
} from 'lucide-react';

interface LibraryToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onImport: () => void;
  onExport: () => void;
}

export function LibraryToolbar({ 
  searchQuery, 
  setSearchQuery, 
  onImport, 
  onExport 
}: LibraryToolbarProps) {
  const { librarySettings, updateLibrarySettings } = useLibrary();
  const [filterOpen, setFilterOpen] = useState(false);

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-') as [LibrarySettings['sortBy'], LibrarySettings['sortOrder']];
    updateLibrarySettings({ sortBy, sortOrder });
  };

  const toggleGenreFilter = (genre: string) => {
    const current = librarySettings.filterGenres;
    const updated = current.includes(genre as any)
      ? current.filter(g => g !== genre)
      : [...current, genre as any];
    updateLibrarySettings({ filterGenres: updated });
  };

  const toggleStatusFilter = (status: 'Ongoing' | 'Completed' | 'Hiatus') => {
    const current = librarySettings.filterStatus;
    const updated = current.includes(status)
      ? current.filter(s => s !== status)
      : [...current, status];
    updateLibrarySettings({ filterStatus: updated });
  };

  const clearFilters = () => {
    updateLibrarySettings({
      filterGenres: [],
      filterStatus: [],
      hideRead: false,
    });
  };

  const hasActiveFilters = 
    librarySettings.filterGenres.length > 0 || 
    librarySettings.filterStatus.length > 0 || 
    librarySettings.hideRead;

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between p-4 gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Filter Button */}
          <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Filter className="h-4 w-4 mr-2" />
                Filter
                {hasActiveFilters && (
                  <Badge className="ml-2 h-5 w-5 p-0 text-xs flex items-center justify-center">
                    {librarySettings.filterGenres.length + librarySettings.filterStatus.length + (librarySettings.hideRead ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <div className="p-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Filters</h4>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear all
                    </Button>
                  )}
                </div>
                
                {/* Status Filter */}
                <div className="mb-4">
                  <h5 className="text-sm font-medium mb-2">Status</h5>
                  <div className="flex gap-2">
                    {(['Ongoing', 'Completed', 'Hiatus'] as const).map((status) => (
                      <Button
                        key={status}
                        variant={librarySettings.filterStatus.includes(status) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleStatusFilter(status)}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Genres Filter */}
                <div className="mb-4">
                  <h5 className="text-sm font-medium mb-2">Genres</h5>
                  <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto">
                    {GENRES.map((genre) => (
                      <DropdownMenuCheckboxItem
                        key={genre}
                        checked={librarySettings.filterGenres.includes(genre)}
                        onCheckedChange={() => toggleGenreFilter(genre)}
                        className="text-sm"
                      >
                        {genre}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </div>
                </div>

                {/* Other Filters */}
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={librarySettings.hideRead}
                  onCheckedChange={(checked) => updateLibrarySettings({ hideRead: checked })}
                >
                  Hide completed novels
                </DropdownMenuCheckboxItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort */}
          <Select 
            value={`${librarySettings.sortBy}-${librarySettings.sortOrder}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title-asc">Title A-Z</SelectItem>
              <SelectItem value="title-desc">Title Z-A</SelectItem>
              <SelectItem value="author-asc">Author A-Z</SelectItem>
              <SelectItem value="author-desc">Author Z-A</SelectItem>
              <SelectItem value="dateAdded-desc">Recently Added</SelectItem>
              <SelectItem value="dateAdded-asc">Oldest Added</SelectItem>
              <SelectItem value="lastRead-desc">Recently Read</SelectItem>
              <SelectItem value="progress-desc">Most Progress</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex border rounded-md">
            <Button
              variant={librarySettings.viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-r-none"
              onClick={() => updateLibrarySettings({ viewMode: 'grid' })}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={librarySettings.viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-l-none"
              onClick={() => updateLibrarySettings({ viewMode: 'list' })}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onImport}>
                <Upload className="mr-2 h-4 w-4" />
                Import Library
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExport}>
                <Download className="mr-2 h-4 w-4" />
                Export Library
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Library Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {librarySettings.filterStatus.map((status) => (
              <Badge key={status} variant="secondary" className="gap-1">
                {status}
                <button
                  onClick={() => toggleStatusFilter(status)}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            ))}
            {librarySettings.filterGenres.map((genre) => (
              <Badge key={genre} variant="secondary" className="gap-1">
                {genre}
                <button
                  onClick={() => toggleGenreFilter(genre)}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            ))}
            {librarySettings.hideRead && (
              <Badge variant="secondary" className="gap-1">
                Hide Read
                <button
                  onClick={() => updateLibrarySettings({ hideRead: false })}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
