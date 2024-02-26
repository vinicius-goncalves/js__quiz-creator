import buildElement from '../utils/build-element.js'

const toasts = document.querySelector('[data-toast="container"]')

const SECONDS = 3
const SECONDS_TO_MILLISECONDS = SECONDS * 1000

function animateToastTimer(renderedToast) {

    const timer = renderedToast.querySelector('[data-toast="timer"]')
    const startDate = Date.now()

    const animate = () => {

        const currDate = Date.now()
        const dateDiff = (currDate - startDate) / SECONDS_TO_MILLISECONDS
        const diffToPercentage = (1 - dateDiff) * 100

        timer.style.setProperty('width', diffToPercentage + '%')

        if(diffToPercentage <= 0) {
            timer.style.setProperty('width', 0)
            renderedToast.remove()
            return
        }

        requestAnimationFrame(() => animate())
    }

    animate()
}

function renderToast(text) {

    const toastWrapper = buildElement('div')
        .addAttribute('data-toast', 'wrapper')
        .build()

    const toastContent = buildElement('div')
            .addAttribute('data-toast', 'content')
            .appendOn(toastWrapper)
            .build()

        buildElement('div')
            .addAttribute('data-toast', 'timer')
            .appendOn(toastContent)
            .build()

        buildElement('span')
            .addAttribute('data-toast', 'text')
            .setText(text)
            .appendOn(toastContent)
            .build()

    animateToastTimer(toastWrapper)

    return toastWrapper
}

function createToast(text) {

    const renderedToast = renderToast(text)
    toasts.appendChild(renderedToast)

    return renderedToast
}

export default createToast