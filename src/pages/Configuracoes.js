import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Styled Components Definitions
const Container = styled.div`
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
`;

const Section = styled.div`
  margin-bottom: 30px;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const SectionTitle = styled.h3`
  margin-bottom: 20px;
  color: #007bff;
`;

const FormControl = styled.div`
  margin-bottom: 15px;

  label {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }

  input, select {
    padding: 10px;
    width: 100%;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 16px;
  }

  button {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background-color: #218838;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;

  button {
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;

    &.edit {
      background-color: #ffc107;
      color: white;
      &:hover {
        background-color: #e0a800;
      }
    }

    &.delete {
      background-color: #dc3545;
      color: white;
      &:hover {
        background-color: #c82333;
      }
    }

    &.save {
      background-color: #007bff;
      color: white;
      &:hover {
        background-color: #0056b3;
      }
    }

    &.cancel {
      background-color: #6c757d;
      color: white;
      &:hover {
        background-color: #5a6268;
      }
    }
  }
`;

// Main Component
const Configuracoes = () => {
  const [dentistas, setDentistas] = useState([]);
  const [novoDentista, setNovoDentista] = useState('');
  const [editDentistaId, setEditDentistaId] = useState(null);
  const [editDentistaNome, setEditDentistaNome] = useState('');

  const [procedimentos, setProcedimentos] = useState([]);
  const [novoProcedimento, setNovoProcedimento] = useState('');
  const [corProcedimento, setCorProcedimento] = useState('#000000');
  const [editProcedimentoId, setEditProcedimentoId] = useState(null);
  const [editProcedimentoNome, setEditProcedimentoNome] = useState('');
  const [editProcedimentoCor, setEditProcedimentoCor] = useState('#000000');

  useEffect(() => {
    const fetchConfiguracoes = async () => {
      try {
        const dentistasResponse = await axios.get('http://localhost:5000/api/dentistas');
        setDentistas(dentistasResponse.data);

        const procedimentosResponse = await axios.get('http://localhost:5000/api/procedimentos');
        setProcedimentos(procedimentosResponse.data);
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    };
    fetchConfiguracoes();
  }, []);

  // Handlers para Dentistas
  const handleAddDentista = async () => {
    if (novoDentista) {
      try {
        const response = await axios.post('http://localhost:5000/api/dentistas', { nome: novoDentista });
        setDentistas([...dentistas, response.data]);
        setNovoDentista('');
      } catch (error) {
        console.error('Erro ao adicionar dentista:', error);
      }
    }
  };

  const handleEditDentista = (dentista) => {
    setEditDentistaId(dentista._id);
    setEditDentistaNome(dentista.nome);
  };

  const handleUpdateDentista = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/dentistas/${editDentistaId}`, { nome: editDentistaNome });
      setDentistas(dentistas.map((dentista) => (dentista._id === editDentistaId ? response.data : dentista)));
      setEditDentistaId(null);
      setEditDentistaNome('');
    } catch (error) {
      console.error('Erro ao atualizar dentista:', error);
    }
  };

  const handleDeleteDentista = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/dentistas/${id}`);
      setDentistas(dentistas.filter((dentista) => dentista._id !== id));
    } catch (error) {
      console.error('Erro ao deletar dentista:', error);
    }
  };

  // Handlers para Procedimentos
  const handleAddProcedimento = async () => {
    if (novoProcedimento && corProcedimento) {
      try {
        const response = await axios.post('http://localhost:5000/api/procedimentos', { nome: novoProcedimento, cor: corProcedimento });
        setProcedimentos([...procedimentos, response.data]);
        setNovoProcedimento('');
        setCorProcedimento('#000000');
      } catch (error) {
        console.error('Erro ao adicionar procedimento:', error);
      }
    }
  };

  const handleEditProcedimento = (procedimento) => {
    setEditProcedimentoId(procedimento._id);
    setEditProcedimentoNome(procedimento.nome);
    setEditProcedimentoCor(procedimento.cor);
  };

  const handleUpdateProcedimento = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/procedimentos/${editProcedimentoId}`, { nome: editProcedimentoNome, cor: editProcedimentoCor });
      setProcedimentos(procedimentos.map((proc) => (proc._id === editProcedimentoId ? response.data : proc)));
      setEditProcedimentoId(null);
      setEditProcedimentoNome('');
      setEditProcedimentoCor('#000000');
    } catch (error) {
      console.error('Erro ao atualizar procedimento:', error);
    }
  };

  const handleDeleteProcedimento = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/procedimentos/${id}`);
      setProcedimentos(procedimentos.filter((proc) => proc._id !== id));
    } catch (error) {
      console.error('Erro ao deletar procedimento:', error);
    }
  };

  return (
    <Container>
      <h2>Configurações do Sistema</h2>

      {/* Seção para gerenciamento de dentistas */}
      <Section>
        <SectionTitle>Gerenciar Dentistas</SectionTitle>
        <FormControl>
          <label>Nome do Novo Dentista</label>
          <input
            type="text"
            value={novoDentista}
            onChange={(e) => setNovoDentista(e.target.value)}
            placeholder="Digite o nome do dentista"
          />
          <button onClick={handleAddDentista}>Adicionar Dentista</button>
        </FormControl>

        <h4>Lista de Dentistas</h4>
        <ul>
          {dentistas.map((dentista) => (
            <li key={dentista._id}>
              {editDentistaId === dentista._id ? (
                <>
                  <input
                    type="text"
                    value={editDentistaNome}
                    onChange={(e) => setEditDentistaNome(e.target.value)}
                  />
                  <ActionButtons>
                    <button className="save" onClick={handleUpdateDentista}>Salvar</button>
                    <button className="cancel" onClick={() => setEditDentistaId(null)}>Cancelar</button>
                  </ActionButtons>
                </>
              ) : (
                <>
                  {dentista.nome}
                  <ActionButtons>
                    <button className="edit" onClick={() => handleEditDentista(dentista)}>Editar</button>
                    <button className="delete" onClick={() => handleDeleteDentista(dentista._id)}>Excluir</button>
                  </ActionButtons>
                </>
              )}
            </li>
          ))}
        </ul>
      </Section>

      {/* Seção para gerenciamento de procedimentos */}
      <Section>
        <SectionTitle>Gerenciar Procedimentos</SectionTitle>
        <FormControl>
          <label>Nome do Novo Procedimento</label>
          <input
            type="text"
            value={novoProcedimento}
            onChange={(e) => setNovoProcedimento(e.target.value)}
            placeholder="Digite o nome do procedimento"
          />
        </FormControl>

        <FormControl>
          <label>Cor do Procedimento</label>
          <input
            type="color"
            value={corProcedimento}
            onChange={(e) => setCorProcedimento(e.target.value)}
          />
          <button onClick={handleAddProcedimento}>Adicionar Procedimento</button>
        </FormControl>

        <h4>Lista de Procedimentos</h4>
        <ul>
          {procedimentos.map((proc) => (
            <li key={proc._id}>
              {editProcedimentoId === proc._id ? (
                <>
                  <input
                    type="text"
                    value={editProcedimentoNome}
                    onChange={(e) => setEditProcedimentoNome(e.target.value)}
                  />
                  <input
                    type="color"
                    value={editProcedimentoCor}
                    onChange={(e) => setEditProcedimentoCor(e.target.value)}
                  />
                  <ActionButtons>
                    <button className="save" onClick={handleUpdateProcedimento}>Salvar</button>
                    <button className="cancel" onClick={() => setEditProcedimentoId(null)}>Cancelar</button>
                  </ActionButtons>
                </>
              ) : (
                <>
                  <span style={{ backgroundColor: proc.cor, color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>
                    {proc.nome}
                  </span>
                  <ActionButtons>
                    <button className="edit" onClick={() => handleEditProcedimento(proc)}>Editar</button>
                    <button className="delete" onClick={() => handleDeleteProcedimento(proc._id)}>Excluir</button>
                  </ActionButtons>
                </>
              )}
            </li>
          ))}
        </ul>
      </Section>
    </Container>
  );
};

export default Configuracoes;
