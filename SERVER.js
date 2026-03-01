// 1. Google Sheets Setup
const SHEET_ID = '1UU1YLd30lGK8eNcixb7NVtQzxz2oi0l-0w_hx9mLll0'; 
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
const EDIT_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;

// 2. Navigation Logic
function openView(viewId) {
    // Attach the correct link to the Edit button
    const editBtn = document.getElementById('btn-edit-db');
    if (editBtn) {
        editBtn.href = EDIT_URL;
    }

    // Hide all views safely
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
        view.classList.add('hidden');
    });
    
    // Show the targeted view
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.remove('hidden');
        targetView.classList.add('active');
    }

    // Fetch data if opening the menu
    if(viewId === 'menu-view') {
        fetchMenuFromGoogleSheets();
    }
}

// 3. Database Fetch Logic
async function fetchMenuFromGoogleSheets() {
    // FIXED: Changed 'menu-container' to 'menu-list' to match your HTML
    const menuContainer = document.getElementById('menu-list');
    const loader = document.getElementById('menu-loading');

    if (!menuContainer || !loader) return; // Safety check to prevent crashes

    loader.style.display = 'block';
    menuContainer.innerHTML = ''; // Clear old items

    try {
        const response = await fetch(SHEET_URL);
        const text = await response.text();
        
        // Google's API wraps the JSON in a text function, we slice it off to get pure data
        const jsonText = text.substring(47).slice(0, -2);
        const data = JSON.parse(jsonText);

        const rows = data.table.rows;
        
        loader.style.display = 'none'; // Hide the loading text

        if (rows.length === 0) {
            menuContainer.innerHTML = '<p class="system-msg">No items found in the menu.</p>';
            return;
        }

        // Loop through each row in the sheet
       // Loop through each row in the sheet
        rows.forEach(row => {
            // Make sure the row has data
            if (row.c) {
                // Safely grab Column A (No), Column B (Name), and Column C (Price)
                // If a cell is blank, it defaults to empty text so it doesn't crash
                const itemNo = row.c[0] && row.c[0].v !== null ? row.c[0].v : '';
                const itemName = row.c[1] && row.c[1].v !== null ? row.c[1].v : '';
                const itemPrice = row.c[2] && row.c[2].v !== null ? row.c[2].v : '';

                // Only create the item if there is actually a name
                if (itemName) {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'menu-item';
                    itemDiv.innerHTML = `
                        <div class="item-no">${itemNo}</div>
                        <div class="item-name">${itemName}</div>
                        <div class="item-price">₹${itemPrice}</div>
                    `;
                    menuContainer.appendChild(itemDiv);
                }
            }
        });
        // 3. Cuisine Filter Logic (Veg / Non-Veg)
async function loadCuisine(type) {
    const cuisineContainer = document.getElementById('cuisine-container');
    cuisineContainer.innerHTML = `<p class="system-msg">Loading ${type} items...</p>`;

    try {
        const response = await fetch(SHEET_URL);
        const text = await response.text();
        const jsonText = text.substring(47).slice(0, -2);
        const data = JSON.parse(jsonText);

        const rows = data.table.rows;
        cuisineContainer.innerHTML = ''; // Clear loading text

        let itemsFound = false;

        rows.forEach(row => {
            // Check if No, Name, Price, AND Category (Column D) exist
            if (row.c && row.c[0] && row.c[1] && row.c[2] && row.c[3]) {
                
                // Grab the category from Column D
                const itemCategory = row.c[3].v ? row.c[3].v.toString().trim() : '';
                
                // If the category in the sheet matches the button clicked (Veg or Non-Veg)
                if (itemCategory.toLowerCase() === type.toLowerCase()) {
                    itemsFound = true;
                    
                    const itemNo = row.c[0].v !== null ? row.c[0].v : '';
                    const itemName = row.c[1].v !== null ? row.c[1].v : '';
                    const itemPrice = row.c[2].v !== null ? row.c[2].v : '';

                    // Create the item card (reusing the exact same styling as the menu page)
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'menu-item';
                    itemDiv.innerHTML = `
                        <div class="item-no">${itemNo}</div>
                        <div class="item-name">${itemName}</div>
                        <div class="item-price">₹${itemPrice}</div>
                    `;
                    cuisineContainer.appendChild(itemDiv);
                }
            }
        });

        // If no items matched the filter
        if (!itemsFound) {
            cuisineContainer.innerHTML = `<p class="system-msg">No ${type} items found. Make sure you added "${type}" to Column D in your Google Sheet.</p>`;
        }

    } catch (error) {
        console.error('Error fetching data:', error);
        cuisineContainer.innerHTML = '<p class="system-msg" style="color: red;">Error loading data.</p>';
    }
}

    } catch (error) {
        console.error('Error fetching data:', error);
        loader.innerHTML = '<p class="system-msg" style="color: red;">Error loading menu. Ensure your Google Sheet is published.</p>';
    }
}
// --- CUISINE FILTER LOGIC ---
async function loadCuisine(type) {
    const cuisineContainer = document.getElementById('cuisine-container');
    
    // Show a loading message so the user knows it's working
    cuisineContainer.innerHTML = `<p class="system-msg">Loading ${type} items...</p>`;

    try {
        const response = await fetch(SHEET_URL);
        const text = await response.text();
        
        // Clean the Google Sheets JSON response
        const jsonText = text.substring(47).slice(0, -2);
        const data = JSON.parse(jsonText);
        const rows = data.table.rows;
        
        cuisineContainer.innerHTML = ''; // Clear the loading message

        let itemsFound = false;

        // Loop through all rows in the sheet
        rows.forEach(row => {
            // Check if Column A (No), Column B (Name), Column C (Price), AND Column D (Category) exist
            if (row.c && row.c[0] && row.c[1] && row.c[2] && row.c[3]) {
                
                // Get the category from Column D (index 3)
                const itemCategory = row.c[3].v ? row.c[3].v.toString().trim().toLowerCase() : '';
                const targetType = type.toLowerCase();
                
                // If the category in the sheet matches the button you clicked
                if (itemCategory === targetType) {
                    itemsFound = true;
                    
                    const itemNo = row.c[0].v !== null ? row.c[0].v : '';
                    const itemName = row.c[1].v !== null ? row.c[1].v : '';
                    const itemPrice = row.c[2].v !== null ? row.c[2].v : '';

                    // Create the menu item card (reusing the same CSS from the main menu)
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'menu-item';
                    itemDiv.innerHTML = `
                        <div class="item-no">${itemNo}</div>
                        <div class="item-name">${itemName}</div>
                        <div class="item-price">₹${itemPrice}</div>
                    `;
                    cuisineContainer.appendChild(itemDiv);
                }
            }
        });

        // If no items match the category
        if (!itemsFound) {
            cuisineContainer.innerHTML = `<p class="system-msg">No ${type} items found. Please make sure you added "${type}" in Column D of your Google Sheet.</p>`;
        }

    } catch (error) {
        console.error('Error fetching cuisine data:', error);
        cuisineContainer.innerHTML = '<p class="system-msg" style="color: red;">Error loading items. Check your internet connection.</p>';
    }
}