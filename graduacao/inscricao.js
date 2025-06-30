class InscricaoTutorialManager {
  constructor() {
    this.currentStep = 0;
    this.totalSteps = 8;
    this.isActive = false;

    this.steps = [
      {
        title: "Modalidades de Ingresso",
        text: "Existem 4 modalidades disponíveis para ingresso na graduação. Cada uma tem critérios específicos.",
        tip: "Prova Agendada: o aluno realizará uma redação on-line com um tema específico\nEnem: para o ingressante que realizou o exame nos últimos 3 anos e obteve uma média a partir de 450 pontos\nObtenção de Novo Título: quando o aluno já possui uma graduação.\nTransferência: para o aluno que já realiza o curso em outra instituição e quer concluir conosco.",
        target: "#modalitySection",
        position: "bottom",
      },
      {
        title: "Sistema de Abas",
        text: "O formulário está dividido em duas abas: Dados do Candidato e Dados do Curso. Após preencher os Dados do Candidato você deve direcionar ao Dados do Curso",
        tip: "Sempre preencha primeiro os dados do candidato antes de passar para os dados do curso.",
        target: "#tabsContainer",
        position: "bottom",
      },
      {
        title: "Dados Pessoais Básicos",
        text: "Inicie coletando CPF, nome completo e sexo. Estes são os dados fundamentais para identificação do candidato.",
        tip: "Sempre confirme a grafia correta do nome, email e número de telefone - erros podem causar problemas na matrícula.",
        target: "#cpfField",
        position: "right",
      },
      {
        title: "Informações de Contato",
        text: "E-mail e celular são essenciais para comunicação. O candidato receberá confirmações e informações importantes.",
        tip: "Verifique se o e-mail está correto - todas as comunicações oficiais serão enviadas para ele.",
        target: "#emailField",
        position: "right",
      },
      {
        title: "Campo Indicação - MUITO IMPORTANTE!",
        text: "SEMPRE insira seu nome no campo 'Indicação' para que a venda seja vinculada a você como parceiro.",
        tip: "Este campo é OBRIGATÓRIO para receber sua comissão! Nunca esqueça de preenchê-lo.",
        target: "#indicacaoField",
        position: "top",
        important: true,
      },
      {
        title: "Endereço Completo",
        text: "Colete todas as informações de endereço. O CEP ajuda a preencher automaticamente cidade e estado.",
        tip: "Endereço completo é necessário para emissão de documentos e correspondências oficiais.",
        target: "#enderecoRow",
        position: "right",
      },
      {
        title: "Seleção de Curso",
        text: "Agora vamos para a aba 'Dados do Curso'. Aqui o candidato escolhe o curso de interesse.",
        tip: "Ajude o candidato a escolher o curso mais adequado ao seu perfil e objetivos profissionais.\n Atenção! Sempre vincule ao seu polo ou unidade mais próxima do candidato.",
        target: "#tabCurso",
        position: "bottom",
        action: "switchTab",
      },
      {
        title: "Finalização e Pagamento",
        text: "Após preencher todos os dados, clique em CONTINUAR. A taxa de matrícula é de até R$ 250,00.",
        tip: "O pagamento da taxa de matrícula dá acesso ao portal e materiais didáticos. Se você negociou um valor diferente gentileza entrar em contato com seu consultor para solicitar a alteração do valor da taxa.",
        target: "#submitButton",
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

    // Adicionar eventos de teclado
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

    // CORRIGIDO - Redirecionamento direto para centralcandidato.html
    document.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();

      // Verificar se o tutorial está ativo
      if (this.isActive) {
        // Se estiver no tutorial, mostrar modal explicativo
        this.showPaymentInfo();
      } else {
        // Se não estiver no tutorial, redirecionar diretamente
        window.location.href = "centralcandidato.html";
      }
    });
  }

  // NOVO: Bloquear scroll durante tutorial
  blockScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.width = '100%';
  }

  // NOVO: Desbloquear scroll
  unblockScroll() {
    const scrollY = document.body.style.top;
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }

  showWelcomeModal() {
    document.getElementById("welcomeModal").style.display = "flex";
    this.blockScroll(); // Bloquear scroll
  }

  hideWelcomeModal() {
    document.getElementById("welcomeModal").style.display = "none";
    // Não desbloquear scroll aqui pois o tutorial vai começar
  }

  startTutorial() {
    this.hideWelcomeModal();
    this.isActive = true;
    this.currentStep = 0;
    this.showProgressPanel();
    this.showStep();
    // Scroll continua bloqueado durante o tutorial
  }

  showStep() {
    const step = this.steps[this.currentStep];
    const overlay = document.getElementById("tutorialOverlay");
    const tutorialBox = overlay.querySelector(".tutorial-box");
    const tipElement = document.getElementById("tutorialTip");

    console.log(`Mostrando passo ${this.currentStep + 1}: ${step.title}`);

    // Executar ação especial se necessário
    if (step.action === "switchTab") {
      document.getElementById("tabCurso").click();
    }

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
      tutorialBox.style.border = "3px solid #ff6b35";
      document.querySelector(".tutorial-content h3").style.color = "#ff6b35";
      const iconElement = document.querySelector(
        ".tutorial-content h3::before"
      );
      if (iconElement) {
        iconElement.textContent = "⚠️";
      }
    } else {
      tutorialBox.style.border = "3px solid #7c4dff";
      document.querySelector(".tutorial-content h3").style.color = "#7c4dff";
    }

    // Atualizar botões
    const prevBtn = document.getElementById("prevStep");
    const nextBtn = document.getElementById("nextStep");
    const finishBtn = document.getElementById("finishTutorial");

    // Desabilitar/habilitar botão anterior
    if (this.currentStep === 0) {
      prevBtn.disabled = true;
      prevBtn.style.opacity = "0.5";
      prevBtn.style.cursor = "not-allowed";
    } else {
      prevBtn.disabled = false;
      prevBtn.style.opacity = "1";
      prevBtn.style.cursor = "pointer";
    }

    // Mostrar/esconder botões próximo/finalizar
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

    // QUARTO: Posicionar caixa do tutorial (com delay para garantir que o elemento esteja visível)
    setTimeout(() => {
      this.positionTutorialBox(step.target, step.position);
    }, 200);

    // Adicionar efeito hover ao elemento destacado
    this.addHoverEffect(step.target);
  }

  // FUNÇÃO CORRIGIDA DE POSICIONAMENTO
  positionTutorialBox(selector, position) {
    const element = document.querySelector(selector);
    const tutorialBox = document.querySelector(".tutorial-box");

    console.log(`Tentando posicionar tutorial box para: ${selector}`);

    if (!element) {
      console.error(`Elemento não encontrado: ${selector}`);
      return;
    }

    if (!tutorialBox) {
      console.error("Tutorial box não encontrado");
      return;
    }

    // Remover classes de posição anteriores
    tutorialBox.classList.remove(
      "position-top",
      "position-bottom",
      "position-left",
      "position-right"
    );

    // Forçar o tutorial box a ser visível temporariamente para calcular dimensões
    tutorialBox.style.visibility = "hidden";
    tutorialBox.style.display = "block";
    tutorialBox.style.position = "fixed";

    // Aguardar próximo frame para cálculos
    requestAnimationFrame(() => {
      const elementRect = element.getBoundingClientRect();
      const boxRect = tutorialBox.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      console.log("Element rect:", elementRect);
      console.log("Box rect:", boxRect);

      let top, left;
      let finalPosition = position;

      // Calcular posição inicial baseada na preferência
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

      // Ajustar se sair da tela horizontalmente
      if (left < 20) {
        left = 20;
      } else if (left + boxRect.width > viewportWidth - 20) {
        left = viewportWidth - boxRect.width - 20;
      }

      // Ajustar se sair da tela verticalmente
      if (top < 20) {
        top = elementRect.bottom + 20;
        finalPosition = "bottom";
      } else if (top + boxRect.height > viewportHeight - 20) {
        top = elementRect.top - boxRect.height - 20;
        finalPosition = "top";
      }

      // Aplicar a classe de posição final
      tutorialBox.classList.add(`position-${finalPosition}`);

      // Aplicar posição
      tutorialBox.style.top = `${Math.max(20, top)}px`;
      tutorialBox.style.left = `${Math.max(20, left)}px`;
      tutorialBox.style.visibility = "visible";

      console.log(
        `Tutorial box posicionado em: top=${top}, left=${left}, position=${finalPosition}`
      );
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

      // Não usar scroll durante tutorial - elemento já está visível
      // element.scrollIntoView({
      //   behavior: "smooth",
      //   block: "center",
      //   inline: "center",
      // });
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

      // Animação especial para campo indicação
      if (selector === "#indicacaoField") {
        cursor.style.color = "#ff6b35";
        cursor.style.fontSize = "32px";
      } else {
        cursor.style.color = "#ff4444";
        cursor.style.fontSize = "28px";
      }

      // Animação especial no último passo
      if (this.currentStep === this.totalSteps - 1) {
        setTimeout(() => {
          cursor.style.transform = "scale(0.7)";
          setTimeout(() => {
            cursor.style.transform = "scale(1)";
          }, 300);
        }, 1500);
      }
    }
  }

  addHoverEffect(selector) {
    // Remover efeito anterior
    const previousElement = document.querySelector(".tutorial-highlight-hover");
    if (previousElement) {
      previousElement.classList.remove("tutorial-highlight-hover");
    }

    // Adicionar ao elemento atual
    const element = document.querySelector(selector);
    if (element) {
      element.classList.add("tutorial-highlight-hover");
    }
  }

  // FUNÇÃO CORRIGIDA DE ATUALIZAÇÃO DE PROGRESSO
  updateProgress() {
    console.log(
      `Atualizando progresso para passo: ${this.currentStep + 1} de ${
        this.totalSteps
      }`
    );

    const progressItems = document.querySelectorAll(".progress-item");

    console.log(`Encontrados ${progressItems.length} itens de progresso`);

    progressItems.forEach((item, index) => {
      const icon = item.querySelector("i");

      if (!icon) {
        console.error(`Ícone não encontrado para item ${index}`);
        return;
      }

      // Limpar todas as classes primeiro
      item.classList.remove("completed", "current");

      if (index < this.currentStep) {
        // Passos já concluídos
        item.classList.add("completed");
        icon.className = "fas fa-check-circle";
        console.log(`Item ${index} marcado como concluído`);
      } else if (index === this.currentStep) {
        // Passo atual
        item.classList.add("current");
        icon.className = "fas fa-circle-notch";
        console.log(`Item ${index} marcado como atual`);
      } else {
        // Passos futuros
        icon.className = "fas fa-circle";
        console.log(`Item ${index} marcado como futuro`);
      }
    });
  }

  nextStep() {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
      console.log(`Avançando para passo: ${this.currentStep + 1}`);
      this.showStep();
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      console.log(`Voltando para passo: ${this.currentStep + 1}`);

      // Se voltar para o passo 7 (seleção de curso), garantir que a aba correta esteja ativa
      if (this.currentStep === 6) {
        document.getElementById("tabCurso").click();
      }
      // Se voltar para passos anteriores ao 7, voltar para aba de dados do candidato
      else if (this.currentStep < 6) {
        document.getElementById("tabCandidato").click();
      }

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

    // IMPORTANTE: Desbloquear scroll quando finalizar tutorial
    this.unblockScroll();

    // Mostrar mensagem de conclusão
    this.showCompletionMessage();
  }

  showCompletionMessage() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <i class="fas fa-graduation-cap"></i>
          <h2>Tutorial Concluído!</h2>
        </div>
        <div class="modal-body">
          <p>Parabéns! Você aprendeu como preencher o formulário de inscrição! 🎉</p>
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>💡 Dicas importantes:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Use as <strong> setas do teclado</strong> para navegar no tutorial</li>
              <li>Pressione <strong>ESC</strong> para sair do tutorial</li>
              <li>As caixas de diálogo se posicionam automaticamente</li>
            </ul>
          </div>
          <p><strong>Pontos importantes para lembrar:</strong></p>
          <ul>
            <li><i class="fas fa-exclamation-triangle" style="color: #ff6b35;"></i> <strong>SEMPRE</strong> preencha o campo "Indicação" com seu nome</li>
            <li><i class="fas fa-user-check"></i> Colete todos os dados do candidato com cuidado</li>
            <li><i class="fas fa-envelope"></i> Confirme e-mail e telefone para comunicações</li>
            <li><i class="fas fa-money-bill-wave"></i> Taxa de matrícula:  R$ 250,00 (podendo ser alteração pelo seu consultor)</li>
          </ul>
          <div class="info-box">
            <i class="fas fa-lightbulb"></i>
            <strong>Dica:</strong> Quanto mais completos os dados, mais rápida será a matrícula, e menos propício a causar estresses futuros!
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-success" onclick="this.closest('.modal').remove()">
            <i class="fas fa-check"></i> Entendi!
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Remover modal após 15 segundos
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 15000);
  }

  showPaymentInfo() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <i class="fas fa-check-circle"></i>
        <h2>Inscrição Finalizada!</h2>
      </div>
      <div class="modal-body">
        <p>✅ <strong>Parabéns! Inscrição realizada com sucesso!</strong></p>
        <p>Agora você será direcionado para a Central do Candidato onde poderá:</p>

        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h4 style="margin: 0 0 10px 0; color: #28a745;">📋 Próximos Passos:</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Acessar área do candidato</li>
            <li>Verificar dados da inscrição</li>
            <li>Fazer upload de documentos</li>
            <li>Acompanhar status do processo</li>
          </ul>
        </div>

        <p><strong>Vamos continuar o tutorial na Central do Candidato!</strong></p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="window.location.href='centralcandidato.html'">
          <i class="fas fa-arrow-right"></i> Ir para Central do Candidato
        </button>
      </div>
    </div>
  `;

    document.body.appendChild(modal);
  }

  restartTutorial() {
    this.hideProgressPanel();
    // Voltar para aba de dados do candidato
    document.getElementById("tabCandidato").click();
    this.currentStep = 0;
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
  console.log("Inicializando Tutorial Manager");
  new InscricaoTutorialManager();
});

// SISTEMA CORRIGIDO DE INFORMAÇÕES DAS MODALIDADES
document.addEventListener("DOMContentLoaded", () => {
  const modalityLabels = document.querySelectorAll(".modality-options label");
  let currentTooltip = null; // Controlar tooltip ativo

  modalityLabels.forEach((label) => {
    // Usar mouseenter em vez de click para evitar múltiplas aberturas
    label.addEventListener("mouseenter", (e) => {
      const input = label.querySelector('input[type="radio"]');
      if (input) {
        const modalityText = label.textContent.trim();
        showModalityInfo(modalityText, e.currentTarget);
      }
    });

    // Fechar tooltip ao sair do elemento
    label.addEventListener("mouseleave", () => {
      setTimeout(() => {
        if (currentTooltip && !currentTooltip.matches(':hover')) {
          closeCurrentTooltip();
        }
      }, 100);
    });
  });

  function showModalityInfo(modality, targetElement) {
    // Fechar tooltip anterior se existir
    closeCurrentTooltip();

    let info = "";
    let icon = "";

    switch (modality) {
      case "Prova Agendada":
        icon = "📝";
        info = `
          <strong>Prova Agendada:</strong><br>
          • Redação online com tema específico<br>
          • Modalidade mais comum e flexível<br>
          • Agendamento conforme disponibilidade<br>
          • Duração: até 2 horas<br>
          • Resultado em até 48 horas
        `;
        break;
      case "ENEM":
        icon = "🎓";
        info = `
          <strong>ENEM:</strong><br>
          • Para quem fez o exame nos últimos 3 anos<br>
          • Média mínima: 450 pontos<br>
          • Não precisa fazer nova prova<br>
          • Apresentar certificado ou boletim<br>
          • Processo mais rápido
        `;
        break;
      case "Novo Título":
        icon = "🎯";
        info = `
          <strong>Novo Título:</strong><br>
          • Para quem já possui graduação completa<br>
          • Processo simplificado sem prova<br>
          • Apresentação de diploma registrado<br>
          • Análise curricular prévia<br>
          • Segunda graduação
        `;
        break;
      case "Transferência":
        icon = "🔄";
        info = `
          <strong>Transferência:</strong><br>
          • Já estuda o curso em outra instituição<br>
          • Quer concluir na UniÚnica<br>
          • Análise de disciplinas já cursadas<br>
          • Aproveitamento de créditos<br>
          • Histórico escolar obrigatório
        `;
        break;
    }

    const tooltip = document.createElement("div");
    tooltip.className = "modality-tooltip";
    tooltip.innerHTML = `
      <div class="tooltip-header">
        <span class="tooltip-icon">${icon}</span>
        <button class="tooltip-close" onclick="closeCurrentTooltip()">×</button>
      </div>
      <div class="tooltip-content">
        ${info}
      </div>
    `;

    tooltip.style.cssText = `
      position: fixed;
      background: white;
      border: 2px solid #7c4dff;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.3);
      z-index: 1001;
      max-width: 320px;
      animation: tooltipSlideIn 0.3s ease;
    `;

    // Posicionar tooltip
    const rect = targetElement.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 180;

    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    let top = rect.bottom + 15;

    if (left < 20) left = 20;
    if (left + tooltipWidth > window.innerWidth - 20) {
      left = window.innerWidth - tooltipWidth - 20;
    }
    if (top + tooltipHeight > window.innerHeight - 20) {
      top = rect.top - tooltipHeight - 15;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;

    // Manter referência do tooltip ativo
    currentTooltip = tooltip;
    document.body.appendChild(tooltip);

    // Adicionar evento para manter tooltip aberto quando mouse está sobre ele
    tooltip.addEventListener('mouseenter', () => {
      // Tooltip permanece aberto
    });

    tooltip.addEventListener('mouseleave', () => {
      closeCurrentTooltip();
    });

    // Auto-fechar após 8 segundos
    setTimeout(() => {
      if (currentTooltip === tooltip) {
        closeCurrentTooltip();
      }
    }, 8000);
  }

  // Função global para fechar tooltip
  window.closeCurrentTooltip = function() {
    if (currentTooltip && currentTooltip.parentNode) {
      currentTooltip.style.animation = "tooltipSlideOut 0.3s ease";
      setTimeout(() => {
        if (currentTooltip && currentTooltip.parentNode) {
          currentTooltip.remove();
        }
        currentTooltip = null;
      }, 300);
    }
  };
});

// Adicionar estilos para os tooltips das modalidades
const modalityTooltipStyles = document.createElement("style");
modalityTooltipStyles.textContent = `
  .modality-tooltip {
    font-family: 'Open Sans', sans-serif;
  }
  
  .tooltip-header {
    background: linear-gradient(135deg, #7c4dff, #a081ff);
    color: white;
    padding: 12px 15px;
    border-radius: 10px 10px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .tooltip-icon {
    font-size: 1.5em;
  }
  
  .tooltip-close {
    background: none;
    border: none;
    color: white;
    font-size: 1.5em;
    cursor: pointer;
    padding: 0;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;
  }
  
  .tooltip-close:hover {
    background: rgba(255,255,255,0.2);
  }
  
  .tooltip-content {
    padding: 15px;
    line-height: 1.5;
    color: #333;
    font-size: 0.9em;
  }
  
  .tooltip-content strong {
    color: #7c4dff;
    font-size: 1.1em;
  }
  
  @keyframes tooltipSlideIn {
    from {
      opacity: 0;
      transform: translateY(-15px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  @keyframes tooltipSlideOut {
    from {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateY(-15px) scale(0.9);
    }
  }
`;
document.head.appendChild(modalityTooltipStyles);

// Sistema de validação em tempo real
class FormValidation {
  constructor() {
    this.init();
  }

  init() {
    const cpfInput = document.querySelector('input[title="Digite o CPF"]');
    if (cpfInput) {
      cpfInput.addEventListener("input", (e) => {
        this.applyCPFMask(e.target);
      });
      cpfInput.addEventListener("blur", (e) => {
        this.validateCPF(e.target);
      });
    }

    const phoneInput = document.querySelector(
      'input[title="Digite o Celular"]'
    );
    if (phoneInput) {
      phoneInput.addEventListener("input", (e) => {
        this.applyPhoneMask(e.target);
      });
    }

    const cepInput = document.querySelector('input[title="Digite o CEP"]');
    if (cepInput) {
      cepInput.addEventListener("input", (e) => {
        this.applyCEPMask(e.target);
      });
      cepInput.addEventListener("blur", (e) => {
        this.searchCEP(e.target.value);
      });
    }

    const emailInput = document.querySelector('input[title="Digite o Email"]');
    if (emailInput) {
      emailInput.addEventListener("blur", (e) => {
        this.validateEmail(e.target);
      });
    }
  }

  applyCPFMask(input) {
    let value = input.value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    input.value = value;
  }

  applyPhoneMask(input) {
    let value = input.value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    input.value = value;
  }

  applyCEPMask(input) {
    let value = input.value.replace(/\D/g, "");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    input.value = value;
  }

  validateCPF(input) {
    const cpf = input.value.replace(/\D/g, "");
    if (cpf.length !== 11) {
      this.showFieldError(input, "CPF deve ter 11 dígitos");
      return false;
    }
    if (/^(\d)\1{10}$/.test(cpf)) {
      this.showFieldError(input, "CPF inválido");
      return false;
    }
    this.showFieldSuccess(input);
    return true;
  }

  validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value)) {
      this.showFieldError(input, "Email inválido");
      return false;
    }
    this.showFieldSuccess(input);
    return true;
  }

  searchCEP(cep) {
    const cleanCEP = cep.replace(/\D/g, "");
    if (cleanCEP.length === 8) {
      setTimeout(() => {
        this.fillAddressFields({
          logradouro: "Rua das Flores",
          bairro: "Centro",
          localidade: "São Paulo",
          uf: "SP",
        });
      }, 1000);
    }
  }

  fillAddressFields(data) {
    const enderecoInput = document.querySelector('input[title="Endereço"]');
    const bairroInput = document.querySelector('input[title="Bairro"]');

    if (enderecoInput && !enderecoInput.value) {
      enderecoInput.value = data.logradouro;
      this.animateField(enderecoInput);
    }

    if (bairroInput && !bairroInput.value) {
      bairroInput.value = data.bairro;
      this.animateField(bairroInput);
    }

    this.showNotification("✅ Endereço preenchido automaticamente!", "success");
  }

  animateField(field) {
    field.style.background = "#e8f5e8";
    field.style.transform = "scale(1.02)";
    setTimeout(() => {
      field.style.background = "#faf8ff";
      field.style.transform = "scale(1)";
    }, 1000);
  }

  showFieldError(field, message) {
    field.style.borderColor = "#e74c3c";
    field.style.background = "#fdf2f2";

    const existingError = field.parentNode.querySelector(".field-error");
    if (existingError) existingError.remove();

    const errorDiv = document.createElement("div");
    errorDiv.className = "field-error";
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      color: #e74c3c;
      font-size: 0.8em;
      margin-top: 5px;
      animation: errorSlideIn 0.3s ease;
    `;

    field.parentNode.appendChild(errorDiv);
  }

  showFieldSuccess(field) {
    field.style.borderColor = "#27ae60";
    field.style.background = "#f0fff4";

    const existingError = field.parentNode.querySelector(".field-error");
    if (existingError) existingError.remove();
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === "success" ? "#27ae60" : "#3498db"};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 0.9em;
      z-index: 1002;
      animation: notificationSlideIn 0.3s ease;
      max-width: 300px;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "notificationSlideOut 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Adicionar estilos para validação
const validationStyles = document.createElement("style");
validationStyles.textContent = `
  @keyframes errorSlideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes notificationSlideIn {
    from { opacity: 0; transform: translateX(100%); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes notificationSlideOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100%); }
  }
`;
document.head.appendChild(validationStyles);

// Inicializar validação
document.addEventListener("DOMContentLoaded", () => {
  new FormValidation();
});

// Sistema de dicas contextuais para campos
class ContextualHelp {
  constructor() {
    this.tips = {
      "Digite o CPF":
        "Apenas números. A formatação será aplicada automaticamente.",
      "Digite o Nome Completo": "Nome completo sem abreviações.",
      "Digite o Email": "Email válido para receber comunicações importantes.",
      "Digite o Celular": "Número com DDD para contato.",
      "Escolha quem te indicou":
        "⚠️ IMPORTANTE: Selecione seu nome para receber comissão!",
      "Digite o CEP": "CEP válido para preenchimento automático do endereço.",
    };
    this.init();
  }

  init() {
    Object.keys(this.tips).forEach((title) => {
      const input = document.querySelector(
        `input[title="${title}"], select[title="${title}"]`
      );
      if (input) {
        this.addContextualTip(input, this.tips[title]);
      }
    });
  }

  addContextualTip(element, tipText) {
    element.addEventListener("focus", (e) => {
      this.showTip(e.target, tipText);
    });
    element.addEventListener("blur", () => {
      this.hideTip();
    });
  }

  showTip(element, text) {
    this.hideTip();

    const tip = document.createElement("div");
    tip.id = "contextualTip";
    tip.innerHTML = text;

    const isImportant = text.includes("⚠️");

    tip.style.cssText = `
      position: fixed;
      background: ${isImportant ? "#fff3cd" : "#f8f9fa"};
      border: 2px solid ${isImportant ? "#ffc107" : "#7c4dff"};
      color: ${isImportant ? "#856404" : "#333"};
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 0.85em;
      z-index: 1003;
      max-width: 250px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: tipSlideIn 0.3s ease;
      pointer-events: none;
    `;

    document.body.appendChild(tip);

    const rect = element.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();

    let left = rect.right + 10;
    let top = rect.top + rect.height / 2 - tipRect.height / 2;

    if (left + tipRect.width > window.innerWidth - 20) {
      left = rect.left - tipRect.width - 10;
    }
    if (top < 20) top = 20;
    if (top + tipRect.height > window.innerHeight - 20) {
      top = window.innerHeight - tipRect.height - 20;
    }

    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
  }

  hideTip() {
    const tip = document.getElementById("contextualTip");
    if (tip) {
      tip.style.animation = "tipSlideOut 0.3s ease";
      setTimeout(() => tip.remove(), 300);
    }
  }
}

// Adicionar estilos para dicas contextuais
const contextualHelpStyles = document.createElement("style");
contextualHelpStyles.textContent = `
  @keyframes tipSlideIn {
    from { opacity: 0; transform: translateX(-10px) scale(0.9); }
    to { opacity: 1; transform: translateX(0) scale(1); }
  }

  @keyframes tipSlideOut {
    from { opacity: 1; transform: translateX(0) scale(1); }
    to { opacity: 0; transform: translateX(-10px) scale(0.9); }
  }
`;
document.head.appendChild(contextualHelpStyles);

// Inicializar sistema de ajuda contextual
document.addEventListener("DOMContentLoaded", () => {
  new ContextualHelp();
});

// Adicionar efeitos visuais aprimorados
document.addEventListener("DOMContentLoaded", () => {
  const formFields = document.querySelectorAll("input, select");
  formFields.forEach((field) => {
    field.addEventListener("focus", () => {
      field.style.transform = "translateY(-2px)";
      field.style.boxShadow = "0 4px 12px rgba(124, 77, 255, 0.2)";
    });

    field.addEventListener("blur", () => {
      field.style.transform = "translateY(0)";
      field.style.boxShadow = "none";
    });
  });

  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("mouseenter", () => {
      if (!tab.classList.contains("active")) {
        tab.style.transform = "translateY(-2px)";
      }
    });

    tab.addEventListener("mouseleave", () => {
      if (!tab.classList.contains("active")) {
        tab.style.transform = "translateY(0)";
      }
    });
  });
});

document.getElementById("submitButton").addEventListener("click", function (e) {
  e.preventDefault(); // Previne o envio do formulário
  window.location.href = "centralcandidato.html"; // Redireciona para a página
});