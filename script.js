window.onload = init;
var isDarkModeOn = true;

function init() {
    setLastEditedAtDate();
}

function darkMode() {
    isDarkModeOn = !isDarkModeOn;

    // Button.
    let button = document.getElementsByTagName("button")[0];
    button.classList.toggle("button-light-mode");
    button.innerHTML = isDarkModeOn ? "LIGHT MODE" : "DARK MODE";

    // Body.
    let body = document.body;
    body.classList.toggle("body-light-mode");

    // Group containers.
    let groupContainers = document.getElementsByClassName("group-container");
    for (let groupContainer of groupContainers) {
        groupContainer.classList.toggle("group-container-light-mode");
    }

    // URLs.
    let urls = document.getElementsByTagName("a");
    for (let url of urls) {
        url.classList.toggle("a-light-mode");
    }

    // Horizontal lines.
    let hrs = document.getElementsByTagName("hr");
    for (let hr of hrs) {
        hr.classList.toggle("hr-light-mode");
    }

    // Images.
    let images = document.getElementsByTagName("img");
    for (let image of images) {
        let newSrc = image.src.split('-')[0];
        let extension = image.dataset.extension;
        image.src = isDarkModeOn ? `${newSrc}-light.${extension}` : `${newSrc}-dark.${extension}`;
    }
}

function setLastEditedAtDate() {
    let footer = document.getElementsByClassName('footer')[0];
    fetch('https://api.github.com/repos/artysta/artysta.github.io/commits')
    .then(response => response.json())
    .then(commits => {
        let latestCommit = commits[0];
        let lastEditedAtDate = latestCommit.commit.committer.date.replace('T', ' ').replace('Z', '');
        footer.innerHTML = `Last edited at ${lastEditedAtDate} CET | commit <a href="${latestCommit.html_url}" target="_blank">${latestCommit.sha}</a>`;
    })
    .catch(error => footer.innerHTML = `Last edited at N/A`);
}