import StorageManager from './features/storage-manager.js'

import questionsJSON from '../assets/jsons/questions.json' assert { type: 'json' }
import preferencesJSON from '../assets/jsons/preferences.json' assert { type: 'json' }

import {
    defineElementProperties,
    defineElementStyle,
    setSavedItemStringify,
    getSavedItemParsed,
    verifyIfLocalStorageItemIsNull,
    clearHTML,
    buildElement,
    buildIcon } from './features/utils.js'

import { deleteQuestion, editQuestion } from './quiz-tools.js'

const scrollbarIndicator = document.querySelector('.scrollbar')

const navbarWrapper = document.querySelector('[data-navbar="navbar"]')
const adminModeWrapper = document.querySelector('.admin-mode-wrapper')
const questionsWrapper = document.querySelector('.questions-wrapper')
const questionCreatorWrapper = document.querySelector('.question-creator')

const createQuizButton = document.querySelector('[data-button="create-quiz"]')
const creatorQuizRadios = document.querySelectorAll('[data-radio="radiocheck"]')

const modalWrappers = document.querySelectorAll('[data-js="modal-wrapper"]')
const modalCreatorWrapper = document.querySelector('.modal-create-quiz-wrapper')
const modalDashboardWrapper = document.querySelector('.modal-dashboard-wrapper')

const modalDashboardContent = document.querySelector('.modal-dashboard-content')
const modalHeaders = document.querySelectorAll('.modal-header')

const correctAnswerLetter = document.querySelector('.question-creator')

const guestManagement = verifyIfLocalStorageItemIsNull('guestManagement', {}, item => JSON.parse(item))

const preferences = new StorageManager('preferences')
const questions = new StorageManager('questions')

async function initializeStorages() {

    const storages = new Map([
        [ preferences, preferencesJSON ],
        [ questions, questionsJSON ]
    ])

    for(const [ storage, json ] of storages) {

        const exists = await storage.exists()

        if(!exists) {
            storage.set(json)
        }
    }
}

window.addEventListener('load', () => {

    initializeStorages()
    setupNavbar()
    loadQuestions()

})

