const slider = ({
  container,
  slide,
  nextArrow,
  prevArrow,
  totalCount,
  currentCount,
  wrapper,
  field,
}) => {
  //Slider
  const slides = document.querySelectorAll(slide),
    slider = document.querySelector(container),
    prev = document.querySelector(prevArrow),
    next = document.querySelector(nextArrow),
    total = document.querySelector(totalCount),
    current = document.querySelector(currentCount),
    slidesWrapper = document.querySelector(wrapper),
    slidesField = document.querySelector(field),
    width = window.getComputedStyle(slidesWrapper).width;
  let slideIndex = 1;
  let offset = 0;

  const checkCurrentSlides = () =>
    (current.textContent = slideIndex > 10 ? slideIndex : `0${slideIndex}`);
  const checkTotalSlides = () =>
    (total.textContent =
      slides.length > 10 ? slides.length : `0${slides.length}`);

  const removeCharFromString = (string) => string.replace(/\D/g, "");

  checkCurrentSlides();
  checkTotalSlides();

  slidesField.style.width = 100 * slides.length + "%";
  slidesField.style.display = "flex";
  slidesField.style.transition = "0.5s all";

  slidesWrapper.style.overflow = "hidden";
  slides.forEach((slide) => (slide.style.width = width));

  slider.style.position = "relative";

  const indicators = document.createElement("ol"),
    dots = [];

  indicators.classList.add("carousel-indicators");
  slider.append(indicators);

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement("li");
    dot.setAttribute("data-slide-to", i + 1);
    dot.classList.add("dot");
    if (i === 0) {
      dot.style.opacity = 1;
    }
    indicators.append(dot);
    dots.push(dot);
  }
  const changeDotOpacity = () => {
    dots.forEach((dot) => (dot.style.opacity = ".5"));
    dots[slideIndex - 1].style.opacity = 1;
  };

  next.addEventListener("click", () => {
    if (offset == +removeCharFromString(width) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += +removeCharFromString(width);
    }
    slidesField.style.transform = `translateX(-${offset}px)`;
    if (slideIndex == slides.length) {
      slideIndex = 1;
    } else {
      slideIndex++;
    }

    checkCurrentSlides();
    changeDotOpacity();
  });

  prev.addEventListener("click", () => {
    if (offset == 0) {
      offset = +removeCharFromString(width) * (slides.length - 1);
    } else {
      offset -= +removeCharFromString(width);
    }
    slidesField.style.transform = `translateX(-${offset}px)`;
    if (slideIndex == 1) {
      slideIndex = slides.length;
    } else {
      slideIndex--;
    }
    checkCurrentSlides();
    changeDotOpacity();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      const slideTo = e.target.getAttribute("data-slide-to");
      slideIndex = slideTo;
      offset = +removeCharFromString(width) * (slideTo - 1);

      slidesField.style.transform = `translateX(-${offset}px)`;

      changeDotOpacity();
      checkCurrentSlides();
    });
  });
};

export default slider;
