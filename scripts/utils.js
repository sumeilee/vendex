exports.createVendorObj = (vendors) => {
    const vendorObj = {};

    vendors.forEach(vendor => {
        vendor.vendorType.forEach(type => {
            if (!Object.keys(vendorObj).includes(type)) {
                vendorObj[type] = [];
            }

            vendorObj[type].push(vendor);
        })
    });

    return vendorObj;
}

exports.formatVendorData = (data) => {
    const doc = {};
    const vendorType = [];
    const address = {};

    for (key in data) {
        if (key.startsWith("address--")) {
            const field = key.split("--")[1];
            address[field] = data[key];
        } else if (key.startsWith("vendor--")) {
            vendorType.push(data[key]);
        } else {
            doc[key] = data[key];
        }
    }

    doc["vendorType"] = vendorType;
    doc["address"] = address;

    return doc;
}
