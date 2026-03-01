// 1. Navigation Logic
function openView(viewId) {
    // Remove 'active' class from all views to hide them
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Add 'active' class to the requested view to show it
    document.getElementById(viewId).classList.add('active');

    // Fetch data if opening the menu
    if(viewId === 'menu-view') {
        fetchMenuFromGoogleSheets();
    }
}

// 2. Google Sheets Logic
// Your exact Sheet ID
const SHEET_ID = '1UU1YLd30lGK8eNcixb7NVtQzxz2oi0l-0w_hx9mLll0'; 

// THE FIX: This special URL formats the sheet as readable data instead of a webpage
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

async function fetchMenuFromGoogleSheets() {
    const menuContainer = document.getElementById('menu-container');

    try {
        menuContainer.innerHTML = '<p class="system-msg">Fetching menu...</p>';
        
        const response = await fetch(SHEET_URL);
        const text = await response.text();
        
        // Google's API wraps the JSON in a text function, we slice it off to get pure data
        const jsonText = text.substring(47).slice(0, -2);
        const data = JSON.parse(jsonText);

        const rows = data.table.rows;
        menuContainer.innerHTML = ''; // Clear the loading text

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
                itemDiv.className = 'menu-item';
                itemDiv.innerHTML = `
                    <div class="item-name">${itemName}</div>
                    <div class="item-price">₹${itemPrice}</div>
                `;
                menuContainer.appendChild(itemDiv);
            }
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        menuContainer.innerHTML = '<p class="system-msg" style="color: red;">Error loading menu. Ensure your Google Sheet is set to "Anyone with the link can view".</p>';
    }
}