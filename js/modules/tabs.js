const tabs = (tabsSelector, tabsContentSelector, tabsParentSelector, tabsActive) => {
    //Tabs
    const tabs = document.querySelectorAll(tabsSelector),
        tabsContent = document.querySelectorAll(tabsContentSelector),
        tabsParent = document.querySelector(tabsParentSelector);

    const hideTabContent = () => {
        tabsContent.forEach((item) => {
            item.classList.add("hide");
            item.classList.remove("show", "fade");
        });
        tabs.forEach((item) => {
            item.classList.remove(tabsActive);
        });
    };

    const showTabContent = (i = 0) => {
        tabsContent[i].classList.add("show", "fade");
        tabsContent[i].classList.remove("hide");
        tabs[i].classList.add(tabsActive);
    };

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener("click", (e) => {
        const target = e.target;
        if (target && target.classList.contains(tabsSelector.replace(/\./,""))) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
};

export default tabs;