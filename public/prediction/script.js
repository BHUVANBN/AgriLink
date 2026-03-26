let masterData = null;
let priceChart = null;

// DOM Elements
const groupSelect = document.getElementById('group-select');
const commoditySelect = document.getElementById('commodity-select');
const districtSelect = document.getElementById('district-select');
const marketSelect = document.getElementById('market-select');
const predictBtn = document.getElementById('predict-btn');
const resultsArea = document.getElementById('results-area');
const loader = document.getElementById('loader');

// Initial Load
async function init() {
    try {
        const response = await fetch('/data.json');
        masterData = await response.json();
        
        populateGroups();
        populateDistricts();
    } catch (err) {
        console.error("Failed to load metadata:", err);
    }
}

function populateGroups() {
    Object.entries(masterData.groups).forEach(([id, info]) => {
        const opt = new Option(info.name, id);
        groupSelect.add(opt);
    });
}

function populateDistricts() {
    Object.entries(masterData.districts).forEach(([id, info]) => {
        const opt = new Option(info.name, id);
        districtSelect.add(opt);
    });
}

// Interdependent Filtering
groupSelect.onchange = () => {
    commoditySelect.innerHTML = '<option value="">Select Crop</option>';
    const gid = groupSelect.value;
    if (gid && masterData.groups[gid]) {
        commoditySelect.disabled = false;
        Object.entries(masterData.groups[gid].commodities).forEach(([cid, name]) => {
            commoditySelect.add(new Option(name, cid));
        });
    } else {
        commoditySelect.disabled = true;
    }
    validateBtn();
};

districtSelect.onchange = () => {
    marketSelect.innerHTML = '<option value="">Select Market</option>';
    const did = districtSelect.value;
    if (did && masterData.districts[did]) {
        marketSelect.disabled = false;
        Object.entries(masterData.districts[did].markets).forEach(([mid, name]) => {
            marketSelect.add(new Option(name, mid));
        });
    } else {
        marketSelect.disabled = true;
    }
    validateBtn();
};

const validateBtn = () => {
    predictBtn.disabled = !(commoditySelect.value && marketSelect.value);
};

commoditySelect.onchange = validateBtn;
marketSelect.onchange = validateBtn;

// Prediction Logic
predictBtn.onclick = async () => {
    const cid = commoditySelect.value;
    const mid = marketSelect.value;
    const cropName = commoditySelect.options[commoditySelect.selectedIndex].text;
    
    loader.classList.remove('hidden');
    resultsArea.classList.add('hidden');

    try {
        // We use our existing API endpoint in ml_service
        const resp = await fetch('http://localhost:8000/api/predict/crop-price', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                cropName: cropName,
                commodity_id: cid,
                market_id: mid,
                forecastMonths: 4
            })
        });
        
        const result = await resp.json();
        if (result.success) {
            updateUI(result);
        } else {
            alert("Error: " + (result.error || "No data available for this market combination."));
        }
    } catch (err) {
        alert("Server Connectivity Error. Ensure ml_service is running.");
    } finally {
        loader.classList.add('hidden');
    }
};

function updateUI(data) {
    resultsArea.classList.remove('hidden');
    
    // Stats
    document.getElementById('current-price').innerText = `₹${data.currentMarketPrice}/q`;
    document.getElementById('p1-price').innerText = `₹${data.forecast[0].predictedPrice}/q`;
    document.getElementById('confidence-score').innerText = `${Math.round(data.confidence * 100)}%`;
    document.getElementById('best-window').innerText = "Next 60 Days";

    // Table
    const tableBody = document.getElementById('historical-data');
    tableBody.innerHTML = '';
    data.forecast.forEach(pt => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pt.month}</td>
            <td style="font-weight:700">₹${pt.predictedPrice}</td>
            <td>₹${pt.minPrice}</td>
            <td>₹${pt.maxPrice}</td>
            <td>${data.confidence > 0.7 ? 'High' : 'Medium'}</td>
            <td style="color:${data.trend === 'rising' ? '#4ade80' : '#f87171'}">${data.trend.toUpperCase()}</td>
        `;
        tableBody.appendChild(row);
    });

    // Chart
    renderChart(data.forecast, data.currentMarketPrice);
}

function renderChart(forecast, current) {
    const ctx = document.getElementById('priceChart').getContext('2d');
    if (priceChart) priceChart.destroy();

    const labels = ["Current", ...forecast.map(f => f.month)];
    const prices = [current, ...forecast.map(f => f.predictedPrice)];
    
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Predicted Price Path',
                data: prices,
                borderColor: '#d4af37',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#aaa'} },
                x: { grid: { display: false }, ticks: { color: '#aaa'} }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

init();
