let currentIndex = 0;
const images = document.querySelectorAll('.carousel-images img');

function showSlide(index) {
    images.forEach(img => img.classList.remove('active'));
    images[index].classList.add('active');
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % images.length;
    showSlide(currentIndex);
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showSlide(currentIndex);
}

// Initialize
showSlide(currentIndex);
