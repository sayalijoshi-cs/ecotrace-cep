async function calculateSolar() {
    const billInput = document.getElementById('bill').value;
    if (!billInput) {
        alert("Please enter your average monthly electricity bill.");
        return;
    }

    const monthlyBill = parseFloat(billInput);
    const resultDiv = document.getElementById('solar-result');

    // Show loading state while waiting for Render backend
    resultDiv.className = 'result-box active-result';
    resultDiv.innerHTML = '<strong>Calculating solar estimate via Python backend...</strong>';

    try {
        // Send data to your live Render backend
        const response = await fetch('https://ecotrace-backend-f2ax.onrender.com/api/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                electricity_kwh: monthlyBill / 8 // converts bill to estimated kWh
            })
        });

        const data = await response.json();

        if (data.status === "success") {
            // Calculate remaining solar fields for display
            const estimatedUnits = monthlyBill / 8;
            const requiredKW = Math.max(1, Math.round((estimatedUnits / 30 / 4) * 10) / 10);
            const subsidy = requiredKW <= 2 ? requiredKW * 30000 : 78000;
            const netCost = Math.max(0, (requiredKW * 50000) - subsidy);

            resultDiv.innerHTML = `
                <strong>Solar Recommendation Results:</strong><br><br>
                <strong>Recommended Capacity:</strong> ${requiredKW} kW<br>
                <strong>Estimated Govt Subsidy:</strong> ₹${subsidy}<br>
                <strong>Estimated Net Cost:</strong> ₹${netCost}<br>
                <strong>Backend Verification:</strong> ${data.message}
            `;
        } else {
            resultDiv.innerHTML = '<strong>Error processing solar data.</strong>';
        }
    } catch (error) {
        console.error("Error connecting to backend:", error);
        resultDiv.innerHTML = '<strong>Could not connect to the Python backend server.</strong>';
    }
}