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

;(() => {

    const mutationChangesTypes = [
        { hasNewNodes: true, eventType: 'addEventListener', mutationProperty: 'addedNodes' },
        { hasNewNodes: false, eventType: 'removeEventListener', mutationProperty: 'removedNodes' }
    ]

    const observer = new MutationObserver(mutations => {

        if(mutations.length >= 2) {
            return
        }

        const mutation = mutations[0]

        const getMutationInfo = ({ hasNewNodes }) => hasNewNodes === mutation.addedNodes.length >= 1
        const { eventType, mutationProperty } = mutationChangesTypes.find(getMutationInfo)

        const openModalBtnContext = mutation[mutationProperty][0].querySelector('[data-open-modal]')

        if(!openModalBtnContext) {
            return
        }

        openModalBtnContext[eventType]('click', () => toggleModalVisibility(openModalBtnContext))
    })

    observer.observe(questionWrapper, {
        childList: true
    })

})()