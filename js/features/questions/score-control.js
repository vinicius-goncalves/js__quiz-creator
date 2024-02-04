import StorageManager from '../storage/storage-manager.js'

const resultButton = document.querySelector('[data-button="result"]')
const resultText = document.querySelector('p.result')

const DOMQuestions = document.querySelectorAll('[data-quiz*="container"]')

const questions = new StorageManager('questions')

const selectAnswers = (questionContainer) => questionContainer.querySelector('[data-quiz="answers"]')
const getAnswers = () => [...DOMQuestions].map(selectAnswers)

async function getCorrectAnswer(questionId) {

    const allQuestions = await questions.getAll()
    const { correctAnswer } = allQuestions.find(({ id }) => id === questionId)

    return correctAnswer
}

function createQuestionControl({ questionId, checkedAnswer, correctAnswer }) {
    return Object.assign({}, { questionId, checkedAnswer, correctAnswer })
}

function getCheckedInputs() {

    const checkedInputs = getAnswers().map(async (answersWrapper) => {

        const checkedInput = answersWrapper.querySelector('input[type="radio"]:checked')
        const checkedAnswer = checkedInput.getAttribute('data-letter')

        const questionId = checkedInput.name
        const correctAnswer = await getCorrectAnswer(questionId)

        return createQuestionControl({ questionId, checkedAnswer, correctAnswer })
    })

    return Promise.all(checkedInputs)
}

async function getResult() {

    const checkedInputs = await getCheckedInputs()

    const scores = checkedInputs.map(({ checkedAnswer, correctAnswer }) => checkedAnswer === correctAnswer)
    const scoreSum = scores.reduce((acc, scored) => scored ? acc + 1 : acc, 0)

    return { totalScored: scoreSum, totalQuestions: checkedInputs.length }
}

async function scoreTextResult() {

    const { totalScored, totalQuestions } = await getResult()

    const lowestScore = 'You got all questions wrong!'
    const countScore = `You got ${totalScored} of ${totalQuestions} correct!`

    const text = totalScored === 0 ? lowestScore : countScore

    return text
}

async function updateResultText() {

    const text = await scoreTextResult()
    resultText.textContent = text

    setTimeout(() => resultText.textContent = '', 3000)
}

resultButton.addEventListener('click', () => updateResultText())

export default {}