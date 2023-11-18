import { buildElement, buildIcon, randomID } from '../utils.js'
import { edit, remove } from './tools-manager.js'

const mainQuestions = document.querySelector('.questions-wrapper')
const popupsCreated = []

const popup = {

    getQuizId: function(event) {

        const targetClicked = event.target

        const quizContextId = targetClicked.matches('[data-quiz-context-id]')
            ? targetClicked
            : targetClicked.closest('[data-quiz-context-id]')

        const quizId = quizContextId.dataset.quizContextId

        return quizId
    },

    createEventsTo: function createEventsTo(popupContainer) {
        const wkMap = new WeakMap()
        wkMap.set(popupContainer, { edit, remove })
        return wkMap
    },

    createNew: function createNew(event) {

        const popupContainer = buildElement('div')
            .addAttribute('data-tools-popup', `container-${randomID()}`)
            .defineStyle({ left: `${event.pageX}px`, top: `${event.pageY}px` })
            .build()

        const wkMap = this.createEventsTo(popupContainer)

        const popupContent = buildElement('div')
            .addAttribute('data-tools-popup', 'content')
            .appendOn(popupContainer)
            .build()

        const toolsMenu = buildElement('menu')
            .addAttribute('data-tools-popup', 'tools')
            .appendOn(popupContent)
            .build()

        const toolsToCreate = [{ icon: 'edit', func: 'edit' }, { icon: 'delete', func: 'remove' }]
        const currQuizId = this.getQuizId(event)

        toolsToCreate.forEach(({ icon, func }) => {

            const toolContainer = buildElement('li')
                .addAttribute('data-tools-popup', 'tool')
                .appendOn(toolsMenu)
                .build()

            const button = buildElement('button')
                .setText(icon[0].toUpperCase() + icon.slice(1))
                .appendOn(toolContainer)
                .build()

            buildIcon(icon)
                .addClass('tool-icon')
                .prependOn(button)
                .build()

            const toolFunc = wkMap.get(popupContainer)[func]
            button.onclick = () => toolFunc(currQuizId)
        })

        popupsCreated.push(popupContainer)
        return popupContainer
    },

    render: function render(event) {

        const isToolsIcon = event.target.matches('.tools-icon')

        if(!isToolsIcon) {
            return
        }

        const newPopup = this.createNew(event)
        mainQuestions.append(newPopup)
    },

    deleteAll: function deleteAll() {
        popupsCreated.forEach(popup => popup.remove())
        popupsCreated.splice(0, popupsCreated.length)
    }
}

function handleWithPopups(event) {

    event.stopPropagation()

    popup.deleteAll()
    popup.render(event)
}

mainQuestions.addEventListener('click', handleWithPopups)

const deletePopupsWhen = ['resize', 'click']
deletePopupsWhen.forEach(evtName => window.addEventListener(evtName, popup.deleteAll))