
const API_CONFIG = {
    BASE_URL: 'http://127.0.0.1:8080/api',
    TOKEN_KEY: 'token'
};

/**
 * 
 * @param {string} endpoint 
 * @param {object} options  
 */

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem(API_CONFIG.TOKEN_KEY);
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token && token !== 'null') {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    try {
        const resposta = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, config);

        if (resposta.status === 401 || resposta.status === 403) {
            const isAuthPage = window.location.pathname.includes('login.html') || 
                               window.location.pathname.includes('registro.html');
            
            if (!isAuthPage) {
                localStorage.removeItem(API_CONFIG.TOKEN_KEY);
                window.location.replace('../auth/login.html');
                return;
            }
        }

        return resposta;
    } catch (erro) {
        console.error('Erro na requisição:', erro);
        throw erro;
    }
}