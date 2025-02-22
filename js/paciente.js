// alunos.js
import { apiBase, utils } from './api.js';

const ENDPOINT = 'paciente';

export const pacienteModule = {
    async carregarPacientes() {
        try {
            const paciente = await apiBase.listar(ENDPOINT);
            this.renderizarTabela(paciente);
        } catch (error) {
            utils.mostrarMensagem('Erro', error.message);
        }
    },

    async cadastrarPaciente(event) {
        event.preventDefault();
        try {
            debugger;
            const dados = utils.getFormData(event.target);
            await apiBase.cadastrar(ENDPOINT, dados);
            utils.mostrarMensagem('Sucesso', 'Paciente cadastrado com sucesso!');
            event.target.reset();
            await this.carregarPacientes();
        } catch (error) {
            utils.mostrarMensagem('Erro', error.message);
        }
    },

    async carregarPaciente() {
        const id = utils.obterParametroUrl('id');
        if (!id) return;

        try {
            const paciente = await apiBase.buscarPorId(ENDPOINT, id);
            this.preencherFormulario(paciente);
        } catch (error) {
            utils.mostrarMensagem('Erro', error.message);
        }
    },

    async atualizarPaciente(event) {
        event.preventDefault();
        const id = document.getElementById('id').value;
        try {
            const dados = utils.getFormData(event.target);
            await apiBase.atualizar(ENDPOINT, id, dados);
            utils.mostrarMensagem('Sucesso', 'Paciente atualizado com sucesso!');
        } catch (error) {
            utils.mostrarMensagem('Erro', error.message);
        }
    },

    async excluirPaciente(id) {
        if (!confirm('Deseja realmente excluir este paciente?')) return;
        
        try {
            await apiBase.excluir(ENDPOINT, id);
            utils.mostrarMensagem('Sucesso', 'Paciente excluído com sucesso!');
            await this.carregarPacientes();
        } catch (error) {
            utils.mostrarMensagem('Erro', error.message);
        }
    },

    renderizarTabela(paciente) {
        const tbody = document.getElementById('dadosPaciente');
        tbody.innerHTML = paciente.map(paciente => `
            <tr>
                <td>${paciente.id}</td>
                <td>${paciente.nome}</td>
                <td>${paciente.cpf}</td>
                <td>${paciente.sexo}</td>
                <td>${paciente.data_nascimento}</td>
                <td>${paciente.responsavel}</td>
                <td>
                    <a href="/cadastro/editar/paciente.html?id=${paciente.id}">
                        <button class="w3-button w3-green w3-round">Editar</button>
                    </a>
                    <button class="w3-button w3-red w3-round" 
                            onclick=this.excluirAluno('${paciente.id}')>
                        Excluir
                    </button>
                </td>
            </tr>
        `).join('');
    },

    preencherFormulario(paciente) {
        Object.keys(paciente).forEach(key => {
            const input = document.getElementById(key);
            if (input) input.value = paciente[key];
        });
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se está na página de listagem
    if (document.getElementById('dadosPaciente')) {
        pacienteModule.carregarPacientes();
    }

    // Verifica se está na página de edição
    if (utils.obterParametroUrl('id')) {
        pacienteModule.carregarPaciente();
    }

    // Configura o formulário
    const form = document.querySelector('form');
    if (form) {
        alert("form");
        form.addEventListener('submit', (e) => {
            if (utils.obterParametroUrl('id')) {
                pacienteModule.atualizarPaciente(e);
            } else {
                pacienteModule.cadastrarPaciente(e);
            }
        });
    }
});