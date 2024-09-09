(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Navbar active link on scroll
   */
  function setActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('#navmenu a');
    let index = sections.length;

    while (--index && window.scrollY + (window.innerHeight / 2) < sections[index].offsetTop) {}

    navLinks.forEach((link) => link.classList.remove('active'));
    if (navLinks[index]) {
      navLinks[index].classList.add('active');
    }
  }

  function handleShowMoreEvents() {
    const eventItems = document.querySelectorAll('#eventos .row .col-md-6'); // Selecciona todos los eventos
    const showMoreBtn = document.createElement('button'); // Crea el botón "Ver más"
    showMoreBtn.textContent = 'Ver más';
    showMoreBtn.classList.add('btn', 'btn-primary', 'mt-4'); // Agrega clases al botón para estilos

    // Crea un contenedor para centrar el botón
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('d-flex', 'justify-content-center'); // Clases de Bootstrap para centrar

    let isShowingAll = false; // Variable para rastrear si todos los eventos están mostrados

    // Función para determinar cuántos eventos mostrar basado en el ancho de la pantalla
    function determineVisibleEvents() {
      const width = window.innerWidth;
      if (width <= 767) { // Móviles (<= 767px)
        return 3;
      } else if (width <= 820) { // Tablet (576px - 820)
        return 4;
      } else { // Desktop (> 820px)
        return 6;
      }
    }

    // Función para inicializar la visibilidad de los eventos
    function initEventVisibility() {
      const visibleCount = determineVisibleEvents(); // Número de eventos a mostrar
      eventItems.forEach((item, index) => {
        if (index >= visibleCount) {
          item.style.display = 'none';
        } else {
          item.style.display = 'block';
        }
      });
    }

    // Añadir el botón "Ver más" dentro del contenedor centrado
    btnContainer.appendChild(showMoreBtn);

    // Añadir el contenedor con el botón "Ver más" después de la lista de eventos
    const eventsContainer = document.querySelector('#eventos .container .row');
    eventsContainer.parentNode.appendChild(btnContainer);

    // Inicializa la visibilidad de los eventos al cargar la página
    initEventVisibility();

    // Añadir evento al botón "Ver más" para mostrar el resto de eventos
    showMoreBtn.addEventListener('click', () => {
      if (!isShowingAll) {
        // Mostrar todos los eventos
        eventItems.forEach(item => {
          item.style.display = 'block';
        });
        showMoreBtn.textContent = 'Ver menos'; // Cambia el texto del botón
        isShowingAll = true;
      } else {
        // Restablecer la visibilidad inicial de los eventos según el dispositivo
        initEventVisibility();
        showMoreBtn.textContent = 'Ver más'; // Cambia el texto del botón
        isShowingAll = false;
      }
    });

    // Reajustar el número de eventos mostrados al cambiar el tamaño de la ventana
    window.addEventListener('resize', () => {
      if (!isShowingAll) {
        initEventVisibility(); // Reinicializa la visibilidad de los eventos
      }
    });
  }

  document.addEventListener('DOMContentLoaded', handleShowMoreEvents);

  
  window.addEventListener('scroll', setActiveNavLink);
  document.addEventListener('DOMContentLoaded', setActiveNavLink);

})();
