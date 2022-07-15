import { loadQuestions } from './app.js'
import { getSavedItemParsed, setSavedItemStringify } from './utils.js'

const questionsWrapper = document.querySelector('.questions-wrapper')

const modalEditWrapper = document.querySelector('.modal-edit-wrapper')
const modalEditContent = document.querySelector('.modal-edit-content')
const modalEditQuizData = document.querySelector('.modal-edit-quiz-data')

const savedQuestions = getSavedItemParsed('savedQuestions')
const guestManagement = getSavedItemParsed('guestManagement')


export const deleteQuestion = (id) => {

    savedQuestions.filter((item, index) => {
        const objectQuestionKey = Object.keys(item)
        console.log(item[objectQuestionKey].questionId)
        if(item[objectQuestionKey].questionId === id) {
            return savedQuestions.splice(index, 1)
        }
    })
    
    if(!guestManagement.totalQuizDeleted) {
        guestManagement.totalQuizDeleted = 1
    }else {
        guestManagement.totalQuizDeleted = guestManagement.totalQuizDeleted + 1
    }
    
    console.log(getSavedItemParsed('savedQuestions'))

    localStorage.setItem('savedQuestions', JSON.stringify(savedQuestions))
    setSavedItemStringify('guestManagement', guestManagement)

    const questionWrapperChildren = [...questionsWrapper.children]
    questionWrapperChildren.forEach(item => {
        item.remove()
    })
}

export const editQuestion = (id, event) => {

    modalEditWrapper.classList.add('active')

    const idToNumber = Number.parseInt(id)

    const modalChildren = [...modalEditQuizData.children]
    modalChildren.forEach(item => item.remove())

    savedQuestions.forEach((question, index) => {
        const questionValue = Object.values(question)
        const { questionId, title, answers, correctAnswer  } = questionValue[0]
        if(questionId === idToNumber) {

            const answersToArray = Object.values(answers)
            const letter = Object.keys(answers)
            const questionPosition = index

            const titleInput = document.createElement('input')
            titleInput.setAttribute('type', 'text')
            titleInput.setAttribute('placeholder', title)
            titleInput.setAttribute('data-temp-edit-title', questionId)
            
            const div = document.createElement('div')
            div.classList.add('modal-edit-answers-wrapper')

            const h2 = document.createElement('h2')
            h2.textContent = 'Answers'
            div.appendChild(h2)

            modalEditQuizData.appendChild(titleInput)
            
            answersToArray.forEach((item, index) => {

                const divQuestions = document.createElement('div')
                divQuestions.classList.add('temp-edit')
                
                const input = document.createElement('input')
                input.setAttribute('type', 'text')
                input.setAttribute('placeholder', item)
                input.setAttribute('data-temp-edit-text', questionId)

                const result = item.length > 39 ? item.slice(0, 12) + '...' : item

                input.setAttribute('placeholder', result)
                input.setAttribute('data-temp-edit', `letter-${letter[index]}-${questionPosition}`)

                const correctInput = document.createElement('input')
                correctInput.setAttribute('type', 'radio')
                correctInput.setAttribute('name', 'temp-edit-quiz')
                correctInput.setAttribute('data-letter', letter[index])
                correctInput.setAttribute('data-temp-edit-radio', questionId)

                const isCorrectAnswer = correctInput.dataset.letter === correctAnswer
                if(isCorrectAnswer) {
                    correctInput.setAttribute('checked', 'true')
                }

                divQuestions.append(correctInput)
                divQuestions.append(input)
                div.appendChild(divQuestions)
            })

            const h2CorrectAnswer = document.createElement('h2')
            h2CorrectAnswer.textContent = 'Correct Answer'
            div.appendChild(h2CorrectAnswer)
            
            const input = document.createElement('input')
            input.setAttribute('type', 'button')
            input.setAttribute('value', 'Edit quiz')
            input.setAttribute('class', 'confirm-edit')

            document.querySelector('.confirm-edit').setAttribute('data-temp-edit-button', questionId)

            modalEditQuizData.appendChild(div)
        }
    })
}

modalEditContent.addEventListener('click', event => {
    if(event.target.classList.contains('confirm-edit')) {
        const newTitleValue = document.querySelector(`[data-temp-edit-title="${event.target.dataset.tempEditButton}"]`)

        savedQuestions.forEach(question => {
            const extractValues = Object.values(question)[0]
            if(extractValues.questionId === Number.parseInt(event.target.dataset.tempEditButton)) {
                extractValues.title = 'a'
                // console.log(savedQuestions)
                setSavedItemStringify('savedQuestions', savedQuestions)
            }
        })
    }
})