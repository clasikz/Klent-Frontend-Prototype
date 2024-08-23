document.addEventListener('DOMContentLoaded', function () {
    fetch('/data/styleguide-links.json')
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
                const sectionHeader = document.createElement('h2');
                const ul = document.createElement('ul');

                sectionHeader.textContent = section.name;
                componentGroup.classList.add('component-group');
                componentGroup.appendChild(sectionHeader);

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
    const errorBox = document.querySelector('.error-box');
    
    // Hide the error box initially
    errorBox.classList.add('hide');
    
    // Display loading message
    componentContainer.innerHTML = `<h2>Loading ${component}...</h2>`;

    // Fetch the HTML file for the component
    fetch(`/html/${component.toLowerCase()}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            fetch(`/handlebars/${component.toLowerCase()}/${component.toLowerCase()}.hbs`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(templateSource => {
                    const template = Handlebars.compile(templateSource);
                    
                    fetch(`/data/${component.toLowerCase()}.json`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            const html = template(data);
                            componentContainer.innerHTML = html;
                        })
                        .catch(error => {
                            let errorMessage = `${error} (fetch: /data/${component.toLowerCase()}.json)`;
                            errorBox.querySelector('.message').textContent = errorMessage;
                            errorBox.classList.remove('hide');
                            componentContainer.innerHTML = ''; 
                        });
                })
                .catch(error => {
                    let errorMessage = `${error} (fetch: /handlebars/${component.toLowerCase()}/${component.toLowerCase()}.hbs)`;
                    errorBox.querySelector('.message').textContent = errorMessage;
                    errorBox.classList.remove('hide');
                    componentContainer.innerHTML = ''; 
                });
        })
        .catch(error => {
            let errorMessage = `${error} (fetch: /html/${component.toLowerCase()}.html)`;
            errorBox.querySelector('.message').textContent = errorMessage;
            errorBox.classList.remove('hide');
            componentContainer.innerHTML = ''; 
        });
}


