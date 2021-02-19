const addToCart = document.getElementById('add-to-cart')

addToCart.addEventListener('click', async () => {
    const token = localStorage.getItem('token')
    const url = window.location.href.replace('books', 'book/add')
    await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
        .then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error(res.status)
            }
        })
        .then(() => {
            const cartCount = document.querySelector('#cart span')
            const plusOne = parseInt(cartCount.innerHTML) + 1
            cartCount.innerHTML = plusOne
        })
        .catch((err) => {
            console.log(err)
            alert('please login/sign up first')
        })
})
