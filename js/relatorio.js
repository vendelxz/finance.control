import { apiRequest } from "./api.js";


function exibirFeedback(titulo, mensagem, tipo) {
    const modal = document.getElementById('modal-feedback');
    const content = document.getElementById('content-feedback');
    const txtTitulo = document.getElementById('feedback-titulo');
    const txtMsg = document.getElementById('feedback-mensagem');

    if (!modal || !content) return;

    txtTitulo.innerText = titulo;
    txtMsg.innerText = mensagem;
    content.className = 'modal-content'; 
    
    if (tipo === 'verde') content.classList.add('neon-verde-feedback');
    if (tipo === 'roxo') content.classList.add('neon-roxo-feedback');
    if (tipo === 'negativo') content.classList.add('neon-erro-feedback');

    modal.style.display = 'flex';
}

function fecharFeedback() {
    const modal = document.getElementById('modal-feedback');
    if (modal) modal.style.display = 'none';
}

function inicializarLogicaRelatorios() {
    const selectAno = document.getElementById('relatorio-ano');
    const btnPdf = document.getElementById('btn-gerar-pdf');
    const btnEmail = document.getElementById('btn-enviar-relatorio-email');

    if (selectAno && selectAno.options.length === 0) {
        const anoAtual = new Date().getFullYear();
        for (let i = anoAtual - 10; i <= anoAtual + 1; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = i;
            if (i === anoAtual) opt.selected = true;
            selectAno.appendChild(opt);
        }
    }

    if (btnPdf) {
            btnPdf.onclick = async () => {
            const mes = document.getElementById('relatorio-mes').value;
            const ano = document.getElementById('relatorio-ano').value;

            try {
                const resposta = await apiRequest(`/relatorios/pdf?mes=${mes}&ano=${ano}`, {
                    method: 'GET'
                });

                // Caso de Sucesso (200 OK)
                if (resposta.ok) {
                    const blob = await resposta.blob();
                    
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Relatorio_${mes}_${ano}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                    
                    exibirFeedback("Sucesso", "O seu relatório foi gerado com sucesso!", "verde");
                } 
                // Caso de não possuir transações (404 Not Found vindo do Java)
                else if (resposta.status === 404) {
                    exibirFeedback("Sem Lançamentos", "Não existem transações registradas para este mês. O relatório não pôde ser gerado.", "roxo");
                } 
                else {
                    exibirFeedback("Aviso", "Ocorreu um erro ao tentar gerar o arquivo.", "roxo");
                }
            } catch (error) {
                exibirFeedback("Erro", "Não foi possível contactar o servidor.", "negativo");
            }
        };
    }

    if (btnEmail) {
        btnEmail.onclick = async () => {
            const mes = document.getElementById('relatorio-mes').value;
            const ano = document.getElementById('relatorio-ano').value;
            try {
                const resposta = await apiRequest(`/relatorios/email?mes=${mes}&ano=${ano}`, {
                    method: 'POST'
                });
                if (resposta.status === 202 || resposta.ok || resposta.accepted) {
                    exibirFeedback("Sucesso", "O relatório será enviado para seu e-mail em instantes.  (Verifique sua caixa de Spam por vias das dúvidas)", "verde");
                } else {
                    exibirFeedback("Aviso", "Não há dados para enviar por e-mail no período selecionado.", "roxo");
                }
            } catch (error) {
                exibirFeedback("Erro", "Erro ao solicitar envio de e-mail.", "negativo");
            }
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarLogicaRelatorios();
    
    const btnNavRelatorios = document.getElementById('btn-relatorios');
    if (btnNavRelatorios) {
        btnNavRelatorios.addEventListener('click', () => {
            setTimeout(inicializarLogicaRelatorios, 100);
        });
    }
});