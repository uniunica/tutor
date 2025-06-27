class PosInscricaoTutorialManager {
  constructor() {
    this.currentStep = 0;
    this.totalSteps = 6;
    this.isActive = false;

    this.steps = [
      {
        title: "Confirmação dos Dados",
        text: "Esta seção mostra os dados do candidato que foram preenchidos no formulário de inscrição. Sempre verifique se estão corretos.",
        tip: "Se houver algum erro nos dados, oriente o candidato a entrar em contato para correção.",
        target: "#userInfoSection",
        position: "bottom",
      },
      {
        title: "Informações do Curso",
        text: "Aqui são exibidas todas as informações do curso escolhido: nome, turno, modalidade e polo de estudo.",
        tip: "Essas informações são importantes para o candidato confirmar sua escolha antes do pagamento.",
        target: "#processInfoSection",
        position: "top",
      },
      {
        title: "Mensagem de Boas-vindas",
        text: "Esta mensagem informa sobre a promoção atual e orienta sobre os próximos passos para o candidato.",
        tip: "A promoção mencionada pode variar. Sempre confirme os valores atuais com a equipe.",
        target: "#welcomeMsgSection",
        position: "top",
      },
      {
        title: "Central do Candidato",
        text: "Botão principal para o candidato acessar sua área pessoal, onde pode acompanhar o processo e gerenciar seus dados.",
        tip: "O candidato deve acessar a Central do Candidato para acompanhar todo o processo.",
        target: "#candidatePortalBtn",
        position: "top",
      },
      {
        title: "Opções de Pagamento",
        text: "O candidato pode escolher entre 3 formas de pagamento: Boleto, PIX ou Cartão de Crédito. Cada uma tem suas vantagens.",
        tip: "PIX é mais rápido, Boleto leva 1-3 dias úteis, Cartão é aprovado na hora mas pode ter juros.",
        target: "#paymentButtons",
        position: "top",
      },
      {
        title: "Finalização do Processo",
        text: "Após o pagamento, o candidato receberá acesso ao portal do aluno e aos materiais didáticos. O valor máximo é R$ 250,00.",
        tip: "Lembre-se: o candidato só terá acesso completo após a confirmação do pagamento!",
        target: "#paymentSection",
        position: "center",
      },
    ];

    this.init();
  }

  init() {
    this.bindEvents();
    this.showWelcomeModal();
  }

  bindEvents() {
    // Botão iniciar tutorial
    document.getElementById("startTutorial").addEventListener("click", () => {
      this.startTutorial();
    });

    // Navegação do tutorial
    document.getElementById("nextStep").addEventListener("click", () => {
      this.nextStep();
    });

    document.getElementById("prevStep").addEventListener("click", () => {
      this.prevStep();
    });

    document.getElementById("finishTutorial").addEventListener("click", () => {
      this.finishTutorial();
    });

    // Botão reiniciar tutorial
    document.getElementById("restartTutorial").addEventListener("click", () => {
      this.restartTutorial();
    });

    // Fechar modal clicando fora
    document.getElementById("welcomeModal").addEventListener("click", (e) => {
      if (e.target.id === "welcomeModal") {
        this.startTutorial();
      }
    });

    // Simular funcionalidades dos botões
    this.setupButtonSimulations();
  }

  setupButtonSimulations() {
    // Central do Candidato
    document
      .getElementById("candidatePortalBtn")
      .addEventListener("click", () => {
        this.showCandidatePortalInfo();
      });

    // Boleto
    document.getElementById("boletoBtn").addEventListener("click", () => {
      this.showPaymentMethodInfo("boleto");
    });

    // PIX
    document.getElementById("pixBtn").addEventListener("click", () => {
      this.showPaymentMethodInfo("pix");
    });

    // Cartão
    document.getElementById("cartaoBtn").addEventListener("click", () => {
      this.showPaymentMethodInfo("cartao");
    });
  }

  showWelcomeModal() {
    document.getElementById("welcomeModal").style.display = "flex";
  }

  hideWelcomeModal() {
    document.getElementById("welcomeModal").style.display = "none";
  }

  startTutorial() {
    this.hideWelcomeModal();
    this.isActive = true;
    this.currentStep = 0;
    this.showProgressPanel();
    this.showStep();
  }

  showStep() {
    const step = this.steps[this.currentStep];
    const overlay = document.getElementById("tutorialOverlay");
    const highlight = document.getElementById("highlight");
    const cursor = document.getElementById("animatedCursor");
    const tipElement = document.getElementById("tutorialTip");

    // Mostrar overlay
    overlay.classList.remove("hidden");

    // Atualizar conteúdo
    document.getElementById("tutorialTitle").textContent = step.title;
    document.getElementById("tutorialText").textContent = step.text;
    document.getElementById("tutorialStep").textContent = this.currentStep + 1;
    document.getElementById("tutorialTotal").textContent = this.totalSteps;

    // Mostrar dica se existir
    if (step.tip) {
      document.getElementById("tutorialTipText").textContent = step.tip;
      tipElement.classList.remove("hidden");
    } else {
      tipElement.classList.add("hidden");
    }

    // Atualizar botões
    document.getElementById("prevStep").disabled = this.currentStep === 0;

    if (this.currentStep === this.totalSteps - 1) {
      document.getElementById("nextStep").classList.add("hidden");
      document.getElementById("finishTutorial").classList.remove("hidden");
    } else {
      document.getElementById("nextStep").classList.remove("hidden");
      document.getElementById("finishTutorial").classList.add("hidden");
    }

    // Destacar elemento
    this.highlightElement(step.target);

    // Animar cursor
    this.animateCursor(step.target);

    // Atualizar progresso
    this.updateProgress();
  }

  highlightElement(selector) {
    const element = document.querySelector(selector);
    const highlight = document.getElementById("highlight");

    if (element) {
      const rect = element.getBoundingClientRect();
      highlight.style.top = rect.top - 5 + "px";
      highlight.style.left = rect.left - 5 + "px";
      highlight.style.width = rect.width + 10 + "px";
      highlight.style.height = rect.height + 10 + "px";
      highlight.classList.remove("hidden");

      // Scroll para o elemento se necessário
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  animateCursor(selector) {
    const element = document.querySelector(selector);
    const cursor = document.getElementById("animatedCursor");

    if (element) {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      cursor.style.left = centerX + "px";
      cursor.style.top = centerY + "px";
      cursor.classList.remove("hidden");

      // Animação especial para botões de pagamento
      if (selector === "#paymentButtons") {
        cursor.style.color = "#28a745";
        cursor.style.fontSize = "28px";
      } else {
        cursor.style.color = "#ff4444";
        cursor.style.fontSize = "24px";
      }

      // Animação de clique no último passo
      if (this.currentStep === this.totalSteps - 1) {
        setTimeout(() => {
          cursor.style.transform = "scale(0.8)";
          setTimeout(() => {
            cursor.style.transform = "scale(1)";
          }, 200);
        }, 1000);
      }
    }
  }

  updateProgress() {
    const items = document.querySelectorAll(".progress-item");

    items.forEach((item, index) => {
      const icon = item.querySelector("i");

      if (index < this.currentStep) {
        item.classList.add("completed");
        item.classList.remove("current");
        icon.className = "fas fa-check-circle";
      } else if (index === this.currentStep) {
        item.classList.add("current");
        item.classList.remove("completed");
        icon.className = "fas fa-circle-notch";
      } else {
        item.classList.remove("completed", "current");
        icon.className = "fas fa-circle";
      }
    });
  }

  nextStep() {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
      this.showStep();
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showStep();
    }
  }

  finishTutorial() {
    this.isActive = false;
    document.getElementById("tutorialOverlay").classList.add("hidden");
    document.getElementById("highlight").classList.add("hidden");
    document.getElementById("animatedCursor").classList.add("hidden");

    // Mostrar mensagem de conclusão
    this.showCompletionMessage();
  }

  showCompletionMessage() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <i class="fas fa-medal"></i>
          <h2>Parabéns! Tutorial Completo!</h2>
        </div>
        <div class="modal-body">
          <p>🎉 <strong>Você concluiu todo o processo de inscrição!</strong></p>
          <p>Agora você sabe como orientar candidatos em todas as etapas:</p>

          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4 style="margin: 0 0 10px 0; color: #28a745;">✅ O que você aprendeu:</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Navegar pela página inicial</li>
              <li>Preencher formulário de inscrição</li>
              <li>Orientar sobre pagamento</li>
              <li>Explicar próximos passos</li>
            </ul>
          </div>

          <div class="info-box">
            <i class="fas fa-star"></i>
            <strong>Lembre-se:</strong> Sempre preencha o campo "Indicação" para receber suas comissões!
          </div>

          <p><strong>Agora você está pronto para ajudar candidatos a se inscreverem!</strong></p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-success" onclick="this.closest('.modal').remove()">
            <i class="fas fa-graduation-cap"></i> Estou Pronto!
          </button>
          <button class="btn btn-primary" onclick="window.location.href='index.html'">
            <i class="fas fa-home"></i> Voltar ao Início
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  showCandidatePortalInfo() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <i class="fas fa-user-graduate"></i>
          <h2>Central do Candidato</h2>
        </div>
        <div class="modal-body">
          <p><strong>A Central do Candidato permite:</strong></p>
          <ul>
            <li><i class="fas fa-eye"></i> Acompanhar status da inscrição</li>
            <li><i class="fas fa-file-alt"></i> Visualizar documentos enviados</li>
            <li><i class="fas fa-calendar"></i> Agendar provas (se necessário)</li>
            <li><i class="fas fa-bell"></i> Receber notificações importantes</li>
            <li><i class="fas fa-download"></i> Baixar comprovantes</li>
            <li><i class="fas fa-edit"></i> Atualizar dados pessoais</li>
          </ul>
          <div class="info-box">
            <i class="fas fa-info-circle"></i>
            <strong>Importante:</strong> O candidato deve criar uma conta para acessar todos os recursos!
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="this.closest('.modal').remove()">
            <i class="fas fa-check"></i> Entendi!
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  showPaymentMethodInfo(method) {
    let title, content, icon;

    switch (method) {
      case "boleto":
        title = "Pagamento via Boleto";
        icon = "fas fa-barcode";
        content = `
          <p><strong>Características do Boleto:</strong></p>
          <ul>
            <li><i class="fas fa-calendar"></i> Prazo: até 3 dias úteis para compensação</li>
            <li><i class="fas fa-bank"></i> Pode ser pago em qualquer banco ou lotérica</li>
            <li><i class="fas fa-mobile"></i> Pagamento via app bancário</li>
            <li><i class="fas fa-clock"></i> Vencimento em 3 dias</li>
          </ul>
          <div class="info-box">
            <i class="fas fa-exclamation-triangle"></i>
            <strong>Atenção:</strong> Após o vencimento, é necessário solicitar um novo boleto!
          </div>
        `;
        break;
      case "pix":
        title = "Pagamento via PIX";
        icon = "fas fa-qrcode";
        content = `
          <p><strong>Vantagens do PIX:</strong></p>
          <ul>
            <li><i class="fas fa-bolt"></i> Pagamento instantâneo</li>
            <li><i class="fas fa-mobile"></i> Pelo celular ou internet banking</li>
            <li><i class="fas fa-qrcode"></i> QR Code ou chave PIX</li>
            <li><i class="fas fa-check-circle"></i> Confirmação imediata</li>
          </ul>
          <div class="info-box">
            <i class="fas fa-star"></i>
            <strong>Recomendado:</strong> Forma mais rápida de liberar o acesso!
          </div>
        `;
        break;
      case "cartao":
        title = "Pagamento via Cartão";
        icon = "fas fa-credit-card";
        content = `
          <p><strong>Opções de Cartão:</strong></p>
          <ul>
            <li><i class="fas fa-credit-card"></i> Cartão de crédito (parcelamento disponível)</li>
            <li><i class="fas fa-money-check"></i> Cartão de débito (à vista)</li>
            <li><i class="fas fa-shield-alt"></i> Transação segura e criptografada</li>
            <li><i class="fas fa-check"></i> Aprovação imediata</li>
          </ul>
          <div class="info-box">
            <i class="fas fa-info-circle"></i>
            <strong>Importante:</strong> Parcelamento pode ter juros. Consulte as condições!
          </div>
        `;
        break;
    }

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <i class="${icon}"></i>
          <h2>${title}</h2>
        </div>
        <div class="modal-body">
          ${content}
          <p><strong>Valor máximo da taxa:</strong> R$ 250,00</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="this.closest('.modal').remove()">
            <i class="fas fa-check"></i> Entendi!
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  restartTutorial() {
    this.hideProgressPanel();
    this.showWelcomeModal();
  }

  showProgressPanel() {
    document.getElementById("progressPanel").classList.remove("hidden");
  }

  hideProgressPanel() {
    document.getElementById("progressPanel").classList.add("hidden");
  }
}

// Inicializar quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  new PosInscricaoTutorialManager();
});

