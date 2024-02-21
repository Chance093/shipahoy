'use strict';

const response = {
  type: "success",
  message: "Bulk order created successfully",
  bulkOrder: {
    _id: "65cec2a11fbc6dd9285e236a",
    user: "6511c995eac45b5e35c1d6a7",
    orders: [
      {
        _id: "65cec2a11fbc6dd9285e2368",
        uuid: "dca338af-b473-4ee8-940e-414e3237bd57",
        user: "6511c995eac45b5e35c1d6a7",
        isApi: false,
        labelType: {
          _id: "65118b89f10c0c341a3d59c4",
          name: "USPS Priority (0-70lb)",
          uid: "priority",
        },
        price: 5.5,
        status: "paid",
        pdf: "./labels/64ecefcc3dd8e9c254f4ef58/92055958439379198892887060.pdf",
        tracking: "92055958439379198892887060",
        tracking_details: [],
        createdAt: "2024-02-16T02:04:17.916Z",
        updatedAt: "2024-02-16T02:04:17.916Z",
        __v: 0,
      },
    ],
    labelType: "65118b89f10c0c341a3d59c4",
    total: 5.5,
    status: "pending",
    uuid: "3fadc629-229d-48f9-afee-1cd5b9866296",
    csv: "./labels/64ecefcc3dd8e9c254f4ef58/3fadc629-229d-48f9-afee-1cd5b9866296.csv",
    pdf: "./labels/64ecefcc3dd8e9c254f4ef58/3fadc629-229d-48f9-afee-1cd5b9866296.pdf",
    zip: "./labels/e9732961-18c4-4af3-8ae7-ddc1648c2745.zip",
    createdAt: "2024-02-16T02:04:17.921Z",
    updatedAt: "2024-02-16T02:04:18.491Z",
    __v: 0,
    csvLink: "https://api.weshipsmart.com/./labels/6511c995eac45b5e35c1d6a7/3fadc629-229d-48f9-afee-1cd5b9866296.csv",
    pdfLink: "https://api.weshipsmart.com/./labels/6511c995eac45b5e35c1d6a7/3fadc629-229d-48f9-afee-1cd5b9866296.pdf",
    zipLink: "https://api.weshipsmart.com/./labels/6511c995eac45b5e35c1d6a7/3fadc629-229d-48f9-afee-1cd5b9866296.zip",
  },
};