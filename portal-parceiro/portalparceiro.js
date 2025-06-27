class PortalParceiroTutorialManager {
  constructor() {
    this.currentStep = 0;
    this.totalSteps = 12;
    this.isActive = false;

    this.steps = [
      {
        title: "Visão Geral do Portal",
        text: "Bem-vindo ao Portal do Parceiro! Esta é sua ferramenta principal para vendas e gestão. Vamos conhecer cada área.",
        tip: "Este portal centraliza todas as funcionalidades que você precisa para ser um parceiro de sucesso.",
        target: "#topBar",
        position: "bottom",
      },
      {
        title: "Sistema de Busca",
        text: "Use este campo para pesquisar seus alunos por CPF ou nome. É fundamental para acompanhar matrículas existentes.",
        tip: "Sempre verifique se o aluno já possui matrícula antes de criar uma nova.",
        target: "#searchInput",
        position: "bottom",
      },
      {
        title: "Link de Matrícula",
        text: "Este botão gera seu link personalizado de matrícula. Compartilhe com seus clientes para matrículas diretas.",
        tip: "Cada parceiro tem um link único que garante a comissão das vendas realizadas.",
        target: "#linkBtn",
        position: "bottom",
      },
      {
        title: "Notificações e Configurações",
        text: "Aqui você acessa notificações importantes e configurações da sua conta.",
        tip: "Mantenha sempre as notificações ativadas para não perder oportunidades.",
        target: "#iconsArea",
        position: "left",
      },
      {
        title: "Perfil do Parceiro",
        text: "Sua área de perfil mostra seu status como parceiro autorizado e informações pessoais.",
        tip: "O status 'Parceiro Autorizado' indica que você pode realizar vendas normalmente.",
        target: "#profileSection",
        position: "right",
      },
      {
        title: "Nova Matrícula",
        text: "O botão principal para iniciar uma nova matrícula. Use sempre que um novo cliente quiser se inscrever.",
        tip: "Este é o botão mais importante - é por aqui que você gera suas vendas!",
        target: "#novaMatricula",
        position: "right",
        important: true,
      },
      {
        title: "Menu Lateral",
        text: "O menu lateral dá acesso a todas as ferramentas: relatórios, leads, treinamentos, suporte e muito mais.",
        tip: "Explore cada seção para maximizar suas vendas e gestão de alunos.",
        target: "#sideMenu",
        position: "right",
      },
      {
        title: "Tipo de Venda",
        text: "Escolha entre 'Único curso' para uma matrícula simples ou 'Combo' para pacotes de cursos.",
        tip: "Combos geralmente têm comissões mais altas - sempre ofereça quando possível.",
        target: "#tipoVendaSection",
        position: "right",
      },
      {
        title: "Instituições de Ensino",
        text: "Selecione a instituição desejada. Cada uma tem cursos e valores diferentes.",
        tip: "UniÚnica: graduação, Prominas: pós-graduação, Conexão: cursos técnicos.",
        target: "#instituicoesSection",
        position: "top",
      },
      {
        title: "Modalidades de Ensino",
        text: "Escolha a modalidade: Pós-Graduação, Aperfeiçoamento, Extensão ou Ensino Médio (EJA).",
        tip: "Pós-graduação é a modalidade com maior demanda e melhores comissões.",
        target: "#modalidadeSection",
        position: "top",
      },
      {
        title: "Áreas do Curso",
        text: "Filtre por área de interesse do aluno para encontrar cursos mais rapidamente.",
        tip: "Comece sempre perguntando a área de interesse do cliente para otimizar a busca.",
        target: "#areasSection",
        position: "top",
      },
      {
        title: "Busca de Curso",
        text: "Digite o nome específico do curso desejado. O sistema filtrará automaticamente as opções disponíveis.",
        tip: "Use palavras-chave como 'gestão', 'educação', 'saúde' para encontrar cursos relacionados.",
        target: "#buscarCursoSection",
        position: "top",
      },
    ];

    this.init();
  }

  init() {
    this.bindEvents();
    this.showWelcomeModal();
  }

  bindEvents() {
    // Tutorial events
    document.getElementById("startTutorial").addEventListener("click", () => {
      this.startTutorial();
    });

    document.getElementById("nextStep").addEventListener("click", () => {
      this.nextStep();
    });

    document.getElementById("prevStep").addEventListener("click", () => {
      this.prevStep();
    });

    document.getElementById("finishTutorial").addEventListener("click", () => {
      this.finishTutorial();
    });

    document.getElementById("restartTutorial").addEventListener("click", () => {
      this.restartTutorial();
    });

    // Modal close
    document.getElementById("welcomeModal").addEventListener("click", (e) => {
      if (e.target.id === "welcomeModal") {
        this.startTutorial();
      }
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (this.isActive) {
        if (e.key === "ArrowRight" || e.key === "Space") {
          e.preventDefault();
          this.nextStep();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          this.prevStep();
        } else if (e.key === "Escape") {
          e.preventDefault();
          this.finishTutorial();
        }
      }
    });

    // Simular funcionalidades do portal
    this.bindPortalFunctionality();
  }

  bindPortalFunctionality() {
    // Simular busca de alunos
    document.getElementById("searchInput").addEventListener("input", (e) => {
      if (e.target.value.length > 3) {
        this.showNotification("🔍 Buscando alunos...", "info");
        setTimeout(() => {
          this.showNotification("✅ 3 alunos encontrados!", "success");
        }, 1500);
      }
    });

    // Simular cópia do link
    document.getElementById("linkBtn").addEventListener("click", () => {
      this.showNotification(
        "📋 Link copiado para área de transferência!",
        "success"
      );
    });

    // Simular notificações
    document
      .getElementById("notificationIcon")
      .addEventListener("click", () => {
        this.showNotification("🔔 Você tem 3 novas notificações", "info");
      });

    // Simular nova matrícula
    document.getElementById("novaMatricula").addEventListener("click", () => {
      this.showNotification("🎓 Iniciando nova matrícula...", "success");
    });

    // Simular mudança de instituição
    document.querySelectorAll('input[name="instituicao"]').forEach((radio) => {
      radio.addEventListener("change", (e) => {
        const instituicao = e.target.parentElement.textContent.trim();
        this.showNotification(`🏛️ ${instituicao} selecionada`, "info");
        this.updateCourseOptions();
      });
    });

    // Simular busca de curso
    document.getElementById("curso").addEventListener("input", (e) => {
      if (e.target.value.length > 2) {
        this.showNotification("📚 Buscando cursos...", "info");
        setTimeout(() => {
          this.showNotification(
            `✅ ${Math.floor(Math.random() * 20) + 5} cursos encontrados!`,
            "success"
          );
        }, 1000);
      }
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
    const tutorialBox = overlay.querySelector(".tutorial-box");
    const tipElement = document.getElementById("tutorialTip");

    console.log(`Mostrando passo ${this.currentStep + 1}: ${step.title}`);

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

    // Destacar se for importante
    if (step.important) {
      tutorialBox.style.border = "3px solid #e53935";
      document.querySelector(".tutorial-content h3").style.color = "#e53935";
      document.querySelector(".tutorial-content h3::before").textContent = "⭐";
    } else {
      tutorialBox.style.border = "3px solid #002f5f";
      document.querySelector(".tutorial-content h3").style.color = "#002f5f";
      document.querySelector(".tutorial-content h3::before").textContent = "🤝";
    }

    // Atualizar botões
    const prevBtn = document.getElementById("prevStep");
    const nextBtn = document.getElementById("nextStep");
    const finishBtn = document.getElementById("finishTutorial");

    if (this.currentStep === 0) {
      prevBtn.disabled = true;
      prevBtn.style.opacity = "0.5";
      prevBtn.style.cursor = "not-allowed";
    } else {
      prevBtn.disabled = false;
      prevBtn.style.opacity = "1";
      prevBtn.style.cursor = "pointer";
    }

    if (this.currentStep === this.totalSteps - 1) {
      nextBtn.classList.add("hidden");
      finishBtn.classList.remove("hidden");
    } else {
      nextBtn.classList.remove("hidden");
      finishBtn.classList.add("hidden");
    }

    // PRIMEIRO: Atualizar progresso
    this.updateProgress();

    // SEGUNDO: Destacar elemento
    this.highlightElement(step.target);

    // TERCEIRO: Animar cursor
    this.animateCursor(step.target);

    // QUARTO: Posicionar caixa do tutorial
    setTimeout(() => {
      this.positionTutorialBox(step.target, step.position);
    }, 200);

    // Adicionar efeito hover
    this.addHoverEffect(step.target);
  }

  positionTutorialBox(selector, position) {
    const element = document.querySelector(selector);
    const tutorialBox = document.querySelector(".tutorial-box");

    if (!element || !tutorialBox) {
      console.error(`Elemento não encontrado: ${selector}`);
      return;
    }

    // Remover classes de posição anteriores
    tutorialBox.classList.remove(
      "position-top",
      "position-bottom",
      "position-left",
      "position-right"
    );

    // Forçar visibilidade para cálculos
    tutorialBox.style.visibility = "hidden";
    tutorialBox.style.display = "block";
    tutorialBox.style.position = "fixed";

    requestAnimationFrame(() => {
      const elementRect = element.getBoundingClientRect();
      const boxRect = tutorialBox.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top, left;
      let finalPosition = position;

      switch (position) {
        case "top":
          top = elementRect.top - boxRect.height - 20;
          left = elementRect.left + elementRect.width / 2 - boxRect.width / 2;
          break;

        case "bottom":
          top = elementRect.bottom + 20;
          left = elementRect.left + elementRect.width / 2 - boxRect.width / 2;
          break;

        case "left":
          top = elementRect.top + elementRect.height / 2 - boxRect.height / 2;
          left = elementRect.left - boxRect.width - 20;
          break;

        case "right":
          top = elementRect.top + elementRect.height / 2 - boxRect.height / 2;
          left = elementRect.right + 20;
          break;

        default:
          top = elementRect.bottom + 20;
          left = elementRect.left + elementRect.width / 2 - boxRect.width / 2;
          finalPosition = "bottom";
          break;
      }

      // Ajustar se sair da tela
      if (left < 20) {
        left = 20;
      } else if (left + boxRect.width > viewportWidth - 20) {
        left = viewportWidth - boxRect.width - 20;
      }

      if (top < 20) {
        top = elementRect.bottom + 20;
        finalPosition = "bottom";
      } else if (top + boxRect.height > viewportHeight - 20) {
        top = elementRect.top - boxRect.height - 20;
        finalPosition = "top";
      }

      // Aplicar posição
      tutorialBox.classList.add(`position-${finalPosition}`);
      tutorialBox.style.top = `${Math.max(20, top)}px`;
      tutorialBox.style.left = `${Math.max(20, left)}px`;
      tutorialBox.style.visibility = "visible";

      console.log(`Tutorial posicionado: ${finalPosition} em ${top}, ${left}`);
    });
  }

  highlightElement(selector) {
    const element = document.querySelector(selector);
    const highlight = document.getElementById("highlight");

    if (element) {
      const rect = element.getBoundingClientRect();
      highlight.style.top = rect.top - 8 + "px";
      highlight.style.left = rect.left - 8 + "px";
      highlight.style.width = rect.width + 16 + "px";
      highlight.style.height = rect.height + 16 + "px";
      highlight.classList.remove("hidden");

      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
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

      // Animação especial para Nova Matrícula
      if (selector === "#novaMatricula") {
        cursor.style.color = "#e53935";
        cursor.style.fontSize = "32px";
      } else {
        cursor.style.color = "#e53935";
        cursor.style.fontSize = "28px";
      }
    }
  }

  addHoverEffect(selector) {
    const previousElement = document.querySelector(".tutorial-highlight-hover");
    if (previousElement) {
      previousElement.classList.remove("tutorial-highlight-hover");
    }

    const element = document.querySelector(selector);
    if (element) {
      element.classList.add("tutorial-highlight-hover");
    }
  }

  updateProgress() {
    const progressItems = document.querySelectorAll(".progress-item");

    progressItems.forEach((item, index) => {
      const icon = item.querySelector("i");

      item.classList.remove("completed", "current");

      if (index < this.currentStep) {
        item.classList.add("completed");
        icon.className = "fas fa-check-circle";
      } else if (index === this.currentStep) {
        item.classList.add("current");
        icon.className = "fas fa-circle-notch";
      } else {
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

    // Remover efeito hover
    const element = document.querySelector(".tutorial-highlight-hover");
    if (element) {
      element.classList.remove("tutorial-highlight-hover");
    }

    this.showCompletionMessage();
  }

  showCompletionMessage() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <i class="fas fa-trophy"></i>
          <h2>Tutorial Concluído!</h2>
        </div>
        <div class="modal-body">
          <p>🎉 <strong>Parabéns! Você dominou o Portal do Parceiro!</strong></p>
          <p>Agora você sabe como usar todas as ferramentas disponíveis:</p>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4 style="margin: 0 0 10px 0; color: #28a745;">✅ Conhecimentos adquiridos:</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Sistema de busca de alunos</li>
              <li>Geração de link personalizado</li>
              <li>Processo de nova matrícula</li>
              <li>Seleção de instituições e cursos</li>
              <li>Navegação no menu lateral</li>
              <li>Filtros por modalidade e área</li>
            </ul>
          </div>

          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2196f3;">
            <p><strong>💡 Navegação Aprimorada:</strong></p>
            <p>• Use as <strong>setas do teclado</strong> para navegar no tutorial<br>
            • Pressione <strong>ESC</strong> para sair do tutorial<br>
            • As caixas se posicionam automaticamente próximas aos elementos</p>
          </div>

          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4 style="margin: 0 0 10px 0; color: #f39c12;">🚀 Próximos Passos:</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li><strong>Explore o menu lateral</strong> - Acesse relatórios, leads e treinamentos</li>
              <li><strong>Use o link personalizado</strong> - Compartilhe com seus clientes</li>
              <li><strong>Pratique matrículas</strong> - Quanto mais usar, melhor será</li>
              <li><strong>Acompanhe notificações</strong> - Fique sempre atualizado</li>
            </ul>
          </div>
          
          <div class="info-box">
            <i class="fas fa-star"></i>
            <strong>Dica Final:</strong> O Portal do Parceiro é sua ferramenta de sucesso - use todas as funcionalidades!
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-success" onclick="this.closest('.modal').remove()">
            <i class="fas fa-medal"></i> Sou um Expert!
          </button>
          <button class="btn btn-primary" onclick="window.location.href='index.html'">
            <i class="fas fa-home"></i> Voltar ao Início
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  restartTutorial() {
    this.hideProgressPanel();
    this.currentStep = 0;
    this.showWelcomeModal();
  }

  showProgressPanel() {
    document.getElementById("progressPanel").classList.remove("hidden");
  }

  hideProgressPanel() {
    document.getElementById("progressPanel").classList.add("hidden");
  }

  // Funcionalidades simuladas do portal
  updateCourseOptions() {
    const cursoInput = document.getElementById("curso");
    const instituicaoSelecionada = document.querySelector(
      'input[name="instituicao"]:checked'
    );

    if (instituicaoSelecionada) {
      const nomeInstituicao =
        instituicaoSelecionada.parentElement.textContent.trim();

      if (nomeInstituicao.includes("Única")) {
        cursoInput.placeholder = "Ex: Administração, Direito, Pedagogia...";
      } else if (nomeInstituicao.includes("Prominas")) {
        cursoInput.placeholder = "Ex: MBA em Gestão, Pós em Educação...";
      } else if (nomeInstituicao.includes("Conexão")) {
        cursoInput.placeholder =
          "Ex: Técnico em Informática, Curso de Inglês...";
      }
    }
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      top: ${
        20 + document.querySelectorAll(".portal-notification").length * 70
      }px;
      right: 20px;
      background: ${this.getNotificationColor(type)};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 0.9em;
      z-index: 1002;
      animation: notificationSlideIn 0.3s ease;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    notification.className = "portal-notification";
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="flex: 1;">${message}</span>
        <button onclick="this.closest('.portal-notification').remove()" style="
          background: none;
          border: none;
          color: white;
          font-size: 1.2em;
          cursor: pointer;
          opacity: 0.7;
        ">&times;</button>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = "notificationSlideOut 0.3s ease";
        setTimeout(() => notification.remove(), 300);
      }
    }, 4000);
  }

  getNotificationColor(type) {
    switch (type) {
      case "success":
        return "#28a745";
      case "error":
        return "#dc3545";
      case "warning":
        return "#ffc107";
      default:
        return "#002f5f";
    }
  }
}

// Inicializar quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  new PortalParceiroTutorialManager();
});

