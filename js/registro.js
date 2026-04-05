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

    //Novamente o apiRequest reduziu o tamanho do código em muito.
    //stringify em todos dados ao invés de criar um objeto const de cadastro já reduz verbosidade em ficar criando
    //senha : senha, email : email, etc...
    try {
        const resposta = await apiRequest('/auth/registrar', {
            method: 'POST',
            body: JSON.stringify({ nome, email, senha, confirmarSenha })
        });

        if (resposta.ok) {
            alert("Conta criada com sucesso! Faça login para entrar.");
            window.location.href = 'login.html';
        } else {
            const erro = await resposta.json().catch(() => ({}));
            alert(erro.mensagem || "Erro ao cadastrar. Verifique os dados ou se o e-mail já existe.");
        }
    } catch (erro) {
        alert("Não foi possível contactar o servidor.");
    }
});