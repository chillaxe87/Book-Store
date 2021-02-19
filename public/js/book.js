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
    if(searchbar){
        blur.style.background = 'transparent'
    }
}
const backgroundRemoveBlur = () => {
    // document.querySelector(".backdrop").classList.remove('open')
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
    backgroundRemoveBlur()
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
    page = mainContainer.children.length <= 10 ? page : page + 1
    while (mainContainer.children.length > 1) {
        mainContainer.removeChild(mainContainer.lastChild)
    }
    renderBooksMain(page)
})

// search Bar 
bookSearch.addEventListener('keyup', async () => {
    let input = bookSearch.value;
    if (input.length >= 3) {
        await fetch(`http://localhost:3000/book/find/?text=${input}`)
        .then((res) => {
            if(res.ok){
                return res.json()
            } else {
                throw new Error(res.status)
            }
        })
        .then((jsonObj) => {
            if(jsonObj.length > 0){
                backgroundBlur(true)
                searchButton.style.zIndex = 300
                renderSearchList(jsonObj)
            }
            return jsonObj
        })
        .catch((err) => {
            console.log(err)
        })
    } else {
        searchList.className = 'hidden'
    }
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
            window.location.href = `./books/?_id=${book._id}&name=${book.name}`
        })
        searchList.appendChild(li)
    })
}
searchButton.addEventListener('click', async (event)=> {
    event.preventDefault()
    let input = bookSearch.value;
    backgroundRemoveBlur()

    if (input.length >= 3) {
        await fetch(`http://localhost:3000/book/find/?text=${input}`)
        .then((res) => {
            if(res.ok){
                return res.json()
            } else {
                throw new Error(res.status)
            }
        })
        .then((jsonObj) => {
            if(jsonObj.length > 0){
                while (mainContainer.children.length > 1) {
                    mainContainer.removeChild(mainContainer.lastChild)
                }
                jsonObj.forEach(book => createBookDiv(book))
            }
            return jsonObj
        })
        .catch((err) => {
            console.log(err)
        })
    } else {
        searchList.className = 'hidden'
    }

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
            alert('Wrong Credentials')
            console.log(err)
        })

    location.reload();
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
                alert("logout successfully")
                loggedOutMode()
            } else {
                throw new Error(res.status)
            }
        })
        .catch((err) => {
            console.log(err)
        })
    window.location.href = "../"


}
// Get all books 
const renderBooksMain = async () => {
    const token = localStorage.getItem('token')
    if (token != undefined) {
        getUser(token)
    }
    const skip = page * 10
    await fetch(`http://localhost:3000/book/all/?page=${skip}`, {
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
            return jsonObj
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
            return jsonObj
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


// cart page render 
const renderCart = async () => {
    const token = localStorage.getItem('token')

    if (token != undefined) {
        getUser(token)
    }
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
                throw new Error('Error loading cart')
            }
        })
        .then((jsonObj) => {
            let price = 0;
            jsonObj.forEach(el => {
                renderCartBook(el)
                price += el.price
            })
            document.getElementById("total").innerHTML = `Total: ${price}$`
        })
        .catch((err) => {
            console.log(err)
        })

}

const cartDiv = document.getElementById("main-container")
const renderCartBook = (el) => {
    const container = document.createElement('div')
    container.className = "book-container"
    const bookContainer = document.createElement('div')
    bookContainer.className = "book-container__inner"
    const img = document.createElement('img')
    img.src = "../img/noBook.png"
    const info = document.createElement('div')
    info.className = "info"
    const title = document.createElement('h2')
    title.className = "title"
    title.innerHTML = el.name
    title.addEventListener('click', () => {
        const url = window.location.href.replace('cart', 'books')
        window.location.href = `${url}?_id=${el._id}&name=${el.name}`
    })
    const author = document.createElement('h2')
    author.className = "author"
    author.innerHTML = el.author
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





