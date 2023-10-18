// import StorageManager from '../storage-manager.js'

// import { clearHTML, verifyIfLocalStorageItemIsNull } from '../utils.js'

// const modalEditWrapper = document.querySelector('.modal-edit-wrapper')
// const modalEditQuizData = document.querySelector('.modal-edit-quiz-data')

// const storageManager = new StorageManager('saved_questions')
// const storage = storageManager.storageContext
// const savedQuestions = (await storageManager.get(storage)).data
// const questionsArr = Object.values(savedQuestions)

// const showModal = () => modalEditWrapper.classList.add('active')

// function prepareToEdit() {
//     showModal()
//     clearHTML(modalEditQuizData)
// }

// function findQuestion(questionId) {

//     for(const [ index, question ] of questionsArr.entries()) {
//         if(question.id === questionId) {
//             return { question, index }
//         }
//     }
// }

// function createInput(type, dataset, extraAttrs) {

//     const input = document.createElement('input')
//     input.type = type

//     for(const key in dataset) {
//         const value = dataset[key]
//         input.dataset[key] = value
//     }

//     if(extraAttrs) {
//         for(const attr in extraAttrs) {
//             const value = extraAttrs[attr]
//             input.setAttribute(attr, value)
//         }
//     }

//     return input
// }

// function createTempEditModalWith(question, index) {

//     const { id, title, answers, correctAnswer } = question

//     const div = document.createElement('div')
//     div.classList.add('modal-edit-answers-wrapper')

//     const titleInput = createInput('text', { tempEditTitle: id }, {
//         value: title
//     })

//     const h2 = document.createElement('h2')
//     h2.textContent = 'Answers'

//     modalEditQuizData.appendChild(titleInput)
//     div.appendChild(h2)

//     const answersArr = Object.entries(answers)

//     answersArr.forEach(([ letter, answer ]) => {

//         const questionWrapper = document.createElement('div')
//         questionWrapper.classList.add('temp-edit')

//         const questionInput = createInput('text', {
//             [`tempEditText${letter.toUpperCase()}`]: id,
//             tempEdit: `letter-${letter}-${index}`
//         }, answer)

//         const questionRadioInput = createInput('radio', {
//             letter,
//             tempEditRadio: id
//         }, { name: 'temp-edit-quiz' })

//         if(letter === correctAnswer) {
//             questionRadioInput.checked = true
//         }

//         questionWrapper.append(correctRadioInput, questionInput)
//         div.appendChild(questionWrapper)
//     })

//     modalEditQuizData.appendChild(div)
// }

// function edit(questionId) {

//     if(!questionId || !Number.isInteger(questionId)) {
//         throw new Error('The id must not be undefined, and must be a integer.')
//     }

//     prepareToEdit()

//     const { question, index } = findQuestion(questionId)
//     createTempEditModalWith(question, index)
// }

// export default edit