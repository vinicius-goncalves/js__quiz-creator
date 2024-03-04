const modalContext = document.querySelector('[data-modal="question-management"]')

const TEXT_INPUT_INDEX = 2
const INVALID_CLASS_NAME = 'invalid-field'

const questionControl = {

    getDOMQuestionTitle: function() {
        return modalContext.querySelector('[data-quiz-title="title"]')
    },

    getDOMQuestionInputAnswers: function() {

        const labelAnswers = this.getAnswers()
        const inputAnswers = labelAnswers.map(answer => answer.children.item(TEXT_INPUT_INDEX))

        return inputAnswers;
    },

    getDOMCorrectAnswer: function() {

        const correctAnswer = modalContext.querySelector('input[type="radio"]:checked')
        return correctAnswer

    },

    getQuestionTitle: function() {

        const questionTitle = modalContext.querySelector('[data-quiz-title="title"]')

        if(questionTitle === null) {
            return 'Untitled'
        }

        return questionTitle.value.length === 0 ? 'Untitled' : questionTitle.value
    },

    getAnswers: function() {

        const answersElements = modalContext.querySelectorAll('[data-question-details="answer"]')
        const answersArr = [...answersElements]

        return answersArr
    },

    getQuestionAnswers() {

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

    getQuestionCorrectAnswer: function() {

        const answers = this.getAnswers()
        const radioInputs = answers.map(answer => answer.querySelector('input[type="radio"]'))
        const correctAnswer = radioInputs.find(({ checked }) => checked === true)

        return typeof correctAnswer === 'undefined' ? radioInputs[0].dataset.letter : correctAnswer.dataset.letter
    },

    createQuestionObject: function() {

        const [ title, answers, answer ] = [
            this.getQuestionTitle(),
            this.getQuestionAnswers(),
            this.getQuestionCorrectAnswer()
        ]

        return { title, answers, answer }
    },

    validateQuestionInputs() {

        const questionTitleInput = modalContext.querySelector('[data-quiz-title="title"]')
        const answersInputs = this.getAnswers().map(answer => answer.children.item(TEXT_INPUT_INDEX))

        const fieldsInputs = [ questionTitleInput, ...answersInputs ]

        for(const input of fieldsInputs) {
            input.classList.toggle(INVALID_CLASS_NAME, input.value.length === 0)
        }

        const areAllValid = fieldsInputs.every(input => !input.classList.contains(INVALID_CLASS_NAME))

        return areAllValid
    },

    clearQuestionInputs() {

        this.getDOMQuestionTitle().value = ''
        this.getDOMQuestionInputAnswers().forEach(input => input.value = '')
        this.getDOMCorrectAnswer().checked = false

    }
}

export default questionControl