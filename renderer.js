const renderBasicTemplate = section => `
    <div id="div-main-${section.key}">
        <h2>${section.title}</h2>
        <div class="group-container">
            <div>
                <p>${section.description}</p>
                <ul id="ul-simple-${section.key}"></ul>
            </div>
        </div>
    </div>
`;

const renderItemsWithLogoTemplate = section => `
    <div class="group-container" data-type="logo">
        <div class="group-logo-container">
            <img id="logo-${section.key}">
        </div>
        <div>
            <ul id="ul-detailed-${section.key}"></ul>
        </div>
    </div>
`;

const renderIconsTemplate = section => `
    <div class="group-container">
        <div id="div-icons-${section.key}" class="icons-wrapper"></div>
    </div>
`;

const renderLine = (color) => `
    <hr class="hr-${color}-dark">
`;

const renderFooterTemplate = (commits, color) => {
    if (commits[0]) {
        return `
            ${renderLine(color)}
            <div class="footer">
                Last edited at ${commits[0].commit.committer.date.replace('T', ' ').replace('Z', '')} UTC | 
                <a href="${commits[0].html_url}" target="_blank" class="url-${color}-dark">${commits[0].sha}</a>
            </div>
        `;
    }
    return '';
}

const renderButtonTemplate = (color, text) => `
    <button id="btn-switch-theme" class="button-${color}-dark">${text}</button>
`;

const renderMessageTemplate = (text) => `
    <div style="display: flex; justify-content: center">
        <p>${text}</p>
    </div>
`;

const renderSection = (wrapper, section, color) => {
    wrapper.insertAdjacentHTML('beforeend', renderBasicTemplate(section));
    const mainDiv = document.getElementById(`div-main-${section.key}`);

    if (section.hasOwnProperty('items')) {
        const ul = document.getElementById(`ul-simple-${section.key}`);

        section.items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${item.url ? `<a href="${item.url}" target="_blank" class="url-${color}-dark">${item.title}</a>` : item.title}
                <ul>
                    ${item.items2 ? item.items2.map(item2 => `
                        <li>${item2.url ? `<a href="${item2.url}" target="_blank" class="url-${color}-dark">${item2.value}</a>` : item2.value}</li>
                    `).join('') : ''}
                </ul>
            `;
            ul.appendChild(li);
        });
    }

    if (section.hasOwnProperty('itemsWithLogo')) {
        mainDiv.insertAdjacentHTML('afterend', renderItemsWithLogoTemplate(section));

        const img = document.getElementById(`logo-${section.key}`);
        img.src = section.itemsWithLogo[0].logoUrl;
        img.dataset.name = section.itemsWithLogo[0].dataName;
        img.dataset.extension = section.itemsWithLogo[0].logoUrl.split('.').pop();

        const ulOutter = document.getElementById(`ul-detailed-${section.key}`);
        const title = document.createElement('h3');
        title.textContent = section.itemsWithLogo[0].name;
        ulOutter.prepend(title);

        section.itemsWithLogo[0].positions.forEach(position => {
            const liOutter = document.createElement('li');
            const ulInner = document.createElement('ul');
            liOutter.innerHTML = `<strong>${position.dateFrom} - ${position.dateThru}</strong> - ${position.title}`;

            if (!position.isActive) {
                liOutter.innerHTML = `<s>${liOutter.innerHTML}</s>`;
            }

            ulOutter.appendChild(liOutter);

            position.details.forEach(detail => {
                const liInner = document.createElement('li');
                liInner.innerHTML = detail.value;

                if (!position.isActive) {
                    liInner.innerHTML = `<s>${liInner.innerHTML}</s>`;
                }

                ulInner.appendChild(liInner);
                liOutter.appendChild(ulInner);
            });
        });
    }

    if (section.hasOwnProperty('icons')) {
        mainDiv.insertAdjacentHTML('afterend', renderIconsTemplate(section));
        const divIconsContainer = document.getElementById(`div-icons-${section.key}`);

        section.icons.forEach(icon => {
            const div = document.createElement('div');
            div.classList.add('div-image');

            const i = document.createElement('i');
            i.classList.add(`icon-${color}-dark`, ...icon.class.split(' '));
            if (icon.class.split(' ').length <= 2) {
                i.style.fontSize = icon.size;
            }

            const p = document.createElement('p');
            p.innerHTML = icon.name;

            div.appendChild(i);
            div.appendChild(p);
            divIconsContainer.appendChild(div);
        });
    }

    mainDiv.insertAdjacentHTML('afterbegin', renderLine(color));
}

export {
    renderFooterTemplate,
    renderButtonTemplate,
    renderMessageTemplate,
    renderSection
};
