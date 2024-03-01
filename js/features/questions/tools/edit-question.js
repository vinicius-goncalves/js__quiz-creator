import StorageManager from '../../storage/storage-manager.js'

import { buildElement, clearTree } from '../../../utils/_utils.js'

const updateQuestionBtn = document.querySelector('[data-button="update-quiz"]')
const questionEditorWrapper = document.querySelector('[data-modal="question-editor"]')

const questions = new StorageManager('questions')
const allQuestions = await questions.getAll()

function getAnswers() {

    const answersElements = questionEditorWrapper.querySelectorAll('[data-question-details="edit-answer"]')
    const answersArr = [...answersElements]

    return answersArr
}

async function updateQuestion(questionId, { title, answers, answer }) {
    questions.update(questionId, { title, answers, answer })
}

async function edit(questionId) {

    sessionStorage.setItem('editing-question-id', questionId)

    if(typeof questionId === 'undefined') {
        throw new Error('The questionId for editing is undefined.')
    }

    const questionFound = await questions.getById(questionId)

    if(!questionFound) {
        return
    }

    const quizTitle = questionEditorWrapper.querySelector('[data-edit-quiz="title"]')

    const { title, answers, answer } = questionFound

    quizTitle.value = title

    getAnswers().forEach(answerLabel => {

        const text = answerLabel.querySelector('input[type="text"]')
        const radio = answerLabel.querySelector('input[type="radio"]')

        const letter = radio.dataset.letter

        if(answer === letter) {
            radio.checked = true
        }

        text.value = answers[letter]
    })
}

// updateQuestionBtn.addEventListener('click', () => {

//     const editingQuestionId = sessionStorage.getItem('editing-question-id')

//     const answers = getAnswers().map(answer => answer.querySelector('input[type="text"]').value)
//     const correctAnswer = questionEditorWrapper.querySelector('input[type="radio"]:checked').dataset.letter
//     const title = questionEditorWrapper.querySelector('[data-edit-quiz="title"]').value

//     updateQuestion(editingQuestionId, { title, answers, answer: correctAnswer })
// })

export default edit