const loadQuestions = async () => {

    clearHTML(questionsWrapper)

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

        if(guestManagement.adminMode === 'ON') {

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
            .addAttribute('data-answers', answers)
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

// window.addEventListener('scroll', () => {
//     if(document.documentElement.scrollTop === 0) {
//         document.querySelector('.scrollbar-wrapper').style.display = 'none'
//         return
//     }

//     document.querySelector('.scrollbar-wrapper').style.display = 'block'
//     const scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0
//     const clientHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
//     const percentage = Math.floor((scrollTop / clientHeight) * 100)
//     scrollbarIndicator.style.width = `${percentage}%`
    
// })

//

const pElementEmptyInputs = document.createElement('p')
createQuizButton.addEventListener('click', () => {

    const questionCreatorWrapperChildren = [...questionCreatorWrapper.children]
    const textInputs = []
    questionCreatorWrapperChildren.forEach(inputWrapper => {
        if(inputWrapper.querySelector('input[type="text"]') !== null) {
            textInputs.push(inputWrapper.querySelector('input[type="text"]'))
        }
    })

    const answers = [...document.querySelectorAll('[data-creator-answer="creator-answer"]')]

    const isACorrectInput = (input) => input.value === '' 
        ? input.classList.add('incorrect') 
        : input.classList.remove('incorrect')

    const inputsIncorrect = textInputs.map(input => {
        if(!isACorrectInput(input)) {
            return input
        }
    })

    const containsEmptyInput = inputsIncorrect.some(input => {
        if(input.classList.contains('incorrect')) {
            console.log(input)
            pElementEmptyInputs.innerHTML = `<pre>The question cannot have empty answers</pre>`
            pElementEmptyInputs.classList.add('creator-result')
            correctAnswerLetter.append(pElementEmptyInputs)
            setTimeout(() => pElementEmptyInputs.remove(), 2 * 1000)
            return input
        }
    })

    const childrenRadios = [...creatorQuizRadios]
    const elementNoChecked = childrenRadios.some(radioInput => radioInput.checked)

    const elementsToVerify = [containsEmptyInput, elementNoChecked]
    const allElementIsNotOk = elementsToVerify.every(element => Boolean(element))
    
    const correctAnswerIntoDOM = questionCreatorWrapper.querySelector('[data-radio="radiocheck"]:checked')
    if(!correctAnswerIntoDOM) {
        pElementEmptyInputs.textContent = '. You must check a correct answer.'
        correctAnswerLetter.append(pElementEmptyInputs)
        return
    }

    if(!allElementIsNotOk) {
        const answersObject = answers.reduce((acc, input) => {
            const { dataset: { letter }, value } = input
            acc[letter] = value
            return acc
        }, {})
    
        console.log(correctAnswerIntoDOM)
    
        const questionId = Math.floor(Math.random() * (99999 - 9999 + 1) + 9999)

        const newQuestion = {
            [questionId]: {
                title: document.querySelector('.creator-question-title').value,
                answers: { ...answersObject },
                correctAnswer: correctAnswerIntoDOM.dataset.letter,
                questionId
            },
        }
    
        verifyIfTotalQuestionExist()

        setSavedItemStringify('guestManagement', guestManagement)

        const savedQuestions = getSavedItemParsed('savedQuestions')
        
        savedQuestions.push(newQuestion)
        localStorage.setItem('savedQuestions', JSON.stringify(savedQuestions))
        console.log(JSON.parse(localStorage.getItem('savedQuestions')))

        const questionWrapperChildren = [...questionsWrapper.children]
        questionWrapperChildren.forEach(item => {
            item.remove()
        })

        loadQuestions()

        document.querySelector('.creator-result').textContent = `Question with ID: ${questionId} created at: ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}`

        document.querySelector('.creator-question-title').focus()

        questionCreatorWrapper.querySelectorAll('input').forEach(item => {
            if(item.type === 'radio') {
                item.removeAttribute('checked')
            }else {
                item.value = ''
            }
        })

        setTimeout(() => {
            document.querySelector('.creator-result').remove()
        }, 2 * 1000)

    }
})

//

const element = document.createElement('p')

const correctAnswerChangeEvent = (input) => input.addEventListener('change', event => {
    if(event.target.dataset.letter === undefined) {
        return
    }

    element.innerHTML = `<pre>The letter <strong style="inline">${event.target.dataset.letter}</strong> will be marked as correct answer</pre>`
    element.classList.add('creator-result')

    correctAnswerLetter.insertAdjacentElement('afterend', element)

})

creatorQuizRadios.forEach(input => {
    correctAnswerChangeEvent(input)
})

//

const callAdminMode = () => {

    const guestStatus = guestManagement.adminMode === 'ON' 
        ? 'ON'
        : 'OFF'

    const adminButton = adminModeWrapper.querySelector('[data-navbar="admin-mode"]')
        
    if(guestStatus === 'ON') {
        adminButton.textContent = 'Admin Mode: OFF'
        guestManagement.adminMode = 'OFF'
    } else {
        adminButton.textContent = 'Admin Mode: ON'
        guestManagement.adminMode = 'ON'
    }
    
    setSavedItemStringify('guestManagement', guestManagement)

    const questionWrapperChildren = [...questionsWrapper.children]
    questionWrapperChildren.forEach(item => {
        item.remove()
    })
    loadQuestions()
}

navbarWrapper.style.display = 'none'

const setupNavbar = () => {
    
    navbarWrapper.style.display = 'flex'

    const actualAdminStatus = (color, status) => 
        `Admin Mode: <span style="color: ${color}; font-weight: bold;" data-navbar="admin-mode">${status}</span>`

    if(guestManagement.adminMode === 'ON') {
        adminModeWrapper.querySelector('[data-status="admin-mode"]').innerHTML = 
            actualAdminStatus('#15ff00', 'ON')
    }else {
        adminModeWrapper.querySelector('[data-status="admin-mode"]').innerHTML = 
            actualAdminStatus('#ff0000', 'OFF')
    }

    const { adminMode } = guestManagement
    const navbarChildren = [...navbarWrapper.children]
    
    navbarChildren.forEach(item => {
        const adminModeOn = item.dataset.status.includes(adminMode === 'ON' ? 'admin-mode-on' : 'ignore')
        if(adminModeOn) {
            item.style.display = 'block'
            return
        }
        item.style.display = 'none'
    })
    
    adminModeWrapper.removeAttribute('style')

}

const divInformationsDashboard = document.createElement('div')
const invokeDashboardInformations = () => {
    const guestManagement = getSavedItemParsed('guestManagement')
    
    divInformationsDashboard.classList.add('informations')
    modalDashboardContent.append(divInformationsDashboard)

    const children = [...document.querySelector('.informations').children]
    children.forEach(item => item.remove())

    const pElement = document.createElement('p')
    pElement.textContent = `Total questions created: ${guestManagement.totalQuizCreated}`
    divInformationsDashboard.append(pElement)
    
    const pElement2 = document.createElement('p')
    pElement2.textContent = `Total questions deleted: ${guestManagement.totalQuizDeleted}`
    divInformationsDashboard.append(pElement2)

}

navbarWrapper.addEventListener('click', event => {
    const { navbar } = event.target.dataset

    switch (navbar) {
        case 'create-new-quiz': 
            modalCreatorWrapper.classList.add('active')
            break
        case 'quiz-dashboard':
            modalDashboardWrapper.classList.add('active')
            invokeDashboardInformations()
            break
        case 'admin-mode':
            callAdminMode()
            setupNavbar()
            break
    }
})

let questionsChecked = {}

questionsWrapper.addEventListener('change', () => {
    if(quizDisable) {
        return
    }

    const inputsCheckedByGuest = questionsWrapper.querySelectorAll('input[type="radio"]:checked')
    inputsCheckedByGuest.forEach((item, index) => questionsChecked[index] = item.dataset.letter)
    setSavedItemStringify('checkedItems', questionsChecked)
})

// window.addEventListener('beforeunload', event => {
//     return event.returnValue = 'Do you have sure?'
// })

modalWrappers.forEach(modalWrapper => {
    modalWrapper.addEventListener('click', event => {
        event.target.classList.remove('active')
    })
})

modalHeaders.forEach(modalHeader => {
    modalHeader.addEventListener('click', event => {
        const { ['close']: closeButton } = event.target.dataset

        if(!closeButton) {
            return
        }

        document.querySelector(`.${closeButton}`).classList.remove('active')
    })
})

questionsWrapper.addEventListener('click', event => {
    const getOnlyProperty = Object.keys(event.target.dataset)

    const [ property ] = getOnlyProperty

    const {
        ['edit']: itemEdit,
        ['delete']: itemDelete
    } = event.target.dataset

    switch(property) {
        case 'edit':
            editQuestion(itemEdit, event)
            break
        case 'delete':
            deleteQuestion(Number(itemDelete))
            break
    }
})

export {
    loadQuestions
}