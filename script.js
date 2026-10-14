function calculateSolar() {
    const billInput = document.getElementById('bill').value;
    if (!billInput) {
        alert("Please enter your average monthly electricity bill.");
        return;
    }

    const monthlyBill = parseFloat(billInput);
    
    // Estimation logic for Indian residential setups (~Rs. 8 per unit average)
    let estimatedUnits = monthlyBill / 8;
    let requiredKW = (estimatedUnits / 30) / 4; 
    requiredKW = Math.max(1, Math.round(requiredKW * 10) / 10); // Minimum 1 kW

    let estimatedCost = requiredKW * 50000; // ~Rs. 50k per kW setup cost
    let subsidy = requiredKW <= 2 ? requiredKW * 30000 : 78000; // PM Surya Ghar subsidy slab approx
    let netCost = Math.max(0, estimatedCost - subsidy);
    let monthlySavings = monthlyBill * 0.85; // Saves up to 85% on bills
    let paybackMonths = Math.round(netCost / monthlySavings);

    // Render Output
    const resultDiv = document.getElementById('solar-result');
    resultDiv.className = 'result-box active-result';
    resultDiv.innerHTML = `
        <strong>📊 Solar Recommendation Results:</strong><br><br>
        • <strong>Recommended Capacity:</strong> ${requiredKW} kW<br>
        • <strong>Estimated Govt Subsidy:</strong> ₹${subsidy}<br>
        • <strong>Approx. Net Cost:</strong> ₹${netCost}<br>
        • <strong>Estimated Monthly Savings:</strong> ₹${Math.round(monthlySavings)}/month<br>
        • <strong>Estimated Payback Period:</strong> ~${paybackMonths} months
    `;
}
