
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { NewsGrid } from '@/components/NewsGrid';
import { FilterSidebar } from '@/components/FilterSidebar';
import { SearchBar } from '@/components/SearchBar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { PaginationControls } from '@/components/PaginationControls';
import { newsService, NewsArticle, NewsParams } from '@/services/newsService';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<NewsParams>({
    limit: 12,
    offset: 0
  });
  const { toast } = useToast();

  const fetchNews = async (params: NewsParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await newsService.getNews(params);
      setArticles(response.data);
      setTotalPages(Math.ceil(response.pagination.total / params.limit!));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch news';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = {
      ...filters,
      offset: (currentPage - 1) * (filters.limit || 12)
    };
    fetchNews(params);
  }, [filters, currentPage]);

  const handleFilterChange = (newFilters: Partial<NewsParams>) => {
    setCurrentPage(1);
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearch = (query: string) => {
    setCurrentPage(1);
    setFilters(prev => ({ ...prev, keywords: query, offset: 0 }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest News</h1>
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <FilterSidebar onFilterChange={handleFilterChange} />
          </aside>

          <div className="flex-1">
            {loading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} onRetry={() => fetchNews(filters)} />}
            {!loading && !error && (
              <>
                <NewsGrid articles={articles} />
                {totalPages > 1 && (
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
