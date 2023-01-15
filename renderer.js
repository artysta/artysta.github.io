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

const renderFooterTemplate = (commits, color) => `
    ${renderLine(color)}
    <div class="footer">
        ${`Last edited at ${commits[0].commit.committer.date.replace('T', ' ').replace('Z', '')} UTC | <a href="${commits[0].html_url}" target="_blank" class="url-${color}-dark">${commits[0].sha}</a>`}
    </div>
`;

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
    const ul = document.getElementById(`ul-simple-${section.key}`);

    if (section.hasOwnProperty('items')) {
        section.items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = item.url !== '' ? `<a href="${item.url}" target="_blank" class="url-${color}-dark">${item.value}</a>` : item.value;
            ul.appendChild(li);
        });
    }

    if (section.hasOwnProperty('itemsWithLogo')) {
        section.itemsWithLogo.forEach(item => {
            mainDiv.insertAdjacentHTML('afterend', renderItemsWithLogoTemplate(section))

            const img = document.getElementById(`logo-${section.key}`);
            const logoUrlParts = item.logoUrl.split('.');
            img.src = item.logoUrl;
            img.dataset.name = item.dataName;
            img.dataset.extension = logoUrlParts[logoUrlParts.length - 1];

            const ulOutter = document.getElementById(`ul-detailed-${section.key}`);

            item.positions.forEach(position => {
                const liOutter = document.createElement('li');
                const ulInner = document.createElement('ul');
                liOutter.innerHTML = `<strong>${position.dateFrom} - ${position.dateThru}</strong> - ${position.title}`;;

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
        });
    }

    if (section.hasOwnProperty('icons')) {
        mainDiv.insertAdjacentHTML('afterend', renderIconsTemplate(section))
        const divIconsContainer = document.getElementById(`div-icons-${section.key}`);

        section.icons.forEach(icon => {
            const div = document.createElement('div');
            div.classList = 'div-image';

            const i = document.createElement('i');
            i.classList = `icon-${color}-dark ${icon.class}`;
            i.style = `font-size:${icon.class.split(' ').length <= 2 ? icon.size : ''}`;

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
}