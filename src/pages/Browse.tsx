import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLibrary } from '@/contexts/LibraryContext';
import { Novel, GENRES } from '@/types/novel';
import { Search, Plus, Globe, Star, TrendingUp, Clock, Filter } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

// Mock data for demonstration
const SAMPLE_NOVELS: Novel[] = [
  {
    id: 'sample-1',
    title: 'Shadow Slave',
    author: 'Guiltythree',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
    description: 'Growing up in poverty, Sunny never expected anything good from life. However, even he did not anticipate being chosen by the Nightmare Spell and becoming one of the Awakened.',
    genres: ['Fantasy', 'Action', 'Supernatural'],
    status: 'Ongoing',
    rating: 4.8,
    totalChapters: 1500,
    readChapters: 0,
    dateAdded: new Date(),
    source: 'webnovel',
    url: 'https://example.com/shadow-slave',
    bookmarked: false,
    downloaded: false,
    tags: ['System', 'Academy', 'Weak to Strong'],
    language: 'English',
    releaseDate: new Date('2020-01-01'),
    lastUpdate: new Date(),
  },
  {
    id: 'sample-2',
    title: 'Lord of the Mysteries',
    author: 'Cuttlefish That Loves Diving',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
    description: 'With the rising tide of steam power and machinery, who can come close to being a Beyonder? Shrouded in the fog of history and darkness, who or what is the lurking evil that murmurs into our ears?',
    genres: ['Mystery', 'Fantasy', 'Supernatural'],
    status: 'Completed',
    rating: 4.9,
    totalChapters: 1394,
    readChapters: 0,
    dateAdded: new Date(),
    source: 'webnovel',
    url: 'https://example.com/lord-mysteries',
    bookmarked: false,
    downloaded: false,
    tags: ['Steampunk', 'Mystery', 'Gods'],
    language: 'English',
    releaseDate: new Date('2018-04-01'),
    lastUpdate: new Date('2020-05-01'),
  },
  {
    id: 'sample-3',
    title: 'Reverend Insanity',
    author: 'Gu Zhen Ren',
    cover: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
    description: 'Humans are clever in tens of thousands of ways, Gu are the true refined essences of Heaven and Earth.',
    genres: ['Xianxia', 'Drama', 'Mature'],
    status: 'Hiatus',
    rating: 4.7,
    totalChapters: 2334,
    readChapters: 0,
    dateAdded: new Date(),
    source: 'webnovel',
    url: 'https://example.com/reverend-insanity',
    bookmarked: false,
    downloaded: false,
    tags: ['Evil MC', 'Cunning', 'Cultivation'],
    language: 'English',
    releaseDate: new Date('2017-06-01'),
    lastUpdate: new Date('2020-12-01'),
  },
];

export default function Browse() {
  const { sources, addNovel } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [browsedNovels, setBrowsedNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock search function
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const filtered = SAMPLE_NOVELS.filter(novel =>
        novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        novel.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        novel.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setBrowsedNovels(filtered);
      setLoading(false);
    }, 1000);
  };

  // Mock browse by genre
  const handleBrowseGenre = (genre: string) => {
    setLoading(true);
    setTimeout(() => {
      const filtered = genre === 'all' 
        ? SAMPLE_NOVELS 
        : SAMPLE_NOVELS.filter(novel => novel.genres.includes(genre));
      setBrowsedNovels(filtered);
      setLoading(false);
    }, 800);
  };

  const handleAddToLibrary = (novel: Novel) => {
    addNovel(novel);
  };

  useEffect(() => {
    // Load latest novels on component mount
    setBrowsedNovels(SAMPLE_NOVELS);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Browse Novels</h1>
          
          {/* Search Bar */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for novels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {sources.filter(s => s.enabled).map((source) => (
                  <SelectItem key={source.id} value={source.id}>
                    {source.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {GENRES.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <Tabs defaultValue="latest" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="latest" onClick={() => setBrowsedNovels(SAMPLE_NOVELS)}>
              <Clock className="h-4 w-4 mr-2" />
              Latest
            </TabsTrigger>
            <TabsTrigger value="popular" onClick={() => setBrowsedNovels([...SAMPLE_NOVELS].sort((a, b) => b.rating - a.rating))}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Popular
            </TabsTrigger>
            <TabsTrigger value="genres" onClick={() => handleBrowseGenre(selectedGenre)}>
              <Filter className="h-4 w-4 mr-2" />
              Genres
            </TabsTrigger>
            <TabsTrigger value="sources">
              <Globe className="h-4 w-4 mr-2" />
              Sources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="latest" className="mt-4">
            <NovelGrid novels={browsedNovels} onAddToLibrary={handleAddToLibrary} loading={loading} />
          </TabsContent>

          <TabsContent value="popular" className="mt-4">
            <NovelGrid novels={browsedNovels} onAddToLibrary={handleAddToLibrary} loading={loading} />
          </TabsContent>

          <TabsContent value="genres" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
                {GENRES.slice(0, 18).map((genre) => (
                  <Button
                    key={genre}
                    variant={selectedGenre === genre ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedGenre(genre);
                      handleBrowseGenre(genre);
                    }}
                  >
                    {genre}
                  </Button>
                ))}
              </div>
              <NovelGrid novels={browsedNovels} onAddToLibrary={handleAddToLibrary} loading={loading} />
            </div>
          </TabsContent>

          <TabsContent value="sources" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sources.map((source) => (
                <Card key={source.id} className={source.enabled ? '' : 'opacity-50'}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{source.icon}</span>
                      {source.name}
                      <Badge variant={source.enabled ? 'default' : 'secondary'}>
                        {source.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Language: {source.language}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Version: {source.version}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" disabled={!source.enabled}>
                        Browse
                      </Button>
                      <Button size="sm" variant="outline" disabled={!source.enabled}>
                        Latest
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface NovelGridProps {
  novels: Novel[];
  onAddToLibrary: (novel: Novel) => void;
  loading: boolean;
}

function NovelGrid({ novels, onAddToLibrary, loading }: NovelGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-muted rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded mb-2 w-2/3"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (novels.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No novels found. Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {novels.map((novel) => (
        <Card key={novel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-[3/4] relative overflow-hidden">
            <img
              src={novel.cover}
              alt={novel.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <Badge 
              className="absolute top-2 left-2"
              variant={novel.status === 'Completed' ? 'default' : novel.status === 'Ongoing' ? 'secondary' : 'destructive'}
            >
              {novel.status}
            </Badge>
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 rounded px-2 py-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-white text-xs">{novel.rating}</span>
            </div>
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-medium text-sm mb-1 line-clamp-2">{novel.title}</h3>
            <p className="text-xs text-muted-foreground mb-2">{novel.author}</p>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{novel.description}</p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {novel.genres.slice(0, 3).map((genre) => (
                <Badge key={genre} variant="outline" className="text-xs px-1 py-0">
                  {genre}
                </Badge>
              ))}
            </div>
            
            <Button 
              size="sm" 
              className="w-full"
              onClick={() => onAddToLibrary(novel)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add to Library
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}