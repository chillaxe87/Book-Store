const removeFromCart = async (book_id) => {
    const token = localStorage.getItem('token')
    const url = window.location.href.replace('cart', 'user/cart')
    await fetch(`${url}?_id=${book_id}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then((res) => {
        if (res.ok) {
            location.reload()
            return res.json()
        } else {
            throw new Error ('Book not found')
        }
    })
    .catch((err) => {
        console.log(err)
    })
}

const checkout = document.getElementById('checkout')
checkout.addEventListener('click', async (event) => {
    event.preventDefault()
    const token = localStorage.getItem('token')
    const url = window.location.href.replace('cart', 'user/cart/all')
    await fetch(`${url}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then((res) => {
        if (res.ok) {
            purchaseAlert()
            return res.json()
        } else {
            throw new Error ('Book not found')
        }
    })
    .catch((err) => {
        console.log(err)
    })
})

const backdrop = document.querySelector('.backdrop')
const purchaseDiv = document.getElementById("purchase-Div")
const purchaseAlert = () => {
    backdrop.classList.add('open')
    purchaseDiv.classList.remove('hidden')
}
const reloadPage = () => {
    location.reload();
}



