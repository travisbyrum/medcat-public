// DrugBank API Configuration
// To use DrugBank API:
// 1. Create an account at https://go.drugbank.com/releases/latest
// 2. Get your API credentials from your account dashboard
// 3. Replace the placeholder values below with your actual credentials

window.DRUGBANK_CONFIG = {
    baseURL: 'https://go.drugbank.com/api/v1',

    // Replace these with your actual DrugBank credentials
    username: 'YOUR_DRUGBANK_USERNAME',
    password: 'YOUR_DRUGBANK_PASSWORD',

    // Rate limiting (DrugBank has limits)
    maxRequestsPerMinute: 60,
    requestDelay: 1000 // milliseconds between requests
};

// Alternative: RxNorm API (free, no authentication)
window.RXNORM_CONFIG = {
    baseURL: 'https://rxnav.nlm.nih.gov/REST',
    enabled: true // fallback when DrugBank is not available
};

// OpenFDA Configuration (free, no authentication)
window.OPENFDA_CONFIG = {
    baseURL: 'https://api.fda.gov/drug',
    enabled: true,
    maxResults: 5
};