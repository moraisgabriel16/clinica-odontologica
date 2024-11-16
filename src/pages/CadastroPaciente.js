import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import axios from "axios";
import InputMask from "react-input-mask";

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f4f6f8;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #007bff;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
`;

const Section = styled.div`
  margin-bottom: 20px;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
  background-color: #fff;
`;

const InputField = styled(InputMask)`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SelectField = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 8px;
  display: block;
`;

const ErrorText = styled.div`
  color: red;
  margin-top: 5px;
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  width: 100%;
  font-size: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #0056b3;
  }
`;

const validationSchema = Yup.object({
  nome_completo: Yup.string().required("Nome completo é obrigatório"),
  email: Yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  cpf: Yup.string()
    .required("CPF é obrigatório")
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
  data_nascimento: Yup.date().required("Data de nascimento é obrigatória"),
  telefone_celular: Yup.string()
    .required("Telefone celular é obrigatório")
    .matches(/^\(\d{2}\)\s\d{5}-\d{4}$/, "Telefone celular inválido"),
  endereco: Yup.object().shape({
    rua: Yup.string().required("Rua é obrigatória"),
    numero: Yup.string().required("Número é obrigatório"),
    cidade: Yup.string().required("Cidade é obrigatória"),
    estado: Yup.string().required("Estado é obrigatório"),
  }),
  fumante: Yup.string().required("Informar se é fumante ou não"),
  autorizacao_tratamento: Yup.bool().oneOf(
    [true],
    "Você precisa autorizar o tratamento"
  ),
});

const CadastroPaciente = () => {
  const handleSubmit = (values) => {
    console.log("Submitting values:", values);
    axios
      .post("https://clinica-backend-beige.vercel.app/api/pacientes", values)
      .then(() => {
        alert("Paciente cadastrado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao cadastrar paciente:", error);
        alert("Erro ao cadastrar o paciente. Tente novamente.");
      });
  };

  return (
    <Container>
      <Title>Cadastro de Paciente</Title>
      <Formik
        initialValues={{
          nome_completo: "",
          email: "",
          cpf: "",
          data_nascimento: "",
          telefone_celular: "",
          endereco: {
            rua: "",
            numero: "",
            cidade: "",
            estado: "",
          },
          fumante: "Não",
          autorizacao_tratamento: false,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <Section>
            <h3>Dados Pessoais</h3>
            <Label htmlFor="nome_completo">Nome Completo</Label>
            <Field name="nome_completo" type="text" as={InputField} />
            <ErrorMessage name="nome_completo" component={ErrorText} />

            <Label htmlFor="email">E-mail</Label>
            <Field name="email" type="email" as={InputField} />
            <ErrorMessage name="email" component={ErrorText} />

            <Label htmlFor="cpf">CPF</Label>
            <Field
              name="cpf"
              as={InputField}
              mask="999.999.999-99"
              placeholder="000.000.000-00"
            />
            <ErrorMessage name="cpf" component={ErrorText} />

            <Label htmlFor="data_nascimento">Data de Nascimento</Label>
            <Field name="data_nascimento" type="date" as={InputField} />
            <ErrorMessage name="data_nascimento" component={ErrorText} />
          </Section>

          <Section>
            <h3>Contato</h3>
            <Label htmlFor="telefone_celular">Telefone Celular</Label>
            <Field
              name="telefone_celular"
              as={InputField}
              mask="(99) 99999-9999"
              placeholder="(00) 00000-0000"
            />
            <ErrorMessage name="telefone_celular" component={ErrorText} />
          </Section>

          <Section>
            <h3>Endereço</h3>
            <Label htmlFor="endereco.rua">Rua</Label>
            <Field name="endereco.rua" type="text" as={InputField} />
            <ErrorMessage name="endereco.rua" component={ErrorText} />

            <Label htmlFor="endereco.numero">Número</Label>
            <Field name="endereco.numero" type="text" as={InputField} />
            <ErrorMessage name="endereco.numero" component={ErrorText} />

            <Label htmlFor="endereco.cidade">Cidade</Label>
            <Field name="endereco.cidade" type="text" as={InputField} />
            <ErrorMessage name="endereco.cidade" component={ErrorText} />

            <Label htmlFor="endereco.estado">Estado</Label>
            <Field name="endereco.estado" as={SelectField}>
              <option value="">Selecione</option>
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="MG">Minas Gerais</option>
              <option value="RS">Rio Grande do Sul</option>
            </Field>
            <ErrorMessage name="endereco.estado" component={ErrorText} />
          </Section>

          <Section>
            <Label>Você é fumante?</Label>
            <Field name="fumante" as={SelectField}>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </Field>
            <ErrorMessage name="fumante" component={ErrorText} />

            <Label>
              <Field type="checkbox" name="autorizacao_tratamento" />
              Autorizo o tratamento odontológico.
            </Label>
            <ErrorMessage
              name="autorizacao_tratamento"
              component={ErrorText}
            />
          </Section>

          <Button type="submit">Cadastrar</Button>
        </Form>
      </Formik>
    </Container>
  );
};

export default CadastroPaciente;
