import Question from '../classes/Question.js'

const createQuizWrapper = document
    .querySelector('[data-modal="create-quiz-wrapper"]')
const createQuizButton = createQuizWrapper
    .querySelector('[data-button="create-quiz"]')
const answersWrapper = createQuizWrapper
    .querySelectorAll('[data-new-quiz="wrapper"]')
const information = createQuizWrapper
    .querySelector('.new-quiz-info')

const titleInput = createQuizWrapper.querySelector('[data-new-quiz="title"]')
const answersToArray = [...answersWrapper.values()]

const questionLetters = ['a', 'b', 'c', 'd']

function getAllTextInputs() {

    const getInputText = answerWrapper => answerWrapper.children.item(2)

    const answersTextInput = answersToArray
        .map(getInputText)

    return [ titleInput, ...answersTextInput ]
}

function applyInputValidationStyle() {

    const applyValidationStyle = inputText => {
        if(inputText.value.length == 0) {
            inputText.classList.add('invalid')
            return
        }

        inputText.classList.remove('invalid')
    }

    getAllTextInputs().forEach(applyValidationStyle)
}

function validateRadio() {

    const getInputRadio = answerWrapper => answerWrapper.children.item(1)

    const hasUncheckedRadio = answersToArray
        .map(getInputRadio)
        .every(radio => !radio.checked)

    return hasUncheckedRadio
}

function verifyInputValidation() {

    applyInputValidationStyle()

    const wasRadioChecked = validateRadio()

    const hasSomeInvalidTextInput = getAllTextInputs()
        .some(inputText => inputText.classList.contains('invalid'))

    const isSomeInvalid = [ wasRadioChecked, hasSomeInvalidTextInput ]
        .some(validation => validation)

    return isSomeInvalid ? { valid: false } : { valid: true }
}

function missingDetails() {

    information.textContent = 'You are missing details. Please, verify it and try again.'

    setTimeout(() => {
        information.textContent = ''
    }, 2500)
}

function createNewQuiz() {

    function getCorrectAnswer() {

        const radioInputs = createQuizWrapper
            .querySelectorAll('input[type="radio"]')

        for(const [ index, radioInput ] of radioInputs.entries()) {

            if(!radioInput.checked) {
                continue
            }

            return questionLetters[index]
        }
    }

    const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)

    const [ title, ...answers ] = getAllTextInputs()
        .map(inputText => inputText.value)

    const correctAnswer = getCorrectAnswer()

    const question = {
        id,
        title,
        answers,
        correctAnswer,
        [Symbol.iterator]: function* () {
            for(const key in question) {
                if(question.hasOwnProperty(key)) {
                    yield question[key]
                }
            }
        }
    }

    const newQuestion = new Question(...question)
    console.log(newQuestion)

}

getAllTextInputs().forEach(inputText => {

    inputText.addEventListener('input', () => {
        applyInputValidationStyle()
    })
})

createQuizButton.addEventListener('click', () => {

    const { valid } = verifyInputValidation()

    if(!valid) {
        missingDetails()
        return
    }

    createNewQuiz()
})