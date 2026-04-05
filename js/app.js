if (localStorage.getItem('tema') === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
}

const token = localStorage.getItem('token');
const isLoginPage = window.location.pathname.includes('login.html');
const isRegistroPage = window.location.pathname.includes('registro.html'); 

if ((!token || token === 'null' || token === 'undefined' || token === '') && !isLoginPage && !isRegistroPage) {
    window.location.replace('auth/login.html'); 
}

if (token && token !== 'null' && token !== 'undefined' && token !== '' && isLoginPage) {
    window.location.replace('../index.html');
}

//DASHBOARD
document.addEventListener('DOMContentLoaded', () => {
    
    const btnDashboard = document.getElementById('btn-dashboard');
    const btnTransacoes = document.getElementById('btn-transacoes');
    const secaoDashboard = document.getElementById('secao-dashboard');
    const secaoTransacoes = document.getElementById('secao-transacoes');
    const tituloPagina = document.getElementById('titulo-pagina');

    if (btnDashboard && btnTransacoes) {
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
    }

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('token'); 
            window.location.replace('auth/login.html'); 
        });
    }

    const btnTema = document.getElementById('btn-tema');
    if (btnTema) {
        if (localStorage.getItem('tema') === 'dark') {
            btnTema.innerHTML = '☀️ Light Mode';
        }

        btnTema.addEventListener('click', () => {
            document.body.classList.add('anima-tema');

            const temaEscuroAtivo = document.body.getAttribute('data-theme') === 'dark';

            if (temaEscuroAtivo) {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('tema', 'light');
                btnTema.innerHTML = '🌙 Dark Mode';
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('tema', 'dark');
                btnTema.innerHTML = '☀️ Light Mode';
            }
        });
    }
});

//Relatórios PDF
document.addEventListener('DOMContentLoaded', () => {
    const btnDashboard = document.getElementById('btn-dashboard');
    const btnTransacoes = document.getElementById('btn-transacoes');
    const btnRelatorios = document.getElementById('btn-relatorios'); 

    const secaoDashboard = document.getElementById('secao-dashboard');
    const secaoTransacoes = document.getElementById('secao-transacoes');
    const secaoRelatorios = document.getElementById('secao-relatorios'); 
    
    const tituloPagina = document.getElementById('titulo-pagina');

    function trocarSecao(botaoAtivo, secaoAtiva, titulo) {

        [btnDashboard, btnTransacoes, btnRelatorios].forEach(btn => btn?.classList.remove('ativo'));
        [secaoDashboard, secaoTransacoes, secaoRelatorios].forEach(sec => sec?.classList.remove('ativa'));

        botaoAtivo.classList.add('ativo');
        secaoAtiva.classList.add('ativa');
        tituloPagina.innerText = titulo;
    }

    if (btnDashboard) btnDashboard.addEventListener('click', () => trocarSecao(btnDashboard, secaoDashboard, 'Visão Geral'));
    if (btnTransacoes) btnTransacoes.addEventListener('click', () => trocarSecao(btnTransacoes, secaoTransacoes, 'Transações'));
    if (btnRelatorios) btnRelatorios.addEventListener('click', () => trocarSecao(btnRelatorios, secaoRelatorios, 'Relatórios'));

});