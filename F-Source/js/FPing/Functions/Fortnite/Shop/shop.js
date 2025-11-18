/////////////////////////////////////////////////////////////////////
///////////////////// DEPRECATED
///////////////////// DEPRECATED
///////////////////// DEPRECATED
///////////////////// DEPRECATED
///////////////////// DEPRECATED
///////////////////// DEPRECATED
///////////////////// DEPRECATED
///////////////////// DEPRECATED
///////////////////// DEPRECATED
///////////////////// DEPRECATED
///////////////////// DEPRECATED
///////////////////// DEPRECATED
///////////////////// DEPRECATED
///////////////////// DEPRECATED
///////////////////// DEPRECATED
///////////////////// DEPRECATED
///////////////////// DEPRECATED
///////////////////// DEPRECATED
///////////////////// DEPRECATED
///////////////////// DEPRECATED
///////////////////// DEPRECATED


    const shopContainer = document.getElementById('shop-container');
    const searchBar = document.getElementById('search-bar');
    const typeFilter = document.getElementById('type-filter');
    const rarityFilter = document.getElementById('rarity-filter');
    const sortFilter = document.getElementById('sort-filter');


    // --- State ---
    let allShopItems = []; 

    // --- Initialization ---
    async function initializeShop() {
        
        try {
            const shopData = await fetchShopData();
  
            allShopItems = shopData.shop; // Store all items
            setupFilters();
            applyFiltersAndRender(); // Initial render
        } catch (error) {
            console.error('Initialization failed:', error);
            displayError(error.message);
        }
    }

    // --- Data Fetching ---
  

    async function fetchShopData() {
    try {
        // api call to backend
        const response = await fetch('https://fpingbackend.vercel.app/api/shop'); // your backend/api url

        if (!response.ok) {
            throw new Error('Failed to fetch shop data from the backend.');
        }

        const data = await response.json();
        console.log('Shop data:', data);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call the function to get the data when needed


 
    function applyFiltersAndRender() {
     
        const searchText = searchBar.value.toLowerCase().trim();
        const selectedType = typeFilter.value;
        const selectedRarity = rarityFilter.value;
        const selectedSort = sortFilter.value;

        let filteredItems = [...allShopItems];

        if (searchText) {
            filteredItems = filteredItems.filter(item =>
                item.displayName.toLowerCase().includes(searchText)
            );
        }
     
        if (selectedType !== 'all') {
            filteredItems = filteredItems.filter(item => item.mainType === selectedType);
        }
   
        if (selectedRarity !== 'all') {
            filteredItems = filteredItems.filter(item => item.rarity?.id.toLowerCase() === selectedRarity);
        }


        sortItems(filteredItems, selectedSort);

        // 4. Group the final list of items and render them
        const groupedItems = groupShopItems(filteredItems);
        renderShop(groupedItems);
        updateCategoryVisibility();
    }


    function setupFilters() {
        const controls = [searchBar, typeFilter, rarityFilter, sortFilter];
        controls.forEach(control => {
            control.addEventListener('input', applyFiltersAndRender);
        });
    }


    function groupShopItems(shopItems) {
        const grouped = {};
        shopItems.forEach(item => {
            // Use the section name provided by the API for more accurate grouping
            const groupName = item.section?.name || 'Special Offers';
            if (!groupName) return;

            if (!grouped[groupName]) {
                grouped[groupName] = [];
            }
            grouped[groupName].push(item);
        });
        return grouped;
    }

    /**
     * Sorts an array of items in place based on the selected sort option.
     */
    function sortItems(items, sortBy) {
        switch (sortBy) {
            case 'price-desc':
                items.sort((a, b) => (b.price?.finalPrice || 0) - (a.price?.finalPrice || 0));
                break;
            case 'price-asc':
                items.sort((a, b) => (a.price?.finalPrice || 0) - (b.price?.finalPrice || 0));
                break;
            case 'name-az':
                items.sort((a, b) => a.displayName.localeCompare(b.displayName));
                break;
            default:
                // No sorting or default API sort
                break;
        }
    }

    // --- UI Rendering Functions ---

    function renderShop(groupedItems) {
        shopContainer.innerHTML = '';
        if (Object.keys(groupedItems).length === 0) {
            shopContainer.innerHTML = `<p class="no-results-message">No items match your criteria.</p>`;
            return;
        }

        for (const groupName in groupedItems) {
            const items = groupedItems[groupName];
            const groupTitle = createCategoryTitle(groupName);
            shopContainer.appendChild(groupTitle);

            const categoryContainer = document.createElement('div');
            categoryContainer.className = 'category-container';
            if (groupName.toLowerCase().includes('bundle')) {
                categoryContainer.classList.add('bundle-category');
            }

            items.forEach(item => {
                const itemCard = createItemCard(item);
                categoryContainer.appendChild(itemCard);
            });
            shopContainer.appendChild(categoryContainer);
        }
    }
function createItemCard(item) {
    const itemCard = document.createElement('div');
    itemCard.className = 'item-card';

    // Add rarity class for specific styling
    if (item.rarity?.id) {
        itemCard.classList.add(`rarity-${item.rarity.id.toLowerCase()}`);
    }

    // --- The Corrected Logic ---
    // Access the colors object directly from the 'item' object
    const colorsObject = item.colors; 

    if (colorsObject) {
        // Create an array of colors from the object's values
        // Filter out any invalid values like null, undefined, or empty strings
        const colors = [colorsObject.color1, colorsObject.color2, colorsObject.color3].filter(Boolean);

        if (colors.length >= 2) {
            // If we have at least 2 colors, build the linear-gradient
            itemCard.style.backgroundImage = `linear-gradient(to bottom, ${colors.map(c => `#${c}`).join(', ')})`;
        } else if (colors.length === 1) {
            // Fallback to a solid background if only one color is present
            itemCard.style.backgroundColor = `#${colors[0]}`;
        }
    } else {
        // Handle the case where the item has no colors object
        // This is a good place for a default fallback color.
        itemCard.style.backgroundColor = '#333'; 
    }
    // --- End of Corrected Logic ---

    // The rest of your function remains the same
    const imageUrl = item.displayAssets?.[0]?.url || './imgs/placeholder.png';

    itemCard.innerHTML = `
        <img src="${imageUrl}" alt="${item.displayName}" loading="lazy">
        <div class="iteminfo">
            <h3>${item.displayName || 'Unnamed Item'}</h3>
            <p>
                <img src="https://fortnite-api.com/images/vbuck.png" width="20" class="vbuck-icon"> 
                ${item.price?.finalPrice.toLocaleString() || 'N/A'}
            </p>
        </div>
    `;
    
    return itemCard;
}

    function createCategoryTitle(groupName) {
        const groupTitle = document.createElement('h2');
        groupTitle.className = 'category-title';
        const iconUrl = getCategoryIconUrl(groupName);
        groupTitle.innerHTML = `
            <img src="${iconUrl}" alt="${groupName} icon" class="category-icon">
            <span>${groupName}</span>
        `;
        return groupTitle;
    }

    function getCategoryIconUrl(categoryName) {
        const lowerCaseName = categoryName.toLowerCase();
        const iconMap = {
            'bundle': 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjUgMTI1Ij48cGF0aCBmaWxsPSIjODBkNGZmIiBkPSJNODEuOCA5OC40IDczIDExNC44YTEuOSAxLjkgMCAxIDEtMS40LS42bDctMTcuM2ExLjIgMS4yIDAgMCAxIDEuNS0uNmwxLjIuNWExLjIgMS4yIDAgMCAxIC41IDEuNloiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTE0IDkxLjRjLS41LTIuNi0zLjUtMTEuNi0xNy44LTE5LjVhNDEgNDEgMCAwIDAtMjYuNS0zLjUgMTYuNCAxNi40IDAgMCAwLTMuNyAxLjNjLS44LjYtLjcuNyAxIC42YTY3LjEgNjcuMSAwIDAgMSAxMi4zIDFjLTEyLjItLjctMTUuNC40LTE1LjYgMS4zLTEuMiA0LjggMi45IDkuNSAyLjkgOS41cy4zLTEgMy42LTIuOEEyNyAyNyAwIDAgMSA4MC41IDc2YTMyLjMgMzIuMyAwIDAgMC04LjcgMy43Yy0yLjEgMS4zLTUuMyAzLTQuMiA0LjRhMzMuNSAzMy41IDAgMCAwIDEyLjggOS4yIDEzLjIgMTMuMiAwIDAgMSAxLjQtMy43IDMzIDMzIDAgMCAxIDUuNS03IDQ0LjIgNDQuMiAwIDAgMC00LjIgMTAuOWMtLjIgMS4xIDAgMS4zIDAgMS4zQzg5LjYgOTguOSA5OSA5OSA5OSA5OWEyLjIgMi4yIDAgMCAwIC41LTFjMS00LjItLjMtMTEtLjMtMTEgMS42IDMgMi4yIDYuNyAzIDEwLjcuNCAxLjgtLjQgMS44IDQuNSAxIDMuMy0uNiA1LjItMiA1LjItMy4zIDAtMi44LTUuMy0xMC44LTUuMy0xMC44IDIuOSAyLjQgNS4zIDYuOSA2LjggOS4xLjIuNC40IDAgLjUtLjNhNSA1IDAgMCAwIC4xLTJaWk05NS4zIDc1LjFjLS4zLjgtMS44LjktMy4zLjFzLTIuNC0xLjktMi0yLjcgMS44LS44IDMuMyAwIDIuNCAxLjggMiAyLjZaIi8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTM4LjcgNzkuN2ExOC44IDE4LjggMCAwIDEgMTguMi0xMHYtLjhjLTEyLjEtMi41LTIyLjUgNC45LTIyLjUgNC45YTMuMyAzLjMgMCAwIDEtLjIgNWwtMyAyLjNhMS41IDEuNSAwIDAgMS0uMi4xIDMuNiAzLjYgMCAwIDEtNS4zLTEuMmMtMyAxLjItMTAuNSAxMS0xMyAxNC42YTQuNCA0LjQgMCAwIDAtLjkgMy4yYy45IDYgOC40IDUuNyA4LjQgNS43LTEuMi0zLjkgNy40LTE0LjMgNy40LTE0LjMgMi4xLTIuNyA1LjUtLjYgNS41LS42IDUuMi0yIDYtMy44IDYtMy44WiIvPjxwYXRoIGZpbGw9IiM4MGQ0ZmYiIGQ9Ik00MCA4Ni42YTkgOSAwIDAgMS01LjQgMy4zYzMuNyA4IDIwLjUgMjguMSAyMC41IDI4LjEgMi40LS4yIDMtMy43IDMtMy43QTczLjYgNzMuNiAwIDAgMSA0MCA4Ni42Wk0zMC40IDc0bC0yLjcgMS41YTIuNiAyLjYgMCAwIDAtMS4yIDEuNCAyLjEgMi4xIDAgMCAwIDEuNiAyLjkgMyAzIDAgMCAwIDIuNi0uNWwyLTEuNGEyLjUgMi41IDAgMCAwIDEuMy0yYzAtMS0uNC0yLjItMS44LTIuM2EzIDMgMCAwIDAtMS44LjNaIi8+PHBhdGggZmlsbD0iIzgwZDRmZiIgZD0iTTExMC41IDMyYTMuOSAzLjkgMCAwIDEtMS4zIDIuMmM1LjIgMjYtOC43IDIxLjctOC43IDIxLjdhNi43IDYuNyAwIDAgMS0xLjIgMmMyMSA3LjEgMTEuMi0yNS45IDExLjItMjUuOVpNMTAyLjUgMzBsLTQuOCA1LjVjLTMgMy45LTEwLjYuNi0xMC42LjZhMS45IDEuOSAwIDAgMC0yLjMgMHMtMi43IDMuMy0zLjcgNC4zYTI2LjkgMjYuOSAwIDAgMS0yLjUgMi4zIDMuMiAzLjIgMCAwIDEtMS41LjYgMy41IDMuNSAwIDAgMS0zLjItMUw3Mi43IDQxYTIgMiAwIDAgMS0uOC0xLjggMiAyIDAgMCAxIDEuNS0xLjdjMy42LTEgNC4yLTQuMyA0LjMtNS43YTIgMiAwIDAgMC0uNy0xLjYgMi4zIDIuMyAwIDAgMC0xLjYtLjV2LjNjMCAyLjktMi42IDQuNy00LjEgNS42YTguNCA4LjQgMCAwIDAtNC4zIDguMyA1LjYgNS42IDAgMCAwIDEgMi41YzUuNyA4IDIzIDE0IDIzIDE0LTYuMy01LjctMS44LTEwLjgtMS44LTEwLjguMiAxMi44IDYuNiA5LjggNi42IDkuOEMxMDEuNiA1NyAxMDcuMSAzMSAxMDcuMSAzMWMtMS43LTMuNy00LjYtMS00LjYtMVpNOTUgMTYuMmwxLjItMi4zYTIuMyAyLjMgMCAwIDEgMi44LS44IDEuNiAxLjYgMCAwIDEgLjUuMmwxLjcgMS4yYTIgMiAwIDAgMSAuOCAxLjIgNC4xIDQuMSAwIDAgMS0uOCAzLjIgMTAuNCAxMC40IDAgMCAxIDIuMSAxLjIgNS44IDUuOCAwIDAgMCAuNy01LjYgMi43IDIuNyAwIDAgMC0uOS0xIDIwLjkgMjAuOSAwIDAgMC0zLjgtMi40IDUuNyA1UuNyAwIDAgMC00IC41IDMuNSAzLjUgMCAwIDAtMS42IDJsMS40IDIgMi4yIDEuOFoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNOTkuNSAyMC41YTE2LjcgMTYuNyAwIDAgMS04LTQuNCAyLjcgMi43IDAgMCAwLTIuMS0uOWMtMi42LjItOCAuOC05LjEgNC42YTYuNSA2LjUgMCAwIDEtMS44IDIuNyA4LjIgOC4yIDAgMCAxLTMgMS45LjkxLjkxIDAgMCAwLS4yIDBzLTIuNyAxLjUgMyA1YzAgMCAxLjYtMy4xIDQuNC0xLjVsMi41IDEuNXMxLjguNiAxLjUgNC4yYzAgMCA3LjMgMy43IDEyLjUtMi44IDAgMCA1LjgtNy4zIDkuNiAwIDAgMCAxLjctNi42LTkuMi0xMC4zWk03My4yIDM4LjhjMyA3IDcuNy0xIDcuNy0xbC0yLjQtMi4xYy0yLjggNC01LjMgMy4xLTUuMyAzLjFaIi8+PHBhdGggZmlsbD0iIzgwZDRmZiIgZD0iTTgxLjMgMzMuNGEzIDMgMCAwIDEtLjYtLjYuNy43IDAgMCAxLS4yLS40IDYuOCA2LjggMCAwIDEgLjgtMy42cy0yLjcgMS41LTIuNSA0YTIuMyAyLjMgMCAwIDAgLjYgMS4xIDUgNSAwIDAgMCAyLjIgMS43IDEuMiAxLjIgMCAwIDAgLjggMGMuOC0uMyAyLjItMS40IDItNC42IDAgMC0uOCAyLjItMi4yIDIuNmExIDEgMCAwIDEtLjktLjJaIi8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTYxLjUgMzMuNkM1NAC44IDI4LjQgNDUuOCAyNCA0NS44IDI0YTE2IDE2IDAgMCAxLTE3LjQgMHMtNC4zIDMuNS0xNS41IDguNWEuNC40IDAgMCAwLS4xLjZsNS44IDcuOWE0NCA0NCAwIDAgMSA3LTMuM2wtMS4zIDIwLjVzMTAuNCA1LjEgMjUuMSAxLjJsLS44LTIwLjlhMjQuNSAyNC41IDAgMCAxIDUuNCAzWm0tMTgtNi44Yy03LjggNy40LTE1LS4yLTE1LS4yIDYgMyAxNSAuMiAxNSAuMlptLTE2LjggMzAgMjAuNyAxYy0xMC44IDQuMy0yMC43LTEtMjAuNy0xWiIvPjxwYXRoIGZpbGw9IiM4MGQ0ZmYiIGQ9Ik0zNyAxOS43cy00IDQtNS4zIDQuMmwtMi0xYTI0LjUgMjQuNSAwIDAgMCA3LjgtNi4zbC42LTFhMTAgMTAgMCAwIDAgMS0xLjlsLjQtMWE0LjYgNC42IDAgMCAwIC4zLTEuNCAzIDMgMCAwIDAtLjctMi41IDIuNyAyLjcgMCAwIDAtNC42IDEuNSA0LjQgNC40IDAgMCAwIDAgMS40bC4yIDEuMS0xLjguM2ExMi43IDEyLjcgMCAwIDEtLjMtMS4zIDguNiA4LjYgMCAwIDEgMC0xLjIgNC41IDQuNSAwIDAgMSA4LTMgNSA1IDAgMCAxIDEuMSA0IDEzLjYgMTMuNiAwIDAgMS0zLjIgNi43bDUuOCA0LjVhOC43IDguNyAwIDAgMS0xLjggMWwtNS41LTQiLz48L3N2Zz4=',
            'pickaxe': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 125 125"%3E%3Cpath d="M66.8 37.4a37.6 37.6 0 0 1 36.4-20.1v-1.7c-24.3-5-45.1 9.9-45.1 9.9 2.7 2.1 2.4 5 1.8 7a6.2 6.2 0 0 1-2.2 3l-6 4.6a4 4 0 0 1-.5.3c-7 4.2-10.6-2.3-10.6-2.3-6.1 2.3-21 22-26.2 29a9 9 0 0 0-1.7 6.6c1.7 12 16.8 11.4 16.8 11.4-2.2-7.9 15-28.7 15-28.7 4.3-5.5 11-1.3 11-1.3 10.4-4 12.2-7.4 12.2-7.4Z" fill="%23fff"/%3E%3Cpath fill="%2380d4ff" d="M69.2 51.3c-5.2 6-10.6 6.5-10.6 6.5 7.4 16 41 56.3 41 56.3 5-.4 6.2-7.4 6.2-7.4-23.7-19.5-36.6-55.4-36.6-55.4ZM50.2 25.8 44.7 29a5.3 5.3 0 0 0-2.5 2.9c-.4 1.9-.4 4.4 3.3 5.7a6.1 6.1 0 0 0 5.2-1l4-2.8c1.4-1 2.6-2.2 2.5-4 0-2-.7-4.3-3.5-4.6a6 6 0 0 0-3.5.7Z"/%3E%3C/svg%3E',
            'emote': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 125 125"%3E%3Cpath fill="%2380d4ff" d="M27.6 38.2c-14.7 38 13 33 13 33-20.8-4.4-13-33-13-33Z"/%3E%3Cpath fill="%2380d4ff" d="M39.1 63.9s-7.2-3-6.8-19.5c0 0-5.3 17 6.8 19.5ZM84 28.9c8 3.2 3.5 19 3.5 19 9.7-22.3-3.5-19-3.5-19Z"/%3E%3Cpath fill="%2380d4ff" d="M90 20.5c14.2 16.6-1.7 32-1.7 32 23.6-21 1.6-32 1.6-32Z"/%3E%3Cpath d="m44.1 53.3-.3 1.3a2.5 2.5 0 0 1-.4 1 1 1 0 0 1-.7.1l-.2-.5a2.9 2.9 0 0 1 0-.7c-.4.5-.7 1-1.1.6-.3-.1-.2-.6-.3-1l-.8-.1a3.2 3.2 0 0 1 .3-.8 11.8 11.8 0 0 0 1.4-4.4v-.2c-.4-.8 0-1.5 0-2.2a2.5 2.5 0 0 1 .3-.5l.1-.3a1.8 1.8 0 0 0-.7-1.4 2 2 0 0 1-.7-.7l-.7-1.5a2.2 2.2 0 0 1-.3-1.5l-.3-1a11.6 11.6 0 0 1 .4-1.1 1.4 1.4 0 0 1 .5-.7 10.7 10.7 0 0 1 1.1-.5 12 12 0 0 0 2.4-1 20 20 0 0 0 2.5-2.4L48 32a6.4 6.4 0 0 1 3.5-1.8 4.8 4.8 0 0 1 2 .3 1.3 1.3 0 0 0 1-.2 2.5 2.5 0 0 1 2-.5 3.6 3.6 0 0 0 1-.1 2.4 2.4 0 0 1 .4 0c.8 0 1.2-.5 1.2-1.3l-.2-4.9c0-1 .3-2.2.4-3.3a2.8 2.8 0 0 0-.2-.8 3 3 0 0 1 0-.6 3.6 3.6 0 0 1 .1-.8.8.8 0 0 1 .3-.4c.4-.3.9-.6.5-1.2a.4.4 0 0 1 .2-.4 5.6 5.6 0 0 1 3.5-.8l2 .5.3.3a3.3 3.3 0 0 0 .4.5 5.4 5.4 0 0 1 2.3 3.5 1.8 1.8 0 0 1-.1.8l-.8 2.3a1.5 1.5 0 0 0-.1.7 2.6 2.6 0 0 1-.7 2.6.6.6 0 0 0 0 .9 3.3 3.3 0 0 1 .6 1.1 2.5 2.5 0 0 0 .8 1.3 2.5 2.5 0 0 1 1 1.5 1.4 1.4 0 0 0 .4.6l2.1 2a9.3 9.3 0 0 1 .8 1.2l.4.4c2 .3 3 1.8 4 3.3a5 5 0 0 1 1 3 2.2 2.2 0 0 0 .6 1.7 6.5 6.5 0 0 1 1.1 1.8 6 6 0 0 0 2.2 3 1.7 1.7 0 0 1 .8 2 15.7 15.7 0 0 1-.5 1.6 2 2 0 0 1-1.4 1.1 5.4 5.4 0 0 1-3.1 0c-.6 0-1.2-.3-1.8-.4-.4-.1-.5 0-.6.4a4.5 4.5 0 0 0 .2 2.8 4.3 4.3 0 0 0 .5.8l.4.7-.8.4a2.2 2.2 0 0 0-.4.2.9.9 0 0 1-1.3.1 6.6 6.6 0 0 1-.6-.4s0 0-.1 0c-.2.3-.3.8-.7.6a1.5 1.5 0 0 1-.8-.7 10 10 0 0 1-.3-1.7 3.4 3.4 0 0 0-.1-.3h-.2l-.3 1c0 .4 0 1-.6 1-.4 0-.6-.3-.6-1V55h-.4a6.6 6.6 0 0 0 0 1.4l.6 3.4a1.5 1.5 0 0 0 .3.6c1.4 1.4 1.6 3.2 2 5a2.8 2.8 0 0 1-.2.7 3.5 3.5 0 0 0-.4-.6.7.7 0 0 0-.6-.2l-.3.3-.2 1.4-.8 4a1.6 1.6 0 0 1-1.9 1.4.8.8 0 0 0-.5.3 9.5 9.5 0 0 0-.8 1.7 9 9 0 0 1-2 3.1 1.8 1.8 0 0 0-.2.3 1.4 1.4 0 0 0 0 .2l1 .2a1.6 1.6 0 0 1 1.5 1 1.1 1.1 0 0 0 1 .8 1 1 0 0 1 .6.4 13.4 13.4 0 0 1 1 2 1.2 1.2 0 0 1-.2.8 1.1 1.1 0 0 0 0 1.1l1.2 2.8a1 1 0 0 0 .2.3l1.6 1.3a3.8 3.8 0 0 1 1.4 2.4 4.1 4.1 0 0 0 .5 1.4c.5.7.5 1.3-.1 1.8a11.2 11.2 0 0 1-1.6 1 .7.7 0 0 1-1-.2.7.7 0 0 0-1.2 0 6.9 6.9 0 0 1-.9 1 3.8 3.8 0 0 1-1.2.4l-.9.2a2.4 2.4 0 0 1-.6.2 14.4 14.4 0 0 1-2.6.1 2.6 2.6 0 0 1-1.5-.8 2 2 0 0 1 0-2.3 2.9 2.9 0 0 1 2.3-1.8 4.2 4.2 0 0 0 1-.4c.3-.2.4-.4.1-.7s-.6-.8-.2-1.4c.1 0 0-.4-.2-.5-1-.3-1.7-1.2-2.8-1.3-.5 0-.8 0-.9.6a2.6 2.6 0 0 1-1 1.5 5.8 5.8 0 0 0-1.2 1.9c-.8 1.8-1.7 3.6-2.4 5.5a6.7 6.7 0 0 0-.4 1.9 4.8 4.8 0 0 1-.2 2 1 1 0 0 0 .1 1 1.3 1.3 0 0 1 .3 1.2l-.4 2.3a23.6 23.6 0 0 0 .2 5.1 4.6 4.6 0 0 1 0 1.6 4.5 4.5 0 0 1-2.5 2.8s-.4 0-.5-.2c-.5-.5-.6-.5-1 0a1.3 1.3 0 0 1-2-.4c-.2-.7-.5-.8-1.2-.7a.8.8 0 0 1-.6-.1c-.4-.4-.9-.7-.9-1.1a6.6 6.6 0 0 0-.4-2 1 1 0 0 1 0-.7c.5-1 .3-2.1 1-3a2.4 2.4 0 0 0 .5-.4 5.5 5.5 0 0 0 .5-1l.7-2.3.5-1.6a1 1 0 0 1 .2-.5 4.4 4.4 0 0 0 1-2.3 2.3 2.3 0 0 1 .4-1A5.2 5.2 0 0 0 54 94v-5a2 2 0 0 0-.8-1.5 1.3 1.3 0 0 1 0-2 2.3 2.3 0 0 0 .5-2.5 1.2 1.2 0 0 1 .4-1.5 3.4 3.4 0 0 0 .7-1 1.5 1.5 0 0 0 0-1.8 5 5 0 0 1-.6-1.5 1.3 1.3 0 0 1 0-.7 1.3 1.3 0 0 0-.2-1.3 2.4 2.4 0 0 1-.4-1.2c0-2.5.1-5 .3-7.4l.3-2.4c.1-.8 0-1-.8-1.3a1 1 0 0 1-1-1.4l.5-2.8a1.4 1.4 0 0 0-.5-1.4.8.8 0 0 1-.2-.6l.1-2.8c0-.5.5-.8 1.2-1a2.4 2.4 0 0 0 .7-.2c0-.3-.2-.5-.3-.7a24.6 24.6 0 0 1-1.3-2.1c-.1-.3 0-.7.2-1a1.6 1.6 0 0 0-.2-2 2.3 2.3 0 0 1-.2-.8l-.5-1.5a11.8 11.8 0 0 1-.9-4.1 3.3 3.3 0 0 0-.3-1.4 1.2 1.2 0 0 0-1.8-.6 21.2 21.2 0 0 0-3 2.4c-.3.3-.2 1.1-.1 1.6a5.6 5.6 0 0 0 .7 1.4l1.2 2.3a18.3 18.3 0 0 1 1.6 4.3l-.2.6a1.3 1.3 0 0 1-1-.1 1.6 1.6 0 0 1-.4-1c-.1-.4-.3-.7-.7-.7a1 1 0 0 0-.7.5 27.7 27.7 0 0 0-.6 3c-.1.7 0 1.4-.2 2 0 .3-.4.4-.6.6-.1-.2-.4-.4-.4-.7a9 9 0 0 1 0-1.3Zm25.2-3 .2.1a4.4 4.4 0 0 0 .7-.5 5.1 5.1 0 0 1 3.1-1.4h1.9c.4 0 .4-.2.2-.6l-1.2-2a4.5 4.5 0 0 0-.5-.8c-.5-.6-1.2-.7-1.6-.2a26.9 26.9 0 0 0-1.5 2.6l-1 2.3c-.2.1-.2.3-.3.4Z" fill="%23fff"/%3E%3C/svg%3E',
            'outfit': 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjUgMTI1Ij48cGF0aCBkPSJNMTEwLjQgNjJDOTkgNTEuOCA3OSA0Mi44IDc5IDQyLjhzLTE2LjcgMTItMzUgMGMwIDAtOC41IDctMzEgMTdhLjguOCAwIDAgMC0uMyAxLjNsMTEuNiAxNS44YTg3LjcgODcuNyAwIDAgMSAxNC4zLTYuN2wtMi43IDQxLjJzMjAuOSAxMC4zIDUwLjIgMi4zTDg0LjUgNzJhNDguNyA0OC43IDAgMCAxIDExIDUuOFpNNzQuMiA0OC41Yy0xNS41IDE0LjgtMjkuOC0uNS0yOS44LS41IDEyIDYgMjkuOC41IDI5LjguNVptLTMzLjYgNjAuMyA0MS42IDEuNmE1M3yLjEgNTMuMSAwIDAgMS00MS42LTEuNloiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNNjEuNSAzNC4yczgtMSA4LTEwLjggOC4zLTMuOS0yYTQ5IDQ5IDAgMCAwIDE1LjUtMTIuN2wxLjMtMS44YTIwLjYgMjAuNiAwIDAgMCAyLTMuOWwuNy0xLjlhOS42IDkuNiAwIDAgMCAuNi0zYy4xLTIuMSAwLTMuNS0xLjMtNS0yLjgtMy04LjMtMi4yLTkuMyAzYTguNCA4LjQgMCAwIDAgMCAzbC40IDIuMi0zLjcuNi0uNS0yLjdhMTcgMTcgMCAwIDEgMC0yLjQgOS4xIDkuMSAwIDAgMSAxNi02IDkuOSA5LjkgMCAwIDEgMi4yIDguMiAyNy4yIDI3LjIgMCAwIDEtNi41IDEzLjRsMTEuNyA5YTE3LjQgMTcuNCAwIDAgMS0zLjYgMS44bC0xMS04IiBmaWxsPSIjODBkNGZmIi8+PC9zdmc+',
            'wrap': 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjUgMTI1Ij48cGF0aCBkPSJNNTEuMSA4Ny4yYzM5LjMtMTEgNjAuNC0zMSA2MC40LTMxbC0zNi4zLTM5YTk2IDk2IDAgMCAxLTQ3IDIzLjRDMTcuNyA0My4yIDE1LjggNTIgMTUuOCA1MmwxMi43IDUzYTUgNSAwIDAgMCAuNSAxYzIuNyAzLjkgMTAuMyAzLjIgMTctMS40UzU2IDkyLjkgNTMuNCA4OWE1LjUgNS41IDAgMCAwLTIuMS0xLjhabS03IDE0LjRjLTMuNyAyLjYtOCAzLTkuNC44cy4zLTYgNC04LjVTNDYuNSA5MSA0OCA5M3MtLjMgNS45LTQgOC41WiIgZmlsbD0iIzgwZDRmZiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik00Mi44IDg5LjIgMjMuNiA0N3MtMS45IDAtNC45IDIuNWwxNCA0Ny4zYTE4LjYgMTguNiAwIDAgMSAxMC03LjVaTTI3IDQxLjdzLTIuNSAxLjItMS44IDIuOGwyMC4xIDQ0LjFhNyA3IDAgMCAxIDMuNC0uM1pNNTkuNyA4NC42IDQyIDUwcy0xLjQtMTkuNSAzMS4yLTEwLjRhMzIuOCAzMi44IDAgMCAxIDEzIDdsMTcuNiAxNS42cy0xOSAxNS00NCAyMi4zWk0zOS4zIDEwNS40YTQuMSA0LjEgMCAwIDEtMy41LTEuNiA0LjMgNC4zIDAgMCAxIDAtNC40IDExLjYgMTEuNiAwIDAgMSA4LjctNiA0LjMgNC4zIDAgMCAxIDQuMSAxLjVjMS42IDIuMyAwIDYtMy42IDguNWExMC43IDEwLjcgMCAwIDEtNSAyaC0uN1ptNS44LTEwLjFhMy4xIDMuMSAwIDAgMC0uNSAwIDkuNyA5LjcgMCAwIDAtNyA1IDIuNSAyLjUgMCAwIDAtLjIgMi40IDIuNSAyLjUgMCAwIDAgMi4zLjggOC45IDguOSAwIDAgMCA0LjItMS43YzIuOC0yIDMuOS00LjYgMy01LjdhMi4zIDIuMyAwIDAgMC0xLjktLjhaIi8+PGVsbGlwc2UgZmlsbD0iI2ZmZiIgY3g9IjQxLjciIGN5PSI5OCIgcng9IjQuMiIgcnk9IjIuNCIgdHJhbnNmb3JtPSJyb3RhdGUoLTM0LjkgNDEuNyA5OCkiLz48L3N2Zz4=',
            'default': 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHN0PSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiB2aWV3Qm94PSIwIDAgMTYgMTYiPjxwYXRoIGQ9Ik0zLjNDMi41IDEgMi41IDcgMy4zIDcuN2w5LjQtOS40Yy44LS44LjgtMi4xIDAtMi44cy0yLjEtLjgtMi44IDBMMCAxMC4zYy0uOC44LS44IDIuMSAwIDIuOHMyLjEuOCAyLjggMEwxMi41IDMuNWMuOC0uOC44LTIuMSAwLTIuOFMxMy4zLjMgMTIuNSAxLjFMMi44IDEyLjVjLS44LjgtLjggMi4xIDAgMi44czIuMS44IDIuOCAwTDQuOSA5LjljLjgtLjguOC0yLjEgMC0yLjhzLTIuMS0uOC0yLjggMGw3LjEtNy4xYy44LS44LjgtMi4xIDAtMi44cy0yLjEtLjgtMi44IDBsLTcgN2MtLjguOC0uOCAyLjEgMCAyLjhzMi4xLjggMi44IDBMMTYgNC4zYy44LS44LjgtMi4xIDAtMi44cy0yLjEtLjgtMi44IDBMMC4zIDEzLjdjLS40LjQtLjQuOSAwIDEuM3MuOS40IDEuMyAwbDEzLjctMTMuN2MuNC0uNC40LS45IDAtMS4zcy0uOS0uNC0xLjMgMEwwIDEyLjRjLS40LjQtLjQuOSAwIDEuM3MuOS40IDEuMyAwbDEyLjQgMTIuNGMuNC40LjkuNCAxLjMgMHM0LS45IDAtMS4zTDEuMyAyLjdDLjkgMi4zLjkgMS44IDEuMyAxLjRTMS44LjkgMi4zIDEuM2wxMy43IDEzLjdjLjQuNC45LjQgMS4zIDBzLjQtLjkgMC0xLjNMMi43IDEuM0MuMy45IDAgMS40IDAgMS44czMuOS40IDEuMyAwbDEuNC0xLjRjLjQtLjQuOS0uNCAxLjMgMFMxNi4xIDIgMTYgMi43eiIvPjwvc3ZnPg==' // A generic icon
        };
        for (const key in iconMap) {
            if (lowerCaseName.includes(key)) return iconMap[key];
        }
        return iconMap.default;
    }

    function updateCategoryVisibility() {
        document.querySelectorAll('.category-title').forEach(title => {
            const container = title.nextElementSibling;
            // A category is visible if its container exists and has item cards inside
            const isVisible = container && container.querySelector('.item-card');
            title.style.display = isVisible ? 'flex' : 'none';
        });
    }

    function displayError(message) {
        shopContainer.innerHTML = `
            <div class="error-container">
                <img src="./imgs/icons/cry.png" alt="Error icon" class="error-icon">
                <p class="error-message">Could not load the shop.</p>
                <code class="error-details">[Reason: ${message}]</code>
            </div>
        `;
    }

    // --- Start the Application ---


document.addEventListener('DOMContentLoaded', () => {
        initializeShop();
});

