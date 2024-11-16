import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #007bff;
`;

const SearchInput = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const PacienteCard = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const BuscarPacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://clinica-backend-beige.vercel.app/api/pacientes")
      .then((response) => setPacientes(response.data))
      .catch((error) => console.error("Erro ao buscar pacientes:", error));
  }, []);

  const filteredPacientes = pacientes.filter((paciente) =>
    paciente.nome_completo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Title>Buscar Pacientes</Title>
      <SearchInput
        type="text"
        placeholder="Buscar por nome"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredPacientes.map((paciente) => (
        <PacienteCard key={paciente._id}>
          <strong>Nome:</strong> {paciente.nome_completo} <br />
          <strong>CPF:</strong> {paciente.cpf} <br />
          <Button onClick={() => navigate(`/pacientes/${paciente._id}`)}>
            Ver Detalhes
          </Button>
        </PacienteCard>
      ))}
    </Container>
  );
};

export default BuscarPacientes;
