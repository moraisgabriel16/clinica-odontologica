import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br'; // Importar o idioma português do Brasil para o moment
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import Modal from 'react-modal';

// Contexto para compartilhar agendamentos
const AgendamentoContext = createContext();

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #007bff;
`;

moment.locale('pt-br'); // Definir o idioma do moment para português
const localizer = momentLocalizer(moment);

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  label {
    font-weight: bold;
    margin-bottom: 8px;
  }

  select,
  input {
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    width: 100%;
    font-size: 16px;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;

  button {
    padding: 12px 25px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;

    &.confirm {
      background-color: #28a745;
      color: white;
      &:hover {
        background-color: #218838;
      }
    }

    &.cancel {
      background-color: #dc3545;
      color: white;
      &:hover {
        background-color: #c82333;
      }
    }

    &.delete {
      background-color: #6c757d;
      color: white;
      &:hover {
        background-color: #5a6268;
      }
    }
  }
`;

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '40px',
    maxWidth: '600px',
    width: '100%',
    borderRadius: '12px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    border: 'none',
    zIndex: '1050',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: '1000',
  },
};

const ModalTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #007bff;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
`;

const VerAgendamentos = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [dentistaId, setDentistaId] = useState('');
  const [procedimentoId, setProcedimentoId] = useState('');
  const [pacienteId, setPacienteId] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [duracao, setDuracao] = useState(60); // Duração padrão de 60 minutos

  const { agendamentos, pacientes, dentistas, procedimentos, fetchAgendamentos } = useContext(AgendamentoContext);

  useEffect(() => {
    fetchAgendamentos();
  }, [fetchAgendamentos]);

  const openModal = (slotInfo) => {
    if (!pacientes.length || !dentistas.length || !procedimentos.length) {
      alert('Por favor, aguarde até que todos os dados sejam carregados.');
      return;
    }
    setSelectedSlot(slotInfo);
    setPacienteId('');
    setDentistaId('');
    setProcedimentoId('');
    setDataHora(moment(slotInfo.start).format('YYYY-MM-DDTHH:mm'));
    setDuracao(60); // Duração padrão para novo agendamento
    setModalIsOpen(true);
  };

  const openEditModal = (agendamento) => {
    if (!pacientes.length || !dentistas.length || !procedimentos.length) {
      alert('Por favor, aguarde até que todos os dados sejam carregados.');
      return;
    }
    setSelectedAgendamento(agendamento);

    // Garantir que todos os estados sejam preenchidos com os valores do agendamento
    setPacienteId(agendamento.pacienteId && agendamento.pacienteId._id ? agendamento.pacienteId._id : agendamento.pacienteId || '');
    setDentistaId(agendamento.dentistaId && agendamento.dentistaId._id ? agendamento.dentistaId._id : agendamento.dentistaId || '');
    setProcedimentoId(agendamento.procedimentoId && agendamento.procedimentoId._id ? agendamento.procedimentoId._id : agendamento.procedimentoId || '');

    setDataHora(moment(agendamento.start).format('YYYY-MM-DDTHH:mm')); // Certifique-se de que dataHora esteja no formato correto
    setDuracao(agendamento.duracao || 60); // Definir a duração ao abrir o modal de edição

    setEditModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    clearModalFields();
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    clearModalFields();
  };

  const clearModalFields = () => {
    setSelectedSlot(null);
    setSelectedAgendamento(null);
    setDentistaId('');
    setProcedimentoId('');
    setPacienteId('');
    setDataHora('');
    setDuracao(60); // Redefinir duração padrão
  };

  const handleCreateAgendamento = async () => {
    if (!pacientes.length || !dentistas.length || !procedimentos.length) {
      alert('Por favor, aguarde até que todos os dados sejam carregados.');
      return;
    }
    const newAgendamento = {
      pacienteId,
      dentistaId,
      procedimentoId,
      dataHora: selectedSlot.start,
      duracao: Number(duracao),
    };

    try {
      await axios.post('https://clinica-backend-beige.vercel.app/api/agendamentos', newAgendamento);
      alert('Agendamento criado com sucesso!');
      closeModal();
      fetchAgendamentos();
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      alert('Erro ao criar agendamento. Tente novamente.');
    }
  };

  const handleUpdateAgendamento = async () => {
    if (!pacientes.length || !dentistas.length || !procedimentos.length) {
      alert('Por favor, aguarde até que todos os dados sejam carregados.');
      return;
    }
    const updatedAgendamento = {
      pacienteId,
      dentistaId,
      procedimentoId,
      dataHora,
      duracao: Number(duracao),
    };

    try {
      await axios.put(`https://clinica-backend-beige.vercel.app/api/agendamentos/${selectedAgendamento.id}`, updatedAgendamento);
      alert('Agendamento atualizado com sucesso!');
      closeEditModal();
      fetchAgendamentos();
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      alert('Erro ao atualizar agendamento. Tente novamente.');
    }
  };

  const handleDeleteAgendamento = async () => {
    const confirmed = window.confirm('Tem certeza que deseja excluir este agendamento?');
    if (confirmed) {
      try {
        await axios.delete(`https://clinica-backend-beige.vercel.app/api/agendamentos/${selectedAgendamento.id}`);
        alert('Agendamento excluído com sucesso!');
        closeEditModal();
        fetchAgendamentos();
      } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
        alert('Erro ao excluir o agendamento. Tente novamente.');
      }
    }
  };

  return (
    <Container>
      <Title>Ver Agendamentos</Title>
      <Calendar
        localizer={localizer}
        events={agendamentos}
        startAccessor="start"
        endAccessor={(event) => {
          return new Date(new Date(event.start).getTime() + (event.duracao || 60) * 60000);
        }}
        style={{ height: 600 }}
        views={['month', 'week', 'day']}
        defaultView="month"
        selectable
        onSelectSlot={openModal}
        onSelectEvent={openEditModal}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.backgroundColor,
            color: '#fff',
            borderRadius: '8px',
            border: 'none',
          },
        })}
        messages={{
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          today: 'Hoje',
          previous: 'Anterior',
          next: 'Próximo',
          showMore: (total) => `+${total} mais`,
        }}
      />

      {/* Modal para Criar Novo Agendamento */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Agendar Paciente"
        ariaHideApp={false}
      >
        <ModalTitle>Agendar Paciente</ModalTitle>
        <ModalContent>
          <div>
            <label>Paciente</label>
            <select value={pacienteId} onChange={(e) => setPacienteId(e.target.value)}>
              <option value="">Selecione o paciente</option>
              {pacientes.map((paciente) => (
                <option key={paciente._id} value={paciente._id}>
                  {paciente.nome_completo}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Nome do Dentista</label>
            <select value={dentistaId} onChange={(e) => setDentistaId(e.target.value)}>
              <option value="">Selecione o dentista</option>
              {dentistas.map((dentista) => (
                <option key={dentista._id} value={dentista._id}>
                  {dentista.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Tipo de Procedimento</label>
            <select value={procedimentoId} onChange={(e) => setProcedimentoId(e.target.value)}>
              <option value="">Selecione o procedimento</option>
              {procedimentos.map((procedimento) => (
                <option key={procedimento._id} value={procedimento._id}>
                  {procedimento.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Data e Hora</label>
            <input
              type="datetime-local"
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
            />
          </div>
          <div>
            <label>Duração (em minutos)</label>
            <input
              type="number"
              value={duracao}
              onChange={(e) => setDuracao(Number(e.target.value))}
              min="15"
            />
          </div>
        </ModalContent>
        <ModalButtons>
          <button className="confirm" onClick={handleCreateAgendamento}>
            Confirmar
          </button>
          <button className="cancel" onClick={closeModal}>
            Cancelar
          </button>
        </ModalButtons>
      </Modal>

      {/* Modal para Editar Agendamento Existente */}
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={closeEditModal}
        style={customStyles}
        contentLabel="Editar Agendamento"
        ariaHideApp={false}
      >
        <ModalTitle>Editar Agendamento</ModalTitle>
        <ModalContent>
          <div>
            <label>Paciente</label>
            <select value={pacienteId} onChange={(e) => setPacienteId(e.target.value)}>
              <option value="">Selecione o paciente</option>
              {pacientes.map((paciente) => (
                <option key={paciente._id} value={paciente._id}>
                  {paciente.nome_completo}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Nome do Dentista</label>
            <select value={dentistaId} onChange={(e) => setDentistaId(e.target.value)}>
              <option value="">Selecione o dentista</option>
              {dentistas.map((dentista) => (
                <option key={dentista._id} value={dentista._id}>
                  {dentista.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Tipo de Procedimento</label>
            <select value={procedimentoId} onChange={(e) => setProcedimentoId(e.target.value)}>
              <option value="">Selecione o procedimento</option>
              {procedimentos.map((procedimento) => (
                <option key={procedimento._id} value={procedimento._id}>
                  {procedimento.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Data e Hora</label>
            <input
              type="datetime-local"
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
            />
          </div>
          <div>
            <label>Duração (em minutos)</label>
            <input
              type="number"
              value={duracao}
              onChange={(e) => setDuracao(Number(e.target.value))}
              min="15"
            />
          </div>
        </ModalContent>
        <ModalButtons>
          <button className="confirm" onClick={handleUpdateAgendamento}>
            Salvar
          </button>
          <button className="cancel" onClick={closeEditModal}>
            Cancelar
          </button>
          <button className="delete" onClick={handleDeleteAgendamento}>
            Excluir
          </button>
        </ModalButtons>
      </Modal>
    </Container>
  );
};

// Componente de Provedor para fornecer contexto de Agendamentos
const AgendamentoProvider = ({ children }) => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [dentistas, setDentistas] = useState([]);
  const [procedimentos, setProcedimentos] = useState([]);

  // Memorizar a função fetchAgendamentos com useCallback
  const fetchAgendamentos = useCallback(async () => {
    try {
      const response = await axios.get('https://clinica-backend-beige.vercel.app/api/agendamentos');
      const formattedAgendamentos = response.data.map((agendamento) => ({
        id: agendamento._id,
        title: `Paciente: ${agendamento.pacienteId ? agendamento.pacienteId.nome_completo : 'Desconhecido'} - Dentista: ${agendamento.dentistaId ? agendamento.dentistaId.nome : 'Não Informado'}`,
        start: new Date(agendamento.dataHora),
        end: new Date(new Date(agendamento.dataHora).getTime() + agendamento.duracao * 60000),
        procedimento: agendamento.procedimentoId ? agendamento.procedimentoId.nome : 'Não Informado',
        backgroundColor: agendamento.procedimentoId ? agendamento.procedimentoId.cor : '#333',
        duracao: agendamento.duracao, // Inclui a duração no evento
      }));
      setAgendamentos(formattedAgendamentos);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    }
  }, []); // A função é estável e só será recriada se algo mudar

  const fetchPacientes = useCallback(async () => {
    try {
      const response = await axios.get('https://clinica-backend-beige.vercel.app/api/pacientes');
      setPacientes(response.data);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    }
  }, []);

  const fetchDentistas = useCallback(async () => {
    try {
      const response = await axios.get('https://clinica-backend-beige.vercel.app/api/dentistas');
      setDentistas(response.data);
    } catch (error) {
      console.error('Erro ao carregar dentistas:', error);
    }
  }, []);

  const fetchProcedimentos = useCallback(async () => {
    try {
      const response = await axios.get('https://clinica-backend-beige.vercel.app/api/procedimentos');
      setProcedimentos(response.data);
    } catch (error) {
      console.error('Erro ao carregar procedimentos:', error);
    }
  }, []);

  useEffect(() => {
    fetchAgendamentos();
    fetchPacientes();
    fetchDentistas();
    fetchProcedimentos();
  }, [fetchAgendamentos, fetchPacientes, fetchDentistas, fetchProcedimentos]);

  return (
    <AgendamentoContext.Provider value={{ agendamentos, pacientes, dentistas, procedimentos, fetchAgendamentos }}>
      {children}
    </AgendamentoContext.Provider>
  );
};

export default VerAgendamentos;
export { AgendamentoProvider };
