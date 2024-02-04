const allDataClose = document.querySelectorAll('[data-close]')

allDataClose.forEach(closeButton => {

    closeButton.addEventListener('click', () => {

        const wrapperToCloseName = closeButton.dataset.close
        const wrapperToCloseElement = document.querySelector(`[data-modal="${wrapperToCloseName}"]`)

        wrapperToCloseElement.style.setProperty('display', 'none')

    })
})