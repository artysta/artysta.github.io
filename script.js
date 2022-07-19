window.onload = init;
var isDarkModeOn = true;

function init() {
    fetchResumeData().then(data => {
        renderAbout(data);
        renderPersonal(data);
        renderWorkplaces(data);
        setLastEditedAtDate(data);
        renderContact(data);
    });
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
        footer.innerHTML = `Last edited at ${lastEditedAtDate} UTC | <a href="${latestCommit.html_url}" target="_blank">${latestCommit.sha}</a>`;
    })
    .catch(error => footer.innerHTML = `Last edited at N/A`);
}

function renderAbout(data) {
    let aboutContainer = document.getElementById("about");
    let divGroupContainer = document.createElement("div");
    divGroupContainer.classList.add("group-container");

    let sectionTitle = document.createElement("h2");
    sectionTitle.innerHTML = data.about.title;
    aboutContainer.appendChild(sectionTitle);

    let description = document.createElement("p");
    description.innerHTML = data.about.description;

    divGroupContainer.appendChild(description);
    aboutContainer.appendChild(divGroupContainer);
}

function renderPersonal(data) {
    let personalContainer = document.getElementById("personal");
    let divGroupContainer = document.createElement("div");
    divGroupContainer.classList.add("group-container");

    let sectionTitle = document.createElement("h2");
    sectionTitle.innerHTML = data.personal.title;
    personalContainer.appendChild(sectionTitle);

    let personalUl = document.createElement("ul");
    let nameLi = document.createElement("li");
    nameLi.innerHTML = data.personal.name;
    personalUl.appendChild(nameLi);

    let birthYearLi = document.createElement("li");
    birthYearLi.innerHTML = data.personal.birthYear;
    personalUl.appendChild(birthYearLi);

    let nationalityLi = document.createElement("li");
    nationalityLi.innerHTML = data.personal.nationality;
    personalUl.appendChild(nationalityLi);

    divGroupContainer.appendChild(personalUl);
    personalContainer.appendChild(divGroupContainer);
}

function renderWorkplaces(data) {
    let workplacesContainer = document.getElementById("workplaces");
    let sectionTitle = document.createElement("h2");
    sectionTitle.innerHTML = data.workplaces.title;
    workplacesContainer.appendChild(sectionTitle);

    data.workplaces.items.forEach(workplace => {
        let divGroupContainer = document.createElement("div");
        divGroupContainer.classList.add("group-container");

        let divLogoContainer = document.createElement("div");
        divLogoContainer.classList.add("group-logo-container");

        let img = document.createElement("img");
        img.src = workplace.logoUrl;

        let divPositionsContainer = document.createElement("div");

        workplace.positions.forEach(position => {
            // POSITION START
            let positionUl = document.createElement("ul");
            let positionLi = document.createElement("li");
            positionLi.innerHTML = `<strong>${position.dateFrom} - ${position.dateThru}</strong> - ${position.title}`;
            positionUl.appendChild(positionLi);

            position.duties.forEach(duty => {
                // DUTY START
                let dutyUl = document.createElement("ul");
                let dutyLi = document.createElement("li");
                dutyLi.innerHTML = duty.value;
                dutyUl.appendChild(dutyLi);
                positionUl.appendChild(dutyUl);
                // DUTY END
            });
            // POSITION END
            divPositionsContainer.appendChild(positionUl);
        });

        divLogoContainer.appendChild(img);
        divGroupContainer.appendChild(divLogoContainer);
        divGroupContainer.appendChild(divPositionsContainer);
        workplacesContainer.appendChild(divGroupContainer);
    });
}

function renderContact(data) {
    let personalContainer = document.getElementById("contact");
    let divGroupContainer = document.createElement("div");
    divGroupContainer.classList.add("group-container");

    let sectionTitle = document.createElement("h2");
    sectionTitle.innerHTML = data.contact.title;
    personalContainer.appendChild(sectionTitle);

    let personalUl = document.createElement("ul");

    data.contact.items.forEach(contact => {
        let url = document.createElement("a");
        url.innerHTML = contact.name;
        url.href = contact.url;

        let contactLi = document.createElement("li");
        contactLi.appendChild(url);
        personalUl.appendChild(contactLi);
    });

    divGroupContainer.appendChild(personalUl);
    personalContainer.appendChild(divGroupContainer);
}

function fetchResumeData() {
    return fetch("resume.json").then(response => response.json());
}