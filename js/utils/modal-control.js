const questionWrapper = document.querySelector('.questions-wrapper')

const allModals = document.querySelectorAll('[data-modal]')
const allModalsOpenBtn = document.querySelectorAll('[data-open-modal]')
const allModalsCloseBtn = document.querySelectorAll('[data-close-modal]')

const modalsBtns = [...allModalsOpenBtn, ...allModalsCloseBtn]

function getModal(modalBtn) {

    const [ _, modalName ] = Object.entries(modalBtn.dataset).find(([ k ]) => k.includes('Modal'))
    const modalElement = [...allModals].find(modal => modal.dataset.modal === modalName)

    return modalElement
}

function toggleModalVisibility(modal) {

    const modalElement = getModal(modal)

    const modalVisibility = window.getComputedStyle(modalElement).display
    const newVisibility = modalVisibility === 'none' ? 'block' : 'none'

    modalElement.style.setProperty('display', newVisibility)
}

modalsBtns.forEach(modalBtn => modalBtn.addEventListener('click', () => toggleModalVisibility(modalBtn)))

function getBtnModalContext(modalBtn) {
    const modalContext = modalBtn.getAttribute('data-modal-context')
    return modalContext ? modalContext : 'creator'
}

function updateModalContext(modalBtn) {

    const modalQuestionManagement = document.querySelector('[data-modal="question-management"]')
    const modalContext = getBtnModalContext(modalBtn)
    modalQuestionManagement.setAttribute('data-management-context', modalContext)
}

function handleModalContexts() {
    allModalsOpenBtn.forEach(modalBtn => modalBtn.addEventListener('click', () => updateModalContext(modalBtn)))
}

function handleNewModalBtns() {

    const mutationsHandler = [
        { hasNewNodes: true, eventType: 'addEventListener', mutationProperty: 'addedNodes' },
        { hasNewNodes: false, eventType: 'removeEventListener', mutationProperty: 'removedNodes' }
    ]

    const observer = new MutationObserver(mutations => {

        if(mutations.length >= 2) {
            return
        }

        const mutation = mutations[0]

        const getMutationInfoCallback = ({ hasNewNodes }) => hasNewNodes === mutation.addedNodes.length >= 1
        const { eventType, mutationProperty } = mutationsHandler.find(getMutationInfoCallback)

        const openModalBtnContext = mutation[mutationProperty][0].querySelector('[data-open-modal]')

        if(!openModalBtnContext) {
            return
        }

        openModalBtnContext[eventType]('click', () => {
            toggleModalVisibility(openModalBtnContext)
            updateModalContext(openModalBtnContext)
        })
    })

    observer.observe(questionWrapper, {
        childList: true
    })
}

handleNewModalBtns()
handleModalContexts()