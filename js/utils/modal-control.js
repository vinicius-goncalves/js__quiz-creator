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

    console.log(modalElement)

    modalElement.style.setProperty('display', newVisibility)
}

modalsBtns.forEach(modalBtn => modalBtn.addEventListener('click', () => toggleModalVisibility(modalBtn)))