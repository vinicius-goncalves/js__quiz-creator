import StorageManager from '../../storage/storage-manager.js'

const questionsCache = new StorageManager('questions')
const questions = await questionsCache.getAll()

function removeFromDOM(questionId) {

    const question = document.querySelector(`[data-quiz="container-${questionId}"]`)

    if(question) {
        question.remove()
    }
}

function removeQuestionById(questionId) {
    return questions.filter(({ id }) => id != questionId)
}

async function remove(questionId) {

    const updatedQuestions = removeQuestionById(questionId)
    await questionsCache.set(updatedQuestions, true)

    removeFromDOM(questionId)
}

export default remove