const body = document.querySelector("body");

body.addEventListener("click", (e) => {
    if (e.target.id.startsWith("toggle--")) {
        handleToggleSection(e.target);
    } else if (e.target.classList.contains("vendor-btn")) {
        e.target.style.backgroundColor = "#f9dc5c";
    }
});

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

document.getElementById("vendor-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target));

    const doc = {};

    const vendor_type = [];
    const address = {};

    for (key in data) {
        if (key.startsWith("address--")) {
            const field = key.split("--")[1];
            address[field] = data[key];
        } else if (key.startsWith("vendor--")) {
            vendor_type.push(data[key]);
        } else {
            doc[key] = data[key];
        }
    }

    doc["vendor_type"] = vendor_type;
    doc["address"] = address;

    console.log(doc);

    try {
        axios.post("/vendors/new", doc);
    } catch (err) {
        console.log(err);
    }
});