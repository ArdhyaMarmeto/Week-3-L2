
const API_KEY = 'ml3IcyswtevACPjeoE94GGXBWYVbtBmg88s6GaeLBxjkmWYl0K5X6FKC';
const API_URL = 'https://api.pexels.com/v1/search?query=';

// Fetch data from Pexels API
async function fetchImages(query) {
    const response = await fetch(`${API_URL}${query}`, {
        headers: {
            Authorization: `Bearer ${API_KEY}` // Updated to use 'Bearer' for the Authorization header
        }
    });

    const data = await response.json();
    return data.photos;
}

function performSearch() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    const similarResults = document.getElementById('similar-results');
    similarResults.innerHTML = ''; // Clear previous results
    let foundResults = false;

    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'splide';
    sliderContainer.innerHTML = `
        <div class="splide__track">
            <ul class="splide__list"></ul>
        </div>
    `;

    const sliderList = sliderContainer.querySelector('.splide__list');

    const photographerDetailsDiv = document.querySelector('.photographer-details');

    // Fetch images from the API and display them
    fetchImages(query).then(images => {
        images.forEach(image => {
            const resultItem = `
                <li class="splide__slide">
                    <div class="result-item">
                        <i class="heart-icon">&#9829;</i> <!-- Heart icon -->
                        <img src="${image.src.medium}" alt="${image.alt}">
                        <h4>${image.alt}</h4>
                        <h6>${image.photographer}</h6>
                    </div>
                </li>
            `;
            sliderList.innerHTML += resultItem;

            // Populate photographer details
            const photographerDetailsInnerHTML = `
                <div class="photographer-info">
                    <img src="${image.photographer_url}" alt="${image.photographer}" class="photographer-image">
                </div>
                <div class="photographer-name">
                    <h6>${image.photographer}</h6>
                    <button class="explore-more-btn" onclick="window.open('${image.photographer_url}', '_blank')">
                        Explore More
                    </button>
                </div>
            `;
            photographerDetailsDiv.innerHTML = photographerDetailsInnerHTML;

            foundResults = true;
        });

        if (foundResults) {
            similarResults.appendChild(sliderContainer);

            new Splide('.splide', {
                type: 'loop',
                perPage: 5,
                autoplay: false,
                pagination: false,
                arrows: true,
            }).mount();

            addFavoriteFunctionality(); // Initialize heart icon functionality
        } else {
            similarResults.innerHTML = '<p>No results found. Please try a different search term.</p>';
        }
    }).catch(error => {
        console.error('Error fetching images:', error);
        similarResults.innerHTML = '<p>There was an error fetching images. Please try again later.</p>';
    });
}

document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

function addFavoriteFunctionality() {
    const heartIcons = document.querySelectorAll('.heart-icon');
    const favoritesSection = document.getElementById('favorite-results');

    // Load favorites from localStorage
    const loadFavorites = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites.forEach(favorite => {
            const item = document.createElement('div');
            item.classList.add('result-item');
            item.innerHTML = `
                <img src="${favorite.img}" alt="${favorite.title}">
                <h4>${favorite.title}</h4>
                <h6>${favorite.photographer}</h6>
                <i class="heart-icon favorited">&#9829;</i> <!-- Favorited icon -->
            `;
            favoritesSection.appendChild(item);
        });
    };
    loadFavorites();

    // Function to handle the favorite icon click
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('heart-icon')) {
            const icon = event.target;
            const resultItem = icon.closest('.result-item');
            const isFavorited = icon.classList.contains('favorited');
            const imgSrc = resultItem.querySelector('img').src;
            const title = resultItem.querySelector('h4').textContent;
            const photographer = resultItem.querySelector('h6').textContent;

            if (isFavorited) {
                icon.classList.remove('favorited');
                // Remove from favorites section and localStorage
                const itemToRemove = favoritesSection.querySelector(`img[src="${imgSrc}"]`).closest('.result-item');
                favoritesSection.removeChild(itemToRemove);
                const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                const updatedFavorites = favorites.filter(fav => fav.img !== imgSrc);
                localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            } else {
                icon.classList.add('favorited');
                // Clone the result item and add it to the favorites section
                const clonedItem = resultItem.cloneNode(true);
                clonedItem.querySelector('.heart-icon').classList.add('favorited');
                favoritesSection.appendChild(clonedItem);
                // Save to localStorage
                const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                favorites.push({ img: imgSrc, title, photographer });
                localStorage.setItem('favorites', JSON.stringify(favorites));
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    new Splide('.splide', {
        type: 'loop',
        perPage: 1,
        autoplay: false,
        pagination: false,
        arrows: true,
    }).mount();
});

// Get elements
const communityLink = document.getElementById('community-link');
const closeFormButton = document.getElementById('close-form-button');
const popupContainer = document.getElementById('community-popup');

// Open popup
communityLink.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior
    popupContainer.style.display = 'flex';
});

// Close popup
closeFormButton.addEventListener('click', () => {
    popupContainer.style.display = 'none';
});

// Close popup when clicking outside the popup content
window.addEventListener('click', (event) => {
    if (event.target === popupContainer) {
        popupContainer.style.display = 'none';
    }
});

// Form submission
const communityForm = document.getElementById('community-form'); // Ensure this ID matches your form
communityForm.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Form submitted');
    popupContainer.style.display = 'none';
});
















