
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewsArticle } from '@/services/newsService';
import { Calendar, ExternalLink } from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
}

export const NewsCard = ({ article }: NewsCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleClick = () => {
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card 
      className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 group"
      onClick={handleClick}
    >
      {article.image && (
        <div className="relative overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {article.category || 'General'}
          </Badge>
          <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </div>
        <h3 className="font-semibold text-lg leading-tight line-clamp-3 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>
      </CardHeader>
      
      <CardContent className="pt-0">
        {article.description && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {article.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="font-medium">{article.source}</span>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(article.published_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
