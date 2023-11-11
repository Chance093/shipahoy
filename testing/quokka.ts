'use strict';

const response = {
	"type": "success",
	"message": "Bulk order created successfully",
	"bulkOrder": {
		"_id": "654dd08a6ddd8099c17b409f",
		"user": "6511c995eac45b5e35c1d6a7",
		"orders": [
			{
				"_id": "654dd08a6ddd8099c17b409d",
				"uuid": "fa563501-b3cc-4c6b-9973-1189883e43a2",
				"user": "6511c995eac45b5e35c1d6a7",
				"isApi": false,
				"labelType": {
					"_id": "65118b89f10c0c341a3d59c4",
					"name": "USPS Priority (0-70lb)",
					"uid": "priority"
				},
				"price": 4.75,
				"status": "paid",
				"pdf": "./labels/64ecefcc3dd8e9c254f4ef58/92055901735907417916800475.pdf",
				"tracking": "92055901735907417916800475",
				"tracking_details": [],
				"createdAt": "2023-11-10T06:41:14.709Z",
				"updatedAt": "2023-11-10T06:41:14.709Z",
				"__v": 0
			}
		],
		"labelType": "65118b89f10c0c341a3d59c4",
		"total": 4.75,
		"status": "pending",
		"uuid": "ab0140a4-8b4d-4560-9280-43e4cb055a33",
		"csv": "./labels/64ecefcc3dd8e9c254f4ef58/ab0140a4-8b4d-4560-9280-43e4cb055a33.csv",
		"pdf": "./labels/64ecefcc3dd8e9c254f4ef58/ab0140a4-8b4d-4560-9280-43e4cb055a33.pdf",
		"zip": "./labels/9c13956b-30dc-46fa-9c04-1e456efba393.zip",
		"createdAt": "2023-11-10T06:41:14.716Z",
		"updatedAt": "2023-11-10T06:41:14.716Z",
		"__v": 0
	}
}

const { bulkOrder } = response;
const { csv, pdf, zip } = bulkOrder;
const { orders } = bulkOrder;
const parsedOrders = new Map();

