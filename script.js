window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 50) {
        navbar.classList.remove("transparent");
        navbar.classList.add("white");
    } else {
        navbar.classList.remove("white");
        navbar.classList.add("transparent");
    }
});

document.getElementById("contactForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    try {
        const response = await fetch("http://localhost:5000/submit", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            alert("Form submitted successfully. We'll get in touch with you soon!");
            this.reset();
        } else {
            alert("Failed to submit the form. Please try again.");
        }
    } catch (error) {
        console.error("Error submitting the form:", error);
        alert("An error occurred while submitting the form.");
    }
});