// Sistema de validação e máscaras para formulários
class PortalFormValidator {
  constructor() {
    this.init();
  }

  init() {
    // Adicionar validação em tempo real
    this.addFormValidation();
    this.addInteractiveFeatures();
  }

  addFormValidation() {
    // Validar seleção de instituição antes de buscar curso
    const cursoInput = document.getElementById("curso");
    const instituicaoInputs = document.querySelectorAll(
      'input[name="instituicao"]'
    );

    cursoInput.addEventListener("focus", () => {
      const instituicaoSelecionada = document.querySelector(
        'input[name="instituicao"]:checked'
      );
      if (!instituicaoSelecionada) {
        this.showFieldError(cursoInput, "Selecione uma instituição primeiro");
        cursoInput.blur();
      }
    });

    // Validar preenchimento obrigatório
    const form = document.getElementById("enrollmentForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.validateForm();
    });
  }

  addInteractiveFeatures() {
    // Efeitos visuais nos radio buttons
    const radioInputs = document.querySelectorAll('input[type="radio"]');
    radioInputs.forEach((radio) => {
      radio.addEventListener("change", () => {
        this.animateSelection(radio);
      });
    });

    // Efeitos nos botões do menu lateral
    const menuItems = document.querySelectorAll(".menu-lateral li");
    menuItems.forEach((item) => {
      item.addEventListener("click", () => {
        this.simulateMenuAction(item.textContent.trim());
      });
    });

    // Efeito hover aprimorado nos elementos
    this.addHoverEffects();
  }

  animateSelection(radio) {
    const label = radio.parentElement;
    label.style.transform = "scale(0.98)";
    setTimeout(() => {
      label.style.transform = "scale(1)";
    }, 150);

    // Mostrar feedback da seleção
    const groupName = radio.name;
    const selectedText = label.textContent.trim();

    const notification = new PortalParceiroTutorialManager();
    notification.showNotification(`✅ ${selectedText} selecionado`, "success");
  }

  simulateMenuAction(menuItem) {
    const actions = {
      "Banco Digital": "💰 Acessando Banco Digital...",
      Leads: "🎯 Carregando seus leads...",
      Treinamentos: "📚 Abrindo área de treinamentos...",
      Administrativo: "📋 Acessando área administrativa...",
      Alunos: "👥 Listando seus alunos...",
      Ferramentas: "🛠️ Carregando ferramentas...",
      Relatórios: "📊 Gerando relatórios...",
      Vestibular: "🎓 Acessando área do vestibular...",
      Suporte: "🆘 Conectando com suporte...",
    };

    const message = actions[menuItem] || `📂 Acessando ${menuItem}...`;

    const notification = new PortalParceiroTutorialManager();
    notification.showNotification(message, "info");
  }

  validateForm() {
    const errors = [];

    // Verificar instituição
    const instituicao = document.querySelector(
      'input[name="instituicao"]:checked'
    );
    if (!instituicao) {
      errors.push("Selecione uma instituição de ensino");
    }

    // Verificar modalidade
    const modalidade = document.querySelector(
      'input[name="modalidade"]:checked'
    );
    if (!modalidade) {
      errors.push("Selecione uma modalidade de ensino");
    }

    // Verificar área
    const area = document.querySelector('input[name="area"]:checked');
    if (!area) {
      errors.push("Selecione uma área do curso");
    }

    // Verificar curso
    const curso = document.getElementById("curso").value.trim();
    if (!curso) {
      errors.push("Digite o nome do curso desejado");
    }

    if (errors.length > 0) {
      this.showValidationErrors(errors);
    } else {
      this.showSuccessMessage();
    }
  }

  showValidationErrors(errors) {
    const errorModal = document.createElement("div");
    errorModal.className = "modal";
    errorModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header" style="background: #dc3545;">
          <i class="fas fa-exclamation-triangle"></i>
          <h2>Campos Obrigatórios</h2>
        </div>
        <div class="modal-body">
          <p><strong>Por favor, preencha os seguintes campos:</strong></p>
          <ul>
            ${errors.map((error) => `<li>${error}</li>`).join("")}
          </ul>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="this.closest('.modal').remove()">
            <i class="fas fa-check"></i> Entendi
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(errorModal);
  }

  showSuccessMessage() {
    const successModal = document.createElement("div");
    successModal.className = "modal";
    successModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header" style="background: #28a745;">
          <i class="fas fa-check-circle"></i>
          <h2>Formulário Validado!</h2>
        </div>
        <div class="modal-body">
          <p>✅ <strong>Todos os campos foram preenchidos corretamente!</strong></p>
          <p>Agora você pode prosseguir com a matrícula do aluno.</p>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4 style="margin: 0 0 10px 0; color: #28a745;">📋 Próximos Passos:</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Coletar dados pessoais do aluno</li>
              <li>Confirmar informações de contato</li>
              <li>Processar pagamento da matrícula</li>
              <li>Enviar confirmação por email</li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-success" onclick="this.closest('.modal').remove()">
            <i class="fas fa-arrow-right"></i> Continuar Matrícula
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(successModal);
  }

  showFieldError(field, message) {
    // Remover erro anterior
    const existingError = field.parentNode.querySelector(".field-error");
    if (existingError) existingError.remove();

    // Adicionar novo erro
    const errorDiv = document.createElement("div");
    errorDiv.className = "field-error";
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      color: #dc3545;
      font-size: 0.8em;
      margin-top: 5px;
      animation: errorSlideIn 0.3s ease;
    `;

    field.parentNode.appendChild(errorDiv);

    // Destacar campo com erro
    field.style.borderColor = "#dc3545";
    field.style.background = "#fdf2f2";

    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
      field.style.borderColor = "";
      field.style.background = "";
    }, 3000);
  }

  addHoverEffects() {
    // Efeitos nos labels de radio
    const labels = document.querySelectorAll("label");
    labels.forEach((label) => {
      if (label.querySelector('input[type="radio"]')) {
        label.addEventListener("mouseenter", () => {
          if (!label.querySelector("input").checked) {
            label.style.transform = "translateY(-2px)";
            label.style.boxShadow = "0 4px 12px rgba(0, 47, 95, 0.1)";
          }
        });

        label.addEventListener("mouseleave", () => {
          if (!label.querySelector("input").checked) {
            label.style.transform = "translateY(0)";
            label.style.boxShadow = "none";
          }
        });
      }
    });

    // Efeitos nos botões
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
      if (!button.classList.contains("btn")) {
        button.addEventListener("mouseenter", () => {
          button.style.transform = "translateY(-2px)";
          button.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
        });

        button.addEventListener("mouseleave", () => {
          button.style.transform = "translateY(0)";
          button.style.boxShadow = "none";
        });
      }
    });
  }
}

// Inicializar validador
document.addEventListener("DOMContentLoaded", () => {
  new PortalFormValidator();
});

// Sistema de dicas contextuais
class ContextualHelp {
  constructor() {
    this.tips = {
      searchInput: "Digite CPF (apenas números) ou nome completo do aluno",
      linkBtn: "Seu link personalizado para compartilhar com clientes",
      novaMatricula: "Botão principal para iniciar novas vendas",
      curso: "Digite palavras-chave para encontrar cursos rapidamente",
    };

    this.init();
  }

  init() {
    Object.keys(this.tips).forEach((elementId) => {
      const element = document.getElementById(elementId);
      if (element) {
        this.addTooltip(element, this.tips[elementId]);
      }
    });
  }

  addTooltip(element, text) {
    element.addEventListener("mouseenter", (e) => {
      this.showTooltip(e, text);
    });

    element.addEventListener("mouseleave", () => {
      this.hideTooltip();
    });
  }

  showTooltip(event, text) {
    const tooltip = document.createElement("div");
    tooltip.id = "contextualTooltip";
    tooltip.innerHTML = text;
    tooltip.style.cssText = `
      position: fixed;
      background: #333;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.85em;
      z-index: 1003;
      max-width: 250px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      pointer-events: none;
      animation: tooltipFadeIn 0.3s ease;
    `;

    document.body.appendChild(tooltip);

    const rect = tooltip.getBoundingClientRect();
    tooltip.style.left = event.clientX - rect.width / 2 + "px";
    tooltip.style.top = event.clientY - rect.height - 10 + "px";
  }

  hideTooltip() {
    const tooltip = document.getElementById("contextualTooltip");
    if (tooltip) {
      tooltip.remove();
    }
  }
}

// Inicializar sistema de dicas
document.addEventListener("DOMContentLoaded", () => {
  new ContextualHelp();
});

// Adicionar estilos para animações
const additionalStyles = document.createElement("style");
additionalStyles.textContent = `
  @keyframes errorSlideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes notificationSlideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes notificationSlideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
  
  @keyframes tooltipFadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
document.head.appendChild(additionalStyles);

// Função para demonstrar funcionalidades avançadas
function demonstrateAdvancedFeatures() {
  console.log("🚀 Portal do Parceiro - Funcionalidades Ativadas:");
  console.log("✅ Tutorial guiado interativo");
  console.log("✅ Sistema de validação de formulários");
  console.log("✅ Dicas contextuais");
  console.log("✅ Simulação de funcionalidades do portal");
  console.log("✅ Notificações em tempo real");
  console.log("✅ Efeitos visuais aprimorados");
  console.log("✅ Navegação por teclado");
  console.log("✅ Posicionamento inteligente de modais");
}

// Executar demonstração
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(demonstrateAdvancedFeatures, 1000);
});
