const main = document.querySelector('main')

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
    }
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
        div.classList.add(`answers-${index}`)
        section.appendChild(div)

        const letters = Object.getOwnPropertyNames(answers)
        const questionPosition = index

        extractAnswers.forEach((item, index) => {
            const label = document.createElement('label')
            label.classList.add('answers-label')
            label.setAttribute('for', `letter-${letters[index]}-${questionPosition}`)
            div.appendChild(label)

            const input = document.createElement('input')
            input.type = 'radio'
            input.id = `letter-${letters[index]}-${questionPosition}`
            input.setAttribute('data-letter', letters[index])
            input.name = `quiz-answer-${questionPosition}`
            label.append(input)

            const p = document.createElement('p')
            p.classList.add('answers-p')
            p.textContent = item
            label.appendChild(p)

        })

        return section
        
    })
    
    finalResult.forEach(item => main.appendChild(item));
}

loadQuestions()

const quizContainers = document.querySelectorAll('[data-js="quiz-container"]')

quizContainers.forEach(item => {
    item.addEventListener('change', event => {
        const objValues = Object.values(questions)
        objValues.forEach(item => {
            const { correctAnswer } = item
            if(event.target.dataset.letter === correctAnswer) {
                console.log(event.target.dataset.letter === correctAnswer)
            }else {
                console.log(event.target.dataset.letter === correctAnswer)
            }
        })
    })
})

