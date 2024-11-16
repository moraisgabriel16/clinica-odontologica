import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CadastroPaciente from "../pages/CadastroPaciente";
import BuscarPacientes from "../pages/BuscarPacientes";
import NovoAgendamento from "../pages/NovoAgendamento";
import VerAgendamentos from "../pages/VerAgendamentos";
import PacienteDetails from "../pages/PacienteDetails"; // Importando PacienteDetails
import Configuracoes from "../pages/Configuracoes"; // Importando Configuracoes
import Navbar from "../components/Navbar"; // Importando a Navbar

const RoutesConfig = () => {
  return (
    <Router>
      <Navbar /> {/* Navbar será visível em todas as páginas */}
      <Routes>
        <Route path="/cadastro-paciente" element={<CadastroPaciente />} />
        <Route path="/buscar-pacientes" element={<BuscarPacientes />} />
        <Route path="/novo-agendamento" element={<NovoAgendamento />} />
        <Route path="/ver-agendamentos" element={<VerAgendamentos />} />
        <Route path="/pacientes/:id" element={<PacienteDetails />} />
        <Route path="/configuracoes" element={<Configuracoes />} /> {/* Nova Rota para Configurações */}
        <Route path="/" element={<CadastroPaciente />} /> {/* Rota padrão */}
      </Routes>
    </Router>
  );
};

export default RoutesConfig;
