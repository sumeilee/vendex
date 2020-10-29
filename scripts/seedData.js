require("dotenv").config();

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const User = require("./../models/User");
const Vendor = require("./../models/Vendor");
const VendorReview = require("../models/VendorReview");

const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
const mongoURI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;
mongoose.set("useFindAndModify", false);

const demoData = [
    {
        user: {
            email: "test@test.com",
            password: "asdfasdf",
        },
        vendors: [
            {
                vendor: {
                    vendorType: ["Electrician"],
                    companyName: "Daylight Electrician",
                    contactNumber: "+65 6653 6261",
                    email: "enquiry@daylightelectrician.com",
                    address: {
                        addrLine1: "34 Boon Leat Terrace",
                        addrLine2: "#04-12F",
                        postalCode: "119866",
                        country: "Singapore"
                    }
                },
                serviceReview: {
                    locations: [],
                    avgCost: 30,
                    rating: 3,
                    comments: "does a decent job"
                }
            },
            {
                vendor: {
                    vendorType: ["Plumber"],
                    companyName: "Plumbing Hub",
                    contactNumber: "+65 6951 5363",
                    url: "https://www.plumbinghub.com.sg",
                    address: {
                        addrLine1: "140 Upper Bukit Timah Rd",
                        postalCode: "588176",
                        country: "Singapore"
                    }
                },
                serviceReview: {
                    locations: ["East", "North"],
                    avgCost: 60,
                    rating: 5,
                    comments: "very professional"
                }
            },
            {
                vendor: {
                    vendorType: ["Aircon Servicing"],
                    companyName: "MaxiCool Services",
                    contactNumber: "+65 8613 3818",
                    facebook: "https://www.facebook.com/maxicoolservices",
                },
                serviceReview: {
                    locations: ["East"],
                    avgCost: 100,
                    rating: 4,
                    comments: "efficient"
                }
            }
        ]
    },
    {
        user: {
            email: "test2@test.com",
            password: "asdfasdf"
        },
        vendors: [
            {
                vendor: {
                    companyName: "Little Locksmith",
                    contactNumber: "+65 6653 6259",
                    email: "enquiry@littlelocksmith.com"
                },
                serviceReview: {
                    locations: ["West"],
                    avgCost: 50,
                    rating: 5,
                    comments: "arrives within 30 mins"
                }
            },
            {
                vendor: {
                    companyName: "Whissh Home Cleaning Service",
                    contactNumber: "+65 6221 8626",
                    email: "www.whissh.com.sg"
                },
                serviceReview: {
                    locations: ["West"],
                    avgCost: 100,
                    rating: 5,
                    comments: "very clean job"
                }
            }
        ]
    },
    {
        user: {
            email: "test3@test.com",
            password: "asdfasdf"
        },
        vendors: [
            {
                vendor: {
                    vendorType: ["Gardener"],
                    companyName: "Express Grass Cutting Services",
                    contactNumber: "+65 8922 3359"
                }
            },
            {
                vendor: {
                    vendorType: ["Electrician"],
                    companyName: "United Electrician",
                    contactNumber: "+65 9047 3688",
                    email: "unitedelectriciansingapore@gmail.com"
                }
            }
        ]
    }
];

const seedData = async (allData) => {
    try {
        const response = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const numData = allData.length;

        for (let i = 0; i < numData; i++) {
            const { user: { email, password }, vendors } = allData[i];

            const passwordHash = await bcrypt.hash(password, 10);
            const newUser = await User.create({ email, passwordHash });

            const numVendors = vendors.length;

            for (let j = 0; j < numVendors; j++) {
                const { vendor, serviceReview } = vendors[j];
                const newVendor = await Vendor.create({
                    ...vendor,
                    createdBy: newUser._id
                });

                newUser.vendors.push(newVendor._id);

                if (serviceReview) {
                    const newServiceReview = await VendorReview.create({
                        ...serviceReview,
                        reviewer: newUser._id,
                        vendor: newVendor._id
                    });
                }
            }

            await newUser.save();
        }

        await mongoose.disconnect();

    } catch (err) {
        console.log(err);
        await mongoose.disconnect();
    }
}

seedData(demoData);

