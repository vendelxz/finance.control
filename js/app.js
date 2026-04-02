document.addEventListener('DOMContentLoaded', () => {
    
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = '/auth/login.html';
        return; 
    }

    const btnDashboard = document.getElementById('btn-dashboard');
    const btnTransacoes = document.getElementById('btn-transacoes');
    const secaoDashboard = document.getElementById('secao-dashboard');
    const secaoTransacoes = document.getElementById('secao-transacoes');
    const tituloPagina = document.getElementById('titulo-pagina');

   
    btnDashboard.addEventListener('click', () => {
    
        btnDashboard.classList.add('ativo');
        btnTransacoes.classList.remove('ativo');
        
        secaoDashboard.classList.add('ativa');
        secaoTransacoes.classList.remove('ativa');
        
        tituloPagina.innerText = 'Visão Geral';
    });

    btnTransacoes.addEventListener('click', () => {
        btnTransacoes.classList.add('ativo');
        btnDashboard.classList.remove('ativo');
        
        secaoTransacoes.classList.add('ativa');
        secaoDashboard.classList.remove('ativa');
        
        tituloPagina.innerText = 'Transações';
    });

    const btnLogout = document.getElementById('btn-logout');
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('token'); 
        window.location.href = '/auth/login.html'; 
    });

});
document.addEventListener('DOMContentLoaded', () => {
    
    if (localStorage.getItem('tema') === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }

    const btnTema = document.getElementById('btn-tema');
    
    if (btnTema) {
        if (localStorage.getItem('tema') === 'dark') {
            btnTema.innerHTML = '☀️ Claro';
        }

        btnTema.addEventListener('click', () => {
            const temaEscuroAtivo = document.body.getAttribute('data-theme') === 'dark';
            
            if (temaEscuroAtivo) {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('tema', 'light');
                btnTema.innerHTML = '🌙 Escuro';
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('tema', 'dark');
                btnTema.innerHTML = '☀️ Claro';
            }
        });
    }
});