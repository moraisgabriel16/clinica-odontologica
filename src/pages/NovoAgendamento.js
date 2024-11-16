import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f4f6f8;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #007bff;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
`;

const Select = styled.select`
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 12px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.span`
  color: red;
  margin-bottom: 10px;
`;

const schema = yup.object({
  pacienteId: yup.string().required("Paciente é obrigatório"),
  dentistaId: yup.string().required("Dentista é obrigatório"),
  procedimentoId: yup.string().required("Procedimento é obrigatório"),
  dataHora: yup.date().required("Data e hora são obrigatórios"),
  duracao: yup.number().min(15, "Duração mínima de 15 minutos").required("Duração é obrigatória"),
});

const NovoAgendamento = () => {
  const [pacientes, setPacientes] = useState([]);
  const [dentistas, setDentistas] = useState([]);
  const [procedimentos, setProcedimentos] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // Buscar pacientes, dentistas e procedimentos
    const fetchPacientes = async () => {
      try {
        const response = await axios.get("https://clinica-backend-beige.vercel.app/api/pacientes");
        setPacientes(response.data);
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
      }
    };

    const fetchDentistas = async () => {
      try {
        const response = await axios.get("https://clinica-backend-beige.vercel.app/api/dentistas");
        setDentistas(response.data);
      } catch (error) {
        console.error("Erro ao carregar dentistas:", error);
      }
    };

    const fetchProcedimentos = async () => {
      try {
        const response = await axios.get("https://clinica-backend-beige.vercel.app/api/procedimentos");
        setProcedimentos(response.data);
      } catch (error) {
        console.error("Erro ao carregar procedimentos:", error);
      }
    };

    fetchPacientes();
    fetchDentistas();
    fetchProcedimentos();
  }, []);

  const onSubmit = async (data) => {
    try {
      console.log('Dados enviados para o backend:', data);
      await axios.post("https://clinica-backend-beige.vercel.app/api/agendamentos", data);
      alert("Agendamento criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      alert("Erro ao criar agendamento. Tente novamente.");
    }
  };

  return (
    <Container>
      <Title>Novo Agendamento</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="pacienteId">Paciente</Label>
        <Select {...register("pacienteId")}>
          <option value="">Selecione o paciente</option>
          {pacientes.map((paciente) => (
            <option key={paciente._id} value={paciente._id}>
              {paciente.nome_completo}
            </option>
          ))}
        </Select>
        {errors.pacienteId && <ErrorMessage>{errors.pacienteId.message}</ErrorMessage>}

        <Label htmlFor="dentistaId">Nome do Dentista</Label>
        <Select {...register("dentistaId")}>
          <option value="">Selecione o dentista</option>
          {dentistas.map((dentista) => (
            <option key={dentista._id} value={dentista._id}>
              {dentista.nome}
            </option>
          ))}
        </Select>
        {errors.dentistaId && <ErrorMessage>{errors.dentistaId.message}</ErrorMessage>}

        <Label htmlFor="procedimentoId">Tipo de Procedimento</Label>
        <Select {...register("procedimentoId")}>
          <option value="">Selecione o procedimento</option>
          {procedimentos.map((procedimento) => (
            <option key={procedimento._id} value={procedimento._id}>
              {procedimento.nome}
            </option>
          ))}
        </Select>
        {errors.procedimentoId && <ErrorMessage>{errors.procedimentoId.message}</ErrorMessage>}

        <Label htmlFor="dataHora">Data e Hora</Label>
        <Input type="datetime-local" {...register("dataHora")} />
        {errors.dataHora && <ErrorMessage>{errors.dataHora.message}</ErrorMessage>}

        <Label htmlFor="duracao">Duração (em minutos)</Label>
        <Input type="number" {...register("duracao")} />
        {errors.duracao && <ErrorMessage>{errors.duracao.message}</ErrorMessage>}

        <Button type="submit">Agendar</Button>
      </Form>
    </Container>
  );
};

export default NovoAgendamento;
