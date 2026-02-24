curl -s -X POST http://localhost:8081/api/v1/customer/leads \
  -H "Authorization: Bearer <CUSTOMER_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleType": "3W",
    "tyreType": "NEW",
    "tyreBrand": "CEAT",
    "vehicleModel": "Mahindra Treo Standard",
    "locationArea": "Bangalore",
    "locationPincode": "560071",
    "tyreSize": "3.75-12",
    "serviceRequirement": "Tyre Replacement",
    "tyreId": "ddb288c5-506d-4ca4-94d1-ff62d67a5391"
  }'
