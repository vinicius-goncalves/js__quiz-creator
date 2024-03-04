import buildElement from './build-element.js'

function buildIcon(icon) {

    return buildElement('i')
        .addClass('material-icons')
        .setText(icon)
}

export default buildIcon