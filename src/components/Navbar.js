import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const NavbarContainer = styled.nav`
  background-color: #007bff; /* Azul-claro */
  padding: 15px;
`;

const NavList = styled.ul`
  list-style-type: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 0;
  flex-wrap: wrap; /* Torna a navbar responsiva */
`;

const NavItem = styled.li`
  color: white;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
  margin: 0 10px; /* Adicionado espaço entre os itens */
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Navbar = () => {
  return (
    <NavbarContainer>
      <NavList>
        <NavItem>
          <StyledLink to="/cadastro-paciente">Cadastro de Paciente</StyledLink>
        </NavItem>
        <NavItem>
          <StyledLink to="/buscar-pacientes">Buscar Pacientes</StyledLink>
        </NavItem>
        <NavItem>
          <StyledLink to="/novo-agendamento">Novo Agendamento</StyledLink>
        </NavItem>
        <NavItem>
          <StyledLink to="/ver-agendamentos">Ver Agendamentos</StyledLink>
        </NavItem>
        <NavItem>
          <StyledLink to="/configuracoes">Configurações</StyledLink> {/* Novo link para Configurações */}
        </NavItem>
      </NavList>
    </NavbarContainer>
  );
};

export default Navbar;
