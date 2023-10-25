import StorageManager from './storage-manager.js'

import { clearHTML, buildElement, buildIcon } from '../utils.js'
import * as AdminMode from '../tools/admin-mode.js'

const questions = new StorageManager('questions')
const questionsWrapper = document.querySelector('.questions-wrapper')

async function loadQuestions() {

    clearHTML(questionsWrapper)

    const isAdminModeActive = await AdminMode.getStatus()
    const questionsArr = Object.values(await questions.get())

    const renderQuestion = (question, index) => {

        const { ['id']: questionId, title, answers } = question
        const docFragment = document.createDocumentFragment()

        const questionContainer = buildElement('section')
            .addClass(`quiz-${index}`)
            .addAttribute('data-js', 'quiz-container')
            .addAttribute('data-question', questionId)
            .build()

        const questionHeader = buildElement('div')
            .addClass('quiz-header-wrapper')
            .defineStyle({
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            })
            .appendOn(questionContainer)
            .build()

        buildElement('h1')
            .setText(title)
            .appendOn(questionHeader)
            .build()

        if(isAdminModeActive) {

            const toolsContainer = buildElement('div')
                .addClass('edit-items-wrapper')
                .appendOn(questionHeader)
                .build()

            const tools = ['delete', 'edit']

            tools.forEach(tool => {
                buildIcon(tool)
                    .addAttribute(`data-${tool}`, questionId)
                    .appendOn(toolsContainer)
                    .build()
            })
        }

        const div = buildElement('div')

            .appendOn(questionContainer)
            .build()

        const answersStructure = Object.entries(answers)
        const questionIndex = index

        answersStructure.forEach(([ letter, answer ], index) => {

            const answerLabel = buildElement('label')
                .addClass('answers-label')
                .addAttribute('for', `letter-${letter}-${questionIndex}`)
                .appendOn(div)
                .build()

            buildElement('input')
                .setType('radio')
                .addAttribute('id', `letter-${letter}-${questionIndex}`)
                .addAttribute('name', `quiz-answer-${questionIndex}`)
                .appendOn(answerLabel)
                .build()

            buildElement('p')
                .addAttribute('answers-p')
                .addAttribute('data-single-answer', `answer-${letter}-${questionIndex}`)
                .setText(`${letter}) ${answer}`)
                .appendOn(answerLabel)
                .build()
        })

        docFragment.appendChild(questionContainer)
        return docFragment
    }

    const questionRendered = questionsArr.map(renderQuestion)
    questionsWrapper.append(...questionRendered)
}

export default loadQuestions