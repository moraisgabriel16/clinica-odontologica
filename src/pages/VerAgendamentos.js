import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import Modal from 'react-modal';

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

const localizer = momentLocalizer(moment);

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  label {
    font-weight: bold;
    margin-bottom: 8px;
  }

  select, input {
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
  const [agendamentos, setAgendamentos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [dentistas, setDentistas] = useState([]);
  const [procedimentos, setProcedimentos] = useState([]);
  const [dentistaId, setDentistaId] = useState('');
  const [procedimentoId, setProcedimentoId] = useState('');
  const [pacienteId, setPacienteId] = useState('');
  const [dataHora, setDataHora] = useState('');

  useEffect(() => {
    // Carregar agendamentos da API
    const fetchAgendamentos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/agendamentos');
        const formattedAgendamentos = response.data.map((agendamento) => ({
          id: agendamento._id,
          title: `Paciente: ${agendamento.pacienteId ? agendamento.pacienteId.nome_completo : 'Desconhecido'} - Dentista: ${agendamento.dentistaId ? agendamento.dentistaId.nome : 'Não Informado'}`,
          start: new Date(agendamento.dataHora),
          end: new Date(new Date(agendamento.dataHora).getTime() + 60 * 60 * 1000), // Definindo 1h de duração
          procedimento: agendamento.procedimentoId ? agendamento.procedimentoId.nome : 'Não Informado',
          backgroundColor: agendamento.procedimentoId ? agendamento.procedimentoId.cor : '#333',
        }));
        setAgendamentos(formattedAgendamentos);
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      }
    };

    // Carregar pacientes, dentistas e procedimentos
    const fetchPacientes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/pacientes');
        setPacientes(response.data);
      } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
      }
    };

    const fetchDentistas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dentistas');
        setDentistas(response.data);
      } catch (error) {
        console.error('Erro ao carregar dentistas:', error);
      }
    };

    const fetchProcedimentos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/procedimentos');
        setProcedimentos(response.data);
      } catch (error) {
        console.error('Erro ao carregar procedimentos:', error);
      }
    };

    fetchAgendamentos();
    fetchPacientes();
    fetchDentistas();
    fetchProcedimentos();
  }, []);

  const openModal = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setModalIsOpen(true);
  };

  const openEditModal = (agendamento) => {
    setSelectedAgendamento(agendamento);
    setPacienteId(agendamento.pacienteId ? agendamento.pacienteId._id : '');
    setDentistaId(agendamento.dentistaId ? agendamento.dentistaId._id : '');
    setProcedimentoId(agendamento.procedimentoId ? agendamento.procedimentoId._id : '');
    setDataHora(moment(agendamento.start).format('YYYY-MM-DDTHH:mm'));
    setEditModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedSlot(null);
    setDentistaId('');
    setProcedimentoId('');
    setPacienteId('');
    setDataHora('');
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setSelectedAgendamento(null);
    setDentistaId('');
    setProcedimentoId('');
    setPacienteId('');
    setDataHora('');
  };

  const handleCreateAgendamento = async () => {
    const newAgendamento = {
      pacienteId,
      dentistaId,
      procedimentoId,
      dataHora: selectedSlot.start,
    };

    try {
      await axios.post('http://localhost:5000/api/agendamentos', newAgendamento);
      alert('Agendamento criado com sucesso!');
      closeModal();
      window.location.reload(); // Para atualizar os agendamentos no calendário
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      alert('Erro ao criar agendamento. Tente novamente.');
    }
  };

  const handleUpdateAgendamento = async () => {
    const updatedAgendamento = {
      pacienteId,
      dentistaId,
      procedimentoId,
      dataHora,
    };

    try {
      await axios.put(`http://localhost:5000/api/agendamentos/${selectedAgendamento.id}`, updatedAgendamento);
      alert('Agendamento atualizado com sucesso!');
      closeEditModal();
      window.location.reload(); // Para atualizar os agendamentos no calendário
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      alert('Erro ao atualizar agendamento. Tente novamente.');
    }
  };

  const handleDeleteAgendamento = async () => {
    const confirmed = window.confirm('Tem certeza que deseja excluir este agendamento?');
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/agendamentos/${selectedAgendamento.id}`);
        alert('Agendamento excluído com sucesso!');
        closeEditModal();
        window.location.reload(); // Para atualizar os agendamentos no calendário
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
        endAccessor="end"
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

export default VerAgendamentos;
