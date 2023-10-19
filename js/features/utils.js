const generateLorem = document.querySelector('[data-button="generate-lorem"]')
const creatorQuestionTitle = document.querySelector('.creator-question-title')
const creatorAnswerLetter = letter => document.querySelector(`#creator-answer-${letter}`)

export const setSavedItemStringify = (stringItem, object) => {
    return localStorage.setItem(stringItem, JSON.stringify(object))
}

export const getSavedItemParsed = (stringItem) => {
    return JSON.parse(localStorage.getItem(stringItem))
}

export const verifyIfLocalStorageItemIsNull = (itemToVerify, nullReturn, callback) =>
    localStorage.getItem(itemToVerify) === null
        ? nullReturn
        : callback(localStorage.getItem(itemToVerify))


const defineLoremMessage = (letter) =>
    creatorAnswerLetter(letter).value =
        'Lorem ipsum dolor sit amet consectetur adipisicing elit.'

generateLorem.addEventListener('click', () => {

    const letters = ['a', 'b', 'c', 'd']
    letters.forEach((_, index)=> {
        defineLoremMessage(letters[index])
    })

    creatorQuestionTitle.value = 'Lorem ipsum dolor. ' + Math.floor(Math.random() * 9999)

    const randomPosition = letters[Math.floor(Math.random() * letters.length)]
    document.querySelector(`#creator-letter-${randomPosition}`).setAttribute('checked', 'true')

})

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

        appendOn: function appendOn(element) {

            element.appendChild(newElement)
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

function buildIcon(icon) {

    return buildElement('i')
        .addClass('material-icons')
        .setText(icon)
}


function clearHTML(container) {

    if(!(container instanceof Element)) {
        throw new TypeError('The container (arg0) must be an instance of DOM element.')
    }

    try {
        while(container.firstChild) {
            container.removeChild(container.firstChild)
        }
    } catch(err) {
        console.log(err)
    }
}

export {
    buildElement,
    buildIcon,
    clearHTML
}