function clearTree(container) {

    if(!(container instanceof Element)) {
        throw new TypeError('The container argument must be an instance of DOM element.')
    }

    try {

        while(container.firstChild !== null) {
            container.removeChild(container.firstChild)
        }

    } catch(err) {
        console.log(err)
    }
}

export default clearTree