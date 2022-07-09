const main = document.querySelector('main')

const scrollbarIndicator = document.querySelector('.scrollbar')

const seeResultButton = document.querySelector('.see-result')

const navbarWrapper = document.querySelector('[data-navbar="navbar"]')
const questionCreatorWrapper = document.querySelector('.question-creator')
const createQuizButton = document.querySelector('[data-button="create-quiz"]')

const modalCreatorWrapper = document.querySelector('.modal-create-quiz-wrapper')

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
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0
    const clientHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const percentage = Math.floor((scrollTop / clientHeight) * 100)
    scrollbarIndicator.style.width = `${percentage}%`
})

createQuizButton.addEventListener('click', () => {

    const answers = [...document.querySelectorAll('[data-answer="answer"]')]
    const answersObject = answers.reduce((acc, item) => {
        acc[item.dataset.letter] = item.value || 'Input a question...'
        return acc
    }, {})

    const correctAnswer = questionCreatorWrapper.querySelector('[data-radio="radiocheck"]:checked')

    const newQuestion = {
        [Math.floor(Math.random() * 9999)]: {
            title: document.querySelector('.creator-question-title').value,
            answers: { ...answersObject },
            correctAnswer: correctAnswer.dataset.letter
        },
    }

    savedQuestions.push(newQuestion)
    localStorage.setItem('savedQuestions', JSON.stringify(savedQuestions))
    console.log(JSON.parse(localStorage.getItem('savedQuestions')))
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
            console.log('b')
            break
    }
})