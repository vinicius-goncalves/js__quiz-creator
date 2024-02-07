//Code for testing purposes, not the final one

// const features = document.querySelector('[data-features="container"]')
// const timerBar = document.querySelector('.timer-bar')
// const timerSeconds = document.querySelector('.timer-seconds')

// const seconds = 3

// function updateTimerSeconds(seconds, position) {
//     timerSeconds.style.left = position + 'px'
//     timerSeconds.style.top = 10 + 'px'
//     timerSeconds.textContent = seconds + 's'
// }

// ;(() => {

//     const dateNow = Date.now()
//     const seconds = 3

//     const interval = setInterval(() => {

//         let currDate = Date.now()

//         const diff =  (currDate - dateNow) / (seconds * 1000)
//         const percentage = (1 - diff) * 100
//         const remainSeconds = (currDate - dateNow) / 1000

//         timerBar.style.setProperty('width', percentage + '%')

//         const rect = timerBar.getBoundingClientRect()

//         updateTimerSeconds((seconds - remainSeconds).toFixed(1), rect.width - (timerSeconds.offsetWidth * 2))

//         if(percentage <= 0) {
//             timerBar.style.setProperty('width', 0)
//             clearInterval(interval)
//         }

//         // console.log(-1 * percentage)
//         // timerBar.style.setProperty('width', percentage + '%')

//         // if(s >= 100) {
//         //     console.log('Finished')
//         //     clearInterval(interval)
//         //     const p2 = performance.now()

//         //     console.log((p2 - p))
//         // }

//     }, 100)

// })()