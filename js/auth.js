
const formLogin = document.getElementById('form-login');

formLogin.addEventListener('submit', async (evento) => {
    
    evento.preventDefault(); 

    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
       
        const resposta = await fetch('http://127.0.0.1:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, senha: senha })
        });

        if (resposta.ok) {
            
            const dados = await resposta.json();
            
            //Guardar o token para navegar nas requisições da API posteriormente...
            localStorage.setItem('token', dados.token);
            window.location.href = '/index.html'; 
        } else {
            // Se devolver 403, 404, etc.
            alert('Credenciais inválidas. Por favor, tente novamente.');
        }
    } catch (erro) {
        console.error('Erro de ligação:', erro);
        alert('Não foi possível contactar o servidor. Verifique se a API está a correr.');
    }
});