const main = document.querySelector('main')

const scrollbarIndicator = document.querySelector('.scrollbar')

const seeResultButton = document.querySelector('.see-result')

const navbarWrapper = document.querySelector('[data-navbar="navbar"]')
const questionCreatorWrapper = document.querySelector('.question-creator')
const createQuizButton = document.querySelector('[data-button="create-quiz"]')

const modalCreatorWrapper = document.querySelector('.modal-create-quiz-wrapper')

const correctAnswerLetter = document.querySelector('.question-creator')

const savedQuestions = 
    localStorage.getItem('savedQuestions') === null 
        ? [] 
        : JSON.parse(localStorage.getItem('savedQuestions'))

const defineElementProperties = (element, obj) => {
    const extractProperties = Object.entries(obj)
    extractProperties.forEach(([ property, value ]) => {
        element.setAttribute(property, value)
    })
}

const loadQuestions = () => {
    
    const mainChildren = [...main.children]

    for(let i = 0; i < mainChildren.length; i++) {
        mainChildren[0].remove()
    }

    // const x = JSON.parse(localStorage.getItem('savedQuestions'))

    if(localStorage.getItem('savedQuestions') === null) {
        return
    }

    const questionsValues = JSON.parse(localStorage.getItem('savedQuestions'))
    const finalResult = questionsValues.map((item, index) => {
        const extractQuestion = Object.values(item)
        const { title, answers } = extractQuestion[0]

        const section = document.createElement('section')
        section.classList.add(`quiz-${index}`)
        section.setAttribute('data-js', 'quiz-container')

        const h1 = document.createElement('h1')
        h1.textContent = title
        section.appendChild(h1)

        const div = document.createElement('div')
        div.setAttribute('data-answers', 'answers')
        section.appendChild(div)

        const letters = Object.getOwnPropertyNames(answers)
        const questionPosition = index

        const extractAnswers = Object.values(answers)
        extractAnswers.forEach((question, index) => {
            const label = document.createElement('label')
            label.classList.add('answers-label')
            defineElementProperties(label, {
                for: `letter-${letters[index]}-${questionPosition}`
            })
            div.appendChild(label)

            const input = document.createElement('input')
            defineElementProperties(input, { 
                type: 'radio',
                id: `letter-${letters[index]}-${questionPosition}`,
                name: `quiz-answer-${questionPosition}`,
                'data-letter': letters[index],
                // checked: 'true'
            })
            label.append(input)

            const p = document.createElement('p')
            p.classList.add('answers-p')
            p.textContent = `${letters[index]}) ${question}`
            label.appendChild(p)

        })

        return section
        
    })
    
    finalResult.forEach(item => main.appendChild(item));
}

loadQuestions()

const quizContainers = document.querySelectorAll('[data-js="quiz-container"]')

seeResultButton.addEventListener('click', () => {

    let points = 0
    const answersWrapper = [...document.querySelectorAll('[data-answers="answers"]')]

    const extractQuestion = JSON.parse(localStorage.getItem('savedQuestions'))
    
    const howManyQuestionsExist = extractQuestion.reduce((acc, _, index) => {
        acc[index + 1] = `You got ${index + 1}/${extractQuestion.length} question right!`
        return acc
    }, {})

    const pointsResult = (result) => ({
        ...howManyQuestionsExist
    })[result] || 'You got all questions wrong =('

    const finalResultChecks = answersWrapper.map(item => {
        const answerChildren = [...item.children]
        const hasSomeUncheckBox = answerChildren.every(input => {
            return input.querySelector('input[type="radio"]:checked') !== null ? '' : document.querySelector('.result').textContent = 'Check an item before'
        })
        return hasSomeUncheckBox
    })

    const thereAreNotUncheckedItems = finalResultChecks.every(isUncheck => isUncheck === false)

    if(thereAreNotUncheckedItems) {
        answersWrapper.forEach((answer, index) => {
            const inputChecked = answer.querySelector('input[type="radio"]:checked')
            if(inputChecked) {
                const extractQuestion = JSON.parse(localStorage.getItem('savedQuestions'))
                const { correctAnswer } = Object.values(extractQuestion[index])[0]
                if(inputChecked.dataset.letter === correctAnswer) {
                    points++
                }
            }
        })
        
        document.querySelector('.result').textContent = pointsResult(points)
    
        window.scrollTo({ 
            behavior: 'smooth', 
            top: document.documentElement.scrollHeight - document.documentElement.clientHeight })
    }
})

