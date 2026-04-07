if (localStorage.getItem('tema') === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
}

const token = localStorage.getItem('token');
const pathAtual = window.location.pathname;

const isLoginPage = pathAtual.includes('login.html');
const isRegistroPage = pathAtual.includes('registro.html'); 
const isRecuperarPage = pathAtual.includes("solicitar-recuperacao.html") || pathAtual.includes("redefinir-senha.html");

if ((!token || token === 'null' || token === '') && !isLoginPage && !isRegistroPage && !isRecuperarPage) {
    window.location.replace('auth/login.html'); 
}

if (token && token !== 'null' && token !== '' && isLoginPage) {
    window.location.replace('../index.html');
}

document.addEventListener('DOMContentLoaded', () => {
    
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

    const btnDashboard = document.getElementById('btn-dashboard');
    const btnTransacoes = document.getElementById('btn-transacoes');
    const btnRelatorios = document.getElementById('btn-relatorios'); 

    const secaoDashboard = document.getElementById('secao-dashboard');
    const secaoTransacoes = document.getElementById('secao-transacoes');
    const secaoRelatorios = document.getElementById('secao-relatorios'); 
    const tituloPagina = document.getElementById('titulo-pagina');

    function trocarSecao(botaoAtivo, secaoAtiva, titulo) {
        if (!botaoAtivo || !secaoAtiva) return;

        [btnDashboard, btnTransacoes, btnRelatorios].forEach(btn => btn?.classList.remove('ativo'));
        [secaoDashboard, secaoTransacoes, secaoRelatorios].forEach(sec => sec?.classList.remove('ativa'));

        botaoAtivo.classList.add('ativo');
        secaoAtiva.classList.add('ativa');
        if (tituloPagina) tituloPagina.innerText = titulo;
    }

    if (btnDashboard) btnDashboard.addEventListener('click', () => trocarSecao(btnDashboard, secaoDashboard, 'Visão Geral'));
    if (btnTransacoes) btnTransacoes.addEventListener('click', () => trocarSecao(btnTransacoes, secaoTransacoes, 'Transações'));
    if (btnRelatorios) btnRelatorios.addEventListener('click', () => trocarSecao(btnRelatorios, secaoRelatorios, 'Relatórios'));

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('token'); 
            window.location.replace('auth/login.html'); 
        });
    }
});