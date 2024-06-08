// Create a new link element
const linkElement = document.createElement('link');

// Set attributes for the link element
linkElement.rel = 'stylesheet';
linkElement.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css';
linkElement.integrity = 'sha384-KyZXEAg3QhqLMpG8r+Knujsl5+z8r4zQj61LY8sO+kgBXdqBq5sXn2nXRS0iotfS';
linkElement.crossOrigin = 'anonymous';

// Insert the link element into the header of the document
document.head.appendChild(linkElement);
