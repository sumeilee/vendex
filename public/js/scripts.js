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