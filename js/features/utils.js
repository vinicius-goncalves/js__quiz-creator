const generateLorem = document.querySelector('[data-button="generate-lorem"]')
const creatorQuestionTitle = document.querySelector('.creator-question-title')
// const creatorAnswerLetter = letter => document.querySelector(`#creator-answer-${letter}`)

// export const setSavedItemStringify = (stringItem, object) => {
//     return localStorage.setItem(stringItem, JSON.stringify(object))
// }

// export const getSavedItemParsed = (stringItem) => {
//     return JSON.parse(localStorage.getItem(stringItem))
// }

// export const verifyIfLocalStorageItemIsNull = (itemToVerify, nullReturn, callback) =>
//     localStorage.getItem(itemToVerify) === null
//         ? nullReturn
//         : callback(localStorage.getItem(itemToVerify))


// const defineLoremMessage = (letter) =>
//     creatorAnswerLetter(letter).value =
//         'Lorem ipsum dolor sit amet consectetur adipisicing elit.'

// generateLorem.addEventListener('click', () => {

//     const letters = ['a', 'b', 'c', 'd']
//     letters.forEach((_, index)=> {
//         defineLoremMessage(letters[index])
//     })

//     creatorQuestionTitle.value = 'Lorem ipsum dolor. ' + Math.floor(Math.random() * 9999)

//     const randomPosition = letters[Math.floor(Math.random() * letters.length)]
//     document.querySelector(`#creator-letter-${randomPosition}`).setAttribute('checked', 'true')

// })