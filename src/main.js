import iziToast from 'izitoast';

import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';
import closeIcon from './img/bi_x-octagon.png';

import axios from 'axios';

const form = document.querySelector('form');

const list = document.querySelector('.gallery');
const searchInput = document.querySelector('.form-input');

form.addEventListener('submit', onSearchButton);
// refs.formElem.addEventListener('submit', onSearchButton);

let query = '';
let currentPage = 1;
let totalResults = 0;
const PAGE_SIZE = 15;

// const inputSearch = form.elements.search.value;





// ----Event Searching photos----


async function onSearchButton(e) {
  e.preventDefault();
  query = e.target.elements.search.value.trim();

  
  
  currentPage = 1;
  list.innerHTML = '';
  const data = await getPhotos();

  console.log(data);
  
}


// ----FORMER Promise function----

async function getPhotos() {
  
  const searchParams = new URLSearchParams({
    key: '42306918-f68a47ae9b20261d6e2f05069',
    q: `${query}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: currentPage,
    per_page: PAGE_SIZE,
  });

  const url = `https://pixabay.com/api/?${searchParams}`;

  const res = await axios.get(url);
  return res.data;
}



// ----When photos are not found----
function noImages() {
  iziToast.error({
    messageColor: '#FFF',
    color: '#EF4040',
    iconUrl: closeIcon,
    position: 'topRight',
    message:
      'Sorry, there are no images matching your search query. Please try again!',
  });
}

// ----Markup HTML----
function renderPhoto(photos) {
  const markup = photos
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<li class='gallery-item'>
  <a class='gallery-link' href='${largeImageURL}'>
    <img class='gallery-image' src='${webformatURL}' alt='${tags}'/>
  </a>
<div class='container-app'>
<p><span>Likes</span> ${likes}</p>
<p><span>Views</span> ${views}</p>
<p><span>Comments</span> ${comments}</p>
<p><span>Downloads</span> ${downloads}</p>
</div>
 </li>`
    )
    .join('');
  list.innerHTML = markup;
}

// ----library simpleLightbox----
function simpleLightbox() {
  let gallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionsPosition: 'bottom',
    captionDelay: 250,
  });
  gallery.on('show.simpleLightbox');
  gallery.refresh();
}


function showLoader() {
  refs.loaderElem.classList.remove('hidden');
}

function hideLoader() {
  refs.loaderElem.classList.add('hidden');
}