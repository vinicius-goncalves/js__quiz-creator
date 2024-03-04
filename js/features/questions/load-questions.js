import StorageManager from '../storage-manager.js'
import renderQuestion from './render-question.js'

const questionsWrapper = document.querySelector('.questions-wrapper')
const questionsStorage = new StorageManager('questions')

async function createQuestionsFragment() {

    const questions = await questionsStorage.getAll()

    if(questions.length === 0) {
        questionsWrapper.textContent = 'There are not any questions created yet. Create a new one!'
        return
    }

    const docFragment = document.createDocumentFragment()

    questions.forEach((question, index) => {
        const questionCreated = renderQuestion(question, index)
        docFragment.appendChild(questionCreated)
    })

    return docFragment
}

async function renderQuestions() {

    const questionsFragment = await createQuestionsFragment()

    if(!questionsFragment) {
        return
    }

    questionsWrapper.appendChild(questionsFragment)
}

export default renderQuestions