// Adicionar animações especiais para elementos importantes
document.addEventListener("DOMContentLoaded", () => {
  // Destacar informações importantes
  const userInfo = document.querySelector(".user-info h2");
  const paymentButtons = document.querySelectorAll(".payment-btns .btn");

  // Animação sutil no nome do candidato
  if (userInfo) {
    userInfo.style.transition = "all 0.3s ease";
    userInfo.addEventListener("mouseenter", () => {
      userInfo.style.transform = "scale(1.02)";
      userInfo.style.color = "#7c4dff";
    });
    userInfo.addEventListener("mouseleave", () => {
      userInfo.style.transform = "scale(1)";
      userInfo.style.color = "#35009c";
    });
  }

  // Efeito hover nos botões de pagamento
  paymentButtons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "translateY(-3px)";
      btn.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translateY(0)";
      btn.style.boxShadow = "none";
    });
  });
});

// Função para simular diferentes cenários de pagamento
function simulatePaymentScenarios() {
  const scenarios = [
    {
      method: "PIX",
      time: "Imediato",
      status: "Aprovado",
      color: "#00e28b",
    },
    {
      method: "Boleto",
      time: "1-3 dias úteis",
      status: "Pendente",
      color: "#7c4dff",
    },
    {
      method: "Cartão",
      time: "Imediato",
      status: "Processando",
      color: "#836fff",
    },
  ];

  return scenarios;
}

