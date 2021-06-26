import Modal from './modal.js'

const modal = Modal();
const types = {
    error: 'red',
    success: 'green' 
}

export default (type, message) => {

    const modalMessage = document.querySelector('#modalMessage');
    const modalButton = document.querySelector('#modalButton');

    modalMessage.innerHTML = message;
    modalButton.classList.add(types[type]);
    

    modal.open();

}