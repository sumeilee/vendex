const body = document.querySelector("body");
const navbarLinks = document.querySelector(".navbar__links");
const hamburgerIcon = document.querySelector("#hamburger-icon");

window.addEventListener("resize", () => {
    if (window.innerWidth > 600) {
        navbarLinks.classList.remove("responsive");
    }
})

body.addEventListener("click", (e) => {
    if (e.target.id.startsWith("toggle--")) {
        handleToggleSection(e.target);
    } else if (e.target.classList.contains("vendor-btn")) {
        e.target.style.backgroundColor = "#f9dc5c";
    }
});

body.addEventListener("submit", (e) => {
    if (e.target.id === "vendor-form") {
        handleVendorFormSubmit(e);
    }
})

const handleToggleSection = (target) => {
    const section = target.id.split("--")[1];
    const sectionDiv = document.querySelector(`#section--${section}`);

    const display = sectionDiv.style.display;

    if (!display || display === "none") {
        sectionDiv.style.display = "flex";
    } else {
        sectionDiv.style.display = "none";
    }

    if (section === "web" || section === "address") {
        const toggleSymbol = document.querySelector(`#toggle__symbol--${section}`);
        if (!display || display === "none") {
            toggleSymbol.innerHTML = "-";
        } else {
            toggleSymbol.innerHTML = "+";
        }
    }
}

const handleVendorFormSubmit = async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target));

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

    console.log(doc);

    try {
        const response = await axios.post("/vendors/new", doc);

        window.location = response.data.redirect;
    } catch (err) {
        console.log(err);
    }
};

const toggleSideMenu = () => {
    if (navbarLinks.classList.contains("responsive")) {
        navbarLinks.classList.remove("responsive");
    } else {
        navbarLinks.classList.add("responsive");
    }
    // console.log("toggling side menu");
}

const makeActive = (target, activeClassName) => {
    const currentActive = document.querySelector(`.${activeClassName}`);
    if (currentActive) {
        currentActive.classList.remove(activeClassName);
    }

    console.log(target);
    target.classList.add(activeClassName);
}