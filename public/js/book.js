const mainLogo = document.getElementById("main-logo")
const bookSearch = document.getElementById("book-search")
const searchButton = document.getElementById("search-button")
const user = document.getElementById("user")
const login = document.getElementById("user-login")
const signup = document.getElementById("user-signup")
const cart = document.getElementById("cart")
const itemCount = document.querySelector('#cart span')
const books = document.querySelectorAll('#book')
const bookContainers = document.querySelectorAll('.book-container')

mainLogo.addEventListener('click', () => {
    window.location.href = "../index.html"
})
books.forEach(book => {
    book.addEventListener('click' , () => {
        window.location.href = './books/index.html'
    })
})

bookContainers[0].addEventListener('click', (event) =>{
    event.preventDefault()

    const data = fetch('')
})
