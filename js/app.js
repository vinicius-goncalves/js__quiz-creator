import('./modules-loader.js')
import renderQuestions from './features/questions/load-questions.js'
import questionControl from './features/questions/create-question.js'

const questionCreatorWrapper = document.querySelector('[data-modal="question-creator"]')

window.addEventListener('DOMContentLoaded', async () => {
    renderQuestions()
})

questionCreatorWrapper.addEventListener('input', () => {
    questionControl.validateNewQuestion()
})

if(!localStorage.getItem('questions')) {
    localStorage.setItem('questions', JSON.stringify([{
        "id": "aF3z",
        "title": "If today is Saturday, what's tomorrow's date?",
        "answers": {
            "a": "Friday",
            "b": "Sunday",
            "c": "Monday",
            "d": "Thursday"
        },
        "answer": "b"
    }]))
}