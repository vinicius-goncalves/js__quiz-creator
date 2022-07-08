const main = document.querySelector('main')
const seeResultButton = document.querySelector('.see-result')

const questions = {
    "question-1": {
        title: "Question 1.",
        answers: {
            a: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, magnam.",
            b: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, magnam.",
            c: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, magnam.",
            d: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, magnam."
        },
        correctAnswer: "a"
    },
    "question-2": {
        title: "Question 2.",
        answers: {
            a: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, magnam.",
            b: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, magnam.",
            c: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, magnam.",
            d: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, magnam.",
        },
        correctAnswer: "b"
    },
    "question-3": {
        title: "Question 3.",
        answers: {
            a: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, magnam.",
            b: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, magnam.",
            c: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, magnam.",
            d: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, magnam.",
        },
        correctAnswer: "c"
    },
    "question-4": {
        title: "Question 4.",
        answers: {
            a: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, magnam.",
            b: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, magnam.",
            c: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, magnam.",
            d: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, magnam.",
        },
        correctAnswer: "d"
    }
}

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

    const questionsValues = Object.values(questions)
    const finalResult = questionsValues.map((item, index) => {
        const { title, answers, correctAnswer } = item
        const extractAnswers = Object.values(answers)

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
                input: `letter-${letters[index]}-${questionPosition}`,
                name: `quiz-answer-${questionPosition}`,
                'data-letter': letters[index],

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
    const answersInputs = document.querySelectorAll('[data-answers="answers"]')
    const questionsValue = Object.values(questions)
    questionsValue.forEach((item, index) => {
        const { answers } = item
        
        const letters = Object.getOwnPropertyNames(answers)
        const questionPosition = index

        letters.forEach((letter) => {
            const letterChecked = document.querySelector(`#letter-${letter}-${questionPosition}`)
            if(letterChecked.checked && letterChecked.dataset.letter === item.correctAnswer) {
                points += 25
            }
        })
    })

    console.log(pointsResult(points))
})