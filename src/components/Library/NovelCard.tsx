import { useState } from 'react';
import { Novel } from '@/types/novel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLibrary } from '@/contexts/LibraryContext';
import { MoreVertical, Bookmark, BookmarkCheck, Download, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NovelCardProps {
  novel: Novel;
}

export function NovelCard({ novel }: NovelCardProps) {
  const navigate = useNavigate();
  const { updateNovel, removeNovel } = useLibrary();
  const [imageError, setImageError] = useState(false);

  const progress = novel.totalChapters > 0 ? (novel.readChapters / novel.totalChapters) * 100 : 0;

  const toggleBookmark = () => {
    updateNovel({ ...novel, bookmarked: !novel.bookmarked });
  };

  const handleCardClick = () => {
    navigate(`/novel/${novel.id}`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardContent className="p-0">
        <div onClick={handleCardClick}>
          {/* Cover Image */}
          <div className="aspect-[3/4] relative overflow-hidden">
            {!imageError ? (
              <img
                src={novel.cover}
                alt={novel.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={handleImageError}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <div className="text-4xl">📚</div>
              </div>
            )}
            
            {/* Overlay with quick actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/read/${novel.id}/${novel.lastReadChapter || 1}`);
                }}
              >
                Read
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark();
                }}
              >
                {novel.bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              </Button>
            </div>

            {/* Status badge */}
            <Badge 
              className="absolute top-2 left-2" 
              variant={novel.status === 'Completed' ? 'default' : novel.status === 'Ongoing' ? 'secondary' : 'destructive'}
            >
              {novel.status}
            </Badge>

            {/* More options */}
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(`/novel/${novel.id}`)}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleBookmark}>
                    {novel.bookmarked ? <BookmarkCheck className="mr-2 h-4 w-4" /> : <Bookmark className="mr-2 h-4 w-4" />}
                    {novel.bookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Download Chapters
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => removeNovel(novel.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove from Library
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Downloaded indicator */}
            {novel.downloaded && (
              <div className="absolute bottom-2 right-2">
                <Badge variant="outline" className="bg-green-500/80 text-white border-green-400">
                  <Download className="h-3 w-3 mr-1" />
                  Downloaded
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Novel Info */}
        <div className="p-3 space-y-2">
          <h3 className="font-medium text-sm leading-tight line-clamp-2" title={novel.title}>
            {novel.title}
          </h3>
          
          <p className="text-xs text-muted-foreground line-clamp-1" title={novel.author}>
            {novel.author}
          </p>

          {/* Progress */}
          {novel.totalChapters > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{novel.readChapters}/{novel.totalChapters}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          )}

          {/* Genres */}
          <div className="flex flex-wrap gap-1">
            {novel.genres.slice(0, 2).map((genre) => (
              <Badge key={genre} variant="outline" className="text-xs px-1 py-0">
                {genre}
              </Badge>
            ))}
            {novel.genres.length > 2 && (
              <Badge variant="outline" className="text-xs px-1 py-0">
                +{novel.genres.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}