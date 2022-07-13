import { 
    defineElementProperties, 
    defineElementStyle,
    setSavedItemStringify,  
    getSavedItemParsed,
    verifyIfLocalStorageItemIsNull } from './utils.js'

import { deleteQuestion } from './quiz-tools.js'

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
const modalHeaders = document.querySelectorAll('.modal-header')

const correctAnswerLetter = document.querySelector('.question-creator')

const savedQuestions = verifyIfLocalStorageItemIsNull('savedQuestions', [], item => JSON.parse(item))
const guestManagement = verifyIfLocalStorageItemIsNull('guestManagement', {}, item => JSON.parse(item))

const initialQuestion = {
    1: {
        title: 'If today is Saturday, what is the date going to be tomorrow?',
        answers: {
            a: 'Sunday',
            b: 'Monday',
            c: 'Tuesday',
            d: 'Wednesday'
        },
        correctAnswer: 'a',
        questionId: 1
    }
}

window.addEventListener('load', () => {

    if(guestManagement.adminMode === undefined) {
        guestManagement.adminMode = 'OFF'
    }

    setupNavbar()

    if(guestManagement.isCurrent === undefined) {
        savedQuestions.push(initialQuestion)
        setSavedItemStringify('savedQuestions', savedQuestions)
        loadQuestions()
    }

    guestManagement.isCurrent = true
    setSavedItemStringify('guestManagement', guestManagement)
    
})

export const loadQuestions = () => {
    
    const questionsWrapperChildren = [...questionsWrapper.children]

    for(let i = 0; i < questionsWrapperChildren.length; i++) {
        questionsWrapperChildren[0].remove()
    }
    
    if(getSavedItemParsed('savedQuestions') === null) {
        return
    }

    const questionsValues = JSON.parse(localStorage.getItem('savedQuestions'))
    const finalResult = questionsValues.map((item, index) => {
        const extractQuestion = Object.values(item)
        const { title, answers } = extractQuestion[0]

        const extractQuestionId = Object.getOwnPropertyNames(item)
        const [ questionId ] = extractQuestionId

        const section = document.createElement('section')
        section.classList.add(`quiz-${index}`)
        section.setAttribute('data-js', 'quiz-container')
        section.setAttribute('data-question', questionId)
        
        const divElementQuestionWrapper = document.createElement('div')
        divElementQuestionWrapper.classList.add('quiz-header-wrapper')
        divElementQuestionWrapper.setAttribute('style', defineElementStyle({ 
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'space-between'
        }))
        
        section.appendChild(divElementQuestionWrapper)

        const h1 = document.createElement('h1')
        h1.textContent = title
        divElementQuestionWrapper.appendChild(h1)

        if(guestManagement.adminMode === 'ON') {

            const divElementEditItemsWrapper = document.createElement('div')
            divElementEditItemsWrapper.classList.add('edit-items-wrapper')

            const iElement_trashIcon = document.createElement('i')
            iElement_trashIcon.classList.add('material-icons')
            iElement_trashIcon.textContent = 'delete'
            iElement_trashIcon.setAttribute('style', defineElementStyle({ 
                margin: '0 25px'
            }))
            iElement_trashIcon.setAttribute('data-delete', questionId)

            const iElement_editIcon = document.createElement('i')
            iElement_editIcon.classList.add('material-icons')
            iElement_editIcon.textContent = 'edit'
            iElement_editIcon.setAttribute('data-edit', questionId)

            divElementEditItemsWrapper.append(iElement_trashIcon, iElement_editIcon)
            divElementQuestionWrapper.appendChild(divElementEditItemsWrapper)
        }

        const div = document.createElement('div')
        div.setAttribute('data-answers', 'answers')
        section.appendChild(div)

        const letters = Object.getOwnPropertyNames(answers)
        const questionPosition = index

        const extractAnswers = Object.values(answers)
        extractAnswers.forEach((question, index) => {
            const label = document.createElement('label')
            label.classList.add('answers-label')
            defineElementProperties(label, {
                for: `letter-${letters[index]}-${questionPosition}`
            })
            div.appendChild(label)

            const input = document.createElement('input')
            defineElementProperties(input, { 
                type: 'radio',
                id: `letter-${letters[index]}-${questionPosition}`,
                name: `quiz-answer-${questionPosition}`,
                'data-letter': letters[index],
                // checked: 'true'
            })

            label.append(input)

            const p = document.createElement('p')
            p.classList.add('answers-p')
            p.textContent = `${letters[index]}) ${question}`
            label.appendChild(p)

            if(localStorage.getItem('checkedItems') !== null) {
                const checkedItems = JSON.parse(localStorage.getItem('checkedItems'))
                const letterMatchWithSavedQuestion = input.dataset.letter === checkedItems[questionPosition]
                if(letterMatchWithSavedQuestion) {
                    input.setAttribute('checked', '')
                }
            }
        })

        return section
        
    })
    
    finalResult.forEach(item => questionsWrapper.appendChild(item));
}

loadQuestions()

window.addEventListener('scroll', () => {
    if(document.documentElement.scrollTop === 0) {
        document.querySelector('.scrollbar-wrapper').style.display = 'none'
        return
    }

    document.querySelector('.scrollbar-wrapper').style.display = 'block'
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0
    const clientHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const percentage = Math.floor((scrollTop / clientHeight) * 100)
    scrollbarIndicator.style.width = `${percentage}%`
    
})

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
    
    localStorage.setItem('guestManagement', JSON.stringify(guestManagement))

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

navbarWrapper.addEventListener('click', event => {
    const { navbar } = event.target.dataset

    switch (navbar) {
        case 'create-new-quiz': 
            modalCreatorWrapper.classList.add('active')
            break
        case 'quiz-dashboard':
            modalDashboardWrapper.classList.add('active')
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
        const { close } = event.target.dataset
        document.querySelector(`.${close}`).classList.remove('active')
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
            break
        case 'delete':
            deleteQuestion(Number(itemDelete))
            break
    }
})