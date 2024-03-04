function randomID() {
    return Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER >>> 6)).toString(16)
}

export default randomID