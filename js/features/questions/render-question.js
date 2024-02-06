import popup from './tools/tools-popup.js'
import { buildElement, buildIcon } from '../../utils/_utils.js'

function createAnswers(questionId, answers) {

    const answersElements = Object.entries(answers).map(([ letter, answer ], index) => {

        const answerWrapper = buildElement('label')
            .addClass('answers-label')
            .addAttribute('for', `label-${questionId}-${index}`)
            .build()

            buildElement('input')
                .setType('radio')
                .addAttribute('id', `label-${questionId}-${index}`)
                .addAttribute('name', `${questionId}`)
                .addAttribute('data-letter', letter)
                .appendOn(answerWrapper)
                .build()

            buildElement('p')
                .addAttribute('data-single-answer', `answer-${letter}-${index}`)
                .setText(`${letter}) ${answer}`)
                .appendOn(answerWrapper)
                .build()

        return answerWrapper
    })

    return answersElements
}

function renderQuestion(question, quizIndex) {

    if(typeof question === 'undefined') {
        return
    }

    const { id, title, answers } = question

    const questionWrapper = buildElement('div')
        .addAttribute('data-quiz', `container-${id}`)
        .setEvent('mouseleave', (event) => !event.toElement?.matches('[data-tools-popup]') ? popup.deleteAll() : undefined)
        .build()

    const quizHeader = buildElement('header')
        .addAttribute('data-quiz', 'header')
        .appendOn(questionWrapper)
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
            .setText(`This question's id is: #${id}`)
            .build()

        const toolsContainer = buildElement('div')
            .addAttribute('data-quiz-context-id', `${id}`)
            .addAttribute('data-quiz', 'tools')
            .appendOn(quizHeader)
            .build()

            buildIcon('more_horiz')
                .addClass('tools-icon')
                .appendOn(toolsContainer)
                .build()

    const answersWrapper = buildElement('div')
        .addAttribute('data-quiz', 'answers')
        .appendOn(questionWrapper)
        .build()

    const answersElements = createAnswers(id, answers, quizIndex)
    answersWrapper.append(...answersElements)

    return questionWrapper
}

export default renderQuestion
