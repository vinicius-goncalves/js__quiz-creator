import { loadQuestions } from './app.js'
import { getSavedItemParsed } from './utils.js'

const questionsWrapper = document.querySelector('.questions-wrapper')
const savedQuestions = getSavedItemParsed('savedQuestions')

export const deleteQuestion = (id) => {

    savedQuestions.filter((item, index) => {
        const objectQuestionKey = Object.keys(item)
        console.log(item[objectQuestionKey].questionId)
        if(item[objectQuestionKey].questionId === id) {
            return savedQuestions.splice(index, 1)
        }
    })

    localStorage.setItem('savedQuestions', JSON.stringify(savedQuestions))

    const questionWrapperChildren = [...questionsWrapper.children]
    questionWrapperChildren.forEach(item => {
        item.remove()
    })

    loadQuestions()

}