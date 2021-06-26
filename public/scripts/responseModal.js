const modalWrapper = document.querySelector('.modal-wrapper.myModal')
const cancelButton = document.querySelector('.button.cancel')

cancelButton.addEventListener("click", close)

function open(){
    modalWrapper.classList.add("active")
}
function close(){
    modalWrapper.classList.remove("active")
}

   

const types = {
    error: 'red',
    success: 'green' 
}

export default (type, message) => {

    const modalMessage = document.querySelector('#modalMessage');
    const modalButton = document.querySelector('#modalButton');

    modalMessage.innerHTML = message;
    modalButton.classList.remove('green');
    modalButton.classList.remove('red');
    modalButton.classList.add(types[type]);
    

    open();

}