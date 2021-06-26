// /question/create/<%= roomId %>
import Response from './responseModal.js';

const askForm = document.querySelector('#askForm');
const question = document.querySelector('#question');

askForm.onsubmit = async (e) => {
    e.preventDefault();

    if(!question.value.trim().length < 5){
        Response('error', 'Sua pergunta deve ter mais que 5 caracteres');
    }

}
