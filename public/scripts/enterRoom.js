// action="/enterroom" method="POST"
import Response from './responseModal.js';

const enterRoomForm = document.querySelector('#enterRoomForm');
const passwordInput = document.querySelector('#room-id');


enterRoomForm.onsubmit = async (e) => {
    e.preventDefault();

    if(!passwordInput.value.trim().length){
        Response('error', 'Você precisa inserir uma sala.');
        return
    }

    const { data, request } = await axios.post('/enterroom', {
        roomId: parseInt(passwordInput.value.trim())
    })

    if(data.success === false){
        return Response('error', data.message);
    }

    location = request.responseURL;

}