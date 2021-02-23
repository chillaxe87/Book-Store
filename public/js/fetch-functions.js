// const fetchBooksByName = async (input) => {
//     const data = await fetch(`${location.origin}/book/find/?text=${input}`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//         .then((res) => {
//             if (res.ok) {
//                 return res.json()
//             } else {
//                 throw new Error(res.status)
//             }
//         })
//         .then((jsonObj) => {
//             return jsonObj
//         })
//         .catch((err) => {
//             console.log(err)
//         })
//     return data
// }
// const fetchNewUser = async (username, email, password) => {
//     const user = await fetch(`${location.origin}/users/new`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             username,
//             email,
//             password,
//         })
//     })
//         .then((res) => {
//             if (res.ok) {
//                 return res.json()
//             } else {
//                 throw new Error(res.status)
//             }
//         })
//         .catch((err) => {
//             console.log(err)
//         })
//     return user
// }
// const fetchLogin = async (type, email, password) => {
//     const user = await fetch(`${location.origin}/${type}/login`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             email,
//             password,
//         })
//     })
//         .then((res) => {
//             if (res.ok) {
//                 return res.json()
//             } else {
//                 throw new Error(res.status)
//             }
//         })
//         .catch((err) => {
//             alert('Wrong Credentials')
//             console.log(err)
//         })
//     return user
// }
// const fetchLogout = async (type) => {
//     token = localStorage.getItem('token')
//     const user = await fetch(`${location.origin}/${type}/logout`, {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     })
//         .then((res) => {
//             if (res.ok) {
//                 return res.json()
//             } else {
//                 throw new Error(res.status)
//             }
//         })
//         .catch((err) => {
//             console.log(err)
//         })
//     return user
// }
// const fetchBooks = async (skip) => {
//     const books = await fetch(`${location.origin}/book/all/?page=${skip}`, {
//         method: 'GET'
//     })
//         .then((res) => {
//             if (res.ok) {
//                 return res.json()
//             } else {
//                 throw new Error(res.status)
//             }
//         })
//         .catch((err) => {
//             console.log(err)
//         })
//     return books
// }
// const fetchUser = async (token) => {
//     const user = await fetch(`${location.origin}/users/me`, {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     })
//         .then((res) => {
//             if (res.ok) {
//                 return res.json()
//             }
//             else {
//                 throw new Error('not logged in')
//             }
//         })
//         .catch((err) => {
//             console.log(err)
//         })
//     return user
// }
// const fetchCart = async (token) => {
//     const cart = await fetch(`${location.origin}/users/cart`, {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     })
//         .then((res) => {
//             if (res.ok) {
//                 return res.json()
//             } else {
//                 throw new Error('No cart available')
//             }
//         })
//         .catch((err) => {
//             console.log(err)
//         })
//     return cart
// }
// const fetchBook = async (url) => {
//     console.log(url)
//     const book = await fetch(url)
//         .then((res) => {
//             if (res.ok) {
//                 return res.json()
//             } else {
//                 throw new Error(res.status)
//             }
//         })
//         .catch((err) => {
//             console.log(err)
//         })
//     console.log(book)
//     return book
// }

// module.exports = {
//     fetchBook,
//     fetchCart,
//     fetchUser,
//     fetchBooks,
//     fetchLogout,
//     fetchLogin,
//     fetchNewUser,
//     fetchBooksByName
// }