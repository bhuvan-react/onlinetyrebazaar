const API_BASE = 'http://localhost:8080/api/v1';

async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });
    const text = await res.text();
    let data;
    try {
        data = text ? JSON.parse(text) : null;
    } catch (e) {
        data = text;
    }
    if (!res.ok) {
        throw new Error(`[${res.status}] ${url} - ${JSON.stringify(data)}`);
    }
    return data;
}

async function runTest() {
    console.log("=== STARTING E2E LOCAL TESTING ===");
    try {
        // --- CUSTOMER FLOW ---
        console.log("\n1. Customer Flow: Authenticate & Create Lead");
        const customerMobile = "9999999999";

        // Send OTP
        const customerOtpRes = await request('/auth/customer/send-otp', {
            method: 'POST',
            body: JSON.stringify({ mobile: customerMobile })
        });
        const customerOtp = customerOtpRes.otp || customerOtpRes.code || '123456';
        console.log(" -> Customer OTP sent:", customerOtp);

        // Provide OTP
        const customerLoginResponse = await request('/auth/customer/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ mobile: customerMobile, otp: customerOtp })
        });
        const customerToken = customerLoginResponse.token;
        console.log(" -> Customer logged in. Got token.");

        // Create Lead
        const leadPayload = {
            vehicleType: "4W",
            tyreType: "NEW",
            location: "Bangalore",
            pincode: "560001",
            details: "Need 4 new tyres for Honda City"
        };
        const createdLead = await request('/customer/leads', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${customerToken}` },
            body: JSON.stringify(leadPayload)
        });
        const leadId = createdLead.id;
        console.log(" -> Customer created Lead:", leadId, createdLead.status);


        // --- DEALER FLOW ---
        console.log("\n2. Dealer Flow: Authenticate & Submit Offer");
        const dealerMobile = "8888888888";

        const dealerOtpRes = await request('/auth/dealer/quick/send-otp', {
            method: 'POST',
            body: JSON.stringify({ mobile: dealerMobile })
        });
        const dealerOtp = dealerOtpRes.otp || dealerOtpRes.code || '123456';
        console.log(" -> Dealer OTP sent:", dealerOtp);

        const dealerLoginResponse = await request('/auth/dealer/quick/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ mobile: dealerMobile, otp: dealerOtp })
        });
        const dealerToken = dealerLoginResponse.token;
        console.log(" -> Dealer logged in. Got token.");

        // Dealer discovers leads
        const discoveredLeads = await request('/leads/discover', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${dealerToken}` }
        });
        console.log(" -> Dealer discovered leads:", discoveredLeads.length);

        // Find our lead
        const targetLead = discoveredLeads.find(l => l.id === leadId);
        if (!targetLead) {
            console.log(" !!! ERROR: Lead not found in discovery list.");
        } else {
            console.log(" -> Found target lead in discovery.");
        }

        // Dealer submits offer
        const offerPayload = {
            price: 15000,
            condition: "NEW",
            notes: "Set of 4 Michelin Tyres",
            images: []
        };
        const createdOffer = await request(`/leads/${leadId}/offers`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${dealerToken}` },
            body: JSON.stringify(offerPayload)
        });
        const offerId = createdOffer.id;
        console.log(" -> Dealer submitted offer:", offerId, "Price:", createdOffer.price);


        // --- CUSTOMER FLOW ---
        console.log("\n3. Customer Flow: View Offers & Select Dealer");

        const offersForLead = await request(`/customer/leads/${leadId}/offers`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${customerToken}` }
        });
        console.log(" -> Customer views offers for lead. Count:", offersForLead.length);

        // Select the offer
        const selectedResponse = await request(`/customer/leads/${leadId}/select-offer`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${customerToken}` },
            body: JSON.stringify({ offerId: offerId })
        });
        console.log(" -> Customer selected offer. Lead status updated to:", selectedResponse.status);


        // --- DEALER FLOW ---
        console.log("\n4. Dealer Flow: View Unlocked Leads");

        const unlockedLeads = await request('/leads/unlocked', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${dealerToken}` }
        });
        console.log(" -> Dealer views unlocked leads. Count:", unlockedLeads.length);
        const unlockedTarget = unlockedLeads.find(l => l.id === leadId);
        if (unlockedTarget) {
            console.log(" -> Target lead is unlocked. Customer info:", unlockedTarget.customerName, unlockedTarget.customerPhone);
        }

        console.log("\n=== E2E TESTING COMPLETED SUCCESSFULLY ===");

    } catch (e) {
        console.error("\n!!! E2E TEST FAILED !!!");
        console.error(e.message);
    }
}

runTest();
