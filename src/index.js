
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const input = document.querySelector('.search-input');
const searchButton = document.querySelector('.search_button');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

loadMore.style.display = 'none';

let page = 1;

const fetchImages = async (inputValue, page) => {
  return await fetch(
    `https://pixabay.com/api/?key=33011289-df6702633a8228a46663ae887&q=${inputValue}&orientation=horizontal&safesearch=true&image_type=photo&per_page=40&page=${page}`
  )
    .then(async res => {
      if (!res.ok) {
        if (res.status === 404) {
          return [];
        }
        throw new Error(res.status);
      }
      return await res.json();
    })
    .catch(error => {
      console.error(error);
    });
};

searchButton.addEventListener('click', e => {
  e.preventDefault();
  clear();
  const trimmedValue = input.value.trim();
  if (trimmedValue !== '') {
    fetchImages(trimmedValue, page).then(foundData => {
      if (foundData.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        takeImg(foundData.hits);
        Notiflix.Notify.success(
          `Hooray! We found ${foundData.totalHits} images.`
        );
        loadMore.style.display = 'block';
        gallerySimpleLightbox.refresh();
      }
    });
  }
});


function clear() {
  gallery.innerHTML = '';
  page = 1;
  loadMore.style.display = 'none';
}

function takeImg(images) {
  const markup = images
    .map(image => {
      return `<div class="photo-items">

       <a href=""><img class="photo" src="${image.webformatURL}"/></a>

        <div>
           <p>
    <b>Likes:</b> <span > ${image.likes} </span>
</p>
            <p>
                <b>Views:</b> <span >${image.views}</span>  
            </p>
            <p>
                <b>Comments:</b> <span >${image.comments}</span>  
            </p>
            <p>
                <b>Downloads:</b> <span >${image.downloads}</span> 
            </p>
        </div>
    </div>`;
    })
    .join('');
  gallery.innerHTML += markup;
}

loadMore.addEventListener('click', () => {
  page++;
  const trimmedValue = input.value.trim();
  loadMore.style.display = 'none';
  fetchImages(trimmedValue, page).then(foundData => {
    if (foundData.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      takeImg(foundData.hits);
      Notiflix.Notify.success(
        `Hooray! We found ${foundData.totalHits} images.`
      );
      loadMore.style.display = 'block';
    }
  });
});