window.addEventListener('scroll', () => {
    if(document.documentElement.scrollTop === 0) {
        document.querySelector('.scrollbar-wrapper').style.display = 'none'
    }else {
        document.querySelector('.scrollbar-wrapper').style.display = 'block'
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0
        const clientHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
        const percentage = Math.floor((scrollTop / clientHeight) * 100)
        scrollbarIndicator.style.width = `${percentage}%`
    }
})

const pElementEmptyInputs = document.createElement('p')
createQuizButton.addEventListener('click', () => {

    const questionCreatorWrapperChildren = [...questionCreatorWrapper.children]
    const textInputs = []
    questionCreatorWrapperChildren.forEach(inputWrapper => {
        if(inputWrapper.querySelector('input[type="text"]') !== null) {
            textInputs.push(inputWrapper.querySelector('input[type="text"]'))
        }
    })

    const answers = [...document.querySelectorAll('[data-creator-answer="creator-answer"]')]

    const isACorrectInput = (input) => input.value === '' 
        ? input.classList.add('incorrect') 
        : input.classList.remove('incorrect')

    const inputsIncorrect = textInputs.map(input => {
        if(!isACorrectInput(input)) {
            return input
        }
    })

    const containsEmptyInput = inputsIncorrect.some(input => {
        if(input.classList.contains('incorrect')) {
            console.log(input)
            pElementEmptyInputs.innerHTML = `<pre>The question cannot have empty answers</pre>`
            pElementEmptyInputs.classList.add('creator-result')
            correctAnswerLetter.append(pElementEmptyInputs)
            setTimeout(() => pElementEmptyInputs.remove(), 2 * 1000)
            return input
        }
    })

    if(!containsEmptyInput) {

        const answersObject = answers.reduce((acc, input) => {
            const { dataset: { letter }, value } = input
            acc[letter] = value
            return acc
        }, {})
    
        const correctAnswerIntoDOM = questionCreatorWrapper.querySelector('[data-radio="radiocheck"]:checked')

        console.log(correctAnswerIntoDOM)
    
        const newQuestion = {
            [Math.floor(Math.random() * (99999 - 9999 + 1) + 9999)]: {
                title: document.querySelector('.creator-question-title').value,
                answers: { ...answersObject },
                correctAnswer: correctAnswerIntoDOM.dataset.letter
            },
        }
    
        savedQuestions.push(newQuestion)
        localStorage.setItem('savedQuestions', JSON.stringify(savedQuestions))
        console.log(JSON.parse(localStorage.getItem('savedQuestions')))
    }

})

document.querySelector('.close').addEventListener('click', () => {
    modalCreatorWrapper.classList.remove('active')
})

navbarWrapper.addEventListener('click', event => {
    const { navbar } = event.target.dataset

    switch (navbar) {
        case 'create-new-quiz': 
            modalCreatorWrapper.classList.add('active')
            break
        case 'quiz-dashboard':
            break
    }
})

const element = document.createElement('p')
questionCreatorWrapper.addEventListener('change', event => {

    questionCreatorWrapper.querySelector('input[type="radio"]').setAttribute('checked', '')

    element.innerHTML = `<pre>The letter <strong style="inline">${event.target.dataset.letter}</strong> will be marked as correct answer</pre>`
    element.classList.add('creator-result')

    correctAnswerLetter.insertAdjacentElement('afterend', element)
        
})