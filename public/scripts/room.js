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

const actionForm = document.querySelector('#formAction');
const password = document.querySelector('#password');
const modalResponseText = document.querySelector('#modalResponseText');
modalResponseText.style.color = '#E83F5B';

actionForm.onsubmit = async (e) => {
    e.preventDefault();

    if(!password.value.trim().length){
        return modalResponseText.innerHTML = 'Você precisa botar sua senha';
    }

    const { data } = await axios.post(actionForm.getAttribute('action'), {
        password: password.value.trim()
    })

    if(data.success){
        document.querySelector('.rkt.button.cancel').click();

        return document.getElementById(data.questionId).remove();
    }
    
    password.value = '';
    modalResponseText.innerHTML = data.message;
    
}