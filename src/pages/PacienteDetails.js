import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #007bff;
`;

const DetailsCard = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  padding: 10px 15px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &.edit {
    background-color: #ffc107;
    color: #fff;
    &:hover {
      background-color: #e0a800;
    }
  }

  &.delete {
    background-color: #dc3545;
    color: #fff;
    &:hover {
      background-color: #c82333;
    }
  }

  &.save {
    background-color: #28a745;
    color: #fff;
    &:hover {
      background-color: #218838;
    }
  }

  &.cancel {
    background-color: #6c757d;
    color: #fff;
    &:hover {
      background-color: #5a6268;
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Label = styled.label`
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const PacienteDetails = () => {
  const { id } = useParams(); // O ID do paciente será passado via URL
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: '',
    email: '',
    cpf: '',
    data_nascimento: '',
    telefone_celular: '',
    endereco: { rua: '', numero: '', cidade: '', estado: '' },
    fumante: '',
    autorizacao_tratamento: false,
  });

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/pacientes/${id}`);
        if (response.data) {
          setPaciente(response.data);
          setFormData({
            ...response.data,
            endereco: { ...response.data.endereco },
          });
        } else {
          alert('Paciente não encontrado.');
          navigate('/buscar-pacientes');
        }
      } catch (error) {
        console.error('Erro ao carregar paciente:', error);
        alert('Erro ao carregar os detalhes do paciente.');
        navigate('/buscar-pacientes');
      }
    };

    fetchPaciente();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    if (name.startsWith('endereco.')) {
      const key = name.split('.')[1];
      setFormData({
        ...formData,
        endereco: {
          ...formData.endereco,
          [key]: fieldValue,
        },
      });
    } else {
      setFormData({ ...formData, [name]: fieldValue });
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/pacientes/${id}`, formData);
      alert('Paciente atualizado com sucesso!');
      setPaciente(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error);
      alert('Erro ao atualizar os dados do paciente.');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Tem certeza que deseja excluir este paciente?');
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/pacientes/${id}`);
        alert('Paciente excluído com sucesso!');
        navigate('/buscar-pacientes');
      } catch (error) {
        console.error('Erro ao excluir paciente:', error);
        alert('Erro ao excluir o paciente.');
      }
    }
  };

  return (
    <Container>
      <Title>Detalhes do Paciente</Title>
      {paciente ? (
        <DetailsCard>
          {!isEditing ? (
            <>
              <p><strong>Nome:</strong> {paciente.nome_completo}</p>
              <p><strong>CPF:</strong> {paciente.cpf}</p>
              <p><strong>Email:</strong> {paciente.email}</p>
              <p><strong>Data de Nascimento:</strong> {new Date(paciente.data_nascimento).toLocaleDateString()}</p>
              <p><strong>Telefone:</strong> {paciente.telefone_celular}</p>
              <p><strong>Endereço:</strong> {`${paciente.endereco.rua}, ${paciente.endereco.numero}, ${paciente.endereco.cidade} - ${paciente.endereco.estado}`}</p>
              <p><strong>Fumante:</strong> {paciente.fumante}</p>
              <p><strong>Autorização:</strong> {paciente.autorizacao_tratamento ? 'Sim' : 'Não'}</p>
              <div>
                <Button className="edit" onClick={() => setIsEditing(true)}>Editar</Button>
                <Button className="delete" onClick={handleDelete}>Excluir</Button>
              </div>
            </>
          ) : (
            <>
              <Label>Nome Completo</Label>
              <Input
                type="text"
                name="nome_completo"
                value={formData.nome_completo}
                onChange={handleChange}
              />

              <Label>CPF</Label>
              <Input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
              />

              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

              <Label>Data de Nascimento</Label>
              <Input
                type="date"
                name="data_nascimento"
                value={formData.data_nascimento}
                onChange={handleChange}
              />

              <Label>Telefone</Label>
              <Input
                type="text"
                name="telefone_celular"
                value={formData.telefone_celular}
                onChange={handleChange}
              />

              <Label>Endereço</Label>
              <Input
                type="text"
                name="endereco.rua"
                value={formData.endereco.rua}
                onChange={handleChange}
              />
              <Input
                type="text"
                name="endereco.numero"
                value={formData.endereco.numero}
                onChange={handleChange}
              />
              <Input
                type="text"
                name="endereco.cidade"
                value={formData.endereco.cidade}
                onChange={handleChange}
              />
              <Select
                name="endereco.estado"
                value={formData.endereco.estado}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="SP">São Paulo</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="MG">Minas Gerais</option>
                <option value="RS">Rio Grande do Sul</option>
              </Select>

              <Label>Fumante</Label>
              <Select
                name="fumante"
                value={formData.fumante}
                onChange={handleChange}
              >
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </Select>

              <Label>
                <Input
                  type="checkbox"
                  name="autorizacao_tratamento"
                  checked={formData.autorizacao_tratamento}
                  onChange={handleChange}
                />
                Autorizo o tratamento
              </Label>

              <div>
                <Button className="save" onClick={handleUpdate}>Salvar</Button>
                <Button className="cancel" onClick={() => setIsEditing(false)}>Cancelar</Button>
              </div>
            </>
          )}
        </DetailsCard>
      ) : (
        <p>Paciente não encontrado.</p>
      )}
    </Container>
  );
};

export default PacienteDetails;