// Adicionar informações contextuais baseadas no horário
document.addEventListener("DOMContentLoaded", () => {
  const now = new Date();
  const hour = now.getHours();
  const welcomeMsg = document.querySelector(".welcome-msg");

  if (welcomeMsg) {
    let timeMessage = "";

    if (hour >= 6 && hour < 12) {
      timeMessage =
        "<p><strong>🌅 Bom dia!</strong> Que ótimo começar o dia cuidando do seu futuro acadêmico!</p>";
    } else if (hour >= 12 && hour < 18) {
      timeMessage =
        "<p><strong>☀️ Boa tarde!</strong> Excelente momento para investir em sua educação!</p>";
    } else {
      timeMessage =
        "<p><strong>🌙 Boa noite!</strong> Nunca é tarde para buscar conhecimento!</p>";
    }

    // Adicionar mensagem personalizada
    const timeDiv = document.createElement("div");
    timeDiv.innerHTML = timeMessage;
    timeDiv.style.cssText = `
      background: linear-gradient(135deg, #e8f5e8, #f0f8f0);
      border-left: 4px solid #28a745;
      padding: 15px;
      margin: 15px 0;
      border-radius: 8px;
      font-size: 1.1em;
    `;

    welcomeMsg.insertBefore(timeDiv, welcomeMsg.firstChild);
  }
});

