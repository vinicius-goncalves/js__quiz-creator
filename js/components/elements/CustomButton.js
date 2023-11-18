const styleRef = '/js/components/styles/custom-button.css'

class CustomButton extends HTMLElement {
    constructor() {
        super()

        const self = this
        const shadowRoot = self.attachShadow({ mode: 'open' })

        const button = document.createElement('button')
        const text = self.getAttribute('text')

        button.type = 'button'
        button.textContent = text

        shadowRoot.appendChild(button)
    }

    connectedCallback() {

        const self = this
        const shadowRoot = self.shadowRoot

        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = styleRef

        shadowRoot.prepend(link)

    }
}

customElements.define('custom-button', CustomButton)

export { CustomButton }