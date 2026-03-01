// Screen Navigation Logic
function openView(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
        view.classList.add('hidden');
    });
    
    // Show the requested view
    document.getElementById(viewId).classList.remove('hidden');
    document.getElementById(viewId).classList.add('active');

   function openView(viewId) {
    // ... (code that hides other screens and shows the menu screen) ...

    // THIS is the part that loads the sheet data immediately when the menu opens:
    if(viewId === 'menu-view') {
        fetchMenuFromGoogleSheets(); 
    }
}
}

// Google Sheets Fetch Logic
// YOU MUST PUT YOUR SHEET ID HERE:
const SHEET_ID = '1UU1YLd30lGK8eNcixb7NVtQzxz2oi0l-0w_hx9mLll0'; 

// This special URL formats the Google Sheet as a JSON object
const SHEET_URL = `https://docs.google.com/spreadsheets/d/1UU1YLd30lGK8eNcixb7NVtQzxz2oi0l-0w_hx9mLll0/edit?usp=sharing`;

async function fetchMenuFromGoogleSheets() {
    const menuContainer = document.getElementById('menu-container');
    
    // Only show loading if empty
    if(menuContainer.innerHTML.trim() === '') {
        menuContainer.innerHTML = '<p class="loading-text">Fetching menu...</p>';
    }

    try {
        const response = await fetch(SHEET_URL);
        const text = await response.text();

        // The API returns text wrapped in a function call. 
        // We strip the extra text away to get pure JSON.
        const jsonText = text.substring(47).slice(0, -2);
        const data = JSON.parse(jsonText);

        const rows = data.table.rows;
        menuContainer.innerHTML = ''; // Clear out the loading text

        if (rows.length === 0) {
            menuContainer.innerHTML = '<p>No items found in the menu.</p>';
            return;
        }

        // Loop through each row in the sheet
        rows.forEach(row => {
            // Check if Column A (Name) and Column B (Price) exist
            if (row.c[0] && row.c[1]) {
                const itemName = row.c[0].v;
                const itemPrice = row.c[1].v;

                // Create the HTML elements for the item
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
        menuContainer.innerHTML = '<p>Error loading menu. Ensure your Google Sheet is set to "Anyone with the link can view".</p>';
    }
}