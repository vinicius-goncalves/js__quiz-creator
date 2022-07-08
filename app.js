const main = document.querySelector('main')

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
        extractAnswers.forEach((item, index) => {
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
            p.textContent = `${letters[index]}) ${item}`
            label.appendChild(p)

        })

        return section
        
    })
    
    finalResult.forEach(item => main.appendChild(item));
}

loadQuestions()

const quizContainers = document.querySelectorAll('[data-js="quiz-container"]')

const pointsResult = (result) => ({
    25: 'You got 1/4 questions right!',
    50: 'You got 2/4 questions right!',
    75: 'You got 3/4 questions right!',
    100: 'You got all answers right!'
})[result] || 'You got all questions wrong =('

seeResultButton.addEventListener('click', () => {

    let points = 0
    const answersWrapper = document.querySelectorAll('[data-answers="answers"]')

    answersWrapper.forEach(item => {
        const checkedItem = item.querySelector('input[type="radio"]:checked')
        const extractQuestion = JSON.parse(localStorage.getItem('savedQuestions'))
        if(checkedItem) {
            extractQuestion.forEach(item => {
                const extractOnlyValues = Object.values(item)
                const { correctAnswer } = extractOnlyValues[0]
    
                if(checkedItem.dataset.letter === correctAnswer) {
                    console.log('Acertou')
                }else {
                    console.log('a')
                }
            })
        }
    })
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