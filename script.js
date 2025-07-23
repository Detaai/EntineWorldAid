function toggleDropdown(button) {
    const dropdown = button.parentElement;
    dropdown.classList.toggle('open');
}

function returnToHome() {
    window.location.href = "home-page.html"; // Redirects to home-page.html
}