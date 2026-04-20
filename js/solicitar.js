import { apiRequest } from "./api.js";
import { carregarModalFeedback } from "./api.js"

carregarModalFeedback(exibirFeedback);
carregarModalFeedback(fecharFeedback);

function exibirFeedback(titulo, mensagem, tipo) {
    const modal = document.getElementById('modal-feedback');
    const content = document.getElementById('content-feedback');
    const txtTitulo = document.getElementById('feedback-titulo');
    const txtMsg = document.getElementById('feedback-mensagem');

    txtTitulo.innerText = titulo;
    txtMsg.innerText = mensagem;
    content.className = 'modal-content'; 
    
    if (tipo === 'verde') content.classList.add('neon-verde-feedback');
    if (tipo === 'roxo') content.classList.add('neon-roxo-feedback');
    if (tipo === 'negativo') content.classList.add('neon-erro-feedback');

    modal.style.display = 'flex';
}

function fecharFeedback() {
    document.getElementById('modal-feedback').style.display = 'none';
}


function mascararEmail(email) {
    const [usuario, dominio] = email.split('@');
    if (usuario.length <= 2) return `***@${dominio}`;
    
    const visivelInicio = usuario.substring(0, 2);
    const visivelFim = usuario.substring(usuario.length - 1);
    const asteriscos = "*".repeat(usuario.length - 3);
    
    return `${visivelInicio}${asteriscos}${visivelFim}@${dominio}`;
}

 let ContarTentativas = 0;
 

document.getElementById('form-solicitar-recuperacao').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const emailInput = document.getElementById('email').value;
    const btn = document.getElementById('btn-enviar');
    const origem = window.location.origin;
    
    btn.innerText = "⏳ Processando...";
    btn.disabled = true;

    try {
                const resposta = await apiRequest(`/auth/esqueci-senha`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput , origem: origem})
        });

        const emailMascarado = mascararEmail(emailInput);


        // Mesmo que o usuário não exista
        if (resposta.ok || resposta.status === 200 ) {

            ContarTentativas++;
            exibirFeedback(
                "E-mail Enviado", 
                `Se o endereço ${emailMascarado} estiver em nossa base, um link de recuperação chegará em instantes.`, 
                "verde"
            );
            
            //Assim que aparece o feedback precisa redirecionar o usuário...
            ContarTentativasERedirecionar(resposta, ContarTentativas);
           
        } else {
            exibirFeedback("Aviso", "Não foi possível processar a solicitação no momento.", "roxo");
        }

    } catch (error) {
        exibirFeedback("Erro", "Falha na conexão com o servidor.", "negativo");
    } finally {
        btn.innerText = "Enviar Solicitação ";
        btn.disabled = false;
    }
});

function ContarTentativasERedirecionar(status, ContarTentativas) {
    if(ContarTentativas >= 3){
       exibirFeedback("Aviso", "Você fez muitas tentativas e será redirecionado.", "roxo")
        setTimeout ( () => {
            window.location.href = "login.html";
        }, 3000);
        return;
    }

    if(status === 200){
        
        setTimeout (() => {
            window.location.href = "login.html";
        }, 4000);
    }
}



  
