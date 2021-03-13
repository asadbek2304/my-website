'use strict';
const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const header = document.querySelector('.header');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal oyna

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault()
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////Coookie habar hosil qilish/////////cookie habar hozircha yashirilgan//////
// const habar = document.createElement('div');
// habar.classList.add('cookie-message');
// habar.innerHTML =
//   'Biz cookie-fayllarni takomillashtirilgan funksiyalar va alanalitikalar uchun ishlatamiz. <button class="btn btn--close-cookie">Tushunarli</button>';

// header.before(habar);

// document.querySelector('.btn--close-cookie').addEventListener('click', function () {
//   habar.parentElement.removeChild(habar)
// });

// habar.style.backgroundColor = '#37383d';
// habar.style.width = '104%';

// habar.style.height = Number.parseFloat(getComputedStyle(habar).height, 20, 10) + 30 + 'px';

//ohista scroll qilish
btnScroll.addEventListener('click', function (e) {

  /////////Eski usul///////
  // window.scrollTo({
  //   left: scroll1Koor.left + window.pageXOffset,
  //   top: scroll1Koor.top + window.pageYOffset,
  // behavior: 'smooth'});

  /////////Yangi usul
  section1.scrollIntoView({ behavior: 'smooth' })
});

////navigation bar orqali scroll qilish
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id)
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
  }
  ////buni forEach metodi bilan ham amalga oshirsa bo'ladi
});

///////stylelarni .closest orqali o'zgartirish
// const h1 = document.querySelector('h1');

// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = '';

////////Tab hususiyat qo'shish////////
tabsContainer.addEventListener('click', function (e) {
  const bosilgan = e.target.closest('.operations__tab');

  if (!bosilgan) return;

  // console.log(bosilgan)
  //Aktiv classlarni o'chirish
  tabs.forEach(t => t.classList.remove('operations__tab--active'))

  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //Aktiv classlarini qo'shish(tabga)
  bosilgan.classList.add('operations__tab--active');

  //Aktiv classlarni qo'shish(contentga)
  // console.log(bosilgan.dataset.tab)
  document.querySelector(`.operations__content--${bosilgan.dataset.tab}`)
    .classList.add('operations__content--active')
});

/////xiralashtirish animatsiyasi
const hover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', hover.bind(0.5));
nav.addEventListener('mouseout', hover.bind(1));

// const boshlangichKoor = section1.getBoundingClientRect();

// window.addEventListener('scroll', function() {
//   // console.log(window.scrollY);

//   if(window.scrollY > boshlangichKoor.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky')
// });

///scroll uchun interSectionObserver API dan foydalanish;
const ViewportHeght = nav.getBoundingClientRect().height;
const obsCallback = function (entries) {
  const [entry] = entries;
  // console.log(ViewportHeght)
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const observer = new IntersectionObserver(obsCallback, {
  root: null,
  threshold: 0,
  rootMargin: `-${ViewportHeght}px`
});

observer.observe(header);

///Pastga yurganda contentni ochib berish 

const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target)
};

const sectionsObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionsObserver.observe(section)
  section.classList.add('section--hidden');
});

////rasmlarni ochib berish
const images = document.querySelectorAll('img[data-src]');

const loadImages = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  //////////////Rasmni almashtirish//////////////
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img')
  });
  observer.unobserve(entry.target)
};

const imageObserver = new IntersectionObserver(loadImages, {
  root: null,
  threshold: 0,
  rootMargin: '-200px'
});
images.forEach(image => {
  imageObserver.observe(image)
});

////////////Slider///////////
const sliders = function () {
  const slides = document.querySelectorAll('.slide');
  // const slider = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right')
  let curSlide = 0;
  const maxLenthSlide = slides.length;
  const nuqtalar = document.querySelector('.dots')

  //////////////////////////////Funksiyalar////////////////////////
  /////nuqtalarni yaratish
  const createDots = function () {
    slides.forEach((_, i) => {
      nuqtalar.insertAdjacentHTML('beforeend', `
    <button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  ////aktiv nuqtani ko'rsatish
  const dotActive = function (slide) {
    document.querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active')
  };


  // slider.style.transform = `scale(0.4) translateX(-800px)`;
  // slider.style.overflow = 'visible';

  const slidniOzgartirish = function (slide) {
    slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
  }

  const nextSlide = function () {
    if (curSlide === maxLenthSlide - 1) {
      curSlide = 0
    } else {
      curSlide++;
    }

    slidniOzgartirish(curSlide);
    dotActive(curSlide)
  };

  const init = function () {
    slidniOzgartirish(0);
    createDots()
    dotActive(0)
  }
  init()

  //////Event handlers
  btnRight.addEventListener('click', nextSlide);

  const previousSlide = function () {
    if (curSlide === 0) {
      curSlide = maxLenthSlide - 1;
    } else {
      curSlide--;
    }
    slidniOzgartirish(curSlide);
    dotActive(curSlide)
  };

  btnLeft.addEventListener('click', previousSlide);
  setInterval(nextSlide, 5000)
  ////////Klaviatura orqali boshqarish
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') previousSlide();
    e.key === 'ArrowRight' && nextSlide()
  });
  ///////nuqtalarni funkionallashtirish/////
  nuqtalar.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset
      slidniOzgartirish(slide);
      dotActive(slide)
    };
  });
};
sliders();


/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

// h1.closest('.header').style.background = 'var(--gradient-primary)'

// const randomraqam = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
// const randomcolor = () => `rgb(${randomraqam(0, 255)},${randomraqam(0, 255)},${randomraqam(0, 255)})`;

// document.querySelector('.nav__links').addEventListener('click', function(e) {
//   this.style.backgroundColor = randomcolor()
// })

// console.log(h1.parentElement.children); bu HTML kalleskiya qaytaradi keyin uning ustida amallarni amalga oshirsa bo'ladi(arrayga o'tkazgan holatda)
// [...h1.parentElement.children].forEach(el => {
//   if(h1 !== el) {
//     el.style.transform = 'scale(0.5)'
//   }
// })
// console.log(h1.parentNode);

// document.addEventListener('DOMContentLoaded', function(e){
//   console.log('Salom documentdan loaded qilingandan keyin chiqadi', e)
// });

// window.addEventListener('load', function(e){
//   console.log('Sahifa tolit yuklandi', e)
// })

// window.addEventListener('beforeunload', function(e){
//   e.preventDefault();
//   e.returnValue= ''
// })