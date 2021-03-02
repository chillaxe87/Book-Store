const mainLogo = document.getElementById("main-logo")
const bookSearch = document.getElementById("book-search")
const searchButton = document.getElementById("search-button")
const user = document.getElementById("user")
const signup = document.getElementById("user-signup")
const cart = document.getElementById("cart")
const itemCount = document.querySelector('#cart span')
const mainContainer = document.querySelector('.books-container')
const blur = document.querySelector('.backdrop')
const back = document.getElementById('back')
const next = document.getElementById('next')

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
const backgroundBlur = (searchbar = false) => {
    blur.classList.add('open')
    if (searchbar) {
        blur.style.background = 'transparent'
    }
}
const backgroundRemoveBlur = () => {
    document.getElementById("login").classList.add("hidden")
    document.getElementById("new-user").classList.add("hidden")
    blur.classList = "backdrop"
    searchList.className = 'hidden'
    searchButton.style.zIndex = 0
    bookSearch.value = ""
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
    if(window.location.pathname !== "/cart/"){
        backgroundRemoveBlur()
    }
})

// Navigation 
mainLogo.addEventListener('click', () => {
    window.location.href = "../"
})
cart.addEventListener('click', () => {
    window.location.href = "../cart"
})
let page = 0;
back.addEventListener('click', event => {
    event.preventDefault()
    page = page === 0 ? 0 : page - 1
    while (mainContainer.children.length > 1) {
        mainContainer.removeChild(mainContainer.lastChild)
    }
    renderBooksMain(page)
})
next.addEventListener('click', event => {
    event.preventDefault()
    page = mainContainer.children.length <= 12 ? page : page + 1
    while (mainContainer.children.length > 1) {
        mainContainer.removeChild(mainContainer.lastChild)
    }
    renderBooksMain(page)
})

