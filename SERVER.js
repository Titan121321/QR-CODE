// 1. Google Sheets Setup
const SHEET_ID = '1UU1YLd30lGK8eNcixb7NVtQzxz2oi0l-0w_hx9mLll0'; 
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
const COMBOS_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Combos`;
const EDIT_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;


// 2. Navigation Logic
function openView(viewId) {
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

    // TRIGGER THE FETCHES
    if (viewId === 'menu-view') {
        fetchMenuFromGoogleSheets();
    }
    if (viewId === 'combos-view') {
        fetchCombosFromGoogleSheets();
    }
}

// 3. Database Fetch Logic (MENU)
async function fetchMenuFromGoogleSheets() {
    const menuContainer = document.getElementById('menu-list');
    const loader = document.getElementById('menu-loading');

    if (!menuContainer || !loader) return; 

    loader.style.display = 'block';
    menuContainer.innerHTML = ''; 

    try {
        const response = await fetch(SHEET_URL);
        const text = await response.text();
        const jsonText = text.substring(47).slice(0, -2);
        const data = JSON.parse(jsonText);
        const rows = data.table.rows;
        
        loader.style.display = 'none'; 

        if (rows.length === 0) {
            menuContainer.innerHTML = '<p class="system-msg">No items found in the menu.</p>';
            return;
        }

        rows.forEach(row => {
            // Check if Column B (Name) and Column C (Price) exist
            if (row.c && row.c[1] && row.c[2]) {
                const itemNo = row.c[0] && row.c[0].v !== null ? row.c[0].v : '';
                const itemName = row.c[1].v !== null ? row.c[1].v : '';
                const itemPrice = row.c[2].v !== null ? row.c[2].v : '';

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
    } catch (error) {
        console.error('Error:', error);
        loader.innerHTML = '<p class="system-msg" style="color: red;">Error loading menu.</p>';
    }
}

// 4. Cuisine Filter Logic (Veg / Non-Veg / Drinks)
async function loadCuisine(type) {
    const cuisineContainer = document.getElementById('cuisine-container');
    if (!cuisineContainer) return;

    cuisineContainer.innerHTML = `<p class="system-msg" style="text-align:center;">Loading ${type} items...</p>`;

    try {
        const response = await fetch(SHEET_URL);
        const text = await response.text();
        const jsonText = text.substring(47).slice(0, -2);
        const data = JSON.parse(jsonText);
        const rows = data.table.rows;
        
        cuisineContainer.innerHTML = ''; 
        let itemsFound = false;

        rows.forEach(row => {
            // Check if Name, Price, AND Category (Column D) exist
            if (row.c && row.c[1] && row.c[2] && row.c[3]) {
                const itemCategory = row.c[3].v ? row.c[3].v.toString().trim().toLowerCase() : '';
                const targetType = type.toLowerCase();
                
                if (itemCategory === targetType) {
                    itemsFound = true;
                    
                    const itemNo = row.c[0] && row.c[0].v !== null ? row.c[0].v : '';
                    const itemName = row.c[1].v !== null ? row.c[1].v : '';
                    const itemPrice = row.c[2].v !== null ? row.c[2].v : '';

                    const itemDiv = document.createElement('div');
                    // We reuse the 'menu-item' class so it gets your beautiful 3-column layout!
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

        if (!itemsFound) {
            cuisineContainer.innerHTML = `<p class="system-msg" style="text-align:center;">No ${type} items found. Please make sure you added "${type}" in Column D.</p>`;
        }

    } catch (error) {
        console.error('Error fetching cuisine data:', error);
        cuisineContainer.innerHTML = '<p class="system-msg" style="color: red; text-align:center;">Error loading items.</p>';
    }
}
// 5. Database Fetch Logic (COMBOS)
async function fetchCombosFromGoogleSheets() {
    const combosContainer = document.getElementById('combos-list');
    const loader = document.getElementById('combos-loading');
    if (!combosContainer || !loader) return;

    loader.style.display = 'block';
    combosContainer.innerHTML = ''; 

    try {
        const response = await fetch(COMBOS_URL);
        const text = await response.text();
        const jsonText = text.substring(47).slice(0, -2);
        const data = JSON.parse(jsonText);
        const rows = data.table.rows;
        
        loader.style.display = 'none';

        if (rows.length === 0) {
            combosContainer.innerHTML = '<p class="system-msg">No combos found.</p>';
            return;
        }

        rows.forEach(row => {
            // Checks for Column A (Name) and Column C (Price)
            if (row.c && row.c[0] && row.c[2]) {
                const name = row.c[0].v;
                const desc = row.c[1] ? row.c[1].v : ''; // Desc might be blank
                const price = row.c[2].v;

                const cardDiv = document.createElement('div');
                cardDiv.className = 'combo-card';
                cardDiv.innerHTML = `
                    <div class="combo-info">
                        <div class="combo-title">${name}</div>
                        <div class="combo-desc">${desc}</div>
                    </div>
                    <div class="combo-pricing">
                        <span class="new-price">₹${price}</span>
                    </div>
                `;
                combosContainer.appendChild(cardDiv);
            }
        });
    } catch (error) {
        console.error(error);
        loader.innerHTML = '<p style="color: red; text-align:center;">Error loading combos.</p>';
    }
}

// 6. Bestsellers Button Logic
function toggleBestsellers() {
    const list = document.getElementById('bestsellers-list');
    if (list.classList.contains('hidden')) {
        list.classList.remove('hidden');
    } else {
        list.classList.add('hidden');
    }
}