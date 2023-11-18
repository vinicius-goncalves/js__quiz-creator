import StorageManager from './storage-manager.js'

import { buildElement, buildIcon, clearHTML } from '../utils.js'

const questions = new StorageManager('questions')
const questionsWrapper = document.querySelector('.questions-wrapper')

async function loadQuestions() {

    clearHTML(questionsWrapper)

    const questionsArr = Object.values(await questions.get())

    const renderQuestion = (quiz, quizIndex) => {

        const { ['id']: quizId, title, answers } = quiz
        const docFragment = document.createDocumentFragment()

        const quizContainer = buildElement('div')
            .addAttribute('data-quiz', `container-${quizId}`)
            .addAttribute('data-quiz-index', quizIndex)
            .build()

        const quizHeader = buildElement('header')
            .addAttribute('data-quiz', 'header')
            .appendOn(quizContainer)
            .build()

        const quizHeaderTexts = buildElement('div')
            .addAttribute('data-quiz-header', 'texts')
            .appendOn(quizHeader)
            .build()

        buildElement('h2')
            .addAttribute('data-quiz-header-texts', 'title')
            .setText(title)
            .appendOn(quizHeaderTexts)
            .build()

        buildElement('small')
            .addAttribute('data-quiz-header-texts', 'id')
            .appendOn(quizHeaderTexts)
            .setText(`This question's id is: #${quizId}`)
            .build()

        const toolsContainer = buildElement('div')
            .addAttribute('data-quiz-context-id', `${quizId}`)
            .addAttribute('data-quiz', 'tools')
            .appendOn(quizHeader)
            .build()

        buildIcon('more_horiz')
            .addClass('tools-icon')
            .appendOn(toolsContainer)
            .build()

        const div = buildElement('div')
            .addAttribute('data-quiz', 'answers')
            .appendOn(quizContainer)
            .build()

        const answersStructure = Object.entries(answers)

        answersStructure.forEach(([ letter, answer ]) => {

            const answerLabel = buildElement('label')
                .addClass('answers-label')
                .addAttribute('for', `letter-${letter}-${quizIndex}`)
                .appendOn(div)
                .build()

            buildElement('input')
                .setType('radio')
                .addAttribute('id', `letter-${letter}-${quizIndex}`)
                .addAttribute('name', `quiz-answer-${quizIndex}`)
                .appendOn(answerLabel)
                .build()

            buildElement('p')
                .addAttribute('answers-p')
                .addAttribute('data-single-answer', `answer-${letter}-${quizIndex}`)
                .setText(`${letter}) ${answer}`)
                .appendOn(answerLabel)
                .build()
        })

        docFragment.appendChild(quizContainer)
        return docFragment
    }

    const questionRendered = questionsArr.map(renderQuestion)
    questionsWrapper.append(...questionRendered)
}

export default loadQuestions