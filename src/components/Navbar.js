import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const NavbarContainer = styled.nav`
  background-color: #007bff;
  padding: 15px;
  position: relative;
`;

const NavList = styled.ul`
  list-style-type: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    display: ${(props) => (props.isOpen ? "block" : "none")};
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background-color: #007bff;
    padding: 10px;
    border-radius: 0 0 8px 8px;
  }
`;

const NavItem = styled.li`
  color: white;
  font-weight: bold;
  margin: 0 10px;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    margin: 10px 0;
  }
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const HamburgerIcon = styled.div`
  display: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }

  div {
    width: 25px;
    height: 3px;
    background-color: white;
    margin: 5px 0;
    transition: 0.4s;
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Hook para fechar o menu ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <NavbarContainer ref={navRef}>
      <HamburgerIcon onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </HamburgerIcon>
      <NavList isOpen={isOpen}>
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
          <StyledLink to="/configuracoes">Configurações</StyledLink>
        </NavItem>
      </NavList>
    </NavbarContainer>
  );
};

export default Navbar;
