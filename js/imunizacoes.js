// alunos.js
import { apiBase, utils } from './api.js';

const ENDPOINT = 'imunizacoes';

export const imunizacoesModule = {
    async carregarImunizacoes() {
        try {
            const imunizacoes = await apiBase.listar(ENDPOINT);
            this.renderizarTabela(imunizacoes);
        } catch (error) {
            utils.mostrarMensagem('Erro', error.message);
        }
    },

    async carregarImunizacoesPacientes() {

        const idPaciente = utils.obterParametroUrl('idPaciente');
        if (!idPaciente) return;

        try {

            const ENDPOINTPACIENTE = `${ENDPOINT}/paciente/${idPaciente}`
            console.log(ENDPOINTPACIENTE);
            const imunizacoesPaciente = await apiBase.listar(ENDPOINTPACIENTE);
            this.renderizarTabelaPaciente(imunizacoesPaciente);

        } catch (error) {
            utils.mostrarMensagem('Erro', error.message);
        }
    },



    async cadastrarImunizacoes(event) {
        debugger;
        event.preventDefault();
        try {

            const dados = utils.getFormData(event.target);
            await apiBase.cadastrar(ENDPOINT, dados);
            utils.mostrarMensagem('Sucesso', 'Imunizacoes cadastrado com sucesso!');
            event.target.reset();
           // await this.carregarImunizacoes();
        } catch (error) {
            utils.mostrarMensagem('Erro', error.message);
        }
    },

    async carregarImunizacao() {

        const id = utils.obterParametroUrl('id');
        if (!id) return;

        try {
            const imunizacoes = await apiBase.buscarPorId(ENDPOINT, id);
            this.preencherFormulario(imunizacoes);
        } catch (error) {
            utils.mostrarMensagem('Erro', error.message);
        }
    },


    async atualizarImunizacoes(event) {
        event.preventDefault();
        const id = document.getElementById('id').value;
        try {
            const dados = utils.getFormData(event.target);
            await apiBase.atualizar(ENDPOINT, id, dados);
            utils.mostrarMensagem('Sucesso', 'Imunizacoes atualizado com sucesso!');
        } catch (error) {
            utils.mostrarMensagem('Erro', error.message);
        }
    },

    async excluirImunizacoes(id) {
        if (!confirm('Deseja realmente excluir este imunizacoes?')) return;

        try {
            await apiBase.excluir(ENDPOINT, id);
            utils.mostrarMensagem('Sucesso', 'Imunizacoes excluído com sucesso!');
            await this.carregarImunizacoes();
        } catch (error) {
            utils.mostrarMensagem('Erro', error.message);
        }
    },

    renderizarTabela(imunizacoes) {
        const tbody = document.getElementById('dadosImunizacoes');
        tbody.innerHTML = imunizacoes.map(imunizacao => `
            <tr>
                <td>${imunizacao.id}</td>
                <td>${imunizacao.nome}</td>
                <td>${imunizacao.dose}</td>
                <td>${imunizacao.dataAplicacao}</td>
                <td>${imunizacao.fabricante}</td>
                <td>${imunizacao.lote}</td>
                <td>${imunizacao.localAplicacao}</td>
                <td>${imunizacao.profissionalAplicador}</td>
                <td>
                       <button class="btn btn-danger" onclick="imunizacoesModule.excluirImunizacoes(${imunizacao.id})">
                       <i class="fa-solid fa-virus-slash"></i>
                    </button>
                    
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll('.btn-excluir').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                imunizacoesModule.excluirImunizacoes(id);
            });
        });
    },

    renderizarTabelaPaciente(imunizacoesPaciente) {

        const tbody = document.getElementById('dadosImunizacoesPaciente');
        tbody.innerHTML = imunizacoesPaciente.map(imunizacao => `
            <tr>
                <td>${imunizacao.id}</td>
                <td>${imunizacao.nome}</td>
                <td>${imunizacao.dose}</td>
                <td>${imunizacao.dataAplicacao}</td>
                <td>${imunizacao.fabricante}</td>
                <td>${imunizacao.lote}</td>
                <td>${imunizacao.localAplicacao}</td>
                <td>${imunizacao.profissionalAplicador}</td>
                <td>
                  
                    <button class="btn btn-danger" onclick="imunizacoesModule.excluirImunizacoes(${imunizacao.id})">
                       <i class="fa-solid fa-virus-slash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

    },

    preencherFormulario(imunizacoes) {
        Object.keys(imunizacoes).forEach(key => {
            const input = document.getElementById(key);
            if (input) input.value = imunizacoes[key];
        });
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se está na página de listagem


    if (document.getElementById('dadosImunizacoes')) {
        imunizacoesModule.carregarImunizacoes();
    }

    if (utils.obterParametroUrl('idPaciente')) {
        if (document.getElementById('dadosImunizacoesPaciente')) {
            imunizacoesModule.carregarImunizacoesPacientes();
        }
    }

    // Verifica se está na página de edição
    if (utils.obterParametroUrl('id')) {
        imunizacoesModule.carregarImunizacoes();
    }

    // Configura o formulário
    const form = document.querySelector('form');
    if (form && form.id == 'imunizacoes') {
        
        form.addEventListener('submit', (e) => {
            if (utils.obterParametroUrl('id')) {
                imunizacoesModule.atualizarImunizacoes(e);
            } else {
                imunizacoesModule.cadastrarImunizacoes(e);
            }
        });
    }
});

window.imunizacoesModule = imunizacoesModule; 