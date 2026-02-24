#!/bin/bash
# test-update-lead-api.sh

# 1. Start by creating a lead (as happens on homepage)
echo "1. Creating initial lead..."
CREATE_RESPONSE=$(curl -s -X POST http://localhost:8081/api/v1/customer/leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${CUSTOMER_TOKEN}" \
  -d '{
    "vehicleType": "FOUR_WHEELER",
    "tyreType": "NEW",
    "tyreBrand": "Any",
    "vehicleModel": "Honda City 2021",
    "locationArea": "Bangalore",
    "locationPincode": "560001"
  }')

LEAD_ID=$(echo $CREATE_RESPONSE | jq -r '.id')
echo "Created lead ID: $LEAD_ID"

# 2. Update that lead with a specific tyre (as happens on quote page)
echo "2. Updating lead with tyre selection..."
# Using a dummy tyre ID that exists in the DB (from previous searches usually)
# I'll use a hardcoded UUID or one from a previous run if available.
# Actually I'll just try to fetch one tyre from the DB first.
TYRE_ID=$(curl -s http://localhost:8081/api/v1/tyres | jq -r '.[0].id')
echo "Selecting tyre ID: $TYRE_ID"

UPDATE_RESPONSE=$(curl -s -X PUT "http://localhost:8081/api/v1/customer/leads/$LEAD_ID/tyre/$TYRE_ID" \
  -H "Authorization: Bearer ${CUSTOMER_TOKEN}")

echo "Update Response:"
echo $UPDATE_RESPONSE | jq .

# 3. Verify the tyreInfo is now populated in the lead details
echo "3. Verifying tyre details are attached..."
VERIFY_RESPONSE=$(curl -s -X GET "http://localhost:8081/api/v1/customer/leads" \
  -H "Authorization: Bearer ${CUSTOMER_TOKEN}")

echo "$VERIFY_RESPONSE" | jq '.[] | select(.id=="'$LEAD_ID'") | .tyreInfo'
