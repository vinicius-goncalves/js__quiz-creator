function buildElement(element) {

    const newElement = document.createElement(element)

    return {

        setType: function setType(type) {

            if(element != 'input') {
                throw new Error("Types are only allowed to input elements.")
            }

            newElement.type = type

            return this
        },

        addClass: function addClass(c) {

            newElement.classList.add(c)
            return this

        },

        addClasses: function addClasses(classes) {

            for(const c of classes) {
                newElement.classList.add(c)
            }

            return this
        },

        addAttribute: function addAttribute(attrName, attrValue) {

            const attr = document.createAttribute(attrName)
            attr.value = attrValue
            newElement.setAttributeNode(attr)

            return this
        },

        append: function(...els) {

            newElement.append(...els)

            return this

        },

        setText: function setText(newText) {

            const text = new Text(newText)
            newElement.appendChild(text)

            return this

        },

        defineStyle: function setStyle(styleSettings) {

            const style = newElement.style

            for(const property in styleSettings) {
                const value = styleSettings[property]
                style[property] = value
            }

            return this
        },

        setEvent: function setEvent(evtName, evtCallback) {

            newElement.addEventListener(evtName, evtCallback)
            return this

        },

        appendOn: function appendOn(element) {

            element.appendChild(newElement)
            return this

        },

        prependOn: function prependOn(element) {

            element.prepend(newElement)
            return this

        },

        build: function(debug) {

            if(debug) {

                console.group('Build debug')
                console.log('Element created: "%s"', element)
                console.log('DOM element: %o', newElement)
                console.groupEnd()
            }

            return newElement
        }
    }
}

export default buildElement