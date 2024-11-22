var ownerDocument = (document._currentScript || document.currentScript).ownerDocument;
var template = ownerDocument.querySelector('#multiselectTemplate');

(function() {
    function XMultiselect() {
        try {
            var self = Reflect.construct(HTMLElement, [], XMultiselect);
            self.createdCallback();
            return self;
        } catch (e) {
            var self = HTMLElement.call(this);
            self.createdCallback();
            return self;

        }
    }

    Object.setPrototypeOf(XMultiselect.prototype, HTMLElement.prototype);
    Object.setPrototypeOf(XMultiselect, HTMLElement);

    var multiselectPrototype = XMultiselect.prototype;

    /* Items property accessor */
    Object.defineProperty(multiselectPrototype, 'items', {
        configurable: false,
        enumerable: false,
        get: function () {
            return this.getAttribute('items');
        },
        set: function (newValue) {
            this.setAttribute('items', newValue);
            this.addItems(newValue);
        }
    });

    multiselectPrototype.createdCallback = function() {
        this.init();
        this.render();
    };

    multiselectPrototype.init = function() {
        this.initOptions();

        this._root = this.createRootElement();
        this._control = this._root.querySelector('.multiselect');
        this._field = this._root.querySelector('.multiselect-field');
        this._popup = this._root.querySelector('.multiselect-popup');
        this._list = this._root.querySelector('.multiselect-list');
    };

    multiselectPrototype.initOptions = function() {
        this._options = {
            placeholder: this.getAttribute("placeholder") || 'Select'
        };
    };

    multiselectPrototype.createRootElement = function() {
        var root = this.attachShadow({mode: 'open'});
        var content = document.importNode(template.content, true);

        if (window.ShadowDOMPolyfill) {
            WebComponents.ShadowCSS.shimStyling(content, 'x-multiselect');
        }

        root.appendChild(content);
        return root;
    };

    multiselectPrototype.render = function() {
        this.attachHandlers();
        this.refreshField();
        this.refreshItems();
    };

    /**
     * Handle component attribute changed event
     *
     * @param attributeName {String} - the name of the element attribute that changed
     * @param oldValue {String} - the previous value of the attribute
     * @param oldValue {String} - thenew value of the attribute
    */
    multiselectPrototype.attributeChangedCallback = function (attributeName, oldValue, newValue) {
        switch (attributeName) {
            case 'items':
                console.log("multi-select items changed: ", newValue);
                this.addItems(newValue);
            break;
        }
    };

    /**
     * Append list items to the dropdown
     *
     * @param items {Array} - collection of list item value => text pairs:
     * [{value: 1, text: "Item One"}] or [{text: "Item One"}] are acceptable.
     */
    multiselectPrototype.addItems = function(items) {
        var fragment = document.createDocumentFragment();

        items.forEach(function(item) {
            var li = document.createElement('li');
            li.textContent = item.text;
            li.setAttribute("value", item.value || item.text); // Set value attribute if it exists
            fragment.appendChild(li);
        });

        this.appendChild(fragment);
    };

    multiselectPrototype.attachHandlers = function() {
        this._field.addEventListener('click', this.fieldClickHandler.bind(this));
        this._control.addEventListener('keydown', this.keyDownHandler.bind(this));
        this._list.addEventListener('click', this.listClickHandler.bind(this));
    };

    multiselectPrototype.fieldClickHandler = function() {
        this._isOpened ? this.close() : this.open();
    };

    multiselectPrototype.keyDownHandler = function(event) {
        switch(event.which) {
            case 8:
                this.handleBackspaceKey();
                break;
            case 13:
                this.handleEnterKey();
                break;
            case 27:
                this.handleEscapeKey();
                break;
            case 38:
                event.altKey ? this.handleAltArrowUpKey() : this.handleArrowUpKey();
                break;
            case 40:
                event.altKey ? this.handleAltArrowDownKey() : this.handleArrowDownKey();
                break;
            default:
                return;
        }
        event.preventDefault();
    };

    multiselectPrototype.handleEnterKey = function() {
        if(this._isOpened) {
            var focusedItem = this.itemElements()[this._focusedItemIndex];
            this.selectItem(focusedItem);
        }
    };

    multiselectPrototype.handleArrowDownKey = function() {
        this._focusedItemIndex = (this._focusedItemIndex < this.itemElements().length - 1)
                ? this._focusedItemIndex + 1
                : 0;

        this.refreshFocusedItem();
    };

    multiselectPrototype.handleArrowUpKey = function() {
        this._focusedItemIndex = (this._focusedItemIndex > 0)
                ? this._focusedItemIndex - 1
                : this.itemElements().length - 1;

        this.refreshFocusedItem();
    };

    multiselectPrototype.handleAltArrowDownKey = function() {
        this.open();
    };

    multiselectPrototype.handleAltArrowUpKey = function() {
        this.close();
    };

    multiselectPrototype.refreshFocusedItem = function() {
        this.itemElements()[this._focusedItemIndex].focus();
    };

    multiselectPrototype.handleBackspaceKey = function() {
        var selectedItemElements = this.querySelectorAll("li[selected]");

        if(selectedItemElements.length) {
            this.unselectItem(selectedItemElements[selectedItemElements.length - 1]);
        }
    };

    multiselectPrototype.handleEscapeKey = function() {
        this.close();
    };

    multiselectPrototype.listClickHandler = function(event) {
        var item = event.target;
        while(item && item.tagName !== 'LI') {
            item = item.parentNode;
        }

        this.selectItem(item);
    };

    multiselectPrototype.selectItem = function(item) {
        if(!item.hasAttribute('selected')) {
            item.setAttribute('selected', 'selected');
            item.setAttribute('aria-selected', true);
            this.fireChangeEvent();
            this.refreshField();
        }

        this.close();
    };

    multiselectPrototype.fireChangeEvent = function() {
        var event = new CustomEvent("change");
        this.dispatchEvent(event);
    };

    multiselectPrototype.togglePopup = function(show) {
        this._isOpened = show;
        this._popup.style.display = show ? 'block' : 'none';
        this._control.setAttribute("aria-expanded", show);
    };

    multiselectPrototype.refreshField = function() {
        this._field.innerHTML = '';

        var selectedItems = this.querySelectorAll('li[selected]');

        // No items have been selected, show placeholder text
        if(!selectedItems.length) {
            var placeholder = this.createPlaceholder();
            // Create and append caret to placeholder
            var caret = this.createCaret();
            placeholder.appendChild(caret);
            this._field.appendChild(placeholder);
        } else { // Display selected item tags
            for(var i = 0; i < selectedItems.length; i++) {
                this._field.appendChild(this.createTag(selectedItems[i]));
            }

            // Append caret
            this._field.appendChild(this.createCaret());
        }
    };

    multiselectPrototype.refreshItems = function() {
        var itemElements = this.itemElements();

        for(var i = 0; i < itemElements.length; i++) {
            var itemElement = itemElements[i];
            itemElement.setAttribute("role", "option");
            itemElement.setAttribute("aria-selected", itemElement.hasAttribute("selected"));
            itemElement.setAttribute("tabindex", -1);
        }

        this._focusedItemIndex = 0;
    };

    multiselectPrototype.itemElements = function() {
        return this.querySelectorAll('li');
    };

    multiselectPrototype.createPlaceholder = function() {
        var placeholder = document.createElement('div');
        placeholder.className = 'multiselect-field-placeholder';
        placeholder.textContent = this._options.placeholder;
        return placeholder;
    };

    /**
     * Create caret icon to indicate this is a dropdown select menu
     *
     */
    multiselectPrototype.createCaret = function() {
        var caret = document.createElement('span');
        caret.className = 'caret';
        return caret;
    };

    multiselectPrototype.createTag = function(item) {
        var tag = document.createElement('div');
        tag.className = 'multiselect-tag';

        var content = document.createElement('div');
        content.className = 'multiselect-tag-text';
        content.textContent = item.textContent;

        var removeButton = document.createElement('div');
        removeButton.className = 'multiselect-tag-remove-button';
        removeButton.addEventListener('click', this.removeTag.bind(this, tag, item));

        tag.appendChild(content);
        tag.appendChild(removeButton);

        return tag;
    };

    multiselectPrototype.removeTag = function(tag, item, event) {
        this.unselectItem(item);
        event.stopPropagation();
    };

    multiselectPrototype.unselectItem = function(item) {
        item.removeAttribute('selected');
        item.setAttribute('aria-selected', false);
        this.fireChangeEvent();
        this.refreshField();
    };

    multiselectPrototype.attributeChangedCallback = function(optionName, oldValue, newValue) {
        this._options[optionName] = newValue;
        this.refreshField();
    };

    multiselectPrototype.open = function() {
        this.togglePopup(true);
        this.refreshFocusedItem();
    };

    multiselectPrototype.close = function() {
        this.togglePopup(false);
        this._field.focus();
    };

    multiselectPrototype.selectedItems = function() {
        var result = [];
        var selectedItems = this.querySelectorAll('li[selected]');

        for(var i = 0; i < selectedItems.length; i++) {
            var selectedItem = selectedItems[i];

            var item = { value: "", text: ""};
            item.value = selectedItem.hasAttribute('value')
                ? selectedItem.getAttribute('value')
                : selectedItem.textContent;

            item.text = selectedItem.textContent;
            result.push(item);
        }

        return result;
    };

    customElements.define('x-multiselect', XMultiselect);
}());