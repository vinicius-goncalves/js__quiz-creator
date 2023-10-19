import StorageManager from '../storage-manager.js'

const questions = new StorageManager('questions')

async function remove(questionId) {

    const previousQuestions = await questions.getAll()
    const newQuestions = previousQuestions.filter(({ id }) => id != questionId)

    await questions.set(newQuestions, true)
}

export default remove