// Fetch books by name
const fetchBooksByName = async (input) => {
    const data = await fetch(`${location.origin}/book/find/?text=${input}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error(res.status)
            }
        })
        .catch((err) => {
            console.log(err)
        })
    return data
}

// Search bar 
let timeout = null
bookSearch.addEventListener('keyup', () => {
    clearTimeout(timeout);
    timeout = setTimeout( async () =>{
        let input = bookSearch.value;
        if (input.length >= 2) {
            const books = await fetchBooksByName(input)
            if (books) {
                backgroundBlur(true)
                searchButton.style.zIndex = 300
                renderSearchList(books)
            }
        } else {
            searchList.className = 'hidden'
        }
    }, 1000)
})

// render search list according to input
const searchList = document.getElementById("search-list")
const renderSearchList = (books) => {
    while (searchList.children.length > 0) {
        searchList.removeChild(searchList.lastChild)
    }
    searchList.classList.remove('hidden')
    books.forEach(book => {
        const li = document.createElement('li')
        li.innerHTML = book.name
        li.addEventListener('click', () => {
            window.location.href = `${location.origin}/books/?_id=${book._id}&name=${book.name}`
        })
        searchList.appendChild(li)
    })
}

searchButton.addEventListener('click', async (event) => {
    event.preventDefault()
    let input = bookSearch.value;
    backgroundRemoveBlur()
    if (input.length >= 3) {
        const books = await fetchBooksByName(input)
        if (books) {
            while (mainContainer.children.length > 1) {
                mainContainer.removeChild(mainContainer.lastChild)
            }
            books.forEach(book => createBookDiv(book))
        } else {
            searchList.className = 'hidden'
        }
    }
})

// create new user
const newUser = document.getElementById('new-user__form')

newUser.addEventListener('submit', async (event) => {
    event.preventDefault()
    const username = document.querySelector('#new-user__form').children[0].value
    const email = document.querySelector('#new-user__form').children[1].value
    const password = document.querySelector('#new-user__form').children[2].value
    const user = await fetchNewUser(username, email, password)
    if (user) {
        backgroundRemoveBlur()
        localStorage.setItem('token', user.token);
        loggedInMode(user.user.username)
    } else {
        alert("Please make sure you inserted your credentials correctly, password must be 8 characters long")
    }
})
const fetchNewUser = async (username, email, password) => {
    const user = await fetch(`${location.origin}/users/new`, {
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
        .catch((err) => {
            console.log(err)
        })
    return user
}

// Login user
const login = document.getElementById('login-form')
login.addEventListener('submit', async (event) => {
    event.preventDefault()
    const email = document.querySelector('#login-form').children[0].value
    const password = document.querySelector('#login-form').children[1].value
    const user = await fetchLogin('users', email, password)
    if (user) {
        backgroundRemoveBlur()
        localStorage.setItem('token', user.token);
        getUserCart(user.token)
        loggedInMode(user.user.username)
    }
    location.reload();
})
const fetchLogin = async (type, email, password) => {
    const user = await fetch(`${location.origin}/${type}/login`, {
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
        .catch((err) => {
            alert('Wrong Credentials')
            console.log(err)
        })
    return user
}
// Logout user

const fetchLogout = async (type) => {
    token = localStorage.getItem('token')
    const user = await fetch(`${location.origin}/${type}/logout`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error(res.status)
            }
        })
        .catch((err) => {
            console.log(err)
        })
    return user
}
const logout = async () => {
    const user = await fetchLogout('users')
    if (user) {
        localStorage.removeItem('token')
        alert("logout successfully")
        loggedOutMode()
    }
    window.location.href = location.origin
}
// Get all books 
const renderBooksMain = async () => {
    const token = localStorage.getItem('token')
    if (token != undefined) {
        getUser(token)
    }
    const skip = page * 12
    const books = await fetchBooks(skip)
    if (books) {
        books.forEach(book => createBookDiv(book))
    }
}

const fetchBooks = async (skip) => {
    const books = await fetch(`${location.origin}/book/all/?page=${skip}`, {
        method: 'GET'
    })
        .then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error(res.status)
            }
        })
        .catch((err) => {
            console.log(err)
        })
    return books
}
// get user
const getUser = async (token) => {
    const user = await fetchUser(token)
    if (user) {
        getUserCart(token)
        loggedInMode(user.username)
    }
}
const fetchUser = async (token) => {
    const user = await fetch(`${location.origin}/users/me`, {
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
        .catch((err) => {
            console.log(err)
        })
    return user
}
// Get users books
const getUserCart = async (token) => {
    const cart = await fetchCart(token)
    if (cart) {
        document.querySelector('#cart span').innerHTML = cart.length
    }

}
const fetchCart = async (token) => {
    const cart = await fetch(`${location.origin}/users/cart`, {
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
        .catch((err) => {
            console.log(err)
        })
    return cart
}

// book page getting info
const renderBook = async () => {
    const token = localStorage.getItem('token')
    if (token != undefined) {
        getUser(token)
    }
    const url = window.location.href.replace('books', 'book/get')
    const book = await fetchBook(url)
    if (book) {
        updatePage(book)
    }
}
const fetchBook = async (url) => {
    console.log(url)
    const book = await fetch(url)
        .then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error(res.status)
            }
        })
        .catch((err) => {
            console.log(err)
        })
    console.log(book)
    return book
}
// main page book render
const createBookDiv = (el) => {
    const container = document.createElement('div')
    container.className = "book-container"
    const book = document.createElement('div')
    book.className = "book"
    const img = document.createElement('img')
    if (!el.avatar) {
        img.src = "../img/noBook.png"
    } else {
        img.src = `${location.origin}/books/avatar/${el._id}`
    }

    const title = document.createElement('span')
    title.className = 'title'
    title.innerHTML = el.name
    const author = document.createElement('span')
    author.className = 'author'
    author.innerHTML = `By: ${el.author}`
    const price = document.createElement('span')
    price.className = 'price'
    price.innerHTML = `${el.price} $`
    mainContainer.appendChild(container)
    container.appendChild(book)
    book.appendChild(img)
    book.appendChild(title)
    book.appendChild(author)
    book.appendChild(price)
    book.addEventListener('click', () => {
        window.location.href = `${location.origin}/books/?_id=${el._id}&name=${el.name}`
    })
}

// update UI book page
const updatePage = (book) => {
    document.querySelector('h2').innerHTML = book.name
    document.querySelector('h3').innerHTML = "by: " + book.author
    document.querySelector('p').innerHTML = book.description
    document.querySelector('.book-container img').src = !book.avatar? "../img/noBook.png" : `${location.origin}/books/avatar/${book._id}`
    document.getElementById('book-price').innerHTML = book.price + "$"
}


// cart page render 
const renderCart = async () => {
    const token = localStorage.getItem('token')
    if (token != undefined) {
        getUser(token)
    }
    const cart = await fetchCart(token)
    if (cart) {
        let price = 0;
        cart.forEach(el => {
            renderCartBook(el)
            price += el.price
        })
        document.getElementById("total").innerHTML = `Total: ${price}$`
    }
}

const cartDiv = document.getElementById("main-container")
const renderCartBook = (el) => {
    const container = document.createElement('div')
    container.className = "book-container"
    const bookContainer = document.createElement('div')
    bookContainer.className = "book-container__inner"
    const img = document.createElement('img')
    img.src = !el.avatar? "../img/noBook.png" : `${location.origin}/books/avatar/${el._id}`
    const info = document.createElement('div')
    info.className = "info"
    const title = document.createElement('h2')
    title.className = "title"
    title.innerHTML = el.name
    title.addEventListener('click', () => {
        window.location.href = `${location.origin}/books?_id=${el._id}&name=${el.name}`
    })
    const author = document.createElement('h2')
    author.className = "author"
    author.innerHTML = ` by: ${el.author}`
    const span = document.createElement('span')
    span.innerHTML = "Remove"
    span.addEventListener('click', (event) => {
        event.preventDefault()
        removeFromCart(el._id)
    })

    cartDiv.appendChild(container)
    container.appendChild(bookContainer)
    bookContainer.appendChild(img)
    bookContainer.appendChild(info)
    info.appendChild(title)
    info.appendChild(author)
    info.appendChild(span)

    const priceDiv = document.createElement('div')
    priceDiv.className = "price"
    const price = document.createElement('h2')
    price.className = "price"
    price.innerHTML = el.price + "$"
    container.appendChild(priceDiv)
    priceDiv.appendChild(price)
}





