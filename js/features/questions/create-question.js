import StorageManager from '../storage/storage-manager.js'
import renderQuestion from './render-question.js'

const newQuestionWrapper = document.querySelector('.answers')
const createQuestionBtn = document.querySelector('[data-button="create-quiz"]')
const questionsWrapper = document.querySelector('.question-creator')

const questionsCache = new StorageManager('questions')

const questionControl = {

    getNewQuestionTitle: function() {

        const questionTitle = questionsWrapper.querySelector('[data-new-quiz="title"]')

        console.log(questionTitle)

        if(questionTitle === null) {
            return 'Untitled'
        }

        return questionTitle.value.length === 0 ? 'Untitled' : questionTitle.value
    },

    getAnswers: function() {

        const answersElements = newQuestionWrapper.querySelectorAll('[class="new-answer-wrapper"]')
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
    }
}

function renderNewQuestion() {

    const questionObjectCreated = questionControl.createQuestionObject()
    const newQuestion = Object.assign(questionObjectCreated, { id: Math.random( )})

    const renderedQuestion = renderQuestion(newQuestion)

    questionsCache.add(newQuestion)
    questionsWrapper.appendChild(renderedQuestion)
}

createQuestionBtn.addEventListener('click', () => {
    console.log(renderNewQuestion())
})

export default {}