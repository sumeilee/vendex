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
