const API_URL_BASE = 'http://api.mediastack.com/v1/news?access_key=e74b583ba09164d177a39c69092c2cb3&languages=en&limit=10';

const newsList = document.getElementById('news-list');
const categorySelect = document.getElementById('category-select');

function setLoading(isLoading) {
    if (isLoading) {
        newsList.className = 'loading';
        newsList.innerHTML = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:24px auto;">
  <circle cx="20" cy="20" r="18" stroke="#3a86ff" stroke-width="4" stroke-linecap="round" stroke-dasharray="90 60" stroke-dashoffset="0">
    <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" from="0 20 20" to="360 20 20"/>
  </circle>
</svg>
Loading news...`;
    } else {
        newsList.className = '';
    }
}

function buildApiUrl(category) {
    let url = API_URL_BASE;
    if (category && category !== 'general') {
        url += `&categories=${encodeURIComponent(category)}`;
    }
    return url;
}

async function fetchNews(category = 'general') {
    setLoading(true);
    try {
        const response = await fetch(buildApiUrl(category));
        const data = await response.json();
        setLoading(false);
        if (data && data.data && data.data.length > 0) {
            newsList.innerHTML = '';
            data.data.forEach(article => {
                const item = document.createElement('div');
                item.className = 'news-item';
                const imageUrl = article.image || 'https://via.placeholder.com/120x80?text=No+Image';
                item.innerHTML = `
                    <img src="${imageUrl}" alt="News Image" class="news-image" loading="lazy" />
                    <div class="news-content">
                        <a href="${article.url}" class="news-title" target="_blank" rel="noopener noreferrer">${article.title}</a>
                        <div class="news-description">${article.description || ''}</div>
                        <div class="news-date">${new Date(article.published_at).toLocaleString()}</div>
                    </div>
                `;
                newsList.appendChild(item);
            });
        } else {
            newsList.innerHTML = 'No news found.';
        }
    } catch (error) {
        setLoading(false);
        newsList.innerHTML = 'Failed to load news.';
        console.error('Error fetching news:', error);
    }
}

if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
        fetchNews(categorySelect.value);
    });
}

fetchNews(); 