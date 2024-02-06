import StorageManager from '../storage/storage-manager.js'
import renderQuestion from './render-question.js'

const questionsWrapper = document.querySelector('.questions-wrapper')

const questionsStorage = new StorageManager('questions')
const questions = await questionsStorage.getAll()

function createQuestionsFragment() {

    const docFragment = document.createDocumentFragment()

    questions.forEach((question, index) => {
        const questionCreated = renderQuestion(question, index)
        docFragment.appendChild(questionCreated)
    })

    return docFragment
}

async function renderQuestions() {
    const questionsFragment = createQuestionsFragment()
    questionsWrapper.appendChild(questionsFragment)
}

export default renderQuestions