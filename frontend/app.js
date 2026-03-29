// New error handling and loading states
const productGrid = document.getElementById('product-grid');
const errorContainer = document.getElementById('error-container');
const loader = document.getElementById('loader');
const refreshBtn = document.getElementById('refresh-btn');

// Enhanced fetch with error handling
async function fetchWithRetry(url, options = {}, retries = 3) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
}

// New loading UI
async function loadProducts() {
  try {
    loader.classList.remove('hidden');
    errorContainer.classList.add('hidden');
    
    const products = await fetchWithRetry('http://localhost:5000/api/products');
    
    productGrid.innerHTML = products.map(product => `
      <div class="product-card">
        <h3>${product.name}</h3>
        <div class="price">$${product.base_price}</div>
        ${product.features ? `
          <div class="features">
            <h4>Features:</h4>
            <ul>
              ${Object.entries(JSON.parse(product.features)).map(([key, val]) => `
                <li><strong>${key}:</strong> ${val}</li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
        <button onclick="calculatePrice(${product.id})">
          Calculate AI Price
        </button>
        <div id="result-${product.id}" class="result"></div>
      </div>
    `).join('');
    
  } catch (err) {
    errorContainer.classList.remove('hidden');
    console.error("Failed to load products:", err);
  } finally {
    loader.classList.add('hidden');
  }
}

// New price calculation with animation
async function calculatePrice(productId) {
  const resultDiv = document.getElementById(`result-${productId}`);
  resultDiv.innerHTML = '<div class="calculating">Calculating...</div>';
  
  try {
    const data = await fetchWithRetry('http://localhost:5000/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    });
    
    resultDiv.innerHTML = `
      <div class="ai-result">
        <div>AI Recommended: <span class="highlight">$${data.aiPrice}</span></div>
        <div>Discount: <span class="highlight">${data.discount}</span></div>
      </div>
    `;
  } catch (err) {
    resultDiv.innerHTML = '<div class="error">Calculation failed</div>';
  }
}

// Event listeners
refreshBtn.addEventListener('click', loadProducts);

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});