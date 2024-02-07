import('./modules-loader.js')
import('./features/timer.js')
import renderQuestions from './features/questions/load-questions.js'

window.addEventListener('DOMContentLoaded', async () => {
    renderQuestions()
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