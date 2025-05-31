<template>
    <footer id="contactos" class="footer">
      <div class="footer-container">
        <div class="footer-logo">
            <img src="@/assets/Logo.png" alt="Logo" />
            <h2><span class="logo-eyes">Eyes</span><span class="logo-everywhere">EveryWhere</span></h2>
            </div>

        <div class="footer-section">
          <h4>Ocorrências</h4>
          <p>Nova Ocorrência</p>
          <p>Histórico de Ocorrências</p>
        </div>
        <div class="footer-section">
          <h4>Empresa</h4>
          <p>Sobre Nós</p>
          <p>Termos de Serviço</p>
          <p>Política de Privacidade</p>
        </div>
        <div class="footer-section">
          <h4>Contacte-Nos</h4>
          <p>📞 +351 932 000 863</p>
          <p>📧 eyeseverywhere@gmail.com</p>
          <p>🌐 eyeseverywhere.com</p>
        </div>
      </div>
      <p class="copyright">© 2025 EyesEverywhere - All rights reserved</p>
    </footer>
  </template>
  
  <style scoped>
  .footer {
    background-color: #34506d;
    color: white;
    width: 100vw; /* Preenche 100% da largura da viewport */
    background-color: #3A5F7F; /* ou a cor que estás a usar */
    padding: 60px 60px 20px 60px; /* aumenta o padding superior */
    margin: 0;
  }
  
  .footer-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 40px;
    align-items: flex-start;
  }
  .footer-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 40px; /* empurra o logo mais para baixo */
}
  
.footer-logo img {
  width: 130px;
  margin-bottom: 10px;
}

.footer-logo h2 {
  font-size: 1.8rem;
  margin-top: 5px;
  display: flex;
  gap: 6px;
}

.logo-eyes {
  color: white;
  font-weight: 600;
}

.logo-everywhere {
  color: #1ccfc0;
  font-weight: 600;
}
  
  .footer-section h4 {
    color: #00b3b3;
    margin-bottom: 10px;
    font-size: 1rem;
    font-weight: bold;
    margin-top: 50px; /* empurra o logo mais para baixo */
  }
  
  .footer-section p {
    margin: 4px 0;
    font-size: 0.9rem;
    cursor: pointer;
  }
  
  .footer-section p:hover {
    text-decoration: underline;
  }
  
  .footer-container > * {
    flex: 1 1 200px;
  }
  
  .footer .copyright {
    margin-top: 30px;
    text-align: left;
    font-size: 0.8rem;
  }
  </style>
  