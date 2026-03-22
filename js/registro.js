document.addEventListener('DOMContentLoaded', () => {
    const formRegistro = document.getElementById('form-registro');

    formRegistro.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem. Tente novamente.");
            return; 
        }

        const dadosCadastro = {
            nome: nome,
            email: email,
            senha: senha,
            confirmarSenha: confirmarSenha
        };

        try {
            
            const resposta = await fetch('http://127.0.0.1:8080/api/auth/registrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosCadastro)
            });

            if (resposta.status === 201 || resposta.ok) {
                alert("Conta criada com sucesso! Faça login para entrar.");
                window.location.href = 'login.html'; // Redireciona para o login
            } else if (resposta.status === 400) {
                alert("Erro ao cadastrar. Verifique se o e-mail já está em uso.");
            } else {
                alert("Erro inesperado. Tente novamente mais tarde.");
            }

        } catch (erro) {
            console.error("Erro de conexão:", erro);
            alert("Não foi possível contactar o servidor. Verifique se a API está rodando.");
        }
    });
});