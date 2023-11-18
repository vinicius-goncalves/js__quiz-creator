import('./components/elements/CustomButton.js')

import StorageManager from './features/storage/storage-manager.js'

import questionsJSON from '../assets/jsons/question-example.json' assert { type: 'json' }
import preferencesJSON from '../assets/jsons/preferences.json' assert { type: 'json' }

import loadQuestions from './features/storage/load-questions.js'

import {
    setSavedItemStringify,
    getSavedItemParsed,
    verifyIfLocalStorageItemIsNull } from './features/utils.js'

import * as AdminMode from './features/tools/admin-mode.js'
import * as Tools from './features/tools/tools-manager.js'

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
            await storage.set(json)
        }
    }
}

window.addEventListener('load', () => {
    initializeStorages()
    updateNavbar()
    loadQuestions()
})

//

// const pElementEmptyInputs = document.createElement('p')
// createQuizButton.addEventListener('click', () => {

//     const questionCreatorWrapperChildren = [...questionCreatorWrapper.children]
//     const textInputs = []
//     questionCreatorWrapperChildren.forEach(inputWrapper => {
//         if(inputWrapper.querySelector('input[type="text"]') !== null) {
//             textInputs.push(inputWrapper.querySelector('input[type="text"]'))
//         }
//     })

//     const answers = [...document.querySelectorAll('[data-creator-answer="creator-answer"]')]

//     const isACorrectInput = (input) => input.value === ''
//         ? input.classList.add('incorrect')
//         : input.classList.remove('incorrect')

//     const inputsIncorrect = textInputs.map(input => {
//         if(!isACorrectInput(input)) {
//             return input
//         }
//     })

//     const containsEmptyInput = inputsIncorrect.some(input => {
//         if(input.classList.contains('incorrect')) {
//             console.log(input)
//             pElementEmptyInputs.innerHTML = `<pre>The question cannot have empty answers</pre>`
//             pElementEmptyInputs.classList.add('creator-result')
//             correctAnswerLetter.append(pElementEmptyInputs)
//             setTimeout(() => pElementEmptyInputs.remove(), 2 * 1000)
//             return input
//         }
//     })

//     const childrenRadios = [...creatorQuizRadios]
//     const elementNoChecked = childrenRadios.some(radioInput => radioInput.checked)

//     const elementsToVerify = [containsEmptyInput, elementNoChecked]
//     const allElementIsNotOk = elementsToVerify.every(element => Boolean(element))

//     const correctAnswerIntoDOM = questionCreatorWrapper.querySelector('[data-radio="radiocheck"]:checked')
//     if(!correctAnswerIntoDOM) {
//         pElementEmptyInputs.textContent = '. You must check a correct answer.'
//         correctAnswerLetter.append(pElementEmptyInputs)
//         return
//     }

//     if(!allElementIsNotOk) {
//         const answersObject = answers.reduce((acc, input) => {
//             const { dataset: { letter }, value } = input
//             acc[letter] = value
//             return acc
//         }, {})

//         const questionId = Math.floor(Math.random() * (99999 - 9999 + 1) + 9999)

//         const newQuestion = {
//             [questionId]: {
//                 title: document.querySelector('.creator-question-title').value,
//                 answers: { ...answersObject },
//                 correctAnswer: correctAnswerIntoDOM.dataset.letter,
//                 questionId
//             },
//         }

//         verifyIfTotalQuestionExist()

//         setSavedItemStringify('guestManagement', guestManagement)

//         const savedQuestions = getSavedItemParsed('savedQuestions')

//         savedQuestions.push(newQuestion)
//         localStorage.setItem('savedQuestions', JSON.stringify(savedQuestions))
//         console.log(JSON.parse(localStorage.getItem('savedQuestions')))

//         const questionWrapperChildren = [...questionsWrapper.children]
//         questionWrapperChildren.forEach(item => {
//             item.remove()
//         })

//         loadQuestions()

//         document.querySelector('.creator-result').textContent = `Question with ID: ${questionId} created at: ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}`

//         document.querySelector('.creator-question-title').focus()

//         questionCreatorWrapper.querySelectorAll('input').forEach(item => {
//             if(item.type === 'radio') {
//                 item.removeAttribute('checked')
//             }else {
//                 item.value = ''
//             }
//         })

//         setTimeout(() => {
//             document.querySelector('.creator-result').remove()
//         }, 2 * 1000)

//     }
// })

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

navbarWrapper.style.display = 'none'

async function updateNavbar() {

    navbarWrapper.style.display = 'flex'
    AdminMode.loadStatus()

    const isAdminModeActive = await AdminMode.getStatus()
    const navbarChildren = [...navbarWrapper.children]

    navbarChildren.forEach(option => {
        option.style.display = isAdminModeActive ? 'block' : 'none'
    })

    adminModeWrapper.removeAttribute('style')}

// const divInformationsDashboard = document.createElement('div')
// const invokeDashboardInformations = () => {
//     const guestManagement = getSavedItemParsed('guestManagement')

//     divInformationsDashboard.classList.add('informations')
//     modalDashboardContent.append(divInformationsDashboard)

//     const children = [...document.querySelector('.informations').children]
//     children.forEach(item => item.remove())

//     const pElement = document.createElement('p')
//     pElement.textContent = `Total questions created: ${guestManagement.totalQuizCreated}`
//     divInformationsDashboard.append(pElement)

//     const pElement2 = document.createElement('p')
//     pElement2.textContent = `Total questions deleted: ${guestManagement.totalQuizDeleted}`
//     divInformationsDashboard.append(pElement2)

// }

navbarWrapper.addEventListener('click', async (event) => {
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
            AdminMode.toggle().then(updateNavbar)
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

    const targetClicked = event.target
    const targetDataset = targetClicked.dataset

    if(targetClicked.nodeName != 'I') {
        return
    }

    const [ action, questionId ] = Object.entries(targetDataset)[0]

    switch(action) {
        case 'edit':
            Tools.edit(questionId)
            break
        case 'delete':
            Tools.remove(questionId)
            break
    }
})

export {
    loadQuestions
}