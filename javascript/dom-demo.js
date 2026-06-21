/**
 * JavaScript DOM Manipulation Demo
 * 
 * Demonstrates standard DOM (Document Object Model) manipulation methods 
 * including selecting elements, modifying content/attributes, styling/classes,
 * DOM traversal, and event handling (including event delegation).
 * 
 * In a browser: Linked dynamically in the interactive dashboard (dom-demo.html).
 * In Node.js: Displays documentation and code structures for DOM APIs.
 */

// ==========================================
// 1. Selector Utilities
// ==========================================

/**
 * Selects a single element by its ID.
 * @param {string} id - Element ID
 * @returns {HTMLElement|null}
 */
function selectById(id) {
    return document.getElementById(id);
}

/**
 * Selects elements by their class name.
 * @param {string} className - Class name
 * @returns {HTMLCollection}
 */
function selectByClass(className) {
    return document.getElementsByClassName(className);
}

/**
 * Selects the first element that matches the CSS selector.
 * @param {string} selector - CSS selector
 * @returns {HTMLElement|null}
 */
function selectOne(selector) {
    return document.querySelector(selector);
}

/**
 * Selects all elements matching the CSS selector.
 * @param {string} selector - CSS selector
 * @returns {NodeList}
 */
function selectAll(selector) {
    return document.querySelectorAll(selector);
}

// ==========================================
// 2. Element Creation & Modification
// ==========================================

/**
 * Creates a new HTML element with optional properties.
 * @param {string} tagName - Type of element (e.g., 'div', 'p')
 * @param {object} [attributes] - Key-value pair of attributes
 * @param {string} [textContent] - Text content of the element
 * @returns {HTMLElement}
 */
function createNewElement(tagName, attributes = {}, textContent = '') {
    const el = document.createElement(tagName);
    
    // Set attributes
    for (const [key, value] of Object.entries(attributes)) {
        if (key === 'class') {
            el.className = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(el.style, value);
        } else {
            el.setAttribute(key, value);
        }
    }
    
    if (textContent) {
        el.textContent = textContent;
    }
    
    return el;
}

/**
 * Inserts a child element as the last child of parent.
 * @param {HTMLElement} parent 
 * @param {HTMLElement} child 
 */
function appendElement(parent, child) {
    parent.appendChild(child);
}

/**
 * Inserts a child element as the first child of parent.
 * @param {HTMLElement} parent 
 * @param {HTMLElement} child 
 */
function prependElement(parent, child) {
    parent.prepend(child);
}

/**
 * Safely removes an element from the DOM.
 * @param {HTMLElement} element 
 */
function removeElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

// ==========================================
// 3. Content & Attributes
// ==========================================

/**
 * Sets text content safely (escapes HTML).
 * @param {HTMLElement} element 
 * @param {string} text 
 */
function updateTextContent(element, text) {
    if (element) element.textContent = text;
}

/**
 * Sets HTML content (caution: XSS vulnerability if input is untrusted).
 * @param {HTMLElement} element 
 * @param {string} html 
 */
function updateHTMLContent(element, html) {
    if (element) element.innerHTML = html;
}

/**
 * Sets an attribute value.
 * @param {HTMLElement} element 
 * @param {string} name 
 * @param {string} value 
 */
function setElementAttribute(element, name, value) {
    if (element) element.setAttribute(name, value);
}

/**
 * Removes an attribute.
 * @param {HTMLElement} element 
 * @param {string} name 
 */
function removeElementAttribute(element, name) {
    if (element) element.removeAttribute(name);
}

/**
 * Sets custom dataset (data-*) values.
 * @param {HTMLElement} element 
 * @param {string} key - CamelCase name (becomes data-key-name)
 * @param {string} value 
 */
function setDatasetValue(element, key, value) {
    if (element) element.dataset[key] = value;
}

// ==========================================
// 4. Styling & Classes
// ==========================================

/**
 * Toggles a class on or off.
 * @param {HTMLElement} element 
 * @param {string} className 
 * @returns {boolean} True if class is present after toggle
 */
function toggleElementClass(element, className) {
    if (element) {
        return element.classList.toggle(className);
    }
    return false;
}

/**
 * Adds multiple classes to an element.
 * @param {HTMLElement} element 
 * @param {...string} classNames 
 */
function addElementClasses(element, ...classNames) {
    if (element) element.classList.add(...classNames);
}

/**
 * Removes multiple classes from an element.
 * @param {HTMLElement} element 
 * @param {...string} classNames 
 */
