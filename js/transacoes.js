document.addEventListener('DOMContentLoaded', () => {
    
    // CORREÇÃO 1: Chamar a função assim que a página carrega!
    carregarTransacoes(); 

    const modal = document.getElementById('modal-transacao');
    const btnNovaTransacao = document.getElementById('btn-nova-transacao');
    const btnCancelar = document.getElementById('btn-cancelar-transacao');
    const formTransacao = document.getElementById('form-transacao');

    btnNovaTransacao.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    btnCancelar.addEventListener('click', () => {
        modal.style.display = 'none';
        formTransacao.reset(); 
    });

    formTransacao.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        const token = localStorage.getItem('token'); 

        // Monta o objeto DTO
        const transacaoDTO = {
            descricao: document.getElementById('descricao').value,
            valor: parseFloat(document.getElementById('valor').value),
            dataTransacao: document.getElementById('data').value,
            categoria: document.getElementById('categoria').value,
            tipo: document.getElementById('tipo').value,
            metodoPagamento: document.getElementById('metodoPagamento').value
        };

        try {
            const resposta = await fetch('http://127.0.0.1:8080/api/transacoes/criar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(transacaoDTO)
            });

            if (resposta.status === 201) {
                alert('Transação criada com sucesso!');
                modal.style.display = 'none';
                formTransacao.reset();
                
                
                carregarTransacoes();
                
            } else {
                alert('Erro ao salvar a transação. Verifique os dados.');
            }
        } catch (erro) {
            console.error('Erro:', erro);
            alert('Falha ao comunicar com o servidor.');
        }
    });

    // Função para buscar e renderizar as transações na tabela
  async function carregarTransacoes() {
        const token = localStorage.getItem('token');
        const corpoTabela = document.getElementById('corpo-tabela');

        try {
            const resposta = await fetch('http://127.0.0.1:8080/api/transacoes/usuario', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (resposta.ok) {
                const transacoes = await resposta.json();
                corpoTabela.innerHTML = ''; 

                // Variáveis para calcular os cards
                let totalReceitas = 0;
                let totalDespesas = 0;

                if (transacoes.length === 0) {
                    corpoTabela.innerHTML = `<tr><td colspan="6" style="text-align: center;">Nenhuma transação encontrada neste mês.</td></tr>`;
                    
                    document.getElementById('valor-receitas').innerText = "R$ 0,00";
                    document.getElementById('valor-despesas').innerText = "R$ 0,00";
                } else {
                    
                    transacoes.forEach(t => {
                        if (t.tipo === 'RECEITA') {
                            totalReceitas += t.valor;
                        } else if (t.tipo === 'DESPESA') {
                            totalDespesas += t.valor;
                        }

                        // Cria a linha da tabela
                        const tr = document.createElement('tr');
                        
                        let dataFormatada = "";
                        if(t.dataTransacao) {
                            const partesData = t.dataTransacao.split('-');
                            dataFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
                        }

                        const valorFormatado = t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                        
                        // Define a cor do texto na tabela
                        const classeCor = t.tipo === 'RECEITA' ? 'texto-positivo' : 'texto-negativo';

                        tr.innerHTML = `
                            <td>${dataFormatada}</td>
                            <td>${t.descricao}</td>
                            <td>${t.categoria}</td>
                            <td>${t.metodoPagamento}</td>
                            <td class="${classeCor}">${valorFormatado}</td>
                            <td>
                                <button class="btn-cancelar" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; color: #e74c3c; border-color: #e74c3c;">Excluir</button>
                            </td>
                        `;
                        corpoTabela.appendChild(tr);
                    });

                    // Insere os valores calculados nos Cards da tela
                    document.getElementById('valor-receitas').innerText = totalReceitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                    document.getElementById('valor-despesas').innerText = totalDespesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                }

                // 2. Busca o Saldo Total direto da sua API
                const respostaBalanco = await fetch('http://127.0.0.1:8080/api/transacoes/balanco', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (respostaBalanco.ok) {
                    const saldoTotal = await respostaBalanco.json();
                    document.getElementById('valor-saldo').innerText = saldoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                }

            } else {
                corpoTabela.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Erro ao buscar dados. Tente novamente.</td></tr>`;
            }
        } catch (erro) {
            console.error('Erro:', erro);
            corpoTabela.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Servidor offline.</td></tr>`;
        }
    }
});