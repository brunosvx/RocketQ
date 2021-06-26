import Response from './responseModal.js';

const createPassForm = document.querySelector('#createPassForm');
const passwordInput = document.querySelector('#room-pass');


createPassForm.onsubmit = async (e) => {
    e.preventDefault();

    if(!passwordInput.value.trim().length){
        Response('error', 'Você precisa inserir uma senha.');
        return
    }

    if(passwordInput.value.trim().length >= 50){
        Response('error', 'Sua senha precisa ser menor que 50 caracteres');
        return
    }

    const { data, request} = await axios.post('/create-room', {
        roomPassword: passwordInput.value.trim()
    })

    if(data.success === false){
        return Response('error', data.message);
    }

    location = request.responseURL;

}