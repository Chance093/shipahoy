'use strict';

import { json } from "stream/consumers";

const res = {
	"type": "success",
	"message": "Bulk order created successfully",
	"bulkOrder": {
		"_id": "65a0e1f5b1b30e8a0d7f4e0",
		"uuid": "b1c50a23-965b-4f51-81a3-7a28810187d1",
		"orders": [
			{
				"_id": "65a0e1f5b1b30e8a0d7f4df",
				"labelType": {
					"_id": "65a0e1f5b1b30e8a0d7f4de",
					"name": "USPS Priority",
					"uid": "priority"
				},
				"fromName": "Majd Bigham",
				"fromStreet": "6609 Steen St",
				"fromStreet2": "",
				"fromCity": "Canal Winchester",
				"fromZip": "43110",
				"fromPhone": "",
				"toName": "Dino DeRoia",
				"toStreet": "7965 Princewood Dr",
				"toStreet2": "",
				"toCity": "Hudson",
				"toState": "OH",
				"toZip": "44236-1589",
				"toPhone": "",
				"weight": "2",
				"price": 1,
				"tracking": "9206234256349763495",
				"pdf": "./labels/65a0e1f5b1b30e8a0d7f4f/92055901755477321149763496.pdf",
				"OrderId": "65a0e1f5b1b30e8a0d7f4dd",
				"uuid": "65a0e1f5b1b30e8a0d7f4dd",
				"user": "65a0e1f5b1b30e8a0d7f4dc",
				"createdAt": "2023-09-22T11:42:34.829Z",
				"updatedAt": "2023-09-22T11:42:34.829Z",
				"__v": 0
			},
			{
				"_id": "65a0e1f5b1b30e8a0d7f4df",
				"labelType": {
					"_id": "65a0e1f5b1b30e8a0d7f4de",
					"name": "USPS Priority",
					"uid": "priority"
				},
				"fromName": "Majd Bigham",
				"fromStreet": "6609 Steen St",
				"fromStreet2": "",
				"fromCity": "Canal Winchester",
				"fromZip": "43110",
				"fromPhone": "",
				"toName": "Dino DeRoia",
				"toStreet": "7965 Princewood Dr",
				"toStreet2": "",
				"toCity": "Hudson",
				"toState": "OH",
				"toZip": "44236-1589",
				"toPhone": "",
				"weight": "2",
				"price": 1,
				"tracking": "9206234256349763495",
				"pdf": "./labels/65a0e1f5b1b30e8a0d7f4f/92055901755477321149763496.pdf",
				"OrderId": "65a0e1f5b1b30e8a0d7f4dd",
				"uuid": "65a0e1f5b1b30e8a0d7f4dd",
				"user": "65a0e1f5b1b30e8a0d7f4dc",
				"createdAt": "2023-09-22T11:42:34.829Z",
				"updatedAt": "2023-09-22T11:42:34.829Z",
				"__v": 0
			},
			{
				"_id": "65a0e1f5b1b30e8a0d7f4df",
				"labelType": {
					"_id": "65a0e1f5b1b30e8a0d7f4de",
					"name": "USPS Priority",
					"uid": "priority"
				},
				"fromName": "Majd Bigham",
				"fromStreet": "6609 Steen St",
				"fromStreet2": "",
				"fromCity": "Canal Winchester",
				"fromZip": "43110",
				"fromPhone": "",
				"toName": "Dino DeRoia",
				"toStreet": "7965 Princewood Dr",
				"toStreet2": "",
				"toCity": "Hudson",
				"toState": "OH",
				"toZip": "44236-1589",
				"toPhone": "",
				"weight": "2",
				"price": 1,
				"tracking": "9206234256349763495",
				"pdf": "./labels/65a0e1f5b1b30e8a0d7f4f/92055901755477321149763496.pdf",
				"OrderId": "65a0e1f5b1b30e8a0d7f4dd",
				"uuid": "65a0e1f5b1b30e8a0d7f4dd",
				"user": "65a0e1f5b1b30e8a0d7f4dc",
				"createdAt": "2023-09-22T11:42:34.829Z",
				"updatedAt": "2023-09-22T11:42:34.829Z",
				"__v": 0
			},
			{
				"_id": "65a0e1f5b1b30e8a0d7f4df",
				"labelType": {
					"_id": "65a0e1f5b1b30e8a0d7f4de",
					"name": "USPS Priority",
					"uid": "priority"
				},
				"fromName": "Majd Bigham",
				"fromStreet": "6609 Steen St",
				"fromStreet2": "",
				"fromCity": "Canal Winchester",
				"fromZip": "43110",
				"fromPhone": "",
				"toName": "Dino DeRoia",
				"toStreet": "7965 Princewood Dr",
				"toStreet2": "",
				"toCity": "Hudson",
				"toState": "OH",
				"toZip": "44236-1589",
				"toPhone": "",
				"weight": "2",
				"price": 1,
				"tracking": "9206234256349763495",
				"pdf": "./labels/65a0e1f5b1b30e8a0d7f4f/92055901755477321149763496.pdf",
				"OrderId": "65a0e1f5b1b30e8a0d7f4dd",
				"uuid": "65a0e1f5b1b30e8a0d7f4dd",
				"user": "65a0e1f5b1b30e8a0d7f4dc",
				"createdAt": "2023-09-22T11:42:34.829Z",
				"updatedAt": "2023-09-22T11:42:34.829Z",
				"__v": 0
			}
		],
		"user": "65a0e1f5b1b30e8a0d7f4dc",
		"total": 1,
		"zip": "./labels/65a0e1f5b1b30e8a0d7f4e0/labels.zip",
		"pdf": "./labels/65a0e1f5b1b30e8a0d7f4dc/labels.pdf",
		"csv": "./labels/65a0e1f5b1b30e8a0d7f4dc/labels.csv",
		"createdAt": "2023-09-25T15:00:00.000Z",
		"updatedAt": "2023-09-25T15:00:00.000Z",
		"__v": 0
	},
	"orderStatus": []
}

