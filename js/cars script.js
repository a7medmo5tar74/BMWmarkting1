const cards = document.querySelectorAll('.car-card');
const overlay = document.getElementById('overlay');

cards.forEach(card => {
  card.addEventListener('click', () => {
    document.getElementById('popup-name').innerText = card.dataset.name;
    document.getElementById('popup-price').innerText = card.dataset.price;
    document.getElementById('popup-desc').innerText = card.dataset.desc;
    document.getElementById('popup-img').src = card.dataset.img;

    overlay.classList.add('active');
  });
});

document.querySelector('.close').onclick = () => {
  overlay.classList.remove('active');
};

overlay.onclick = e => {
  if (e.target === overlay) {
    overlay.classList.remove('active');
  }
};