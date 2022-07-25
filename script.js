// TODO: Refactor for sure.

window.onload = init;
var isDarkModeOn = true;

function init() {
    fetchResumeData().then(data => {
        if (!shouldPageBeVisible(data)) {
            let body = document.getElementsByTagName('body')[0];
            body.innerHTML = '';
            let div = document.createElement('div');
            let p = document.createElement('p');
            p.innerText = 'Page is not available at the moment! :(';
            div.style.display = 'flex';
            div.style.justifyContent = 'center';
            div.appendChild(p);
            body.appendChild(div);
            return;
        }

        renderAbout(data);
        renderPersonal(data);
        renderWorkplaces(data);
        renderContact(data);
        renderURLs(data);
        renderLanguages(data);
        renderCertificatesAndCourses(data);
        renderEducation(data);
        renderProgrammingLanguages(data);
        renderLastEditedAtDate();
    })
    .catch(error => {
        let body = document.getElementsByTagName('body')[0];
        body.innerHTML = '';
        let div = document.createElement('div');
        let p = document.createElement('p');
        p.innerText = 'Could not load the page! :(';
        div.style.display = 'flex';
        div.style.justifyContent = 'center';
        div.appendChild(p);
        body.appendChild(div);
    }).finally(() => {
        makePageVisible();
    });
}

function shouldPageBeVisible(data) {
    return data.siteSettings.pageVisible;
}

function makePageVisible() {
    let body = document.getElementsByTagName('body');
    body[0].style.opacity = 1;
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

function renderLastEditedAtDate() {
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
        let logoUrlParts = workplace.logoUrl.split('.');
        img.dataset.extension = logoUrlParts[logoUrlParts.length - 1];

        let divPositionsContainer = document.createElement("div");

        workplace.positions.forEach(position => {
            let positionUl = document.createElement("ul");
            let positionLi = document.createElement("li");
            positionLi.innerHTML = `<strong>${position.dateFrom} - ${position.dateThru}</strong> - ${position.title}`;
            positionUl.appendChild(positionLi);

            position.duties.forEach(duty => {
                let dutyUl = document.createElement("ul");
                let dutyLi = document.createElement("li");
                dutyLi.innerHTML = duty.value;
                dutyUl.appendChild(dutyLi);
                positionUl.appendChild(dutyUl);
            });
            
            divPositionsContainer.appendChild(positionUl);
        });

        divLogoContainer.appendChild(img);
        divGroupContainer.appendChild(divLogoContainer);
        divGroupContainer.appendChild(divPositionsContainer);
        workplacesContainer.appendChild(divGroupContainer);
    });
}

function renderEducation(data) {
    let educationContainer = document.getElementById("education");
    let sectionTitle = document.createElement("h2");
    sectionTitle.innerHTML = data.schools.title;
    educationContainer.appendChild(sectionTitle);

    data.schools.items.forEach(school => {
        let divGroupContainer = document.createElement("div");
        divGroupContainer.classList.add("group-container");

        let divLogoContainer = document.createElement("div");
        divLogoContainer.classList.add("group-logo-container");

        let img = document.createElement("img");
        img.src = school.logoUrl;
        let logoUrlParts = school.logoUrl.split('.');
        img.dataset.extension = logoUrlParts[logoUrlParts.length - 1];

        let divPositionsContainer = document.createElement("div");

        school.fieldOfStudies.forEach(fieldOfStudy => {
            let fieldOfStudyUl = document.createElement("ul");
            let fieldOfStudyLi = document.createElement("li");
            fieldOfStudyLi.innerHTML = `<strong>${fieldOfStudy.dateFrom} - ${fieldOfStudy.dateThru}</strong> - ${school.name}`;
            fieldOfStudyUl.appendChild(fieldOfStudyLi);

            if (!school.isActive) {
                let tmp = fieldOfStudyUl.innerHTML;
                fieldOfStudyUl.innerHTML = `<s>${tmp}</s>`;
            }

            fieldOfStudy.details.forEach(detail => {
                let detailUl = document.createElement("ul");
                let detailLi = document.createElement("li");
                detailLi.innerHTML = detail.value;

                if (!fieldOfStudy.isActive) {
                    let tmp = detailLi.innerHTML;
                    detailLi.innerHTML = `<s>${tmp}</s>`;
                }

                detailUl.appendChild(detailLi);
                fieldOfStudyUl.appendChild(detailUl);
            });

            divPositionsContainer.appendChild(fieldOfStudyUl);
        });

        divLogoContainer.appendChild(img);
        divGroupContainer.appendChild(divLogoContainer);
        divGroupContainer.appendChild(divPositionsContainer);
        educationContainer.appendChild(divGroupContainer);
    });
}

