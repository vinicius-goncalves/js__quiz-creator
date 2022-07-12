const resultButton = document.querySelector('.see-result')

const questionsWrapper = document.querySelector('.questions-wrapper')

let quizDisable = false

resultButton.addEventListener('click', () => {

    let thereAreNotUncheckedItemsExternal = null

    if(!quizDisable) {
        let points = 0
        const answersWrapper = [...document.querySelectorAll('[data-answers="answers"]')]

        const extractQuestion = JSON.parse(localStorage.getItem('savedQuestions'))
        
        const howManyQuestionsExist = extractQuestion.reduce((acc, _, index) => {
            acc[index + 1] = `You got ${index + 1}/${extractQuestion.length} question right!`
            return acc
        }, {})

        const pointsResult = (result) => ({
            ...howManyQuestionsExist,
        })[result] || 'You got all questions wrong =('
        
        let checkedQuestions = 0
        answersWrapper.forEach(item => {
            if(item.querySelector('input[type="radio"]:checked')) {
                checkedQuestions++
            }
        })

        const finalResultChecks = answersWrapper.map(item => {
            const answerChildren = [...item.children]
            const hasSomeUncheckBox = answerChildren.every(input => {
                if(input.querySelector('input[type="radio"]:checked') === null) {
                    return input.querySelector('input[type="radio"]:checked') !== null ? '' : document.querySelector('.result').textContent = `You must check all questions. Checked ${checkedQuestions}/${JSON.parse(localStorage.getItem('savedQuestions')).length}`
                }
            })
            return hasSomeUncheckBox
        })

        const thereAreNotUncheckedItems = finalResultChecks.every(isUncheck => isUncheck === false)
        thereAreNotUncheckedItemsExternal = thereAreNotUncheckedItems

        if(thereAreNotUncheckedItems) {
            answersWrapper.forEach((answer, index) => {
                const inputChecked = answer.querySelector('input[type="radio"]:checked')
                if(inputChecked) {
                    const extractQuestion = JSON.parse(localStorage.getItem('savedQuestions'))
                    const { correctAnswer } = Object.values(extractQuestion[index])[0]
                    if(inputChecked.dataset.letter === correctAnswer) {
                        inputChecked.parentElement.classList.add('correct')
                        points++
                    }else {
                        inputChecked.parentElement.classList.add('incorrect')
                    }
                }
            })
            
            if(points === JSON.parse(localStorage.getItem('savedQuestions')).length) {
                document.querySelector('.result').textContent = 'You got all questions right!!!'
            }else {
                document.querySelector('.result').textContent = pointsResult(points)
            }
            
            const questionsWrapperChildren = [...questionsWrapper.children]
            questionsWrapperChildren.forEach(item => {
                const radioInputs = item.querySelectorAll('input[type="radio"]:checked')
                radioInputs.forEach(input => {
                    input.setAttribute('checked', 'false')
                })
            })
        }

        if(thereAreNotUncheckedItemsExternal) {
            quizDisable = true
        }

        setTimeout(() => {
            localStorage.removeItem('checkedItems')
            window.location.reload()
        }, 2000)
    
        window.scrollTo({ 
            behavior: 'smooth', 
            top: document.documentElement.scrollHeight - document.documentElement.clientHeight })
    }
})
