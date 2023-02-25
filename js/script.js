import tabs from "./modules/tabs";
import modal, { openModal } from "./modules/modal";
import timer from "./modules/timer";
import cards from "./modules/cards";
import calc from "./modules/calc";
import forms from "./modules/forms";
import slider from "./modules/slider";

document.addEventListener("DOMContentLoaded", () => {
  const modalTimerId = setTimeout(
    () => openModal(".modal", modalTimerId),
    50000
  );

  tabs(
    ".tabheader__item",
    ".tabcontent",
    ".tabheader__items",
    "tabheader__item_active"
  );
  calc();
  modal("[data-modal]", ".modal", modalTimerId);
  timer(".timer", "2024-01-30");
  cards();
  forms("form", modalTimerId, ".modal");
  slider({
    container: ".offer__slider",
    slide: ".offer__slide",
    nextArrow: ".offer__slider-next",
    prevArrow: ".offer__slider-prev",
    totalCount: "#total",
    currentCount: "#current",
    wrapper: ".offer__slider-wrapper",
    field: ".offer_slider-inner",
  });
});
