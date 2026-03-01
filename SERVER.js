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
        rows.forEach(row => {
            // Check if Column A (Name) and Column B (Price) exist and have data
            if (row.c && row.c[0] && row.c[1]) {
                const itemName = row.c[0].v;
                const itemPrice = row.c[1].v;

                // Create the visual card for each menu item
                const itemDiv = document.createElement('div');
                itemDiv.className = 'menu-row'; // Updated to match your CSS styling
                itemDiv.innerHTML = `
                    <div class="menu-item-name">${itemName}</div>
                    <div class="menu-item-price">₹${itemPrice}</div>
                `;
                menuContainer.appendChild(itemDiv);
            }
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        loader.innerHTML = '<p class="system-msg" style="color: red;">Error loading menu. Ensure your Google Sheet is published.</p>';
    }
}