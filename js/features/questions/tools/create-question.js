import StorageManager from '../../storage-manager.js'

import renderQuestion from '../render-question.js'
import createToast from '../../toast.js'
import getCurrentContext from '../question-context-manager.js'
import { randomID } from '../../../utils/_utils.js'
import questionControl from '../question-management.js'

const questionsWrapper = document.querySelector('.questions-wrapper')
const modalContext = document.querySelector('[data-modal="question-management"]')
const triggerContextBtn = modalContext.querySelector('[data-button="trigger-context"]')

const questionsCache = new StorageManager('questions')

function renderNewQuestion(newQuestion) {
    const renderedQuestion = renderQuestion(newQuestion)
    questionsWrapper.textContent = ''
    questionsWrapper.appendChild(renderedQuestion)
}

function createQuestion() {

    const isQuizValid = questionControl.validateQuestionInputs()

    if(!isQuizValid) {
        createToast('Fill out all the fields before creating or editing a quiz', document.body)
        return
    }

    const questionObjectCreated = questionControl.createQuestionObject()
    const newQuestion = { ...questionObjectCreated, id: randomID() }

    renderNewQuestion(newQuestion)
    questionsCache.add(newQuestion)

    createToast('Quiz created!', document.body)
}

triggerContextBtn.addEventListener('click', () => {

    const currContext = getCurrentContext()

    if(currContext !== 'creator') {
        return
    }

    createQuestion()
})