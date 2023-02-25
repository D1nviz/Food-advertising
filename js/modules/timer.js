const timer = (id, deadLine) => {
  //timer

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

  const getZero = (num) => (num >= 0 && num < 10 ? `0${num}` : num);

  const setClock = (endtime) => {
    const timer = document.querySelector(id),
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
    };
    const timeInterval = setInterval(updateClock, 1000);
    updateClock();
  };
  setClock(deadLine);
};
export default timer;
