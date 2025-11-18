

const mainAppScreen = document.getElementById('main-app-screen');
const setupModal = document.getElementById('setup-screen-modal');
const sidebar = document.getElementById('sidebar');
const navLinks = document.querySelectorAll('.nav-link');
const pageContents = document.querySelectorAll('.page-content');
const newsContainer = document.getElementById('news-container');
const newsRecentContainer = document.getElementById('news-recent');
const newsTopContainer = document.getElementById('news-top');
const iconsse = document.getElementById('icons-select');

async function fetchNews() {
    try {
        const response = await fetch('./data/news.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newsItems = await response.json();

        const topNews = newsItems.filter(item => item.type === "top");
        const recentNews = newsItems.filter(item => item.type === "recent");

        // --- 1. TOP NEWS BANNER (image_48a4d9.jpg) ---
        if (topNews.length > 0) {
            const firstTopNewsItem = topNews[0];

            if (firstTopNewsItem) {
                const imagePath = firstTopNewsItem.imageurl;
                const newsDate = firstTopNewsItem.date || 'NOV, 2025';
                const newsTag = firstTopNewsItem.tag || 'news';

                newsTopContainer.innerHTML = `
                    <div class="news-card">
                        <div class="news-image-container">
                            <img src='${imagePath}' alt='${firstTopNewsItem.title} News Image'>
                        </div>
                        <div class="news-content-right">
                            <p class="news-date">${newsDate}</p>
                            <h2 class="news-title">${firstTopNewsItem.title}</h2>
                            <span class="news-tag">${newsTag}</span>
                        </div>
                    </div>
                `;
            }
        } else {
             newsTopContainer.innerHTML = `<div class="no-news">${translations.no_news || 'No top news available.'}</div>`;
        }

        // --- 2. RECENT ARTICLES (image_52a08a.jpg) ---
        // Assuming your 'newsRecentContainer' HTML element exists for this section
        if (recentNews.length > 0 && newsRecentContainer) {

            // Map the recent news items to the new small card structure
            newsRecentContainer.innerHTML = recentNews.map(item => {
                const imagePath = item.imageurl;
                const newsDate = item.date || 'OCT, 2025';

                // Handle multiple tags (if necessary) or just use the first one
                const tagsHtml = Array.isArray(item.tags) ? 
                    item.tags.map(tag => `<span class="recent-tag">${tag}</span>`).join('') : 
                    `<span class="recent-tag">${item.tag || 'General'}</span>`;

                return `
                    <div class="recent-article-card">
                        <div class="recent-image-wrapper">
                            <img src='${imagePath}' alt='${item.title}'>
                        </div>
                        <div class="recent-content">
                            <p class="recent-date">${newsDate}</p>
                            <h3 class="recent-title">${item.title}</h3>
                            <p>${item.content}</p>
                            <div class="recent-tags-wrapper">
                                ${tagsHtml}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

    } catch (error) {
        console.error("Error fetching news:", error);
        newsTopContainer.innerHTML = `<div class="error-news">${translations.news_error || 'Failed to load news.'}</div>`;
        if (newsRecentContainer) {
             newsRecentContainer.innerHTML = `<div class="error-news">${translations.news_error || 'Failed to load recent articles.'}</div>`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
 
    fetchNews()

}
);