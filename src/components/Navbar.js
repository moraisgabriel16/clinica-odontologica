import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #007bff;
  padding: 15px;
  color: white;

  .menu {
    display: ${({ isOpen }) => (isOpen ? "block" : "none")};
    position: absolute;
    top: 60px;
    right: 10px;
    background-color: #007bff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .menu a {
    display: block;
    padding: 10px;
    text-decoration: none;
    color: white;
    &:hover {
      background-color: #0056b3;
    }
  }

  @media (min-width: 768px) {
    .menu {
      display: flex;
      position: static;
      box-shadow: none;
      flex-direction: row;
    }
    .menu a {
      padding: 0 15px;
    }
  }
`;

const Hamburger = styled.div`
  display: block;
  cursor: pointer;

  div {
    width: 25px;
    height: 3px;
    background-color: white;
    margin: 5px;
    transition: 0.3s;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navbarRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Handler to close the menu when clicking outside of the navbar
  const handleClickOutside = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <NavbarContainer ref={navbarRef} isOpen={isOpen}>
      <h1>Clínica Odontológica</h1>
      <Hamburger onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </Hamburger>
      <div className="menu">
        <Link to="/">Início</Link>
        <Link to="/cadastro">Cadastro</Link>
        <Link to="/agendamentos">Agendamentos</Link>
        <Link to="/configuracoes">Configurações</Link>
      </div>
    </NavbarContainer>
  );
};

export default Navbar;
