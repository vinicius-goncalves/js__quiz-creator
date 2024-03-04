import StorageManager from '../../storage-manager.js'
import createToast from '../../toast.js'
import getCurrContext from '../question-context-manager.js'
import questionControl from '../question-management.js'

const modalContext = document.querySelector('[data-modal="question-management"]')
const triggerContextBtn = modalContext.querySelector('[data-button="trigger-context"]')

const questions = new StorageManager('questions')

async function findQuestion(questionId) {

    if(typeof questionId === 'undefined') {
        throw new TypeError('The questionId is undefined. It must be a valid question id.')
    }

    sessionStorage.setItem('editing-question-id', questionId)

    const questionFound = await questions.getById(questionId);

    if(!questionFound) {
        return
    }

    return questionFound;
}

async function loadQuestion(question) {

    const title = questionControl.getDOMQuestionTitle()
    const answers = questionControl.getDOMQuestionInputAnswers()
    const correctAnswer = questionControl.getQuestionCorrectAnswer()

    title.value = question.title

    const questionAnswers = Object.entries(question.answers)

    answers.forEach((answer, index) => {

        answer.value = questionAnswers[index][1]
        const currAnswer = questionAnswers[index].at(0)

        if(currAnswer == correctAnswer) {
            answer.parentElement.querySelector('input[type="radio"]').checked = true
        }
    })
}

async function edit(questionId) {

    const questionFound = await findQuestion(questionId)
    loadQuestion(questionFound)
}

async function updateQuiz(questionId) {

    const title = questionControl.getQuestionTitle()
    const answers = questionControl.getQuestionAnswers()
    const answer = questionControl.getQuestionCorrectAnswer()

    questions.update(questionId, { title, answers, answer })

    createToast('Quiz updated!')
}


triggerContextBtn.addEventListener('click', () => {

    if(getCurrContext() !== 'editor') {
        return
    }

    const isQuizValid = questionControl.validateQuestionInputs()

    if(!isQuizValid) {
        createToast('Fill out all the fields before creating or editing a quiz', document.body)
        return
    }

    const questionId = sessionStorage.getItem('editing-question-id')
    updateQuiz(questionId)
})

export default edit