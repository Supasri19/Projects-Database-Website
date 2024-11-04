document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/Cookie'); // แก้ไข URL ตามความเหมาะสม
        const cookies = await response.json();

        const cookieItems = document.getElementById('cookieItems');

        cookies.forEach((cookie) => {
            cookieItems.innerHTML += `
            <div class="menu__item" data-id="${cookie.Cookie_id}">
            <img src="img/${cookie.Img}" class="menu__item-image" alt="${cookie.Cookie_name}">
            <div class="menu__item-content">
            <h3 class="menu__item-title">${cookie.Cookie_name}</h3>
            <p class="menu__item-description">${cookie.Description}</p>
            <div class="menu__item-footer">
            <span class="menu__item-price">${cookie.Price}฿</span>
            <button class="menu__item-add-to-cart">Add to Cart</button>
            </div></div></div>`
        });
    } catch (error) {
        console.error('Error fetching cookies:', error);
    }
});

