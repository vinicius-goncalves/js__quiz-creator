import questionControl from './question-management.js'

const modalContext = document.querySelector('[data-modal="question-management"]')

const questionContext = {

    creator: {
        ['data-question-management-content="description"']: {
            ['[data-question-management-description="title"]']: 'Create a new quiz',
            ['[data-question-management-description="detail"]']: "It's time to create a new quiz! Let's go there!"
        },

        ['data-question-management="title"']: {
            ['.question-section-header-title']: 'Quiz title',
            ['.question-section-header-description']: "What is your quiz's title?"
        },

        ['data-question-details="answers-section"']: {
            ['.question-section-header-title']: 'Answers',
            ['.question-section-header-description']: "Define the quiz's answers. Pay attention: the checked radio means that one is going to be the correct answer."
        },

        ['data-question-management="buttons-container"']: {
            ['[data-button="trigger-context"]']: 'Create quiz'
        }
    },

    editor: {
        ['data-question-management-content="description"']: {
            ['[data-question-management-description="title"]']: 'Edit a quiz',
            ['[data-question-management-description="detail"]']: "Update the quiz details"
        },

        ['data-question-management="title"']: {
            ['.question-section-header-title']: 'Quiz title',
            ['.question-section-header-description']: "What is the updated quiz's title?"
        },

        ['data-question-details="answers-section"']: {
            ['.question-section-header-title']: 'Answers',
            ['.question-section-header-description']: "Update the quiz correct answer. The checked radio means that one is going to be the new correct answer."
        },

        ['data-question-management="buttons-container"']: {
            ['[data-button="trigger-context"]']: 'Update quiz'
        }
    }
}

function getCurrContext() {
    const contextAttr = modalContext.getAttribute('data-management-context')
    return contextAttr ? contextAttr : 'creator'
}

function loadContext() {

    const contextTexts = questionContext[getCurrContext()]

    Object.entries(contextTexts).forEach(([ wrapperSelector, sectionsSelectors ]) => {

        const wrapperElement = modalContext.querySelector(`[${wrapperSelector}]`)

        for(const [ sectionName, sectionText ] of Object.entries(sectionsSelectors)) {
            const sectionFound = wrapperElement.querySelector(sectionName)
            sectionFound.textContent = sectionText
        }
    })
}

function observeContextChanges() {

    const observer = new MutationObserver(mutations => {

        if(mutations.length >= 2) {
            return
        }

        const mutation = mutations[0]
        const mutationType = mutation.type
        const mutationTarget = mutation.target

        if(mutationType === 'attributes' && mutation.attributeName === 'data-management-context') {
            loadContext()
        }

        if(mutationTarget instanceof Element &&
                mutationTarget.getAttribute('data-management-context') === 'creator') {

            questionControl.clearQuestionInputs()
        }
    })

    observer.observe(modalContext, {
            attributes: true,
            attributeFilter: ['data-management-context'] })
}

;(() => {
    loadContext()
    observeContextChanges()
})()

export default getCurrContext