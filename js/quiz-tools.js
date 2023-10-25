import loadQuestions from './features/storage/load-questions.js'
import {
    getSavedItemParsed,
    setSavedItemStringify,
    clearHTML }
from './features/utils.js'

const questionsWrapper = document.querySelector('.questions-wrapper')

const modalEditContent = document.querySelector('.modal-edit-content')
const modalEditQuizData = document.querySelector('.modal-edit-quiz-data')

const savedQuestions = getSavedItemParsed('savedQuestions')

modalEditContent.addEventListener('click', event => {

    const correctNewAnswer = modalEditQuizData.querySelector('input[type="radio"]:checked')

    if(event.target.classList.contains('confirm-edit')) {

        const { ['tempEditButton']: id } = event.target.dataset

        const newTitleValue = document.querySelector(`[data-temp-edit-title="${id}"]`)

        const letters = ['A', 'B', 'C', 'D']

        savedQuestions.forEach(question => {
            const extractValues = Object.values(question)[0]
            if(extractValues.questionId === Number.parseInt(id)) {

                extractValues.title = newTitleValue.value

                for(let i = 0; i < letters.length; i++) {
                    const item = document.querySelector(
                        `[data-temp-edit-text-${letters[i].toLowerCase()}="${id}"]`)
                    extractValues.answers[letters[i].toLowerCase()] = item.value

                }

                extractValues.correctAnswer = correctNewAnswer.dataset.letter
                setSavedItemStringify('savedQuestions', savedQuestions)

            }
        })

        clearHTML(questionsWrapper)
        loadQuestions()
    }
})