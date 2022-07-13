import { loadQuestions } from './app.js'
import { getSavedItemParsed, setSavedItemStringify } from './utils.js'

const questionsWrapper = document.querySelector('.questions-wrapper')
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