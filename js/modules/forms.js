import { closeModal, openModal } from './modal';
import { postData } from '../services/services';

const forms = (formsSelector, modalTimerId, modalSelector) => {
    const forms = document.querySelectorAll(formsSelector);
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };
    const modal = document.querySelector(modalSelector);


    const bindPostData = (form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset();
                });
        });
    }
    forms.forEach(item => {
        bindPostData(item);
    });

    let thanksModal;
    let prevModalDialog;
    const showThanksModal = (message) => {

        thanksModal = document.createElement('div');
        prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal(modalSelector, modalTimerId);

        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        modal.append(thanksModal);


    };

    const closeThanksModal = (thanksModal, prevModalDialog) => {
        thanksModal.remove();
        prevModalDialog.classList.add('show');
        prevModalDialog.classList.remove('hide');
        closeModal(modalSelector);
    };

    modal.addEventListener('click', (e) => {
        if (e.target === modal && thanksModal || e.target.getAttribute('data-close') == "" && thanksModal) {
            closeThanksModal(thanksModal, prevModalDialog);
        }
    });
    document.addEventListener("keydown", (e) => {
        if (e.code === "Escape" && thanksModal) {
            closeThanksModal(thanksModal, prevModalDialog);
        }
    });
}

export default forms;