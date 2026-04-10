import { apiRequest } from "./api.js";

document.addEventListener('DOMContentLoaded', () => {
    inicializarFiltrosDatas();
    buscarTransacoesPorFiltro();

    const btnBuscar = document.getElementById('btn-buscar-filtros');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', buscarTransacoesPorFiltro);
    }

    const modal = document.getElementById('modal-transacao');
    const btnNovaTransacao = document.getElementById('btn-nova-transacao');
    const btnCancelar = document.getElementById('btn-cancelar-transacao');
    const formTransacao = document.getElementById('form-transacao');

    if (btnNovaTransacao) {
        btnNovaTransacao.addEventListener('click', () => modal.style.display = 'flex');
    }

    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            modal.style.display = 'none';
            formTransacao.reset(); 
        });
    }

    if (formTransacao) {
        formTransacao.addEventListener('submit', async (evento) => {
            evento.preventDefault();
            await salvarTransacao();
        });
    }
});

function inicializarFiltrosDatas() {
    const selectMes = document.getElementById('filtro-mes');
    const selectAno = document.getElementById('filtro-ano');
    
    if (!selectMes || !selectAno) return;

    const dataAtual = new Date();
    selectMes.value = dataAtual.getMonth() + 1; 

    const anoAtual = dataAtual.getFullYear();
    selectAno.innerHTML = ''; 
    
    const anoInicial = anoAtual - 10; 

    for (let ano = anoInicial; ano <= anoAtual + 1; ano++) {
        const option = document.createElement('option');
        option.value = ano;
        option.textContent = ano;
        if (ano === anoAtual) option.selected = true;
        selectAno.appendChild(option);
    }
}

async function buscarTransacoesPorFiltro() {
    const mes = document.getElementById('filtro-mes').value;
    const ano = document.getElementById('filtro-ano').value;
    const corpoTabela = document.getElementById('corpo-tabela');

    corpoTabela.innerHTML = `<tr><td colspan="6" style="text-align: center;">Buscando transações...</td></tr>`;

    try {
        const resposta = await apiRequest(`/transacoes/filtro?mes=${mes}&ano=${ano}`, {
            method: 'GET'
        });

        if (resposta.ok) {
            const transacoes = await resposta.json();
            renderizarTabela(transacoes);
            atualizarCardsVisaoGeral(transacoes);
        } else {
            corpoTabela.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Erro ao buscar dados do mês.</td></tr>`;
        }
    } catch (erro) {
        console.error('Erro:', erro);
        corpoTabela.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Servidor offline.</td></tr>`;
    }
}

function renderizarTabela(transacoes) {
    const corpoTabela = document.getElementById('corpo-tabela');
    corpoTabela.innerHTML = ''; 

    if (transacoes.length === 0) {
        corpoTabela.innerHTML = `<tr><td colspan="6" style="text-align: center;">Nenhuma transação neste período.</td></tr>`;
        return;
    }

    transacoes.forEach(t => {
        const tr = document.createElement('tr');
        
        let dataFormatada = "";
        if(t.dataTransacao) {
            const partes = t.dataTransacao.split('-');
            dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
        }

        const valorFormatado = t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const classeCor = t.tipo === 'RECEITA' ? 'texto-positivo' : 'texto-negativo';

        tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td>${t.descricao}</td>
            <td>${t.categoria}</td>
            <td>${t.metodoPagamento}</td>
            <td class="${classeCor}">${valorFormatado}</td>
            <td>
                <button class="btn-cancelar" onclick="deletarTransacao('${t.id}')" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; color: #ff4d4d; border: 1px solid #ff4d4d; background: transparent; cursor: pointer; border-radius: 4px; transition: all 0.3s;">Excluir</button>
            </td>
        `;
        corpoTabela.appendChild(tr);
    });
}

function atualizarCardsVisaoGeral(transacoes) {
    let totalReceitas = 0;
    let totalDespesas = 0;

    transacoes.forEach(t => {
        if (t.tipo === 'RECEITA') totalReceitas += t.valor;
        else if (t.tipo === 'DESPESA') totalDespesas += t.valor;
    });

    const saldoDoMes = totalReceitas - totalDespesas;

    document.getElementById('valor-receitas').innerText = totalReceitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('valor-despesas').innerText = totalDespesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    const cardSaldo = document.getElementById('valor-saldo');
    cardSaldo.innerText = saldoDoMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    if (saldoDoMes < 0) {
        cardSaldo.style.color = '#ff4d4d';
        cardSaldo.style.textShadow = '0 0 8px rgba(255, 77, 77, 0.4)';
    } else {
        cardSaldo.style.color = '#00e5ff';
        cardSaldo.style.textShadow = '0 0 8px rgba(0, 229, 255, 0.4)';
    }
}


async function salvarTransacao() {
    const modal = document.getElementById('modal-transacao');
    const formTransacao = document.getElementById('form-transacao');

    const transacaoDTO = {
        descricao: document.getElementById('descricao').value,
        valor: parseFloat(document.getElementById('valor').value),
        dataTransacao: document.getElementById('data').value,
        categoria: document.getElementById('categoria').value,
        tipo: document.getElementById('tipo').value,
        metodoPagamento: document.getElementById('metodoPagamento').value
    };

    try {
        const resposta = await apiRequest('/transacoes/criar', {
            method: 'POST',
            body: JSON.stringify(transacaoDTO)
        });

        if (resposta.status === 201) {
            modal.style.display = 'none';
            formTransacao.reset();
            
            buscarTransacoesPorFiltro();
        } else {
            alert('Erro ao salvar a transação. Verifique os dados.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Falha ao comunicar com o servidor.');
    }
}

async function deletarTransacao(id) {
    const confirmacao = window.confirm("Tem certeza que deseja excluir esta transação?");
    if (!confirmacao) {
        return; 
    }

    try {
        const resposta = await apiRequest(`/transacoes/${id}`, {
            method: 'DELETE'
        });

        if (resposta.ok) {
            buscarTransacoesPorFiltro();
        } else {
            alert('Erro ao excluir a transação. Verifique as suas permissões.');
        }
    } catch (erro) {
        console.error('Erro ao excluir:', erro);
        alert('Falha ao comunicar com o servidor.');
    }
}