const { orders } = res.bulkOrder;
for (const order of orders) {
	const {
		fromName,
		fromStreet,
		fromStreet2,
		fromCity,
		fromZip,
		fromPhone,
		toName,
		toStreet,
		toStreet2,
		toCity,
		toState,
		toZip,
		toPhone,
		weight,
		price,
		tracking
	} = order;
	console.log(fromName, fromStreet, fromStreet2, fromCity, fromZip, fromPhone, toName, toStreet, toStreet2, toCity, toState, toZip, toPhone, weight, price, tracking);
}

const config = {
	method: "post",
	maxBodyLength: Infinity,
	url: "https://api.weshipsmart.com/api/v2/order/create-bulk-order",
	headers: {
		"x-api-key": "838f1031-44d9-4231-94dd-1e8f9e7b5148",
	},
};

const data = {
	labelType: "priority",
	data: [
		{
			FromCountry: "US",
			FromName: "chance",
			FromCompany: "",
			FromPhone: "7024687626",
			FromStreet1: "1011 avocadodrive",
			FromStreet2: "",
			FromCity: "las vegas",
			FromZip: "89148",
			FromState: "CA",
			ToCountry: "US",
			ToName: "DINH SAM LU",
			ToCompany: "",
			ToPhone: "14820971635",
			ToStreet1: "3165 W TYLER AVE",
			ToStreet2: "",
			ToCity: "ANAHEIM",
			ToZip: "92801",
			ToState: "CA",
			Length: "71",
			Height: "81",
			Width: "12",
			Weight: "8",
		},
	],
}

const kajhsdf = { "labelType": "priority",
"data": [
		{
			"FromCountry": "US",
			"FromName": "chance",
			"FromCompany": "",
			"FromPhone": "7024687626",
			"FromStreet1": "1011 avocadodrive",
			"FromStreet2": "",
			"FromCity": "las vegas",
			"FromZip": "89148",
			"FromState": "CA",
			"ToCountry": "US",
			"ToName": "DINH SAM LU",
			"ToCompany": "",
			"ToPhone": "14820971635",
			"ToStreet1": "3165 W TYLER AVE",
			"ToStreet2": "",
			"ToCity": "ANAHEIM",
			"ToZip": "92801",
			"ToState": "CA",
			"Length": "71",
			"Height": "81",
			"Width": "12",
			"Weight": "8"
		}
	] 
}

