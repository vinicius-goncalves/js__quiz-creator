const questionsWrapper = document.querySelector('.questions-wrapper')

const deleteQuestion = (id) => {

    savedQuestions.filter((item, index) => {
        const objectQuestionKey = Object.keys(item)
        console.log(item[objectQuestionKey].questionId)
        if(item[objectQuestionKey].questionId === id) {
            return savedQuestions.splice(index, 1)
        }
    })

    localStorage.setItem('savedQuestions', JSON.stringify(savedQuestions))

    const questionWrapperChildren = [...questionsWrapper.children]
    questionWrapperChildren.forEach(item => {
        item.remove()
    })

    loadQuestions()

}

questionsWrapper.addEventListener('click', event => {
    const getOnlyProperty = Object.keys(event.target.dataset)

    const [ property ] = getOnlyProperty
    const { 
        ['edit']: itemEdit, 
        ['delete']: itemDelete 
    } = event.target.dataset

    switch(property) {
        case 'edit':
            break
        case 'delete':
            deleteQuestion(Number(itemDelete))
            break
    }
})