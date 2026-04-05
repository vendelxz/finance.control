const formLogin = document.getElementById('form-login');

formLogin.addEventListener('submit', async (evento) => {
    evento.preventDefault(); 

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    //Desse modo fica tudo mais limpo e funcional
    //o meu apiRequest lida com o endpoint, headers, options, token e redirecionamento automaticamente...
    try {
        const resposta = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, senha })
        });

        if (resposta.ok) {
            const dados = await resposta.json();
            localStorage.setItem('token', dados.token);
            window.location.href = '../index.html'; 
        } else {
            alert('Credenciais inválidas. Por favor, tente novamente.');
        }
    } catch (erro) {
        console.error('Erro de ligação:', erro);
        alert('Não foi possível contactar o servidor. Verifique se a API está a correr.');
    }
});