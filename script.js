// TODO: Refactor for sure.

window.onload = init;
var isDarkThemeOn = true;
const LIGHT_THEME = 'LIGHT THEME';
const DARK_THEME = 'DARK THEME';

function init() {
    fetchResumeData().then(data => {
        if (!shouldPageBeVisible(data)) {
            renderMessage('Page is not available at the moment! :(');
            return;
        }

        renderMainWrapper();
        renderSwitchThemeButton();
        renderAbout(data);
        renderPersonal(data);
        renderWorkplaces(data);
        renderEducation(data);
        renderLanguages(data);
        renderProgrammingLanguages(data);
        renderCertificatesAndCourses(data);
        renderURLs(data);
        renderContact(data);
        renderFooter();
    })
    .catch(error => {
        renderMessage('Could not load the page! :(');
    }).finally(() => {
        makePageVisible();
    });
}

function appendHrToElement(element) {
    let hr = document.createElement('hr');
    element.appendChild(hr);
}

function renderMessage(message) {
    let body = document.getElementsByTagName('body')[0];
    body.innerHTML = '';
    let div = document.createElement('div');
    let p = document.createElement('p');
    p.innerText = message;
    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    div.appendChild(p);
    body.appendChild(div);
}

function shouldPageBeVisible(data) {
    return data.siteSettings.pageVisible;
}

function makePageVisible() {
    let body = document.getElementsByTagName('body');
    body[0].style.opacity = 1;
} 

function switchTheme() {
    isDarkThemeOn = !isDarkThemeOn;

    // Button.
    let button = document.getElementsByTagName("button")[0];
    button.classList.toggle("button-light-mode");
    button.innerHTML = isDarkThemeOn ? LIGHT_THEME : DARK_THEME;

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
        image.src = isDarkThemeOn ? `${newSrc}-light.${extension}` : `${newSrc}-dark.${extension}`;
    }
}

function renderSwitchThemeButton() {
    let wrapper = document.getElementById("main-wrapper");
    let button = document.createElement("button");
    button.innerText = LIGHT_THEME;
    button.onclick = switchTheme;
    wrapper.prepend(button);
}

function renderFooter() {
    let wrapper = document.getElementById("main-wrapper");
    let footerContainer = document.createElement("div");
    footerContainer.classList.add("footer");
    fetch('https://api.github.com/repos/artysta/artysta.github.io/commits')
    .then(response => response.json())
    .then(commits => {
        let latestCommit = commits[0];
        let lastEditedAtDate = latestCommit.commit.committer.date.replace('T', ' ').replace('Z', '');
        footerContainer.innerHTML = `Last edited at ${lastEditedAtDate} UTC | <a href="${latestCommit.html_url}" target="_blank">${latestCommit.sha}</a>`;
    })
    .catch(error => footerContainer.innerHTML = `Last edited at N/A`)
    .finally(() => wrapper.appendChild(footerContainer));
}

function renderMainWrapper() {
    let mainWrapper = document.createElement("div");
    mainWrapper.id = 'main-wrapper';
    mainWrapper.classList.add("wrapper");
    let body = document.getElementsByTagName("body")[0];
    body.appendChild(mainWrapper);
}

function renderAbout(data) {
    if (!data.about.sectionVisible) { return; }
    
    let wrapper = document.getElementById("main-wrapper");
    let aboutContainer = document.createElement("div");
    let divGroupContainer = document.createElement("div");
    divGroupContainer.classList.add("group-container");

    let sectionTitle = document.createElement("h2");
    sectionTitle.innerHTML = data.about.title;
    aboutContainer.appendChild(sectionTitle);

    let description = document.createElement("p");
    description.innerHTML = data.about.description;

    divGroupContainer.appendChild(description);
    aboutContainer.appendChild(divGroupContainer);
    
    appendHrToElement(aboutContainer);

    wrapper.appendChild(aboutContainer);
}

function renderPersonal(data) {
    if (!data.personal.sectionVisible) { return; }

    let wrapper = document.getElementById("main-wrapper");
    let personalContainer = document.createElement("div");
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

    appendHrToElement(personalContainer);

    wrapper.appendChild(personalContainer);
}

function renderWorkplaces(data) {
    if (!data.workplaces.sectionVisible) { return; }

    let wrapper = document.getElementById("main-wrapper");
    let workplacesContainer = document.createElement("div");
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

    appendHrToElement(workplacesContainer);

    wrapper.appendChild(workplacesContainer);
}

function renderEducation(data) {
    if (!data.schools.sectionVisible) { return; }

    let wrapper = document.getElementById("main-wrapper");
    let educationContainer = document.createElement("div");
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

    appendHrToElement(educationContainer);

    wrapper.appendChild(educationContainer);
}

function renderLanguages(data) {
    if (!data.languages.sectionVisible) { return; }

    let wrapper = document.getElementById("main-wrapper");
    let languagesContainer = document.createElement("div");
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

    appendHrToElement(languagesContainer);

    wrapper.appendChild(languagesContainer);
}

function renderProgrammingLanguages(data) {
    if (!data.technologies.sectionVisible) { return; }

    let wrapper = document.getElementById("main-wrapper");
    let languagesContainer = document.createElement("div");
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
            iIcon.style.fontSize = technology.size;
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

    appendHrToElement(languagesContainer);

    wrapper.appendChild(languagesContainer);
}

function renderCertificatesAndCourses(data) {
    if (!data.certificates.sectionVisible) { return; }

    let wrapper = document.getElementById("main-wrapper");
    let certificationsAndCoursesContainer = document.createElement("div");
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

    appendHrToElement(certificationsAndCoursesContainer);

    wrapper.appendChild(certificationsAndCoursesContainer);
}

function renderURLs(data) {
    if (!data.interestingUrls.sectionVisible) { return; }

    let wrapper = document.getElementById("main-wrapper");
    let interestingUrlsContainer = document.createElement("div");
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

    appendHrToElement(interestingUrlsContainer);

    wrapper.appendChild(interestingUrlsContainer);
}

function renderContact(data) {
    if (!data.contact.sectionVisible) { return; }

    let wrapper = document.getElementById("main-wrapper");
    let personalContainer = document.createElement("div");
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

    appendHrToElement(personalContainer);

    wrapper.appendChild(personalContainer);
}

function fetchResumeData() {
    return fetch("https://adriankurek.pl/resume.json").then(response => response.json());
}
