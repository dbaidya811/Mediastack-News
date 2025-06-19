
const API_BASE_URL = 'https://api.mediastack.com/v1';
const API_KEY = 'e74b583ba09164d177a39c69092c2cb3';

// CORS proxy as fallback
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  image: string | null;
  category: string;
  language: string;
  country: string;
  published_at: string;
}

export interface NewsParams {
  keywords?: string;
  categories?: string;
  countries?: string;
  languages?: string;
  limit?: number;
  offset?: number;
}

export interface NewsResponse {
  data: NewsArticle[];
  pagination: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
}

class NewsService {
  private cache = new Map<string, { data: NewsResponse; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(params: NewsParams): string {
    return JSON.stringify(params);
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private async makeRequest(url: string): Promise<Response> {
    try {
      // Try direct HTTPS request first
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      return response;
    } catch (error) {
      console.log('Direct request failed, trying with CORS proxy...');
      // Fallback to CORS proxy
      const proxiedUrl = CORS_PROXY + encodeURIComponent(url);
      return await fetch(proxiedUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
    }
  }

  async getNews(params: NewsParams = {}): Promise<NewsResponse> {
    const cacheKey = this.getCacheKey(params);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isValidCache(cached.timestamp)) {
      console.log('Returning cached news data');
      return cached.data;
    }

    const queryParams = new URLSearchParams({
      access_key: API_KEY,
      limit: (params.limit || 12).toString(),
      offset: (params.offset || 0).toString(),
    });

    if (params.keywords) queryParams.append('keywords', params.keywords);
    if (params.categories) queryParams.append('categories', params.categories);
    if (params.countries) queryParams.append('countries', params.countries);
    if (params.languages) queryParams.append('languages', params.languages);

    const url = `${API_BASE_URL}/news?${queryParams}`;

    try {
      console.log('Fetching news from API:', url);
      
      const response = await this.makeRequest(url);

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'API error occurred');
      }

      const newsResponse: NewsResponse = {
        data: data.data || [],
        pagination: data.pagination || {
          limit: params.limit || 12,
          offset: params.offset || 0,
          count: 0,
          total: 0
        }
      };

      // Cache the response
      this.cache.set(cacheKey, {
        data: newsResponse,
        timestamp: Date.now()
      });

      console.log('News data fetched successfully:', newsResponse);
      return newsResponse;
    } catch (error) {
      console.error('Error fetching news:', error);
      
      // If it's a CORS error, provide helpful message
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to fetch news due to CORS restrictions. Consider using a backend proxy or Supabase Edge Functions.');
      }
      
      throw error;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const newsService = new NewsService();
