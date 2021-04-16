import imagesModule from '../gallery-items.js';


const modalActive = 'is-open';

const refs = {
    galleryUl: document.querySelector('.js-gallery'),
    modal: document.querySelector('.js-lightbox'),
    modalOverlay: document.querySelector('.js-lightbox'),
    modalImg: document.querySelector('.lightbox__image'),
};

const imagesArray = imagesModule.map(img => img.original);


// Creation and rendering of markup

const galleryMarkup = images => {
  return images.map(({
    preview: previewImg,
    original: originalImg,
    description: altText }) => {
    return `
      <li class="gallery__item">
        <a
          class="gallery__link"
          href="${originalImg}"
        >
          <img
            class="gallery__image"
            src="${previewImg}"
            data-source="${originalImg}"
            alt="${altText}"
          />
        </a>
      </li>
    `
  }).join('')
};


const renderGalleryListItems = (itemsArray) => {
  refs.galleryUl.innerHTML = galleryMarkup(itemsArray);
};

renderGalleryListItems(imagesModule);

// --------
// Gallery MODAL 

const setModalImg = (src, altTxt) => {
    refs.modalImg.src = src
    refs.modalImg.alt = altTxt
};


const clearModalImg = () => {
    refs.modalImg.src = ''
    refs.modalImg.alt = ''
}

const onModalOpen = el => {
    el.preventDefault();
    const { target } = el;
    const imageSrc = target.dataset.source;
    const imageAltText = target.alt;

    if (!target.classList.contains('gallery__image')) return
    
    setModalImg(imageSrc, imageAltText);

    refs.modal.classList.add(modalActive);

    document.addEventListener('keyup', onModalClose);
    document.addEventListener('keyup', onSlideImage);

}

const onModalClose = el => {
    const { target } = el;

    if (target.dataset.action || target.classList.contains('lightbox__overlay') || el.code === "Escape") {
        refs.modal.classList.remove(modalActive);
        clearModalImage();

        document.removeEventListener('keyup', onModalClose);
        document.removeEventListener('keyup', onSlideImage);
    }
}

// -------
// MODAL slider

const slideModalImage = {
    currentImgIndex: 0,

    prevSlide() {
        const index = imagesArray.indexOf(refs.modalImg.src);

        this.setIndex(index - 1);
        
        if (this.currentImgIndex < 0) {
            this.setIndex(imagesArray.length - 1);
        }

        const { src, alt } = this.getImageData(this.currentImgIndex);

        setmodalImg(src, alt);
    },

    nextSlide() {
        const index = imagesArray.indexOf(refs.modalImg.src);

        this.setIndex(index + 1);

        if (this.currentImgIndex > imagesArray.length - 1) {
            this.setIndex(0);
        }

        const { src, alt } = this.getImageData(this.currentImgIndex);

        setModalImg(src, alt);
    },

    setIndex(index) {
        this.currentImgIndex = index
    },

    getImageData(index) {
        return {
            src: imagesModule[index].original,
            alt: imagesModule[index].description,
        }
    }

}

const onSlideImage = (el) => {
    switch (el.code) {
        case 'ArrowLeft': slideModalImage.prevSlide();
            break;
        case 'ArrowRight': slideModalImage.nextSlide();
            break;
    }
}
// -----
// Listeners

refs.modal.addEventListener('click', onModalClose);

refs.galleryUl.addEventListener('click', onModalOpen);

// -----
