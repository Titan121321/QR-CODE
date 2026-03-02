// 1. Google Sheets Setup (Fully updated with your new Canteen_DB link!)
const SHEET_ID = '1fAIJlQZZk6Hcy06Hz1ojnACh565ppD3l9wwoQRW16KU'; 
const MENU_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=ITEMS_DB`;
const COMBOS_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=COMBOS_DB`;
const TRANSACTIONS_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=TRANSACTIONS_DB`;
const EDIT_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;

// 🚨 Paste your new Google Apps Script URL here later to make the End Day button work!
const APPS_SCRIPT_URL = "YOUR_APPS_SCRIPT_URL_HERE"; 

// 2. Navigation Logic
function openView(viewId) {
    const editBtn = document.getElementById('btn-edit-db');
    if (editBtn) editBtn.href = EDIT_URL;

    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
        view.classList.add('hidden');
    });
    
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.remove('hidden');
        targetView.classList.add('active');
    }

    // Trigger the correct fetch when opening a screen
    if (viewId === 'menu-view') fetchMenuFromGoogleSheets();
    if (viewId === 'combos-view') fetchCombosFromGoogleSheets();
    if (viewId === 'transactions-view') fetchTransactionsFromGoogleSheets();
}

// 3. Database Fetch Logic (MENU - ITEMS_DB)
async function fetchMenuFromGoogleSheets() {
    const menuContainer = document.getElementById('menu-list');
    const loader = document.getElementById('menu-loading');
    if (!menuContainer || !loader) return; 

    loader.style.display = 'block';
    menuContainer.innerHTML = ''; 

    try {
        const response = await fetch(MENU_URL);
        const text = await response.text();
        const jsonText = text.substring(47).slice(0, -2);
        const data = JSON.parse(jsonText);
        const rows = data.table.rows;
        
        loader.style.display = 'none'; 

        if (rows.length === 0) return menuContainer.innerHTML = '<p class="system-msg">No items found.</p>';

        rows.forEach(row => {
            if (row.c) {
                // Safely grab columns A(0), B(1), and D(3)
                const itemNo = row.c[0] ? row.c[0].v : '';
                const itemName = row.c[1] ? row.c[1].v : '';
                const itemPrice = row.c[3] ? row.c[3].v : '';

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
        console.error(error);
        loader.innerHTML = '<p class="system-msg" style="color: red;">Error loading menu.</p>';
    }
}

// 4. Cuisine Filter Logic (ITEMS_DB)
async function loadCuisine(type) {
    const cuisineContainer = document.getElementById('cuisine-container');
    if (!cuisineContainer) return;

    cuisineContainer.innerHTML = `<p class="system-msg" style="text-align:center;">Loading ${type} items...</p>`;

    try {
        const response = await fetch(MENU_URL);
        const text = await response.text();
        const jsonText = text.substring(47).slice(0, -2);
        const data = JSON.parse(jsonText);
        const rows = data.table.rows;
        
        cuisineContainer.innerHTML = ''; 
        let itemsFound = false;

        rows.forEach(row => {
            if (row.c) {
                // Safely grab Category from Column C(2)
                const itemCategory = row.c[2] && row.c[2].v ? row.c[2].v.toString().trim().toLowerCase() : '';
                const targetType = type.toLowerCase();
                
                if (itemCategory === targetType) {
                    itemsFound = true;
                    
                    const itemNo = row.c[0] ? row.c[0].v : '';
                    const itemName = row.c[1] ? row.c[1].v : '';
                    const itemPrice = row.c[3] ? row.c[3].v : ''; 

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

        if (!itemsFound) {
            cuisineContainer.innerHTML = `<p class="system-msg" style="text-align:center;">No ${type} items found.</p>`;
        }

    } catch (error) {
        console.error(error);
        cuisineContainer.innerHTML = '<p class="system-msg" style="color: red; text-align:center;">Error loading items.</p>';
    }
}

// 5. Database Fetch Logic (COMBOS_DB)
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

        if (rows.length === 0) return combosContainer.innerHTML = '<p class="system-msg">No combos found.</p>';

        rows.forEach(row => {
            if (row.c) {
                // Read Columns A, B, C, and D
                const name = row.c[0] ? row.c[0].v : '';
                const desc = row.c[1] ? row.c[1].v : ''; 
                const price = row.c[2] ? row.c[2].v : '';
                const imgUrl = row.c[3] ? row.c[3].v : ''; // Column D for the image link

                if (name) {
                    const cardDiv = document.createElement('div');
                    cardDiv.className = 'combo-card';
                    
                    // If an image URL exists, apply it with a dark overlay
                    if (imgUrl) {
                        cardDiv.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url('${imgUrl}')`;
                        cardDiv.style.borderLeft = 'none'; 
                    } else {
                        cardDiv.style.borderLeft = '8px solid var(--orange)'; // Default look if no image
                    }

                    // Turn text white if there is an image
                    const titleColor = imgUrl ? 'color: #ffffff;' : '';
                    const descColor = imgUrl ? 'color: #cbd5e1;' : '';

                    cardDiv.innerHTML = `
                        <div class="combo-info">
                            <div class="combo-title" style="${titleColor}">${name}</div>
                            <div class="combo-desc" style="${descColor}">${desc}</div>
                        </div>
                        <div class="combo-pricing">
                            <span class="new-price">₹${price}</span>
                        </div>
                    `;
                    combosContainer.appendChild(cardDiv);
                }
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

