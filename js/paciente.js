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
          
            const dados = utils.getFormData(event.target);
            await apiBase.cadastrar(ENDPOINT, dados);
            utils.mostrarMensagem('Sucesso', 'Paciente cadastrado com sucesso!');
            event.target.reset();
            await this.carregarPacientes();
        } catch (error) {
            utils.mostrarMensagem('Erro', error.message);
        }
    },

    async cadastrarDependente(event) {
        debugger;
        event.preventDefault();
        const idDependente = utils.obterParametroUrl('idDependente');
        if (!idDependente) return;
        try {
            
            dados = utils.getFormData(event.target);
            await apiBase.cadastrar(ENDPOINT, dados);
            utils.mostrarMensagem('Sucesso', 'Dependente cadastrado com sucesso!');
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
        debugger;
        event.preventDefault();
        const id = utils.obterParametroUrl('id');
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
            debugger;
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
                <td>${paciente.nomeResponsavel !== undefined ? paciente.nomeResponsavel : ''}</td>
                <td>
                <a href="/editar/paciente.html?id=${paciente.id}">
                    <button class="btn btn-warning" data-toggle="tooltip" data-placement="top" title="Alterar Paciente">
                    <i class="fa-solid fa-user-pen text-white"></i></button>
                </a>
                <a href="/cadastro/dependente.html?idDependente=${paciente.id}">
                    <button class="btn btn-success" data-toggle="tooltip" data-placement="top"  title="Cadastrar Dependente" >
                    <i class="fa-solid fa-users"></i></i></button>
                </a>
                <a href="imunizacoespaciente.html?idPaciente=${paciente.id}">
                    <button class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Imunizações Paciente"><i class="fa-solid fa-syringe"></i></button>
                </a>
                <button class="btn btn-danger btn-excluir" data-toggle="tooltip" data-placement="top" title="Excluir Paciente" 
                    onclick="pacienteModule.excluirPaciente(${paciente.id})">
                        <i class="fa-solid fa-user-xmark"></i>
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
 
        form.addEventListener('submit', (e) => {

            if (utils.obterParametroUrl('id')) {
                pacienteModule.atualizarPaciente(e);
            } else if((utils.obterParametroUrl('idDependente'))){
                pacienteModule.cadastrarDependente(e);
            } else {
                pacienteModule.cadastrarPaciente(e);
            }
        });
    }
});

window.pacienteModule = pacienteModule;