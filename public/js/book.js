const mainLogo = document.getElementById("main-logo")
const bookSearch = document.getElementById("book-search")
const searchButton = document.getElementById("search-button")
const user = document.getElementById("user")
const signup = document.getElementById("user-signup")
const cart = document.getElementById("cart")
const itemCount = document.querySelector('#cart span')
const bookContainers = document.querySelectorAll('.book-container')
const mainContainer = document.querySelector('.books-container')
const blur = document.querySelector('.backdrop')

// main page UI
const loginForm = () => {
    backgroundBlur()
    document.getElementById("login").classList.remove("hidden")
    document.getElementById("new-user").classList.add("hidden")
}
const signUpForm = () => {
    backgroundBlur()
    document.getElementById("new-user").classList.remove("hidden")
    document.getElementById("login").classList.add("hidden")
}
const backgroundBlur = () => {
    document.querySelector(".backdrop").classList.add('open') 
}
const backgroundRemoveBlur = () => {
    document.querySelector(".backdrop").classList.remove('open')
    document.getElementById("login").classList.add("hidden")
    document.getElementById("new-user").classList.add("hidden")
}

const loggedInMode = (name) => {
    document.getElementById('user-logout').classList.remove('hidden')
    document.getElementById('user-login').classList.add('hidden')
    document.getElementById('user-signup').classList.add('hidden')
    document.getElementById('user').innerHTML = `Welcome ${name}`
}
const loggedOutMode = (name = 'Guest') => {
    document.getElementById('user-logout').classList.add('hidden')
    document.getElementById('user-login').classList.remove('hidden')
    document.getElementById('user-signup').classList.remove('hidden')
    document.getElementById('user').innerHTML = `Welcome ${name}`
    document.querySelector('#cart span').innerHTML = 0
}
blur.addEventListener('click', () => {
    backgroundRemoveBlur()
})

// Navigation 
mainLogo.addEventListener('click', () => {
    window.location.href = "../"
})


// create new user
const newUser = document.getElementById('new-user__form')
newUser.addEventListener('submit', async (event) => {
    event.preventDefault()
    const username = document.querySelector('#new-user__form').children[0].value
    const email = document.querySelector('#new-user__form').children[1].value
    const password = document.querySelector('#new-user__form').children[2].value
    await fetch('http://localhost:3000/users/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            email,
            password,
        })
    })
        .then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error(res.status)
            }
        })
        .then((jsonObj) => {
            backgroundRemoveBlur()
            localStorage.setItem('token', jsonObj.token);
            loggedInMode(jsonObj.user.username)
        })
        .catch((err) => {
            console.log(err)
        })
})

// Login user
const login = document.getElementById('login-form')
login.addEventListener('submit', async (event) => {
    event.preventDefault()
    const email = document.querySelector('#login-form').children[0].value
    const password = document.querySelector('#login-form').children[1].value
    await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password,
        })
    })
        .then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error(res.status)
            }
        })
        .then((jsonObj) => {
            backgroundRemoveBlur()
            localStorage.setItem('token', jsonObj.token);
            getUserCart(jsonObj.token)
            loggedInMode(jsonObj.user.username)
        })
        .catch((err) => {
            console.log(err)
        })
})

// Logout user
const logout = async () => {
    token = localStorage.getItem('token')
    await fetch('http://localhost:3000/users/logout', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then((res) => {
            if (res.ok) {
                localStorage.removeItem('token')
                loggedOutMode()
            } else {
                throw new Error(res.status)
            }
        })
        .catch((err) => {
            console.log(err)
        })


}
// Get all books 
const renderBooksMain = async () => {
    const token = localStorage.getItem('token')
    if (token != undefined) {
        getUser(token)
    }
    await fetch('http://localhost:3000/book/all', {
        method: 'GET'
    })
        .then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error(res.status)
            }
        })
        .then((jsonObj) => {
            jsonObj.forEach(el => createBookDiv(el))
        })
        .catch((err) => {
            console.log(err)
        })
}
// get user
const getUser = async (token) => {
    console.log(`Bearer ${token}`)
    await fetch('http://localhost:3000/users/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then((res) => {
            if (res.ok) {
                return res.json()
            }
            else {
                throw new Error('not logged in')
            }
        })
        .then((jsonObj) => {
            getUserCart(token)
            loggedInMode(jsonObj.username)
        })
        .catch((err) => {
            console.log(err)
        })
}

// Get users books
const getUserCart = async (token) => {
    await fetch('http://localhost:3000/users/cart', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error('No cart available')
            }
        })
        .then((jsonObj) => {
            document.querySelector('#cart span').innerHTML = jsonObj.length
        })
        .catch((err) => {
            console.log(err)
        })
}
// book page getting info
const renderBook = async () => {
    const token = localStorage.getItem('token')
    if (token != undefined) {
        getUser(token)
    }
    const url = window.location.href.replace('books', 'book/get')
    await fetch(url)
        .then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error(res.status)
            }
        })
        .then((jsonObj) => {
            updatePage(jsonObj)
        })
        .catch((err) => {
            console.log(err)
        })
}
// main page book render
const createBookDiv = (el) => {
    const container = document.createElement('div')
    container.className = "book-container"
    const book = document.createElement('div')
    book.className = "book"
    const img = document.createElement('img')
    img.src = "../img/noBook.png"
    const title = document.createElement('span')
    title.className = 'title'
    title.innerHTML = el.name
    const author = document.createElement('span')
    author.className = 'author'
    author.innerHTML = el.author
    const price = document.createElement('span')
    price.className = 'price'
    price.innerHTML = el.price
    mainContainer.appendChild(container)
    container.appendChild(book)
    book.appendChild(img)
    book.appendChild(title)
    book.appendChild(author)
    book.appendChild(price)
    book.addEventListener('click', () => {
        window.location.href = `./books/?_id=${el._id}&name=${el.name}`
    })
}

// update UI book page
const updatePage = (book) => {
    document.querySelector('h2').innerHTML = book.name
    document.querySelector('h3').innerHTML = "by: " + book.author
    document.querySelector('p').innerHTML = book.description
    document.querySelector('.book-container img').src = book.avatar === undefined ? "../img/noBook.png" : book.avatar
    document.getElementById('book-price').innerHTML = book.price + "$"
}


module.exports = getUserCart


