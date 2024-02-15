import iziToast from 'izitoast';

import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';
import closeIcon from './img/bi_x-octagon.png';

import axios from 'axios';


const refs = {
  form: document.querySelector('form'),
  list: document.querySelector('.gallery'),
  spanLoader: document.querySelector('.loader'),
  loadButton: document.querySelector('.load-button'),
  input: document.querySelector('.form-input')
}

// ----Add an event handler for the "Load more" button----
refs.loadButton.addEventListener('click', onLoadMoreButton);

// ----Add an event handler for the "Search" button----
refs.form.addEventListener('submit', onSearchButton);



let inputSearch = '';
let currentPage = 1;

const PAGE_SIZE = 15;


// ----Event Searching photos----

async function onSearchButton(e){
  e.preventDefault();
  inputSearch  = refs.input.value.trim();
  refs.list.innerHTML = '';
  refs.loadButton.classList.add('hidden');
  if (inputSearch === '') {
      return iziToast.error({
          messageColor: '#FFF',
          color: '#EF4040',
          iconUrl: closeIcon,
          position: 'topRight',
          message: 'Please,enter what do you want to find!',
      });
  };
  currentPage = 1;
  try {
      const { hits, totalHits } = await getPhotos();
      noPhotos(hits);
      renderPhoto(hits);
      addLoadButton(totalHits,PAGE_SIZE);
  }
  catch (error) {
      iziToast.error({
          messageColor: '#FFF',
          color: '#EF4040',
          iconUrl: closeIcon,
          position: 'topRight',
          message: `${error}`,
      })
  } 
  simpleLightbox();
  refs.form.reset(); 
}

// ----Function to get photos----

async function getPhotos() {
  refs.spanLoader.classList.remove('hidden');
  const response = await axios.get( 'https://pixabay.com/api/',{
      params: {
          key: "42306918-f68a47ae9b20261d6e2f05069",
          q: `${inputSearch}`,
          image_type: "photo",
          orientation: "horizontal",
          safesearch: "true",
          per_page: PAGE_SIZE,
          page: currentPage},
  });
  const {hits, totalHits } = response.data;
  refs.spanLoader.classList.add('hidden');
  return {hits, totalHits};
}

// ----When photos are not found----
function noPhotos(hits){
  if (hits.length === 0) {
      iziToast.error({
          messageColor: '#FFF',
          color: '#EF4040',
          iconUrl: closeIcon,
          position: 'topRight',
          message: 'Sorry, there are no images matching your search query. Please try again!',
      });
      }; 
}

// ----Markup HTML----
function renderPhoto(hits) {
  const markup = hits
      .map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) =>
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
          </li>`)
      .join('');
  refs.list.insertAdjacentHTML('beforeend', markup);
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

// ----Event Loading photos----

function addLoadButton(totalHits,perPage) {
  const totalPages = Math.ceil(totalHits / perPage);     
   if (totalPages>1) {
      refs.loadButton.classList.remove('hidden'); 
   };
    
}

function smoothScroll() {
  const { height: itemHeight } = document.querySelector('.gallery-item').getBoundingClientRect();
  window.scrollBy({
  top: itemHeight*2,
  behavior: 'smooth',
});
}


async function onLoadMoreButton() {  
  currentPage++;
  try {
      const {hits, totalHits} = await getPhotos();
      renderPhoto(hits);
      endOfCollection(currentPage, totalHits, PAGE_SIZE);
  }
  catch (error) {
      console.log(error);
      iziToast.error({
              messageColor: '#FFF',
              color: '#EF4040',
              iconUrl: closeIcon,
              position: 'topRight',
              message: `${error}`,
          })
   };
  smoothScroll();
  simpleLightbox();
}


// ---- The end of the collection----
function endOfCollection(currentPage, totalHits, PAGE_SIZE) {
  const totalPages = Math.ceil(totalHits / PAGE_SIZE);
  if (currentPage>=totalPages) {
      observer.observe(refs.list.lastChild);
      refs.loadButton.classList.add('hidden'); 
  } else {
      observer.unobserve(refs.list.lastChild);
  } 
}

// ---- Add observer----
const observer = new IntersectionObserver(onLastPage);
function onLastPage(entries,observer) {
  entries.forEach((entry) => {
      if (entry.isIntersecting) {
          iziToast.error({
              position: "topRight",
              messageColor: '#FFF',
              color: '#EF4040',
              iconUrl: closeIcon,
              message: "We're sorry, but you've reached the end of search results"
          });
      }
  });
 
}