function renderLanguages(data) {
    let languagesContainer = document.getElementById("languages");
    let divGroupContainer = document.createElement("div");
    divGroupContainer.classList.add("group-container");

    let sectionTitle = document.createElement("h2");
    sectionTitle.innerHTML = data.languages.title;
    languagesContainer.appendChild(sectionTitle);

    let languageUl = document.createElement("ul");

    data.languages.items.forEach(language => {
        let languageLi = document.createElement("li");
        languageLi.innerHTML = `${language.name} (${language.level})`
        languageUl.appendChild(languageLi);
    });

    divGroupContainer.appendChild(languageUl);
    languagesContainer.appendChild(divGroupContainer);
}

function renderProgrammingLanguages(data) {
    let languagesContainer = document.getElementById("programmingLanguages");
    let divGroupContainer = document.createElement("div");
    divGroupContainer.classList.add("group-container");

    let sectionTitle = document.createElement("h2");
    sectionTitle.innerHTML = data.technologies.title;
    languagesContainer.appendChild(sectionTitle);

    let div = document.createElement("div");
    
    let pDescription = document.createElement("p");
    pDescription.innerHTML = data.technologies.description;

    div.appendChild(pDescription);

    let divLanguagesWrapper = document.createElement("div");
    divLanguagesWrapper.classList.add("languages-wrapper");

    data.technologies.items.forEach(technology => {
        let divIcon = document.createElement("div");
        divIcon.classList.add('div-image');
        let iIcon = document.createElement("i");
        
        // Split if there is more than one class.
        if (technology.class.includes(" ")) {
            technology.class.split(' ').forEach(singleClass => {
                iIcon.classList.add(singleClass);
            });
        } else {
            iIcon.classList.add(technology.class);
            iIcon.style.fontSize = '30px';
        }
        
        divIcon.appendChild(iIcon);
        let pIcon = document.createElement("p");
        pIcon.innerHTML = technology.name;
        divIcon.appendChild(pIcon);
        divLanguagesWrapper.appendChild(divIcon);
    });
    
    div.appendChild(divLanguagesWrapper);
    divGroupContainer.appendChild(div);
    languagesContainer.appendChild(divGroupContainer);
}

function renderCertificatesAndCourses(data) {
    let certificationsAndCoursesContainer = document.getElementById("certificationsAndCourses");
    let divGroupContainer = document.createElement("div");
    divGroupContainer.classList.add("group-container");

    let div = document.createElement("div");

    let pDescription = document.createElement("p");
    pDescription.innerHTML = data.certificates.description;

    div.appendChild(pDescription);

    let sectionTitle = document.createElement("h2");
    sectionTitle.innerHTML = data.certificates.title;
    certificationsAndCoursesContainer.appendChild(sectionTitle);

    let interestingUrlUl = document.createElement("ul");

    data.certificates.items.forEach(interestingUrl => {
        let url = document.createElement("a");
        url.innerHTML = interestingUrl.name;
        url.href = interestingUrl.url;

        let interestingUrlLi = document.createElement("li");
        interestingUrlLi.appendChild(url);
        interestingUrlUl.appendChild(interestingUrlLi);
    });

    div.appendChild(interestingUrlUl);
    divGroupContainer.appendChild(div);
    certificationsAndCoursesContainer.appendChild(divGroupContainer);
}

function renderURLs(data) {
    let interestingUrlsContainer = document.getElementById("interestingUrls");
    let divGroupContainer = document.createElement("div");
    divGroupContainer.classList.add("group-container");

    let sectionTitle = document.createElement("h2");
    sectionTitle.innerHTML = data.interestingUrls.title;
    interestingUrlsContainer.appendChild(sectionTitle);

    let interestingUrlUl = document.createElement("ul");

    data.interestingUrls.items.forEach(interestingUrl => {
        let url = document.createElement("a");
        url.innerHTML = interestingUrl.name;
        url.href = interestingUrl.url;

        let interestingUrlLi = document.createElement("li");
        interestingUrlLi.appendChild(url);
        interestingUrlUl.appendChild(interestingUrlLi);
    });

    divGroupContainer.appendChild(interestingUrlUl);
    interestingUrlsContainer.appendChild(divGroupContainer);
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