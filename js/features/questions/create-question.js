import StorageManager from '../storage/storage-manager.js'
import renderQuestion from './render-question.js'
import createToast from './../toast.js'

const questionCreatorWrapper = document.querySelector('[data-modal="question-creator"]')
const createQuestionBtn = document.querySelector('[data-button="create-quiz"]')
const questionsWrapper = document.querySelector('.questions-wrapper')

const questionsCache = new StorageManager('questions')

const questionControl = {

    getNewQuestionTitle: function() {

        const questionTitle = questionCreatorWrapper.querySelector('[data-new-quiz="title"]')

        if(questionTitle === null) {
            return 'Untitled'
        }

        return questionTitle.value.length === 0 ? 'Untitled' : questionTitle.value
    },

    getAnswers: function() {

        const answersElements = questionCreatorWrapper.querySelectorAll('[data-question-details="new-answer"]')
        const answersArr = [...answersElements]

        return answersArr
    },

    getNewQuestionAnswers() {

        const answers = this.getAnswers()
        const answersChildren = answers.map(answer => answer.children)
        const [ radioInputChildIndex, answerTextChildIndex ] = [1, 2]

        const radioInputs = answersChildren.map(answerChild => answerChild.item(radioInputChildIndex))
        const answersText = answersChildren.map(answerChild => answerChild.item(answerTextChildIndex).value)

        const answersObject = radioInputs.reduce((answers, radioInput, index) => {

            const letter = radioInput.dataset.letter
            answers[letter] = answersText[index]

            return answers

        }, {})

        return answersObject
    },

    getNewQuestionCorrectAnswer: function() {

        const answers = this.getAnswers()
        const radioInputs = answers.map(answer => answer.querySelector('input[type="radio"]'))
        const correctAnswer = radioInputs.find(({ checked }) => checked === true)

        return typeof correctAnswer === 'undefined' ? radioInputs[0].dataset.letter : correctAnswer.dataset.letter
    },

    createQuestionObject: function() {

        const [ newTitle, newAnswers, newAnswer ] = [
            this.getNewQuestionTitle(),
            this.getNewQuestionAnswers(),
            this.getNewQuestionCorrectAnswer()
        ]

        return { title: newTitle, answers: newAnswers, answer: newAnswer }
    },

    validateNewQuestion() {

        const INPUT_TEXT_CHILD_INDEX = 2
        const INVALID_CLASS_NAME = 'invalid-field'

        const questionTitleInput = questionCreatorWrapper.querySelector('[data-new-quiz="title"]')
        const answersInputs = this.getAnswers().map(answer => answer.children.item(INPUT_TEXT_CHILD_INDEX))

        const fieldsInputs = [ questionTitleInput, ...answersInputs ]

        for(const input of fieldsInputs) {
            input.classList.toggle(INVALID_CLASS_NAME, input.value.length === 0)
        }

        const areAllValid = fieldsInputs.every(input => !input.classList.contains(INVALID_CLASS_NAME))

        return areAllValid
    }
}

function renderNewQuestion(newQuestion) {
    const renderedQuestion = renderQuestion(newQuestion)
    questionsWrapper.appendChild(renderedQuestion)
}

function createQuestion() {

    const validQuiz = questionControl.validateNewQuestion()

    if(!validQuiz) {
        createToast('Fill out all the fields before creating a quiz', questionCreatorWrapper)
        return
    }

    const questionObjectCreated = questionControl.createQuestionObject()
    const newQuestion = { ...questionObjectCreated, id: Math.random() }

    renderNewQuestion(newQuestion)
    questionsCache.add(newQuestion)

    createToast('Quiz created!', questionCreatorWrapper)
}

createQuestionBtn.addEventListener('click', () => {
    createQuestion()
})

export default questionControl