// 7. Database Fetch Logic (TRANSACTIONS_DB)
async function fetchTransactionsFromGoogleSheets() {
    const txContainer = document.getElementById('transactions-list');
    const loader = document.getElementById('transactions-loading');
    if (!txContainer || !loader) return;

    loader.style.display = 'block';
    txContainer.innerHTML = ''; 

    try {
        const response = await fetch(TRANSACTIONS_URL);
        const text = await response.text();
        const jsonText = text.substring(47).slice(0, -2);
        const data = JSON.parse(jsonText);
        const rows = data.table.rows;
        
        loader.style.display = 'none';

        if (rows.length === 0) return txContainer.innerHTML = '<p class="system-msg" style="text-align:center;">No transactions yet.</p>';

        // Reverse so the newest transactions are at the top
        [...rows].reverse().forEach(row => {
            if (row.c) {
                const time = row.c[0] ? row.c[0].v : '';
                const orderNo = row.c[1] ? row.c[1].v : '';
                const orderInfo = row.c[2] ? row.c[2].v : '';
                const amount = row.c[3] ? row.c[3].v : '';

                if (time || orderInfo) {
                    const txDiv = document.createElement('div');
                    
                    if (orderInfo.toString().includes("END OF")) {
                        txDiv.className = 'tx-divider';
                        txDiv.innerHTML = `------- | ${orderInfo} | -------`;
                    } else {
                        txDiv.className = 'tx-row';
                        txDiv.innerHTML = `
                            <div class="tx-time">${time}</div>
                            <div class="tx-order-no">#${orderNo}</div>
                            <div class="tx-desc">${orderInfo}</div>
                            <div class="tx-amount">₹${amount}</div>
                        `;
                    }
                    txContainer.appendChild(txDiv);
                }
            }
        });
    } catch (error) {
        console.error(error);
        loader.innerHTML = '<p style="color: red; text-align:center;">Error loading transactions.</p>';
    }
}

// 8. End Day Logic (Writing to Sheet)
async function endDay() {
    const btn = document.getElementById('btn-end-day');
    
    if (APPS_SCRIPT_URL === "YOUR_APPS_SCRIPT_URL_HERE") {
        alert("Wait! You need to create a Google Apps Script and paste the URL into your SERVER.js code before this button can write to the database.");
        return;
    }

    if (!confirm("Are you sure you want to end the day? This will add a divider to the sheet.")) return;

    const originalText = btn.innerHTML;
    btn.innerHTML = "Processing...";
    btn.disabled = true;

    try {
        await fetch(APPS_SCRIPT_URL + "?action=endDay", { method: 'GET', mode: 'no-cors' });
        alert("Day ended successfully! Check your database.");
        fetchTransactionsFromGoogleSheets(); 
    } catch (error) {
        alert("Command sent! Check Google Sheets.");
    }

    btn.innerHTML = originalText;
    btn.disabled = false;
}