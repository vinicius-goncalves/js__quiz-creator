import StorageManager from '../storage/storage-manager.js'

import { clearHTML, verifyIfLocalStorageItemIsNull } from '../utils.js'
import { buildElement, buildIcon } from '../utils.js'

const modalEditWrapper = document.querySelector('.modal-edit-wrapper')
const modalEditQuizData = document.querySelector('.modal-edit-quiz-data')

const questions = new StorageManager('questions')
const allQuestions = await questions.getAll()

const showModal = () => modalEditWrapper.classList.add('active')

function prepareToEdit() {
    showModal()
    modalEditWrapper.style.position = `absolute`
    clearHTML(modalEditQuizData)
}

function findQuestion(questionId) {

    for(const [ index, question ] of allQuestions.entries()) {
        if(question.id == questionId) {
            return { question, index }
        }
    }
}

function createTempEditModalWith(question, index) {

    const { id, title, answers, correctAnswer } = question

    const editAnswerModal = buildElement('div')
        .addClass('modal-edit-answers-wrapper')
        .build()

    buildElement('input')
        .setType('text')
        .addAttribute('data-temp-edit-title', id)
        .addAttribute('value', title)
        .appendOn(modalEditQuizData)
        .build()

    buildElement('h2')
        .setText('Answers')
        .appendOn(editAnswerModal)
        .build()

    const answersArr = Object.entries(answers)

    answersArr.forEach(([ letter, answer ]) => {

        const questionContainer = buildElement('div')
            .addClass('temp-edit')
            .appendOn(editAnswerModal)
            .build()

       buildElement('input')
            .setType('radio')
            .addAttribute('letter', letter)
            .addAttribute('name', 'temp-edit-quiz')
            .addAttribute('checked', letter === correctAnswer)
            .appendOn(questionContainer)
            .build()

        buildElement('input')
            .setType('text')
            .addAttribute(`data-temp-edit-text-${letter}`, id)
            .addAttribute('data-temp-edit', `letter-${letter}-${index}`)
            .addAttribute('value', answer)
            .appendOn(questionContainer)
            .build()

    })

    modalEditQuizData.appendChild(editAnswerModal)
}

function edit(questionId) {

    if(!questionId) {
        throw new Error('The id must not be undefined.')
    }

    prepareToEdit()

    const { question, index } = findQuestion(questionId)
    createTempEditModalWith(question, index)
}

export default edit