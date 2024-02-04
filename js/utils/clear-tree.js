function clearTree(container) {

    if(!(container instanceof Element)) {
        throw new TypeError('The container (arg0) must be an instance of DOM element.')
    }

    try {
        while(container.firstChild) {
            container.removeChild(container.firstChild)
        }
    } catch(err) {
        console.log(err)
    }
}

export default clearTree