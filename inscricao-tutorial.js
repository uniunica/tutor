class InscricaoTutorialManager {
  constructor() {
    this.currentStep = 0;
    this.totalSteps = 8;
    this.isActive = false;

    this.steps = [
      {
        title: "Modalidades de Ingresso",
        text: "Existem 4 modalidades disponíveis para ingresso na graduação. Cada uma tem critérios específicos.",
        tip: "Prova Agendada é a mais comum - redação online. ENEM para quem fez nos últimos 3 anos com média 450+.",
        target: "#modalitySection",
        position: "bottom",
      },
      {
        title: "Sistema de Abas",
        text: "O formulário está dividido em duas abas: Dados do Candidato e Dados do Curso. Navegue entre elas conforme necessário.",
        tip: "Sempre preencha primeiro os dados do candidato antes de passar para os dados do curso.",
        target: "#tabsContainer",
        position: "bottom",
      },
      {
        title: "Dados Pessoais Básicos",
        text: "Inicie coletando CPF, nome completo e sexo. Estes são os dados fundamentais para identificação do candidato.",
        tip: "Sempre confirme a grafia correta do nome - erros podem causar problemas na matrícula.",
        target: "#cpfField",
        position: "top",
      },
      {
        title: "Informações de Contato",
        text: "E-mail e celular são essenciais para comunicação. O candidato receberá confirmações e informações importantes.",
        tip: "Verifique se o e-mail está correto - todas as comunicações oficiais serão enviadas para ele.",
        target: "#emailField",
        position: "top",
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
        position: "top",
      },
      {
        title: "Seleção de Curso",
        text: "Agora vamos para a aba 'Dados do Curso'. Aqui o candidato escolhe o curso de interesse.",
        tip: "Ajude o candidato a escolher o curso mais adequado ao seu perfil e objetivos profissionais.",
        target: "#tabCurso",
        position: "bottom",
        action: "switchTab",
      },
      {
        title: "Finalização e Pagamento",
        text: "Após preencher todos os dados, clique em CONTINUAR. A taxa de matrícula é de até R$ 250,00.",
        tip: "O pagamento da taxa de matrícula dá acesso ao portal e materiais didáticos. Valor pode ser alterado pela equipe.",
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

    // Simular envio do formulário
    document.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.showPaymentInfo();
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
      document.querySelector(".tutorial-box").style.border =
        "3px solid #ff6b35";
      document.querySelector(".tutorial-content h3").style.color = "#ff6b35";
    } else {
      document.querySelector(".tutorial-box").style.border = "none";
      document.querySelector(".tutorial-content h3").style.color = "#7c4dff";
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

      // Animação especial para campo indicação
      if (selector === "#indicacaoField") {
        cursor.style.color = "#ff6b35";
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
          <i class="fas fa-graduation-cap"></i>
          <h2>Tutorial Concluído!</h2>
        </div>
        <div class="modal-body">
          <p>Parabéns! Você aprendeu como preencher o formulário de inscrição! 🎉</p>
          <p><strong>Pontos importantes para lembrar:</strong></p>
          <ul>
            <li><i class="fas fa-exclamation-triangle" style="color: #ff6b35;"></i> <strong>SEMPRE</strong> preencha o campo "Indicação" com seu nome</li>
            <li><i class="fas fa-user-check"></i> Colete todos os dados do candidato com cuidado</li>
            <li><i class="fas fa-envelope"></i> Confirme e-mail e telefone para comunicações</li>
            <li><i class="fas fa-money-bill-wave"></i> Taxa de matrícula: até R$ 250,00</li>
          </ul>
          <div class="info-box">
            <i class="fas fa-lightbulb"></i>
            <strong>Dica:</strong> Quanto mais completos os dados, mais rápida será a matrícula!
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
          <i class="fas fa-credit-card"></i>
          <h2>Informações de Pagamento</h2>
        </div>
        <div class="modal-body">
          <p>✅ <strong>Inscrição realizada com sucesso!</strong></p>
          <p>O candidato agora pode efetuar o pagamento da taxa de matrícula.</p>

          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4 style="margin: 0 0 10px 0; color: #28a745;">💰 Informações de Pagamento:</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li><strong>Valor máximo:</strong> R$ 250,00</li>
              <li><strong>Gerado automaticamente</strong> no sistema</li>
              <li><strong>Para alterar:</strong> Contate Expansão e Negócios</li>
              <li><strong>Após pagamento:</strong> Acesso ao portal e materiais</li>
            </ul>
          </div>

          <p><strong>Próximos passos do candidato:</strong></p>
          <ol>
            <li>Receber e-mail com dados de acesso</li>
            <li>Efetuar pagamento da taxa</li>
            <li>Acessar portal do aluno</li>
            <li>Baixar materiais didáticos</li>
          </ol>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="this.closest('.modal').remove()">
            <i class="fas fa-check"></i> Perfeito!
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
  new InscricaoTutorialManager();
});

// Adicionar informações detalhadas sobre modalidades
document.addEventListener("DOMContentLoaded", () => {
  const modalityLabels = document.querySelectorAll(".modality-options label");

  modalityLabels.forEach((label) => {
    label.addEventListener("click", (e) => {
      const input = label.querySelector('input[type="radio"]');
      if (input) {
        showModalityInfo(input.parentElement.textContent.trim());
      }
    });
  });
});

function showModalityInfo(modality) {
  let info = "";

  switch (modality) {
    case "Prova Agendada":
      info =
        "📝 <strong>Prova Agendada:</strong><br>• Redação online com tema específico<br>• Modalidade mais comum<br>• Agendamento flexível";
      break;
    case "ENEM":
      info =
        "🎓 <strong>ENEM:</strong><br>• Para quem fez o exame nos últimos 3 anos<br>• Média mínima: 450 pontos<br>• Não precisa fazer nova prova";
      break;
    case "Novo Título":
      info =
        "🎯 <strong>Novo Título:</strong><br>• Para quem já possui graduação<br>• Processo simplificado<br>• Apresentação de diploma";
      break;
    case "Transferência":
      info =
        "🔄 <strong>Transferência:</strong><br>• Já estuda o curso em outra instituição<br>• Quer concluir na Uniúnica<br>• Análise de disciplinas cursadas";
      break;
  }

  // Mostrar tooltip ou modal pequeno com a informação
  const tooltip = document.createElement("div");
  tooltip.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 1001;
    max-width: 300px;
    border: 2px solid #7c4dff;
  `;
  tooltip.innerHTML =
    info + '<br><br><small style="color: #666;">Clique para fechar</small>';

  document.body.appendChild(tooltip);

  tooltip.addEventListener("click", () => {
    tooltip.remove();
  });

  setTimeout(() => {
    if (tooltip.parentNode) {
      tooltip.remove();
    }
  }, 5000);
}
