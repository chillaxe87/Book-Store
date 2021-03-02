const addBookButton = document.getElementById("show-add-book")
const addBookForm = document.getElementById("add-book")
const adminSearch = document.getElementById("admin-search")
const editBookButton = document.getElementById("show-edit-book")
const bookEdit = document.getElementById("book-edit")

// Switching between add book view and edit view 

addBookButton.addEventListener('click', (event) => {
    event.preventDefault()
    addBookForm.classList.remove("close")
    adminSearch.classList.add("close")
    bookEdit.classList.add("close")
})

editBookButton.addEventListener('click', (event) => {
    event.preventDefault()
    addBookForm.classList.add("close")
    adminSearch.classList.remove("close")
    bookEdit.classList.remove("close")
})
// Admin Login 
const adminUsername = document.getElementById("admin-name")
const adminPassword = document.getElementById("admin-password")
const adminLoginForm = document.getElementById("admin-login")
const adminLogout = document.getElementById("admin-logout")

adminLogout.addEventListener('click', async () => {
    event.preventDefault()
    const token = localStorage.getItem('atoken')
    await fetch(`${location.origin}/admin/logout`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then((res) => {
            if (res.ok) {
                window.location.href = `${location.origin}/admin`
            }
            return res.json()
        })
        .catch((err) => {
            console.log(err)
        })
})
adminLoginForm.addEventListener('click', async (event) => {
    event.preventDefault()
    const email = adminUsername.value
    const password = adminPassword.value

    const admin = await fetchAdmin('admin', email, password)
    if (admin) {
        localStorage.setItem('atoken', admin.token)
        adminLoginForm.classList.add('hidden')
        adminUsername.classList.add('hidden')
        adminPassword.classList.add('hidden')
        adminLogout.classList.remove('hidden')
    }
})

const fetchAdmin = async (type, email, password) => {
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
// Add Book 

const uploadBook = document.getElementById('upload-book')
const addBookName = document.querySelector('.add-book_name')
const addBookAuthor = document.querySelector('.add-book_author')
const addBookPrice = document.querySelector('.add-book_price')
const addBookPages = document.querySelector('.add-book_pages')
const addBookDescription = document.querySelector('.add-book_description')
const addAvatarUrl = document.querySelector(".add-book_avatar")

const fetchNewBook = async (name, author, price, pages, description, token) => {
    const book = await fetch(`${location.origin}/book/new`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name,
            author,
            price,
            description,
            pages,
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
    return book
}
const addBookAvatar = async (id, avatar, token) => {
    await fetch(`${location.origin}/books/avatar/${id}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: avatar
    })
        .then((res) => {
            if (res.ok) {
                return true
            } else {
                throw new Error(res.status)
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

uploadBook.addEventListener('click', async (event) => {
    event.preventDefault()
    const name = addBookName.value
    const author = addBookAuthor.value
    const price = addBookPrice.value
    const pages = addBookPages.value
    const description = addBookDescription.value
    const avatar = addAvatarUrl.files[0]
    const token = localStorage.getItem('atoken')

    const book = await fetchNewBook(name, author, price, pages, description, token)
    if (book) {
        if(avatar){
            const formData = new FormData()
            formData.append('avatar', avatar )      
            await addBookAvatar(book._id, formData, token)
        }
        alert(`${book.name.toString()} Added to the store`)
    }
})

// Edit Book 
const adminSearchInput = document.getElementById('admin-search-input')
const editName = document.getElementById('edit-name')
const editAuthor = document.getElementById('edit-author')
const editPrice = document.getElementById('edit-price')
const editPages = document.getElementById('edit-pages')
const editDescription = document.getElementById("edit-description")
const avatar = document.getElementById("edit-avatar")
const editAvatar = document.querySelector(".edit-book_avatar")

const editButton = document.querySelector('.admin-edit')
const fetchEditBook = async (name, author, price, pages, description, token) => {
    const id = localStorage.getItem('id')
    const book = await fetch(`${location.origin}/book/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name,
            author,
            price,
            description,
            pages,
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
    return book
}
editButton.addEventListener('click', async (event) => {
    event.preventDefault()
    const name = editName.value
    const author = editAuthor.value
    const price = editPrice.value
    const pages = editPages.value
    const description = editDescription.value
    const token = localStorage.getItem('atoken')
    const avatar = editAvatar.files[0]
    const book = await fetchEditBook(name, author, price, pages, description, token)
    if(avatar){
        const formData = new FormData()
        formData.append('avatar', avatar )      
        await addBookAvatar(book._id, formData, token)
    }
    if (book) {
        alert(book.name.toString() + ` has been updated`)
    }
})

const deleteButton = document.querySelector('.admin-delete')
deleteButton.addEventListener('click', async (event) => {
    const token = localStorage.getItem('atoken')
    const id = localStorage.getItem('id')
    console.log(id)
    event.preventDefault()
    await fetch(`${location.origin}/book/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
        .then((res) => {
            if (res.ok) {
                alert("Deleted")
            } else {
                throw new Error('Not deleted')
            }
        })
        .catch((err) => {
            console.log(err)
        })
})
const searchBook = document.getElementById('search-book')
searchBook.addEventListener('click', async () => {
    let input = adminSearchInput.value;
    if (input.length >= 2) {
        const book = await fetchBooksByName(input)
        if (book.length > 0) {
            localStorage.setItem('id', book[0]._id)
        }
        bookEdit.classList.remove("close")
        renderEditBook(book)
    }
})
const renderEditBook = (thisBook ,single) => {
    const book = single? thisBook: thisBook[0]
    if (book.length > 0 || single) {
        editName.value = book.name
        editAuthor.value = book.author
        editPrice.value = book.price
        editPages.value = book.pages
        editDescription.value = book.description
        avatar.src = book.avatar ? `${location.origin}/books/avatar/${book._id}` : " ../img/noBook.png"
    } else {
        editName.value = ""
        editAuthor.value = ""
        editPrice.value = ""
        editPages.value = ""
        editDescription.value = ""
    }

}

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

const getAdmin = async () => {
    const token = localStorage.getItem('atoken')
    const admin = await fetchLoggedAdmin(token)
    if (admin) {
        adminLoginForm.classList.add('hidden')
        adminUsername.classList.add('hidden')
        adminPassword.classList.add('hidden')
        adminLogout.classList.remove('hidden')
    }
}
const fetchLoggedAdmin = async (token) => {
    const user = await fetch(`${location.origin}/admin/me`, {
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
// render books for main page
let page = 0
const bookListContainer = document.querySelector('.main-list')
const renderBooksMain = async () => {
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
    bookListContainer.appendChild(container)
    container.appendChild(book)
    book.appendChild(img)
    book.appendChild(title)
    book.appendChild(author)
    book.appendChild(price)
    book.addEventListener('click', () => {
        bookEdit.classList.remove("close")
        renderEditBook(el, true)
    })
}
back.addEventListener('click', event => {
    event.preventDefault()
    page = page === 0 ? 0 : page - 1
    while (bookListContainer.children.length > 0) {
        bookListContainer.removeChild(bookListContainer.lastChild)
    }
    renderBooksMain(page)
})
next.addEventListener('click', event => {
    event.preventDefault()
    page = bookListContainer.children.length < 12 ? page : page + 1
    while (bookListContainer.children.length > 0) {
        bookListContainer.removeChild(bookListContainer.lastChild)
    }
    renderBooksMain(page)
})
getAdmin()