import handleClick from './main.js';
import Response from './responseModal.js';

const divQuestions = document.querySelector('#divQuestions');

const renderQuestions = (questions, questionsRead) => {

    divQuestions.innerHTML = '';
    
    questions.forEach(question => {
        divQuestions.innerHTML += `<div class="question-wrapper" id="${question.id}">
        <div class="question-date">
        <div class="question-hour">
            ${ new Date(question.data).toLocaleString('pt-BR',{day: '2-digit', month: '2-digit',year: '2-digit' , hour: '2-digit', minute:'2-digit'}).replace(' ',' - ') }
        </div>
      </div>

        <div class="question-content">
            <div class="user">
                <img src="/images/user.svg" alt="Avatar">
            </div>
            <div class="question">
                <p>${question.title}</p>
            </div>
        </div>
        <div class="actions">
            <a href="#" class="check" data-id="${question.id}">
                <img src="/images/check.svg" alt="Marcar como lida">
                Marcar como lida
            </a>
            <a href="#" class="delete" data-id="${question.id}">
                <img src="/images/trash.svg" alt="Excluir">
                Excluir
            </a>
        </div>
    </div>`
    });

    questionsRead.forEach(question => {
        divQuestions.innerHTML += `<div class="question-wrapper read" id="${question.id}">
        <div class="question-date">
                                    <div class="question-hour">
                                        ${ new Date(question.data).toLocaleString('pt-BR',{day: '2-digit', month: '2-digit',year: '2-digit' , hour: '2-digit', minute:'2-digit'}).replace(' ',' - ') }
                                    </div>
                                  </div>
        <div class="question-content">
            <div class="user">
                <img src="/images/user.svg" alt="Avatar">
            </div>
            <div class="question">
                <p>${question.title}</p>
            </div>
        </div>
        <div class="actions">
            <span class="hour">${ new Date(question.data).toLocaleString('pt-BR',{day: '2-digit', month: '2-digit',year: '2-digit' , hour: '2-digit', minute:'2-digit'}).replace(' ',' - ') }</span>
            <a href="#" class="delete" data-id="${question.id}">
                <img src="/images/trash.svg" alt="Excluir">
                Excluir
            </a>
        </div>
    </div>`
    })
    handleClick();

}


const askForm = document.querySelector('#askForm');
const question = document.querySelector('#question');
const spanCounter = document.querySelector('span.counter');

askForm.onsubmit = async (e) => {
    e.preventDefault();

    if(question.value.trim().length < 5){
        return Response('error', 'Sua pergunta deve ter mais que 5 caracteres');
    }

    const { data } = await axios.post(`/question/create/${askForm.getAttribute('room-id')}`,{
        question: question.value.trim()
    })

    if(data.success){
        Response('success', data.message);
        question.value = '';
        spanCounter.innerHTML = '0/500';
        return renderQuestions(data.questions, data.questionsRead);
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
        password.value = '';
        document.querySelector('.rkt.button.cancel').click();
        const questionElement = document.getElementById(data.questionId)
        if(data.action === 'delete'){
            questionElement.remove();
        }else{
            questionElement.classList.add('read');
            questionElement.querySelector('.check').remove();
        }

        if(divQuestions.childElementCount) return

        return divQuestions.innerHTML = `<div class="no-questions">
        <img src="/images/noquestions.svg" alt="Sem perguntas">
        <p>Nenhuma pergunta por aqui...</p>
        <p>Faça sua primeira pergunta e envie o <br>código dessa sala para outras pessoas!</p>
    </div>`;
    }
    
    password.value = '';
    modalResponseText.innerHTML = data.message;
    
}


const type = () => {
    if(question.value.length >= 500){
        spanCounter.style.color = '#E83F5B';
        question.value = question.value.substr(0, 500);
        return spanCounter.innerHTML = `${question.value.length}/500`;
    }
    spanCounter.style.color = 'gray';
    spanCounter.innerHTML = `${question.value.length}/500`;
}

question.addEventListener('input', type)