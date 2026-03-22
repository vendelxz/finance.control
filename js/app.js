document.addEventListener('DOMContentLoaded', () => {
    
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = 'login.html';
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
        window.location.href = 'login.html'; 
    });

});