import { buildElement, buildIcon, randomID } from '../../../utils/_utils.js'
import { edit as editTool, remove as removeTool } from './tools.js'

const questionsWrapper = document.querySelector('.questions-wrapper')

const popupsCreated = []

const tools = [
    { icon: 'edit', funcContext: 'editTool', isModalTrigger: true, modalTarget: 'question-editor' },
    { icon: 'delete', funcContext: 'removeTool', isModalTrigger: false }
]

function deletePopups() {

    for(const popup of popupsCreated) {
        popup.remove()
    }

    popupsCreated.length = 0
}

function handleElementMatch(target, shouldMatch) {

    if(!target) {
        return
    }

    const matchedElement = !target.matches(shouldMatch)
        ? target.closest(shouldMatch)
        : target

    return matchedElement
}

function getQuizID(event) {

    const target = event.target

    if(!target) {
        return
    }

    const matchedElement = handleElementMatch(target, '[data-quiz-context-id]')

    if(!matchedElement) {
        return
    }

    const { quizContextId } = matchedElement.dataset

    return quizContextId
}

function createToolsPopupContext(popupContainer) {

    const wkMap = new WeakMap()
    wkMap.set(popupContainer, { editTool, removeTool })

    return wkMap
}

function renderPopupTools(event) {

    const popupContainer = buildElement('div')
        .addAttribute('data-tools-popup', `container-${randomID()}`)
        .defineStyle({ left: `${event.pageX}px`, top: `${event.pageY}px` })
        .build()

    const popupToolsContext = createToolsPopupContext(popupContainer)

    const popupContent = buildElement('div')
        .addAttribute('data-tools-popup', 'content')
        .setEvent('mouseleave', deletePopups)
        .appendOn(popupContainer)
        .build()

    const toolsMenu = buildElement('menu')
        .addAttribute('data-tools-popup', 'tools')
        .appendOn(popupContent)
        .build()

    for(const { icon, funcContext, isModalTrigger, modalTarget } of tools) {

        const toolContainer = buildElement('li')
            .addAttribute('data-tools-popup', 'tool')
            .appendOn(toolsMenu)
            .build()

        const capitalizedIconName = icon[0].toUpperCase() + icon.slice(1)

        const button = buildElement('button')
            .setText(capitalizedIconName)
            .appendOn(toolContainer)
            .build()

        buildIcon(icon)
            .addClass('tool-icon')
            .prependOn(button)
            .build()


        if(isModalTrigger) {
            toolContainer.setAttribute('data-open-modal', modalTarget)
        }

        const toolsContext = popupToolsContext.get(popupContainer)
        const toolContext = toolsContext[funcContext]

        button.onclick = () => toolContext(getQuizID(event))
    }

    popupsCreated.push(popupContainer)
    return popupContainer
}

function showToolsPopup(event) {

    deletePopups()

    const target = event.target
    const matchesToolsIcon = target.matches('.tools-icon')

    if(!matchesToolsIcon) {
        return
    }

    const newPopup = renderPopupTools(event)
    questionsWrapper.append(newPopup)
}

questionsWrapper.addEventListener('click', (event) => {
    event.stopPropagation()
    showToolsPopup(event)
})

;(() => {

    const deletePopupEvents = ['resize', 'click']

    for(const event of deletePopupEvents) {
        document.addEventListener(event, deletePopups)
    }

})();

export default deletePopups