function removeElementClasses(element, ...classNames) {
    if (element) element.classList.remove(...classNames);
}

/**
 * Updates individual inline CSS style properties.
 * @param {HTMLElement} element 
 * @param {string} property - CSS property in camelCase (e.g. 'backgroundColor')
 * @param {string} value 
 */
function setInlineStyle(element, property, value) {
    if (element) element.style[property] = value;
}

// ==========================================
// 5. DOM Traversal
// ==========================================

/**
 * Navigates to parent, sibling, or children.
 * @param {HTMLElement} element 
 * @param {string} relation - 'parent' | 'children' | 'nextSibling' | 'prevSibling'
 * @returns {HTMLElement|HTMLCollection|null}
 */
function traverseDOM(element, relation) {
    if (!element) return null;
    switch (relation) {
        case 'parent':
            return element.parentElement;
        case 'children':
            return element.children;
        case 'nextSibling':
            return element.nextElementSibling;
        case 'prevSibling':
            return element.previousElementSibling;
        default:
            return null;
    }
}

// ==========================================
// 6. Event Handling
// ==========================================

/**
 * Registers an event listener on an element.
 * @param {HTMLElement} element 
 * @param {string} eventType - e.g. 'click', 'input', 'submit'
 * @param {Function} callback 
 */
function addEventListener(element, eventType, callback) {
    if (element) element.addEventListener(eventType, callback);
}

/**
 * Sets up event delegation on a parent container for dynamic children.
 * @param {HTMLElement} parentElement - Parent element that delegates the event
 * @param {string} targetSelector - CSS selector for the actual children we want to capture
 * @param {string} eventType - e.g., 'click'
 * @param {Function} callback - Triggered when event matches selector
 */
function addEventDelegation(parentElement, targetSelector, eventType, callback) {
    if (!parentElement) return;
    parentElement.addEventListener(eventType, (event) => {
        const targetElement = event.target.closest(targetSelector);
        if (targetElement && parentElement.contains(targetElement)) {
            callback(event, targetElement);
        }
    });
}

// ==========================================
// Exports / Node.js Runner Compatibility
// ==========================================

const DOM_DEMO_CODE = {
    selectById: `document.getElementById('my-id')`,
    selectOne: `document.querySelector('.card')`,
    selectAll: `document.querySelectorAll('.item')`,
    createNewElement: `const div = document.createElement('div');\ndiv.className = 'new-card';\ndiv.textContent = 'Hello World';`,
    appendElement: `parent.appendChild(newChild);`,
    toggleElementClass: `element.classList.toggle('active');`,
    setInlineStyle: `element.style.backgroundColor = '#6366f1';`,
    addEventDelegation: `parent.addEventListener('click', (e) => {\n  const btn = e.target.closest('.delete-btn');\n  if (btn) deleteItem(btn);\n});`
};

/**
 * Node.js Console CLI helper function
 */
function runCliDocumentation() {
    console.log("=============================================================");
    console.log("              JavaScript DOM Manipulation Demo              ");
    console.log("=============================================================");
    console.log("\n[INFO]: DOM manipulation is a browser-based technique to interact");
    console.log("with the HTML document structure. Node.js environments lack a browser");
    console.log("window/document context by default.\n");
    console.log("To interact with this demo visually, open:");
    console.log("  >>> javascript/dom-demo.html <<<");
    console.log("in your browser.\n");
    console.log("-------------------------------------------------------------");
    console.log("Key DOM Manipulation API Reference & Syntaxes:");
    console.log("-------------------------------------------------------------");
    
    for (const [apiName, code] of Object.entries(DOM_DEMO_CODE)) {
        console.log(`\n• Function / Concept: ${apiName}`);
        console.log("  JavaScript equivalent:\n  ------------------------------------");
        console.log(code.split('\n').map(line => `  ${line}`).join('\n'));
        console.log("  ------------------------------------");
    }
    console.log("\n=============================================================");
}

// Export functions for browser import or Node.js exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        selectById,
        selectByClass,
        selectOne,
        selectAll,
        createNewElement,
        appendElement,
        prependElement,
        removeElement,
        updateTextContent,
        updateHTMLContent,
        setElementAttribute,
        removeElementAttribute,
        setDatasetValue,
        toggleElementClass,
        addElementClasses,
        removeElementClasses,
        setInlineStyle,
        traverseDOM,
        addEventListener,
        addEventDelegation
    };
    
    // If run directly in Node.js
    if (require.main === module) {
        runCliDocumentation();
    }
}
