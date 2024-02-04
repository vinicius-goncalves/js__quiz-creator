import('./features/questions/score-control.js')

import renderQuestions from './features/questions/load-questions.js'

window.addEventListener('DOMContentLoaded', async () => {
    renderQuestions()
})