document.querySelector('.menu').addEventListener('click', () => {
    document.querySelector(".menu-lii").classList.toggle("show");
})
document.querySelector('.menu-1').addEventListener('click', () => {
    document.querySelector(".second-nav").classList.toggle("second-width")
})
Array.from(document.querySelectorAll('.link')).forEach(item => {
    item.addEventListener('click', () => {
    document.querySelector(".menu-lii").classList.remove("show");
})
})
document.querySelector('#sub').addEventListener('submit', () => {
    document.querySelector('body').style.backgroundColor = 'black'
})