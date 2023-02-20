"use strict";

document.addEventListener("DOMContentLoaded", () => {
  //tabs
  const tabs = document.querySelectorAll(".tabheader__item"),
    tabsContent = document.querySelectorAll(".tabcontent"),
    tabsParent = document.querySelector(".tabheader__items");

  const hideTabContent = () => {
    tabsContent.forEach((item) => {
      item.classList.add("hide");
      item.classList.remove("show", "fade");
    });
    tabs.forEach((item) => {
      item.classList.remove("tabheader__item_active");
    });
  };

  const showTabContent = (i = 0) => {
    tabsContent[i].classList.add("show", "fade");
    tabsContent[i].classList.remove("hide");
    tabsContent[i].classList.add("tabheader__item_active");
  };

  hideTabContent();
  showTabContent();

  tabsParent.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.classList.contains("tabheader__item")) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  //FIXME: Створи папку helpers і це все винеси туда. Тобто те, що не відноситься до головної логіки, а
  //FIXME: тільки доповнює функціонал. + багато констант, таких як deadLine - створи файл constants.js
  //timer
  const deadLine = "2024-01-30";

  const getTimeRemaining = (endTime) => {
    let days, hours, minutes, seconds;
    const t = Date.parse(endTime) - Date.now();
    if (t <= 0) {
      days = 0;
      hours = 0;
      minutes = 0;
      seconds = 0;
    } else {
      (days = Math.floor(t / (1000 * 60 * 60 * 24))),
        (hours = Math.floor((t / (1000 * 60 * 60)) % 24)),
        (minutes = Math.floor((t / (1000 * 60)) % 60)),
        (seconds = Math.floor((t / 1000) % 60));
    }

    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  };

  const getZero = (num) => ( num >= 0 && num < 10 ) ? `0${num}` : num;

  const setClock = (endtime) => {
    const timer = document.querySelector(".timer"),
      days = timer.querySelector("#days"),
      hours = timer.querySelector("#hours"),
      minutes = timer.querySelector("#minutes"),
      seconds = timer.querySelector("#seconds");
      
    
    const updateClock = () => {
      const time = getTimeRemaining(endtime);
      days.innerHTML = getZero(time.days);
      hours.innerHTML = getZero(time.hours);
      minutes.innerHTML = getZero(time.minutes);
      seconds.innerHTML = getZero(time.seconds);

      if (time.total <= 0) {
        clearInterval(timeInterval);
      }
    }
    const timeInterval = setInterval(updateClock, 1000);
    updateClock();
    
  };
  setClock(deadLine);
  // Modal
  //TODO: винести в окремий клас
  const modalTrigger = document.querySelectorAll("[data-modal]");
  const modal = document.querySelector(".modal");

  const openModal = () => {
    modal.classList.add("show");
    modal.classList.remove("hide");
    document.body.style.overflow = "hidden";
    clearInterval(modalTimerId);
    window.removeEventListener("scroll", showModalByScroll);
  }
  const closeModal = () => {
    modal.classList.add("hide");
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }

  modalTrigger.forEach((item) => {
    item.addEventListener("click", openModal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') == "") {
        closeModal();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  const showModalByScroll = () => {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight - 1
    ) {
      openModal();
    }
  }
  const modalTimerId = setTimeout(openModal, 50000);

  window.addEventListener("scroll", showModalByScroll);

  // create cards Menu
  //TODO: Винести в окремий файл клас
  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.classes = classes;
      this.parent = document.querySelector(parentSelector);
      this.transfer = 37;
      this.changeToUAH();
    }

    changeToUAH() {
      this.price = this.price * this.transfer;
    }

    render() {
      const element = document.createElement("div");
      if (this.classes.length === 0) {
        this.classes = ["menu__item"];
      }
      this.classes.forEach((className) => element.classList.add(className));
      element.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
            `;
      this.parent.append(element);
    }
  }
  
  axios.get('http://localhost:3000/menu')
    .then(data => {
      data.data.forEach( ({img, altimg, title, descr, price}) => {
      new MenuCard(img, altimg, title, descr, price, ".menu .container").render()
    })
  });

  //Forms

  const forms = document.querySelectorAll("form");

  const message = {
    loading: "img/form/spinner.svg",
    success: "Спасибо! Скоро мы с вами свяжемся!",
    failure: "Что-то пошло не так...",
  };
  

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: "POST",
        headers: {
          "content-type":"application/json"
        },
        body: data
    });

    return await res.json();
  };

  const bindPostData = (form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const statusMessage = document.createElement("img");
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
        `;
      statusMessage.textContent = message.loading;
      form.insertAdjacentElement("afterend", statusMessage);

      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData("http://localhost:3000/requests", json)
      .then(data => {
        console.log(data);
        statusMessage.remove();
        showThanksModal(message.success);
      })
      .catch(() => {
        showThanksModal(message.failure);
      })
      .finally(() => {
        form.reset();
      });
    });
    
  }
  forms.forEach(item => bindPostData(item));
  
  const closeThanksModal = (thanksModal, prevModalDialog) => {
    thanksModal.remove();
    prevModalDialog.classList.add("show");
    prevModalDialog.classList.remove("hide");
    closeModal();
  };

  const showThanksModal = (message) => {
    const prevModalDialog = document.querySelector(".modal__dialog");
    const thanksModal = document.createElement("div");
   
    prevModalDialog.classList.add("hide");
    openModal();
    thanksModal.classList.add("modal__dialog");
    thanksModal.innerHTML = `
    <div class="modal__content">
      <div class="modal__close" data-close>×</div>
      <div class="modal__title">${message}</div>
    </div>
    `;

    document.querySelector(".modal").append(thanksModal);
    document.addEventListener("keydown", (e) => {
      if (e.code === "Escape" && thanksModal) {
        closeThanksModal(thanksModal, prevModalDialog);
      }
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.getAttribute('data-close') === "") {
        closeThanksModal(thanksModal, prevModalDialog);
    }
    });
  };

  //Slider
  
    const slides = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector(".offer__slider"),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          total = document.querySelector("#total"),
          current = document.querySelector("#current"),
          slidesWrapper = document.querySelector(".offer__slider-wrapper"),
          slidesField = document.querySelector(".offer_slider-inner"),
          width = window.getComputedStyle(slidesWrapper).width;
    let slideIndex = 1;
    let offset = 0;
    
    const checkCurrentSlides = () => current.textContent = slideIndex > 10 ? slideIndex : `0${slideIndex}`;
    const checkTotalSlides = () => total.textContent = slides.length > 10 ? slides.length : `0${slides.length}`;

    const removeCharFromString = (string) => string.replace(/\D/g, "");
    
    checkCurrentSlides();
    checkTotalSlides();

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = "flex";
    slidesField.style.transition = "0.5s all";
    
    slidesWrapper.style.overflow = "hidden";
    slides.forEach( slide => slide.style.width = width);

    slider.style.position = "relative";

    const indicators = document.createElement("ol");
    const dots = [];
    indicators.classList.add("carousel-indicators")
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
          const dot = document.createElement('li');
          dot.setAttribute('data-slide-to', i + 1);
          dot.classList.add("dot");
          if(i === 0) {
            dot.style.opacity = 1;
          }
          indicators.append(dot);
          dots.push(dot)
    }
  const changeDotOpacity = () => {
    dots.forEach(dot => dot.style.opacity = ".5");
    dots[slideIndex-1].style.opacity = 1;
  }

  next.addEventListener("click", () => {
    if (offset == +removeCharFromString(width) * (slides.length - 1)) {
        offset = 0;
    } else {
        offset += +removeCharFromString(width);
    }
      slidesField.style.transform = `translateX(-${offset}px)`;
    if( slideIndex == slides.length) {
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
    if( slideIndex == 1) {
        slideIndex = slides.length;
    } else {
        slideIndex--;
    }
    checkCurrentSlides();
    changeDotOpacity()
  });
  
  dots.forEach (dot => {
    dot.addEventListener("click", (e) => {
      const slideTo = e.target.getAttribute("data-slide-to");
      slideIndex = slideTo;
      offset = +removeCharFromString(width) * (slideTo - 1);

      slidesField.style.transform = `translateX(-${offset}px)`;

      changeDotOpacity();
      checkCurrentSlides();
    });
  });

  //Calculator 

  const result = document.querySelector(".calculating__result span");
  
  
  let sex, height, weight, age, ratio;

  if(localStorage.getItem("sex")) {
   sex = localStorage.getItem("sex"); 
  } else {
    sex = "female";
    localStorage.setItem("sex","female" )
  }
  if(localStorage.getItem("radio")) {
    ratio = localStorage.getItem("ratio"); 
  } else {
     ratio = 1.375;
     localStorage.setItem("ratio", 1.375);
  }
  
  const calcTotal = () => {
    if (!sex || !height || !weight || !age || !ratio) {
      result.textContent = "____";
      return;
    }
    
    result.textContent = (sex === "female")
    ? Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio)
    : Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio)
  }
  calcTotal();

  const initLocalSettings = (selector, activeClass) => {
    const elements = document.querySelectorAll(selector);

    elements.forEach(elem => {
      elem.classList.remove(activeClass);
      if (elem.getAttribute('id') === localStorage.getItem('sex')) {
        elem.classList.add(activeClass);
      }
      if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
        elem.classList.add(activeClass);
      }
    });
  };

  initLocalSettings("#gender p","calculating__choose-item_active");
  initLocalSettings(".calculating__choose_big p","calculating__choose-item_active");

  const getStaticInfo = (selector, activeClass) => {
    const elements = document.querySelectorAll(selector);

    elements.forEach(elem => {
      elem.addEventListener("click", (e) => {
        if(e.target.getAttribute("data-ratio")) {
          ratio = +e.target.getAttribute("data-ratio");

          localStorage.setItem("ratio", +e.target.getAttribute("data-ratio"))
        } else {
          sex = e.target.getAttribute("id");
  
          localStorage.setItem("sex", e.target.getAttribute("id"))
        }

        elements.forEach(element => {
          element.classList.remove(activeClass);
        });
        e.target.classList.add(activeClass);
        calcTotal(); 
      });
      
    })
      
  } 
  getStaticInfo("#gender p","calculating__choose-item_active");
  getStaticInfo(".calculating__choose_big p","calculating__choose-item_active");

  const getDynamycInfo = selector => {
    const input = document.querySelector(selector);

    
    input.addEventListener('input', () => {
      if(input.value.match(/\D/g)) {
        input.style.border = "2px solid red";
      } else {
        input.style.border = "none";
      }
      switch(input.getAttribute("id")) {
        case "height":
          height = +input.value;
          break;
        case "weight": 
          weight = +input.value;
          break;
        case "age": 
          age = +input.value;
          break;
      }
      calcTotal();
    });
    
  };
  
  
  getDynamycInfo("#height");
  getDynamycInfo("#weight");
  getDynamycInfo("#age");
 
});