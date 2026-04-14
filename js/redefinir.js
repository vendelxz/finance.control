import { apiRequest } from "./api.js";
import { carregarModalFeedback} from "./api.js";

carregarModalFeedback(exibirFeedback);
carregarModalFeedback(fecharFeedback);


function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    
    if (input.type === "password") {
        input.type = "text";
        button.innerText = "(-)"; // Ícone de esconder
    } else {
        input.type = "password";
        button.innerText = "X"; // Ícone de mostrar
    }
}
window.togglePassword = togglePassword;

function exibirFeedback(titulo, mensagem, tipo) {
    const modal = document.getElementById('modal-feedback');
    const content = document.getElementById('content-feedback');
    const txtTitulo = document.getElementById('feedback-titulo');
    const txtMsg = document.getElementById('feedback-mensagem');

    if (!modal || !content) return;

    txtTitulo.innerText = titulo;
    txtMsg.innerText = mensagem;
    content.className = 'modal-content'; 
    
    if (tipo === 'verde') content.classList.add('neon-verde-feedback');
    if (tipo === 'roxo') content.classList.add('neon-roxo-feedback');
    if (tipo === 'negativo') content.classList.add('neon-erro-feedback');

    modal.style.display = 'flex';
}

function fecharFeedback() {
    const modal = document.getElementById('modal-feedback');
    if (modal) modal.style.display = 'none';
}

// Lógica de Redefinição de Senha
document.getElementById('form-redefinir-senha').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (novaSenha !== confirmarSenha) {
        exibirFeedback("Erro", "As senhas não coincidem!", "roxo");
        return;
    }

    const DTOredefinir = {
        token: token,
        novaSenha: novaSenha
    };

    try{
        const resposta = await apiRequest(`/auth/redefinir-senha`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(DTOredefinir)
        });

        if(resposta.ok || resposta.status === 200){
            exibirFeedback("Sucesso", "Senha redefinida com sucesso! Redirecionando para o login...", "verde");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 5000);
        }else{
            exibirFeedback("Erro", "Não foi possível redefinir a senha. O token pode ser inválido ou expirado.", "roxo");
        }

    } catch (error) {
        exibirFeedback("Erro", "Ocorreu um erro ao tentar redefinir a senha.", "roxo");
    }

});
