document.addEventListener('DOMContentLoaded', function () {
    fetch('./data/styleguide-links.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.sections) {
                throw new Error('Data or sections not found in JSON');
            }
            const sections = data.sections;
            const componentsList = document.querySelector('.links-container');
            sections.forEach(function (section) {
                // Create a new component-group div for each section
                const componentGroup = document.createElement('div');
                componentGroup.classList.add('component-group');

                const sectionHeader = document.createElement('h2');
                sectionHeader.textContent = section.name;
                componentGroup.appendChild(sectionHeader);

                const ul = document.createElement('ul');

                section.items.forEach(function (component) {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = '#';
                    a.textContent = component;
                    a.onclick = function (event) {
                        event.preventDefault();
                        loadComponent(component);
                    };
                    li.appendChild(a);

                    ul.appendChild(li);
                });

                componentGroup.appendChild(ul);
                componentsList.appendChild(componentGroup);
            });
        })
        .catch(error => console.error('Error fetching components:', error));
});

function loadComponent(component) {
    const componentContainer = document.getElementById('component-container');
    componentContainer.innerHTML = `<h3>Loading ${component}...</h3>`;
    fetch(`../${component.toLowerCase()}/${component.toLowerCase()}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            componentContainer.innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading component:', error);
            componentContainer.innerHTML = `<p>Error loading component: ${component}</p>`;
        });
}

