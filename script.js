window.onload = init;
var isDarkModeOn = true;

function init() {
    renderAbout();
    renderPersonal();
    renderWorkplaces();
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
        footer.innerHTML = `Last edited at ${lastEditedAtDate} UTC | <a href="${latestCommit.html_url}" target="_blank">${latestCommit.sha}</a>`;
    })
    .catch(error => footer.innerHTML = `Last edited at N/A`);
}

function renderAbout() {
    let aboutContainer = document.getElementById("about");
    fetch("resume.json")
        .then(response => response.json())
        .then(resume => {
            let divGroupContainer = document.createElement("div");
            divGroupContainer.classList.add("group-container");

            let sectionTitle = document.createElement("h2");
            sectionTitle.innerHTML = resume.about.title;
            aboutContainer.appendChild(sectionTitle);

            let description = document.createElement("p");
            description.innerHTML = resume.about.description;

            divGroupContainer.appendChild(description);
            aboutContainer.appendChild(divGroupContainer);
        });
}

function renderPersonal() {
    let personalContainer = document.getElementById("personal");
    fetch("resume.json")
        .then(response => response.json())
        .then(resume => {
            let divGroupContainer = document.createElement("div");
            divGroupContainer.classList.add("group-container");

            let sectionTitle = document.createElement("h2");
            sectionTitle.innerHTML = resume.personal.title;
            personalContainer.appendChild(sectionTitle);
            
            let personalUl = document.createElement("ul");
            let nameLi = document.createElement("li");
            nameLi.innerHTML = resume.personal.name;
            personalUl.appendChild(nameLi);

            let birthYearLi = document.createElement("li");
            birthYearLi.innerHTML = resume.personal.birthYear;
            personalUl.appendChild(birthYearLi);

            let nationalityLi = document.createElement("li");
            nationalityLi.innerHTML = resume.personal.nationality;
            personalUl.appendChild(nationalityLi);

            divGroupContainer.appendChild(personalUl);
            personalContainer.appendChild(divGroupContainer);
        });
}

function renderWorkplaces() {
    let workplacesContainer = document.getElementById("workplaces");
    fetch("resume.json")
        .then(response => response.json())
        .then(resume => {
            let sectionTitle = document.createElement("h2");
            sectionTitle.innerHTML = resume.workplaces.title;
            workplacesContainer.appendChild(sectionTitle);

            resume.workplaces.items.forEach(workplace => {
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
        });

    workplaces.appendChild(ulPosition);
}