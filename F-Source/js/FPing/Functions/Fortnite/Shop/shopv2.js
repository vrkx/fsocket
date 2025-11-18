/// Finally a better version :P



//consts//
const API_URL = 'https://fpingbackend.vercel.app/api/shop'; // Fortnite BR Shop API
const shopContainer = document.getElementById('shop-container');


//functions//

function getItemImageUrl(entry) {

    if (entry.newDisplayAsset && entry.newDisplayAsset.renderImages && entry.newDisplayAsset.renderImages.length > 0) {
        // Find a suitable image, often the first one or one with a specific productTag
        const renderImage = entry.newDisplayAsset.renderImages.find(img => img.productTag === "Product.BR" || img.productTag === "Product.Juno") || entry.newDisplayAsset.renderImages[0];
        if (renderImage) return renderImage.image;
    }


    if (entry.bundle && entry.bundle.image) {
        return entry.bundle.image;
    }
    

    if (entry.brItems && entry.brItems.length > 0) {
        const firstItem = entry.brItems[0];
        if (firstItem.images) {
            return firstItem.images.featured || firstItem.images.icon || firstItem.images.smallIcon;
        }
    }
    
   
    if (entry.tracks && entry.tracks.length > 0) {
        if (entry.tracks[0].albumArt) {
            return entry.tracks[0].albumArt;
        }
    }


    return 'https://via.placeholder.com/200x200?text=No+Image'; 
}


function getItemDisplayName(entry) {

    if (entry.brItems && entry.brItems.length > 0 && entry.brItems[0].name) {
        return entry.brItems[0].name;
    }
    if (entry.bundle && entry.bundle.name) {
        return entry.bundle.name;
    }
    if (entry.tracks && entry.tracks.length > 0 && entry.tracks[0].title) {
        return entry.tracks[0].title;
    }

    if (entry.devName) {
        let name = entry.devName.replace(/\[VIRTUAL\]\d+\s*x\s*/, '').replace(/\s*for\s*\d+\s*MtxCurrency/, '').trim();
        if (name.includes(',')) { // If it's a list of items, just take the first one
            name = name.split(',')[0].trim();
        }
        return name || 'Unnamed Item';
    }
    return 'Unnamed Item';
}


function getCategoryDisplayName(entry) {
    if (entry.layout && entry.layout.name) {
        return entry.layout.name;
    }
    if (entry.offerTag && entry.offerTag.id === "sparksjamloop") {
        return "Jam Tracks"; 
    }
    return "Miscellaneous"; 
}

async function fetchAndDisplayShop() {
    shopContainer.innerHTML = '<p>Loading shop data...</p>';

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const apiResponseData = await response.json();
        console.log('loaded data')
        const shopEntries = apiResponseData.data.entries;

        // Group items by category
        const categories = {};
        shopEntries.forEach(entry => {
            const categoryName = getCategoryDisplayName(entry);
            if (!categories[categoryName]) {
                categories[categoryName] = [];
            }
            categories[categoryName].push(entry);
        });

        shopContainer.innerHTML = ''; // Clear loading message

        // Render each category
        for (const categoryName in categories) {
            const categorySection = document.createElement('section');
            categorySection.classList.add('category-section');

            const categoryTitle = document.createElement('h2');
            categoryTitle.classList.add('category-title');
            categoryTitle.textContent = categoryName;
            categorySection.appendChild(categoryTitle);

            const itemList = document.createElement('ul');
            itemList.classList.add('item-list');

            categories[categoryName].forEach(item => {
                const listItem = document.createElement('li');
                
                const imageUrl = getItemImageUrl(item);
                const displayName = getItemDisplayName(item);
                const finalPrice = item.finalPrice;
                const rarity = item.brItems && item.brItems.length > 0 ? item.brItems[0].rarity.displayValue : 
                               item.series && item.series.value ? item.series.value : 
                               '';
                const description = item.offerTag && item.offerTag.text ? item.offerTag.text :
                                    item.brItems && item.brItems.length > 0 ? item.brItems[0].description : '';

                listItem.innerHTML = `
                    <div class="shop-item">
                        <div class="item-image-container">
                            <img src="${imageUrl}" alt="${displayName}" class="item-image"> 
                        </div>
                        <div class="item-details">
                            <strong>${displayName}</strong>
                            ${rarity ? `<small>${rarity}</small>` : ''}
                            ${description ? `<small>${description.substring(0, 70)}${description.length > 70 ? '...' : ''}</small>` : ''}
                            <p>${finalPrice} V-Bucks</p>
                        </div>
                    </div>
                `;
                itemList.appendChild(listItem);
            });
            
            categorySection.appendChild(itemList);
            shopContainer.appendChild(categorySection);
        }

    } catch (error) {
        console.error('Failed to fetch shop data:', error);
        shopContainer.innerHTML = `<p style="color: red;">Error: Could not load shop items. Please try again later. ${error.message}</p>`;
    }
}

// do not delete anything below this //
// !! if doing so core.js will fail and app won't run !! //


export default fetchAndDisplayShop;
document.addEventListener('DOMContentLoaded', () => {
        fetchAndDisplayShop();
});