// Sistema de notificações para orientar o parceiro
class NotificationSystem {
  constructor() {
    this.notifications = [];
    this.init();
  }

  init() {
    this.createNotificationContainer();
  }

  createNotificationContainer() {
    const container = document.createElement("div");
    container.id = "notificationContainer";
    container.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1001;
      max-width: 350px;
    `;
    document.body.appendChild(container);
  }

  show(message, type = "info", duration = 5000) {
    const notification = document.createElement("div");
    const id = Date.now();

    let bgColor, icon;
    switch (type) {
      case "success":
        bgColor = "#d4edda";
        icon = "fas fa-check-circle";
        break;
      case "warning":
        bgColor = "#fff3cd";
        icon = "fas fa-exclamation-triangle";
        break;
      case "error":
        bgColor = "#f8d7da";
        icon = "fas fa-times-circle";
        break;
      default:
        bgColor = "#d1ecf1";
        icon = "fas fa-info-circle";
    }

    notification.innerHTML = `
      <div style="
        background: ${bgColor};
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        animation: slideInLeft 0.3s ease;
      ">
        <i class="${icon}" style="margin-right: 10px; font-size: 1.2em;"></i>
        <span style="flex: 1;">${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: none;
          border: none;
          font-size: 1.2em;
          cursor: pointer;
          opacity: 0.7;
          margin-left: 10px;
        ">&times;</button>
      </div>
    `;

    document.getElementById("notificationContainer").appendChild(notification);

    // Auto-remover após duração especificada
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = "slideOutLeft 0.3s ease";
        setTimeout(() => notification.remove(), 300);
      }
    }, duration);
  }
}

// Inicializar sistema de notificações
const notificationSystem = new NotificationSystem();

// Adicionar CSS para animações das notificações
const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
  @keyframes slideInLeft {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutLeft {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(-100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(notificationStyles);

// Mostrar notificações contextuais durante o tutorial
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (!document.querySelector(".tutorial-overlay:not(.hidden)")) {
      notificationSystem.show(
        'Dica: Clique no botão "Reiniciar Tutorial" para revisar o processo!',
        "info",
        8000
      );
    }
  }, 3000);
});

// Adicionar tooltips informativos
function addTooltips() {
  const elements = [
    {
      selector: ".user-info h2",
      text: "Nome do candidato conforme preenchido no formulário",
    },
    {
      selector: ".process-info p:first-child",
      text: "Processo seletivo atual - sempre verificar se está correto",
    },
    {
      selector: ".candidate-portal",
      text: "Portal onde o candidato acompanha todo o processo",
    },
  ];

  elements.forEach((item) => {
    const element = document.querySelector(item.selector);
    if (element) {
      element.title = item.text;
      element.style.cursor = "help";
    }
  });
}

// Inicializar tooltips
document.addEventListener("DOMContentLoaded", addTooltips);

// Função para destacar elementos importantes
function highlightImportantElements() {
  const importantElements = [
    ".user-info h2",
    ".candidate-portal",
    ".payment-btns",
  ];

  importantElements.forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.addEventListener("mouseenter", () => {
        element.style.boxShadow = "0 0 15px rgba(124, 77, 255, 0.3)";
        element.style.transition = "box-shadow 0.3s ease";
      });

      element.addEventListener("mouseleave", () => {
        element.style.boxShadow = "none";
      });
    }
  });
}

// Inicializar destaques
document.addEventListener("DOMContentLoaded", highlightImportantElements);

// Sistema de ajuda contextual
class ContextualHelp {
  constructor() {
    this.helpData = {
      "user-info": {
        title: "Dados do Candidato",
        content:
          "Informações pessoais preenchidas durante a inscrição. Verifique se estão corretas.",
      },
      "process-info": {
        title: "Informações do Curso",
        content: "Detalhes do curso escolhido, modalidade e local de estudo.",
      },
      "payment-section": {
        title: "Área de Pagamento",
        content: "Opções disponíveis para pagamento da taxa de matrícula.",
      },
    };

    this.createHelpButton();
  }

  createHelpButton() {
    const helpBtn = document.createElement("button");
    helpBtn.innerHTML = '<i class="fas fa-question-circle"></i> Ajuda';
    helpBtn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #17a2b8;
      color: white;
      border: none;
      border-radius: 50px;
      padding: 12px 20px;
      cursor: pointer;
      font-size: 0.9em;
      font-weight: 600;
      transition: all 0.3s ease;
      z-index: 994;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    helpBtn.addEventListener("click", () => this.showHelpModal());
    helpBtn.addEventListener("mouseenter", () => {
      helpBtn.style.background = "#138496";
      helpBtn.style.transform = "translateY(-2px)";
    });
    helpBtn.addEventListener("mouseleave", () => {
      helpBtn.style.background = "#17a2b8";
      helpBtn.style.transform = "translateY(0)";
    });

    document.body.appendChild(helpBtn);
  }

  showHelpModal() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <i class="fas fa-question-circle"></i>
          <h2>Central de Ajuda</h2>
        </div>
        <div class="modal-body">
          <h4>Perguntas Frequentes:</h4>
          <div style="margin: 15px 0;">
            <strong>❓ O que fazer se os dados estiverem errados?</strong>
            <p>Oriente o candidato a entrar em contato com o suporte para correção.</p>
          </div>
          <div style="margin: 15px 0;">
            <strong>❓ Qual a melhor forma de pagamento?</strong>
            <p>PIX é mais rápido, mas todas as opções são seguras e válidas.</p>
          </div>
          <div style="margin: 15px 0;">
            <strong>❓ Quando o candidato terá acesso ao portal?</strong>
            <p>Após a confirmação do pagamento, geralmente em até 24 horas.</p>
          </div>
          <div style="margin: 15px 0;">
            <strong>❓ Como acompanhar o status da inscrição?</strong>
            <p>Através da Central do Candidato, com login e senha fornecidos por e-mail.</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="this.closest('.modal').remove()">
            <i class="fas fa-check"></i> Entendi!
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }
}

// Inicializar sistema de ajuda
document.addEventListener("DOMContentLoaded", () => {
  new ContextualHelp();
});
