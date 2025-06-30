class PortalParceiroTutorialManager {
  constructor() {
    this.currentStep = 0;
    this.totalSteps = 16;
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
        text: "Use este campo para digitar palavras-chave e refinar a busca, ou navegue pela lista de cursos disponíveis.",
        tip: "O campo é útil para encontrar cursos específicos, ou você pode explorar as opções geradas abaixo.",
        target: "#buscarCursoSection",
        position: "top",
      },
      {
        title: "Seleção de Cursos",
        text: "Após selecionar a modalidade e área, os cursos disponíveis são listados aqui. Clique no '+' para adicionar o curso à matrícula.",
        tip: "A lista de cursos é dinâmica e se atualiza com base nas suas seleções acima.",
        target: "#courseSelectionSection",
        position: "top",
        action: () => {
          // Simular uma seleção para garantir que a seção de cursos esteja visível
          const modalidadeRadio = document.querySelector(
            'input[name="modalidade"][value="Pós-Graduação"]'
          );
          const areaRadio = document.querySelector(
            'input[name="area"][value="Engenharias"]'
          );

          if (modalidadeRadio) modalidadeRadio.checked = true;
          if (areaRadio) areaRadio.checked = true;

          if (window.portalApp) {
            window.portalApp.updateCourseList();
          }
        },
      },
      {
        title: "Carrinho de Cursos",
        text: "Aqui você visualiza todos os cursos selecionados, pode remover itens individuais ou limpar tudo. O valor total é calculado automaticamente.",
        tip: "Use 'Prosseguir com Matrícula' quando o cliente confirmar todos os cursos desejados.",
        target: "#selectedCoursesSection",
        position: "top",
        action: () => {
          // Simular adição de alguns cursos para demonstração
          if (window.portalApp) {
            window.portalApp.addCourseToCart(
              "Automação Industrial - 500H",
              1200.0
            );
            window.portalApp.addCourseToCart(
              "Engenharia da Qualidade - 500H",
              1150.0
            );
          }
        },
      },
      // Adicione estes dois novos passos ao final do array this.steps
      {
        title: "Configuração de Pagamento da Matrícula",
        text: "Aqui você define como será pago o valor da matrícula (ex: R$ 180,00). Escolha o método, o valor, parcelas e a data de vencimento.",
        tip: "O valor da matrícula é fixo e geralmente é pago à vista ou em poucas parcelas.",
        target: "#matriculaPaymentBox",
        position: "top",
        action: () => {
          // Garantir que a seção de pagamento esteja visível
          document
            .getElementById("selectedCoursesSection")
            .classList.add("hidden");
          document
            .getElementById("paymentOptionsContainer")
            .classList.remove("hidden");
          // Simular alguns cursos selecionados se necessário
          if (
            window.portalApp &&
            window.portalApp.selectedCourses.length === 0
          ) {
            window.portalApp.addCourseToCart(
              "Automação Industrial - 500H",
              1200.0
            );
            window.portalApp.addCourseToCart(
              "Engenharia da Qualidade - 500H",
              1150.0
            );
          }
        },
      },
      {
        title: "Configuração de Pagamento do Curso",
        text: "Configure o pagamento das mensalidades do curso. Defina o método de pagamento, o valor promocional e o vencimento da primeira mensalidade.",
        tip: "Este é o valor total do curso, que pode ser parcelado em até 12 vezes.",
        target: "#cursoPaymentBox",
        position: "top",
        action: () => {
          // Garantir que a seção de pagamento esteja visível
          document
            .getElementById("selectedCoursesSection")
            .classList.add("hidden");
          document
            .getElementById("paymentOptionsContainer")
            .classList.remove("hidden");
        },
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

    // Executar ação especial se existir
    if (step.action && typeof step.action === "function") {
      step.action();
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
      tutorialBox.style.border = "3px solid #e53935";
      tutorialBox.style.boxShadow = "0 0 20px rgba(229, 57, 53, 0.3)";
      document.querySelector(".tutorial-content h3").style.color = "#e53935";
    } else {
      tutorialBox.style.border = "3px solid #002f5f";
      tutorialBox.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
      document.querySelector(".tutorial-content h3").style.color = "#002f5f";
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

    // PRIMEIRO: Destacar elemento
    this.highlightElement(step.target);

    // SEGUNDO: Animar cursor
    this.animateCursor(step.target);

    // TERCEIRO: Posicionar caixa do tutorial próxima ao elemento
    setTimeout(() => {
      this.positionTutorialBox(step.target, step.position);
    }, 100);

    // QUARTO: Atualizar progresso
    this.updateProgress();

    // Adicionar efeito hover
    this.addHoverEffect(step.target);
  }

  // Função melhorada para posicionamento do tutorial box
  positionTutorialBox(selector, position) {
    const element = document.querySelector(selector);
    const tutorialBox = document.querySelector(".tutorial-box");

    if (!element || !tutorialBox) {
      console.error(`Elemento não encontrado: ${selector}`);
      return;
    }

    // Scroll suave para o elemento primeiro
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });

    setTimeout(() => {
      // Remover classes de posição anteriores
      tutorialBox.classList.remove(
        "position-top",
        "position-bottom",
        "position-left",
        "position-right"
      );

      // Resetar posição
      tutorialBox.style.position = "fixed";
      tutorialBox.style.visibility = "hidden";
      tutorialBox.style.display = "block";

      // Aguardar dois frames para garantir que o scroll terminou
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const elementRect = element.getBoundingClientRect();
          const boxRect = tutorialBox.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;

          let top, left;
          let finalPosition = position;

          // Margem de segurança
          const margin = 25;
          const arrowSize = 15;

          // Calcular posição baseada na preferência
          switch (position) {
            case "top":
              top = elementRect.top - boxRect.height - arrowSize - margin;
              left =
                elementRect.left + elementRect.width / 2 - boxRect.width / 2;
              break;

            case "bottom":
              top = elementRect.bottom + arrowSize + margin;
              left =
                elementRect.left + elementRect.width / 2 - boxRect.width / 2;
              break;

            case "left":
              top =
                elementRect.top + elementRect.height / 2 - boxRect.height / 2;
              left = elementRect.left - boxRect.width - arrowSize - margin;
              break;

            case "right":
              top =
                elementRect.top + elementRect.height / 2 - boxRect.height / 2;
              left = elementRect.right + arrowSize + margin;
              break;

            default:
              top = elementRect.bottom + arrowSize + margin;
              left =
                elementRect.left + elementRect.width / 2 - boxRect.width / 2;
              finalPosition = "bottom";
              break;
          }

          // Verificar limites horizontais
          if (left < margin) {
            left = margin;
          } else if (left + boxRect.width > viewportWidth - margin) {
            left = viewportWidth - boxRect.width - margin;
          }

          // Verificar limites verticais e ajustar posição se necessário
          if (top < margin) {
            // Se não cabe em cima, colocar embaixo
            top = elementRect.bottom + arrowSize + margin;
            finalPosition = "bottom";
          } else if (top + boxRect.height > viewportHeight - margin) {
            // Se não cabe embaixo, colocar em cima
            top = elementRect.top - boxRect.height - arrowSize - margin;
            finalPosition = "top";

            // Se ainda não cabe, usar posição lateral
            if (top < margin) {
              if (elementRect.left > viewportWidth / 2) {
                // Colocar à esquerda
                top =
                  elementRect.top + elementRect.height / 2 - boxRect.height / 2;
                left = elementRect.left - boxRect.width - arrowSize - margin;
                finalPosition = "left";
              } else {
                // Colocar à direita
                top =
                  elementRect.top + elementRect.height / 2 - boxRect.height / 2;
                left = elementRect.right + arrowSize + margin;
                finalPosition = "right";
              }
            }
          }

          // Garantir que não saia da tela (última verificação)
          top = Math.max(
            margin,
            Math.min(top, viewportHeight - boxRect.height - margin)
          );
          left = Math.max(
            margin,
            Math.min(left, viewportWidth - boxRect.width - margin)
          );

          // Aplicar posição final
          tutorialBox.classList.add(`position-${finalPosition}`);
          tutorialBox.style.top = `${Math.round(top)}px`;
          tutorialBox.style.left = `${Math.round(left)}px`;
          tutorialBox.style.visibility = "visible";

          console.log(
            `Tutorial posicionado: ${finalPosition} em (${Math.round(
              top
            )}, ${Math.round(left)})`
          );
          console.log(`Elemento alvo:`, elementRect);
        });
      });
    }, 400); // Tempo maior para garantir que o scroll termine
  }

  // Função melhorada para highlight
  highlightElement(selector) {
    const element = document.querySelector(selector);
    const highlight = document.getElementById("highlight");

    // Remover highlight anterior
    highlight.classList.add("hidden");
    highlight.classList.remove("highlight-pulse");

    if (element) {
      // Aguardar o scroll terminar
      setTimeout(() => {
        const rect = element.getBoundingClientRect();

        // Aplicar highlight com posicionamento mais preciso
        const highlightPadding = 8;
        highlight.style.top = rect.top - highlightPadding + "px";
        highlight.style.left = rect.left - highlightPadding + "px";
        highlight.style.width = rect.width + highlightPadding * 2 + "px";
        highlight.style.height = rect.height + highlightPadding * 2 + "px";

        // Mostrar highlight
        highlight.classList.remove("hidden");

        // Adicionar animação de pulse após um pequeno delay
        setTimeout(() => {
          highlight.classList.add("highlight-pulse");
        }, 100);

        console.log(`Highlight aplicado em:`, rect);
      }, 450); // Sincronizado com o scroll
    }
  }

  // Função melhorada para cursor animado
  animateCursor(selector) {
    const element = document.querySelector(selector);
    const cursor = document.getElementById("animatedCursor");

    if (element) {
      setTimeout(() => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        cursor.style.left = centerX + "px";
        cursor.style.top = centerY + "px";
        cursor.classList.remove("hidden");

        // Animação especial para elementos importantes
        if (selector === "#novaMatricula") {
          cursor.style.color = "#e53935";
          cursor.style.fontSize = "36px";
          cursor.style.animation = "cursorPulse 1.5s infinite";
          cursor.style.filter = "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))";
        } else {
          cursor.style.color = "#e53935";
          cursor.style.fontSize = "30px";
          cursor.style.animation = "cursorBounce 2s infinite";
          cursor.style.filter = "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))";
        }

        console.log(`Cursor posicionado em: (${centerX}, ${centerY})`);
      }, 500); // Sincronizado com highlight e posicionamento
    }
  }

  // Função melhorada para atualizar progresso
  updateProgress() {
    const progressItems = document.querySelectorAll(".progress-item");

    progressItems.forEach((item, index) => {
      const icon = item.querySelector("i");

      // Remover todas as classes de estado
      item.classList.remove("completed", "current");

      if (index < this.currentStep) {
        // Passos já completados
        item.classList.add("completed");
        icon.className = "fas fa-check-circle";
        icon.style.color = "#28a745";
      } else if (index === this.currentStep) {
        // Passo atual
        item.classList.add("current");
        icon.className = "fas fa-circle-notch fa-spin";
        icon.style.color = "#002f5f";
      } else {
        // Passos futuros
        icon.className = "fas fa-circle";
        icon.style.color = "#6c757d";
      }
    });

    // Scroll suave para o item atual no painel de progresso
    const currentItem = document.querySelector(
      `.progress-item[data-step="${this.currentStep + 1}"]`
    );
    if (currentItem) {
      currentItem.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }

    console.log(
      `Progresso atualizado: passo ${this.currentStep + 1} de ${
        this.totalSteps
      }`
    );
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
          <p>🎉 <strong>Parabéns! Você dominou o processo de inscrição no Portal do Parceiro!</strong></p>
          <p>Agora você sabe como matricular um novo candidato:</p>

          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4 style="margin: 0 0 10px 0; color: #28a745;">✅ Conhecimentos adquiridos:</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Sistema de busca de alunos</li>
              <li>Geração de link personalizado</li>
              <li>Processo de nova matrícula</li>
              <li>Seleção de instituições e cursos</li>
              <li>Navegação no menu lateral</li>
              <li>Filtros por modalidade e área</li>
              <li>Seleção e gerenciamento de cursos</li>
            </ul>
          </div>

          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2196f3;">
            <p><strong>💡 Navegação Aprimorada:</strong></p>
            <p>• Use as <strong>setas do teclado</strong> para navegar no tutorial<br>
            • Pressione <strong>ESC</strong> para sair do tutorial<br>
            • Os modais se posicionam automaticamente próximos aos elementos</p>
          </div>

          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4 style="margin: 0 0 10px 0; color: #f39c12;">🚀 Próximos Passos:</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li><strong>Explore o menu lateral</strong> - Acesse relatórios, leads e treinamentos</li>
              <li><strong>Use o link personalizado</strong> - Explore a ferramenta</li>
              <li><strong>Pratique matrículas</strong> - Quanto mais usar, melhor será</li>
              <li><strong>Acompanhe notificações</strong> - Fique sempre atualizado</li>
            </ul>
          </div>

          <div class="info-box">
            <i class="fas fa-star"></i>
            <strong>Dica Final:</strong> O Portal do Parceiro é sua ferramenta de sucesso - use todas as funcionalidades, não tenha medo da tecnologia!
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-success" onclick="this.closest('.modal').remove()">
            <i class="fas fa-medal"></i> Sou um Expert!
          </button>
          <button class="btn btn-primary" onclick="window.location.href='https://uniunica.github.io/tutor/'">
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

    // Limpar estados visuais
    document.getElementById("tutorialOverlay").classList.add("hidden");
    document.getElementById("highlight").classList.add("hidden");
    document.getElementById("animatedCursor").classList.add("hidden");

    // Remover efeitos hover
    const element = document.querySelector(".tutorial-highlight-hover");
    if (element) {
      element.classList.remove("tutorial-highlight-hover");
    }

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

// ====================================================================================
// LÓGICA PARA A EXIBIÇÃO DINÂMICA DOS CURSOS
// ====================================================================================

class PortalAppLogic {
  constructor() {
    this.coursesData = {
      "Pós-Graduação": {
        Todas: [
          "Pós em Gestão de Projetos - 360H",
          "MBA em Liderança - 400H",
          "Pós em Marketing Digital - 360H",
          "Pós em Direito Civil - 400H",
          "Pós em Educação Inclusiva - 360H",
          "MBA em Finanças - 400H",
          "Pós em Saúde Pública - 360H",
          "Pós em Tecnologia da Informação - 400H",
        ],
        Engenharias: [
          "Automação Industrial - 500H",
          "Engenharia Ambiental - 500H",
          "Engenharia da Qualidade - 500H",
          "Engenharia de Produção - 500H",
          "Engenharia de Controle e Automação Indus - 500H",
          "Engenharia de Materiais - 720H",
          "Design de Interiores - 500H",
          "Engenharia de Estruturas de Concreto Arm - 500H",
          "Engenharia de Pavimentação Asfáltica - 500H",
          "Engenharia de Produção e Gerenciamento D - 500H",
          "Engenharia de Segurança do Trabalho - 600H",
          "Engenharia de Software - 500H",
        ],
        "Empresarial, TI e Negócios": [
          "MBA em Gestão Estratégica - 400H",
          "Análise de Dados e Big Data - 360H",
          "Gestão de Pessoas e Liderança - 360H",
          "Finanças Corporativas - 400H",
          "Marketing e Vendas - 360H",
          "Cibersegurança e Proteção de Dados - 400H",
        ],
        "Meio Ambiente": [
          "Gestão Ambiental e Sustentabilidade - 360H",
          "Auditoria Ambiental - 360H",
        ],
        "Serviço Social": [
          "Serviço Social e Saúde Mental - 360H",
          "Perícia Social - 360H",
        ],
        Estética: [
          "Estética Avançada e Cosmetologia - 360H",
          "Tricologia e Terapias Capilares - 360H",
        ],
        Jurídica: [
          "Direito Penal e Processual Penal - 400H",
          "Direito do Trabalho e Previdenciário - 400H",
        ],
        "Ciências da Saúde": [
          "Enfermagem em UTI - 360H",
          "Farmacologia Clínica - 360H",
          "Nutrição Clínica e Esportiva - 360H",
          "Fisioterapia Ortopédica - 360H",
        ],
        Psicologia: [
          "Psicologia Organizacional - 360H",
          "Terapia Cognitivo-Comportamental - 360H",
        ],
        "MBA Executivo": [
          "MBA em Gestão Empresarial - 400H",
          "MBA em Liderança e Coaching - 400H",
        ],
        Educação: [
          "Docência no Ensino Superior - 360H",
          "Psicopedagogia Clínica e Institucional - 360H",
        ],
        Gastronomia: ["Gastronomia e Segurança Alimentar - 360H"],
      },
      Aperfeiçoamento: {
        Todas: [
          "Excel Avançado para Negócios - 120H",
          "Comunicação Empresarial - 80H",
        ],
        Educação: ["Metodologias Ativas - 80H", "Educação a Distância - 80H"],
      },
      Extensão: {
        Todas: [
          "Introdução ao Marketing Digital - 40H",
          "Noções de Empreendedorismo - 40H",
        ],
      },
      "Ensino Médio (EJA)": {
        Todas: ["Ensino Médio (EJA) - 1200H"],
      },
    };

    this.selectedCourses = [];
    this.coursePrices = {
      // Preços simulados para os cursos
      "Automação Industrial - 500H": 1200.0,
      "Engenharia Ambiental - 500H": 1150.0,
      "Engenharia da Qualidade - 500H": 1150.0,
      "Engenharia de Produção - 500H": 1100.0,
      "Engenharia de Controle e Automação Indus - 500H": 1250.0,
      "Engenharia de Materiais - 720H": 1400.0,
      "Design de Interiores - 500H": 1050.0,
      "Engenharia de Estruturas de Concreto Arm - 500H": 1300.0,
      "Engenharia de Pavimentação Asfáltica - 500H": 1200.0,
      "Engenharia de Produção e Gerenciamento D - 500H": 1180.0,
      "Engenharia de Segurança do Trabalho - 600H": 1350.0,
      "Engenharia de Software - 500H": 1250.0,
      // Adicionar mais preços conforme necessário
      "MBA em Gestão Estratégica - 400H": 2500.0,
      "Análise de Dados e Big Data - 360H": 1800.0,
      "Gestão de Pessoas e Liderança - 360H": 1600.0,
      "Finanças Corporativas - 400H": 2200.0,
      "Marketing e Vendas - 360H": 1500.0,
      "Cibersegurança e Proteção de Dados - 400H": 2000.0,
    };

    this.courseListContainer = document.getElementById("courseList");
    this.courseSelectionSection = document.getElementById(
      "courseSelectionSection"
    );
    this.noCoursesMessage = document.getElementById("noCoursesMessage");

    // NOVO: Elementos do carrinho
    this.selectedCoursesSection = document.getElementById(
      "selectedCoursesSection"
    );
    this.selectedCoursesList = document.getElementById("selectedCoursesList");
    this.coursesCount = document.getElementById("coursesCount");
    this.totalPrice = document.getElementById("totalPrice");

    this.initLogic();
  }

  initLogic() {
    // Adicionar valores aos inputs de rádio
    document
      .querySelectorAll('input[name="modalidade"]')
      .forEach((radio, index) => {
        const modalidades = [
          "Pós-Graduação",
          "Aperfeiçoamento",
          "Extensão",
          "Ensino Médio (EJA)",
        ];
        radio.value = modalidades[index];
      });

    document.querySelectorAll('input[name="area"]').forEach((radio, index) => {
      const areas = [
        "Todas",
        "Engenharias",
        "Empresarial, TI e Negócios",
        "Meio Ambiente",
        "Serviço Social",
        "Estética",
        "Jurídica",
        "Ciências da Saúde",
        "Psicologia",
        "MBA Executivo",
        "Educação",
        "Gastronomia",
      ];
      if (index < areas.length) {
        radio.value = areas[index];
      }
    });

    // Adicionar listeners para os botões de rádio
    document.querySelectorAll('input[name="modalidade"]').forEach((radio) => {
      radio.addEventListener("change", () => this.updateCourseList());
    });

    document.querySelectorAll('input[name="area"]').forEach((radio) => {
      radio.addEventListener("change", () => this.updateCourseList());
    });

    // Adicionar listener para o campo de busca
    document.getElementById("curso").addEventListener("input", (e) => {
      this.filterCourseList(e.target.value);
    });

    this.updateCourseList(); // Inicializa a lista de cursos ao carregar a página

    this.bindCartEvents();
    this.updateCartDisplay();
  }

  // NOVO: Eventos do carrinho
  bindCartEvents() {
    const clearAllBtn = document.getElementById("clearAllCourses");
    const proceedBtn = document.getElementById("proceedToEnrollment");

    if (clearAllBtn) {
      clearAllBtn.addEventListener("click", () => {
        this.clearAllCourses();
      });
    }

    if (proceedBtn) {
      proceedBtn.addEventListener("click", () => {
        this.proceedToEnrollment();
      });
    }
  }

  getSelectedValues() {
    const selectedModalidade = document.querySelector(
      'input[name="modalidade"]:checked'
    )?.value;
    const selectedArea = document.querySelector(
      'input[name="area"]:checked'
    )?.value;
    return { selectedModalidade, selectedArea };
  }

  updateCourseList() {
    const { selectedModalidade, selectedArea } = this.getSelectedValues();
    let coursesToShow = [];

    if (selectedModalidade && selectedArea) {
      if (this.coursesData[selectedModalidade]) {
        if (
          selectedArea === "Todas" &&
          this.coursesData[selectedModalidade]["Todas"]
        ) {
          // Se "Todas" as áreas forem selecionadas, combine todos os cursos daquela modalidade
          for (const area in this.coursesData[selectedModalidade]) {
            coursesToShow = coursesToShow.concat(
              this.coursesData[selectedModalidade][area]
            );
          }
          // Remover duplicatas caso um curso apareça em "Todas" e em uma área específica
          coursesToShow = [...new Set(coursesToShow)];
        } else if (this.coursesData[selectedModalidade][selectedArea]) {
          coursesToShow = this.coursesData[selectedModalidade][selectedArea];
        }
      }
    }

    this.renderCourseList(coursesToShow);
  }

  renderCourseList(courses) {
    if (!this.courseListContainer) return;

    this.courseListContainer.innerHTML = "";

    if (courses.length > 0) {
      courses.forEach((course) => {
        const courseItem = document.createElement("div");
        courseItem.className = "course-item";

        // Verificar se o curso já está no carrinho
        const isSelected = this.selectedCourses.some(
          (selected) => selected.name === course
        );
        const buttonClass = isSelected
          ? "add-course-btn disabled"
          : "add-course-btn";
        const buttonIcon = isSelected ? "fas fa-check" : "fas fa-plus";
        const buttonTitle = isSelected
          ? "Curso já adicionado"
          : "Adicionar curso";

        courseItem.innerHTML = `
          <span>${course}</span>
          <button class="${buttonClass}" data-course="${course}" title="${buttonTitle}" ${
          isSelected ? "disabled" : ""
        }>
            <i class="${buttonIcon}"></i>
          </button>
        `;
        this.courseListContainer.appendChild(courseItem);

        const addBtn = courseItem.querySelector(".add-course-btn");
        if (!isSelected) {
          addBtn.addEventListener("click", (e) => {
            const courseName = e.currentTarget.dataset.course;
            const coursePrice = this.coursePrices[courseName] || 1000.0; // Preço padrão
            this.addCourseToCart(courseName, coursePrice);
          });
        }
      });

      if (this.courseSelectionSection) {
        this.courseSelectionSection.classList.remove("hidden");
      }
      if (this.noCoursesMessage) {
        this.noCoursesMessage.classList.add("hidden");
      }
    } else {
      if (this.courseSelectionSection) {
        this.courseSelectionSection.classList.remove("hidden");
      }
      this.courseListContainer.innerHTML = "";
      if (this.noCoursesMessage) {
        this.noCoursesMessage.classList.remove("hidden");
      }
    }
  }

  // NOVO: Adicionar curso ao carrinho
  addCourseToCart(courseName, coursePrice) {
    // Verificar se o curso já está no carrinho
    if (this.selectedCourses.some((course) => course.name === courseName)) {
      if (window.portalTutorial) {
        window.portalTutorial.showNotification(
          "Curso já está no carrinho!",
          "warning"
        );
      }
      return;
    }

    // Adicionar curso ao carrinho
    const courseData = {
      id: Date.now(), // ID único
      name: courseName,
      price: coursePrice,
      duration: this.extractDuration(courseName),
      addedAt: new Date(),
    };

    this.selectedCourses.push(courseData);
    this.updateCartDisplay();
    this.updateCourseList(); // Atualizar a lista para mostrar o curso como selecionado

    if (window.portalTutorial) {
      window.portalTutorial.showNotification(
        `"${courseName}" adicionado ao carrinho!`,
        "success"
      );
    }
  }

  // NOVO: Remover curso do carrinho
  removeCourseFromCart(courseId) {
    const courseIndex = this.selectedCourses.findIndex(
      (course) => course.id === courseId
    );
    if (courseIndex > -1) {
      const courseName = this.selectedCourses[courseIndex].name;
      this.selectedCourses.splice(courseIndex, 1);
      this.updateCartDisplay();
      this.updateCourseList(); // Atualizar a lista para mostrar o curso como disponível novamente

      if (window.portalTutorial) {
        window.portalTutorial.showNotification(
          `"${courseName}" removido do carrinho!`,
          "info"
        );
      }
    }
  }

  // NOVO: Limpar todos os cursos
  clearAllCourses() {
    if (this.selectedCourses.length === 0) {
      if (window.portalTutorial) {
        window.portalTutorial.showNotification(
          "Carrinho já está vazio!",
          "info"
        );
      }
      return;
    }

    this.selectedCourses = [];
    this.updateCartDisplay();
    this.updateCourseList();

    if (window.portalTutorial) {
      window.portalTutorial.showNotification(
        "Todos os cursos foram removidos do carrinho!",
        "info"
      );
    }
  }

  // NOVO: Prosseguir com matrícula
  proceedToEnrollment() {
    if (this.selectedCourses.length === 0) {
      if (window.portalTutorial) {
        window.portalTutorial.showNotification(
          "Selecione pelo menos um curso para prosseguir!",
          "warning"
        );
      }
      return;
    }

    // Ocultar a seção de seleção de cursos
    this.selectedCoursesSection.classList.add("hidden");

    // Mostrar as seções de configuração de pagamento
    document
      .getElementById("paymentOptionsContainer")
      .classList.remove("hidden");

    // Rolar suavemente para a nova seção
    document.getElementById("paymentOptionsContainer").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // Atualizar valores baseados nos cursos selecionados
    this.updatePaymentValues();

    if (window.portalTutorial) {
      window.portalTutorial.showNotification(
        "Configure agora o pagamento da matrícula e do curso.",
        "success"
      );
    }
  }

  // NOVA: Função para atualizar valores de pagamento
  updatePaymentValues() {
    const totalValue = this.calculateTotal();
    const valorCursoInput = document.getElementById("valorCurso");

    if (valorCursoInput) {
      valorCursoInput.value = `R$ ${totalValue.toFixed(2).replace(".", ",")}`;
    }
  }

  // NOVO: Confirmar matrícula
  confirmEnrollment() {
    if (window.portalTutorial) {
      window.portalTutorial.showNotification(
        "Matrícula confirmada! Redirecionando para pagamento...",
        "success"
      );
    }

    // Simular redirecionamento após 2 segundos
    setTimeout(() => {
      // Aqui você redirecionaria para a página de pagamento
      console.log("Redirecionando para página de pagamento...");
      if (window.portalTutorial) {
        window.portalTutorial.showNotification(
          "Redirecionando para pagamento...",
          "info"
        );
      }
    }, 2000);
  }

  // NOVO: Atualizar display do carrinho
  updateCartDisplay() {
    if (!this.selectedCoursesSection) return;

    const coursesCount = this.selectedCourses.length;
    const totalValue = this.calculateTotal();

    // Atualizar contadores
    if (this.coursesCount) {
      this.coursesCount.textContent = `${coursesCount} curso(s) selecionado(s)`;
    }
    if (this.totalPrice) {
      this.totalPrice.textContent = `Total: R$ ${totalValue
        .toFixed(2)
        .replace(".", ",")}`;
    }

    // Mostrar/esconder seção do carrinho
    if (coursesCount > 0) {
      this.selectedCoursesSection.classList.remove("hidden");
      this.renderSelectedCourses();
    } else {
      this.selectedCoursesSection.classList.add("hidden");
    }
  }

  // NOVO: Renderizar cursos selecionados
  renderSelectedCourses() {
    if (!this.selectedCoursesList) return;

    if (this.selectedCourses.length === 0) {
      this.selectedCoursesList.innerHTML = `
        <div class="no-courses-selected">
          <i class="fas fa-shopping-cart"></i>
          <p>Nenhum curso selecionado</p>
        </div>
      `;
      return;
    }

    this.selectedCoursesList.innerHTML = "";

    this.selectedCourses.forEach((course) => {
      const courseItem = document.createElement("div");
      courseItem.className = "selected-course-item newly-added";
      courseItem.innerHTML = `
        <div class="selected-course-info">
          <div class="selected-course-name">${course.name}</div>
          <div class="selected-course-details">
            <span><i class="fas fa-clock"></i> ${course.duration}</span>
            <span><i class="fas fa-calendar-plus"></i> Adicionado: ${course.addedAt.toLocaleTimeString()}</span>
          </div>
        </div>
        <div class="selected-course-price">R$ ${course.price
          .toFixed(2)
          .replace(".", ",")}</div>
        <button class="remove-course-btn" data-course-id="${
          course.id
        }" title="Remover curso">
          <i class="fas fa-times"></i>
        </button>
      `;

      // Adicionar listener para remover
      courseItem
        .querySelector(".remove-course-btn")
        .addEventListener("click", (e) => {
          const courseId = parseInt(e.currentTarget.dataset.courseId);
          this.removeCourseFromCart(courseId);
        });

      this.selectedCoursesList.appendChild(courseItem);

      // Remover classe de animação após a animação
      setTimeout(() => {
        courseItem.classList.remove("newly-added");
      }, 500);
    });
  }

  // NOVO: Calcular total
  calculateTotal() {
    return this.selectedCourses.reduce(
      (total, course) => total + course.price,
      0
    );
  }

  // NOVO: Extrair duração do nome do curso
  extractDuration(courseName) {
    const match = courseName.match(/(\d+)H/);
    return match ? match[0] : "500H"; // Padrão
  }

  // Filtrar cursos existentes na lista por texto digitado
  filterCourseList(searchText) {
    if (!this.courseListContainer) return;

    const allCourseItems =
      this.courseListContainer.querySelectorAll(".course-item");
    let foundCount = 0;

    if (allCourseItems.length === 0) {
      // Se não houver itens, atualizar a lista primeiro
      this.updateCourseList();
    }

    allCourseItems.forEach((item) => {
      const courseName = item.querySelector("span").textContent.toLowerCase();
      if (courseName.includes(searchText.toLowerCase())) {
        item.classList.remove("hidden");
        foundCount++;
      } else {
        item.classList.add("hidden");
      }
    });

    if (foundCount === 0 && searchText.length > 0) {
      if (this.noCoursesMessage) {
        this.noCoursesMessage.classList.remove("hidden");
      }
    } else {
      if (this.noCoursesMessage) {
        this.noCoursesMessage.classList.add("hidden");
      }
    }
  }
}

// Sistema de validação e máscaras para formulários
class PortalFormValidator {
  constructor() {
    this.init();
  }

  init() {
    this.addFormValidation();
    this.addInteractiveFeatures();
  }

  addFormValidation() {
    const cursoInput = document.getElementById("curso");
    if (cursoInput) {
      cursoInput.addEventListener("focus", () => {
        const instituicaoSelecionada = document.querySelector(
          'input[name="instituicao"]:checked'
        );
        if (!instituicaoSelecionada) {
          this.showFieldError(cursoInput, "Selecione uma instituição primeiro");
          cursoInput.blur();
        }
      });
    }

    const form = document.getElementById("enrollmentForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.validateForm();
      });
    }
  }

  addInteractiveFeatures() {
    const radioInputs = document.querySelectorAll('input[type="radio"]');
    radioInputs.forEach((radio) => {
      radio.addEventListener("change", () => {
        this.animateSelection(radio);
      });
    });

    const menuItems = document.querySelectorAll(".menu-lateral li");
    menuItems.forEach((item) => {
      item.addEventListener("click", () => {
        this.simulateMenuAction(item.textContent.trim());
      });
    });

    this.addHoverEffects();
  }

  animateSelection(radio) {
    const label = radio.parentElement;
    label.style.transform = "scale(0.98)";
    setTimeout(() => {
      label.style.transform = "scale(1)";
    }, 150);

    const selectedText = label.textContent.trim();
    if (window.portalTutorial) {
      window.portalTutorial.showNotification(
        `✅ ${selectedText} selecionado`,
        "success"
      );
    }
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
    if (window.portalTutorial) {
      window.portalTutorial.showNotification(message, "info");
    }
  }

  validateForm() {
    const errors = [];

    const instituicao = document.querySelector(
      'input[name="instituicao"]:checked'
    );
    if (!instituicao) {
      errors.push("Selecione uma instituição de ensino");
    }

    const modalidade = document.querySelector(
      'input[name="modalidade"]:checked'
    );
    if (!modalidade) {
      errors.push("Selecione uma modalidade de ensino");
    }

    const area = document.querySelector('input[name="area"]:checked');
    if (!area) {
      errors.push("Selecione uma área do curso");
    }

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
    const existingError = field.parentNode.querySelector(".field-error");
    if (existingError) existingError.remove();

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
  console.log("✅ Seleção dinâmica de cursos");
}

// INICIALIZAÇÃO ÚNICA E CORRETA
// Variáveis globais para acesso entre classes
window.portalTutorial = null;
window.portalApp = null;
window.portalValidator = null;
window.contextualHelp = null;

// Inicializar quando a página carregar - APENAS UMA VEZ
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Inicializando Portal do Parceiro...");

  // Inicializar todas as classes na ordem correta
  window.portalTutorial = new PortalParceiroTutorialManager();
  window.portalApp = new PortalAppLogic();
  window.portalValidator = new PortalFormValidator();
  window.contextualHelp = new ContextualHelp();

  // Executar demonstração após um delay
  setTimeout(demonstrateAdvancedFeatures, 1000);

  console.log("✅ Portal do Parceiro inicializado com sucesso!");
});
