import Response from './responseModal.js';

const askForm = document.querySelector('#askForm');
const question = document.querySelector('#question');

askForm.onsubmit = async (e) => {
    e.preventDefault();

    if(question.value.trim().length < 5){
        return Response('error', 'Sua pergunta deve ter mais que 5 caracteres');
    }

    const { data } = await axios.post(`/question/create/${askForm.getAttribute('room-id')}`,{
        question: question.value.trim()
    })

    if(data.success){
        return Response('success', data.message);
    }

    Response('error', data.message);
}
