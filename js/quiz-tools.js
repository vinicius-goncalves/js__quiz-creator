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

    loadQuestions()
}

export const editQuestion = (id) => {

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
            
            const div = document.createElement('div')
            div.classList.add('modal-edit-answers-wrapper')

            const h2 = document.createElement('h2')
            h2.textContent = 'Answers'
            div.appendChild(h2)

            modalEditQuizData.appendChild(titleInput)
            
            answersToArray.forEach((item, index) => {

                const label = document.createElement('label')
                label.classList.add('temp-edit')
                
                const input = document.createElement('input')
                input.setAttribute('type', 'text')
                input.setAttribute('placeholder', item)
                input.setAttribute('data-temp-edit', `letter-${letter[index]}-${questionPosition}`)

                const correctInput = document.createElement('input')
                correctInput.setAttribute('type', 'radio')
                correctInput.setAttribute('placeholder', item)
                correctInput.setAttribute('name', 'temp-edit-quiz')
                

                label.append(correctInput)
                label.append(input)
                
                div.appendChild(label)

                console.log(correctAnswer)
            })

            const h2CorrectAnswer = document.createElement('h2')
            h2CorrectAnswer.textContent = 'Correct Answer'
            div.appendChild(h2CorrectAnswer)

            const buttonsContainer = document.createElement('div')
            buttonsContainer.classList.add('buttons-container')
            
            const input = document.createElement('input')
            input.setAttribute('type', 'button')
            input.setAttribute('value', 'Edit quiz')
            input.setAttribute('class', 'confirm-edit')

            buttonsContainer.appendChild(input)

            modalEditContent.appendChild(buttonsContainer)
            modalEditQuizData.appendChild(div)
        }
    })

    

    

    // const question1 = document.createElement('input')
    // question1.setAttribute('type', 'text')
    // question1.setAttribute('placeholder', z.textContent)
    
    // modalEditQuizData.appendChild(question1)
}