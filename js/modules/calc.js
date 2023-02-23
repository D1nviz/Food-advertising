const calc = () => {
  //Calculator 
  const result = document.querySelector(".calculating__result span");
  const additionalResultText = document.querySelector('.calculating__result p');

  let sex, height, weight, age, ratio;

  if (localStorage.getItem("sex")) {
    sex = localStorage.getItem("sex");
  } else {
    sex = "female";
    localStorage.setItem("sex", "female");
  }
  if (localStorage.getItem("ratio")) {
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
  };

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

  initLocalSettings("#gender p", "calculating__choose-item_active");
  initLocalSettings(".calculating__choose_big p", "calculating__choose-item_active");

  const getStaticInfo = (selector, activeClass) => {
    const elements = document.querySelectorAll(selector);

    elements.forEach(elem => {
      elem.addEventListener("click", (e) => {
        if (e.target.getAttribute("data-ratio")) {
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

  getStaticInfo("#gender p", "calculating__choose-item_active");
  getStaticInfo(".calculating__choose_big p", "calculating__choose-item_active");

  const getDynamycInfo = selector => {
    const input = document.querySelector(selector);
    const maxInputValue = 350;
    const minImputValue = 0;
    input.addEventListener('input', () => {

      if(input.value <= maxInputValue && input.value >= minImputValue && !input.value.match(/\D/g)) {
        switch (input.getAttribute("id")) {
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
        input.style.border = "none";
        additionalResultText.textContent = "ккал"
        result.style.fontSize = "";
      } else {
        result.textContent = "Неверные данные"
        result.style.fontSize = "28px"
        input.style.border = "2px solid red";
        additionalResultText.textContent = "";
      }
      
      
    });
  };

  getDynamycInfo("#height");
  getDynamycInfo("#weight");
  getDynamycInfo("#age");
};

export default calc;