// ===== SISTEMA DE NARRAÇÃO DE VOZ =====
class VoiceNarrator {
  constructor() {
    this.synth = window.speechSynthesis;
    this.currentUtterance = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.voices = [];
    this.settings = {
      voice: null,
      rate: 1,
      pitch: 1,
      volume: 0.8,
    };

    // Textos de narração para cada passo do tutorial
    this.stepNarrations = {
      welcome:
        "Bem-vindo ao tutorial de matrícula de graduação! Agora você aprenderá como preencher o formulário de inscrição de graduação de forma eficiente. Este tutorial cobrirá modalidades de ingresso disponíveis, preenchimento dos dados do candidato, seleção de curso e unidade, dicas importantes para parceiros, e informações sobre pagamento. Use as setas do teclado ou botões para navegar, pressione ESC para sair do tutorial, e as caixas se posicionam automaticamente próximas aos elementos. Clique nas modalidades para ver informações detalhadas. IMPORTANTE: Sempre insira seu nome no campo 'Indicação' para vincular a venda!",

      step0:
        "Existem 4 modalidades disponíveis para ingresso na graduação. Cada uma tem critérios específicos. Prova Agendada: o aluno realizará uma redação on-line com um tema específico. ENEM: para o ingressante que realizou o exame nos últimos 3 anos e obteve uma média a partir de 450 pontos. Obtenção de Novo Título: quando o aluno já possui uma graduação. Transferência: para o aluno que já realiza o curso em outra instituição e quer concluir conosco.",

      step1:
        "O formulário está dividido em duas abas: Dados do Candidato e Dados do Curso. Após preencher os Dados do Candidato você deve direcionar ao Dados do Curso. Sempre preencha primeiro os dados do candidato antes de passar para os dados do curso.",

      step2:
        "Inicie coletando CPF, nome completo e sexo. Estes são os dados fundamentais para identificação do candidato. Sempre confirme a grafia correta do nome, email e número de telefone - erros podem causar problemas na matrícula.",

      step3:
        "E-mail e celular são essenciais para comunicação. O candidato receberá confirmações e informações importantes. Verifique se o e-mail está correto - todas as comunicações oficiais serão enviadas para ele.",

      step4:
        "ATENÇÃO! Campo Indicação é MUITO IMPORTANTE! SEMPRE insira seu nome no campo 'Indicação' para que a venda seja vinculada a você como parceiro. Este campo é OBRIGATÓRIO para receber sua comissão! Nunca esqueça de preenchê-lo.",

      step5:
        "Colete todas as informações de endereço. O CEP ajuda a preencher automaticamente cidade e estado. Endereço completo é necessário para emissão de documentos e correspondências oficiais.",

      step6:
        "Agora vamos para a aba 'Dados do Curso'. Aqui o candidato escolhe o curso de interesse. Ajude o candidato a escolher o curso mais adequado ao seu perfil e objetivos profissionais. Atenção! Sempre vincule ao seu polo ou unidade mais próxima do candidato.",

      step7:
        "Após preencher todos os dados, clique em CONTINUAR. A taxa de matrícula é de até R$ 250,00. O pagamento da taxa de matrícula dá acesso ao portal e materiais didáticos. Se você negociou um valor diferente gentileza entrar em contato com seu consultor para solicitar a alteração do valor da taxa.",

      completion:
        "Parabéns! Você aprendeu como preencher o formulário de inscrição! Use as setas do teclado para navegar no tutorial, pressione ESC para sair, e as caixas de diálogo se posicionam automaticamente. Pontos importantes para lembrar: SEMPRE preencha o campo 'Indicação' com seu nome, colete todos os dados do candidato com cuidado, confirme e-mail e telefone para comunicações, e a taxa de matrícula é de R$ 250,00 podendo ser alterada pelo seu consultor. Quanto mais completos os dados, mais rápida será a matrícula, e menos propício a causar estresses futuros!",
    };

    this.init();
  }

  init() {
    this.loadVoices();
    this.bindEvents();
    this.setupVoiceControls();
  }

  loadVoices() {
    const loadVoicesInterval = setInterval(() => {
      this.voices = this.synth.getVoices();

      if (this.voices.length > 0) {
        clearInterval(loadVoicesInterval);
        this.populateVoiceSelect();
        this.selectBestPortugueseVoice();
      }
    }, 100);
  }

  populateVoiceSelect() {
    const voiceSelect = document.getElementById("voiceSelect");
    if (!voiceSelect) return;

    voiceSelect.innerHTML = "";

    // Filtrar vozes em português primeiro
    const portugueseVoices = this.voices.filter(
      (voice) =>
        voice.lang.includes("pt") ||
        voice.name.toLowerCase().includes("portuguese")
    );

    // Se não houver vozes em português, usar todas
    const voicesToShow =
      portugueseVoices.length > 0 ? portugueseVoices : this.voices;

    voicesToShow.forEach((voice, index) => {
      const option = document.createElement("option");
      option.value = this.voices.indexOf(voice);
      option.textContent = `${voice.name} (${voice.lang})`;
      voiceSelect.appendChild(option);
    });
  }

  selectBestPortugueseVoice() {
    // Tentar encontrar a melhor voz em português
    const portugueseVoice = this.voices.find(
      (voice) =>
        voice.lang.includes("pt-BR") ||
        voice.lang.includes("pt") ||
        voice.name.toLowerCase().includes("portuguese")
    );

    if (portugueseVoice) {
      this.settings.voice = portugueseVoice;
      const voiceIndex = this.voices.indexOf(portugueseVoice);
      const voiceSelect = document.getElementById("voiceSelect");
      if (voiceSelect) voiceSelect.value = voiceIndex;
    } else {
      // Usar a primeira voz disponível
      this.settings.voice = this.voices[0];
    }
  }

  bindEvents() {
    // Controles de voz
    const playBtn = document.getElementById("playVoiceBtn");
    const pauseBtn = document.getElementById("pauseVoiceBtn");
    const stopBtn = document.getElementById("stopVoiceBtn");
    const settingsBtn = document.getElementById("settingsBtn");

    if (playBtn)
      playBtn.addEventListener("click", () => this.togglePlayPause());
    if (pauseBtn)
      pauseBtn.addEventListener("click", () => this.pauseNarration());
    if (stopBtn) stopBtn.addEventListener("click", () => this.stopNarration());
    if (settingsBtn)
      settingsBtn.addEventListener("click", () => this.toggleSettings());

    // Configurações
    const voiceSelect = document.getElementById("voiceSelect");
    const speedRange = document.getElementById("speedRange");
    const pitchRange = document.getElementById("pitchRange");
    const volumeRange = document.getElementById("volumeRange");

    if (voiceSelect) {
      voiceSelect.addEventListener("change", (e) => {
        this.settings.voice = this.voices[e.target.value];
      });
    }

    if (speedRange) {
      speedRange.addEventListener("input", (e) => {
        this.settings.rate = parseFloat(e.target.value);
        document.getElementById(
          "speedDisplay"
        ).textContent = `${e.target.value}x`;
      });
    }

    if (pitchRange) {
      pitchRange.addEventListener("input", (e) => {
        this.settings.pitch = parseFloat(e.target.value);
        document.getElementById(
          "pitchDisplay"
        ).textContent = `${e.target.value}x`;
      });
    }

    if (volumeRange) {
      volumeRange.addEventListener("input", (e) => {
        this.settings.volume = parseFloat(e.target.value);
        document.getElementById("volumeDisplay").textContent = `${Math.round(
          e.target.value * 100
        )}%`;
      });
    }

    // Fechar configurações ao clicar fora
    document.addEventListener("click", (e) => {
      const settings = document.getElementById("voiceSettings");
      const settingsBtn = document.getElementById("settingsBtn");

      if (
        settings &&
        settingsBtn &&
        !settings.contains(e.target) &&
        !settingsBtn.contains(e.target)
      ) {
        settings.classList.remove("active");
      }
    });
  }

  setupVoiceControls() {
    // Mostrar controles após um delay
    setTimeout(() => {
      const voiceControls = document.getElementById("voiceControls");
      if (voiceControls) {
        voiceControls.classList.add("active");
      }
    }, 1000);
  }

  speak(text, onEnd = null) {
    if (this.synth.speaking) {
      this.synth.cancel();
    }

    this.currentUtterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance.voice = this.settings.voice;
    this.currentUtterance.rate = this.settings.rate;
    this.currentUtterance.pitch = this.settings.pitch;
    this.currentUtterance.volume = this.settings.volume;

    this.currentUtterance.onstart = () => {
      this.isPlaying = true;
      this.isPaused = false;
      this.showVoiceIndicator();
      this.updatePlayButton();
    };

    this.currentUtterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.hideVoiceIndicator();
      this.updatePlayButton();
      if (onEnd) onEnd();
    };

    this.currentUtterance.onerror = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.hideVoiceIndicator();
      this.updatePlayButton();
    };

    this.synth.speak(this.currentUtterance);
  }

  togglePlayPause() {
    if (this.isPaused && this.synth.paused) {
      this.synth.resume();
      this.isPaused = false;
      this.isPlaying = true;
      this.showVoiceIndicator();
    } else if (this.isPlaying && this.synth.speaking) {
      this.synth.pause();
      this.isPaused = true;
      this.isPlaying = false;
      this.hideVoiceIndicator();
    } else {
      // Reproduzir narração do passo atual
      this.narrateCurrentStep();
    }
    this.updatePlayButton();
  }

  pauseNarration() {
    if (this.isPlaying && this.synth.speaking) {
      this.synth.pause();
      this.isPaused = true;
      this.isPlaying = false;
      this.hideVoiceIndicator();
      this.updatePlayButton();
    }
  }

  stopNarration() {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.isPlaying = false;
    this.isPaused = false;
    this.hideVoiceIndicator();
    this.updatePlayButton();
  }

  toggleSettings() {
    const settings = document.getElementById("voiceSettings");
    if (settings) {
      settings.classList.toggle("active");
    }
  }

  showVoiceIndicator() {
    const indicator = document.getElementById("voiceIndicator");
    if (indicator) {
      indicator.classList.add("active");
    }
  }

  hideVoiceIndicator() {
    const indicator = document.getElementById("voiceIndicator");
    if (indicator) {
      indicator.classList.remove("active");
    }
  }

  updatePlayButton() {
    const playBtn = document.getElementById("playVoiceBtn");
    if (!playBtn) return;

    const playIcon = playBtn.querySelector("i");

    if (this.isPlaying) {
      playBtn.classList.add("active");
      playIcon.className = "fas fa-pause";
      playBtn.title = "Pausar narração";
    } else {
      playBtn.classList.remove("active");
      playIcon.className = "fas fa-play";
      playBtn.title = "Reproduzir narração";
    }
  }

  // Método para narrar passo específico
  narrateStep(stepKey) {
    if (this.stepNarrations[stepKey]) {
      this.speak(this.stepNarrations[stepKey]);
    }
  }

  // Método para narrar o passo atual do tutorial
  narrateCurrentStep() {
    if (window.tutorialManager) {
      const currentStep = window.tutorialManager.currentStep;
      const stepKey = `step${currentStep}`;
      this.narrateStep(stepKey);
    }
  }

  // Método para narrar boas-vindas
  narrateWelcome() {
    this.narrateStep("welcome");
  }

  // Método para narrar conclusão
  narrateCompletion() {
    this.narrateStep("completion");
  }
}

// ===== TUTORIAL MANAGER COM INTEGRAÇÃO DE VOZ =====
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
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.width = "100%";
  }

  // NOVO: Desbloquear scroll
  unblockScroll() {
    const scrollY = document.body.style.top;
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, parseInt(scrollY || "0") * -1);
  }

  showWelcomeModal() {
    document.getElementById("welcomeModal").style.display = "flex";
    this.blockScroll(); // Bloquear scroll

    // Narrar boas-vindas após um delay
    setTimeout(() => {
      if (window.voiceNarrator) {
        window.voiceNarrator.narrateWelcome();
      }
    }, 1500);
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

    // Parar narração de boas-vindas e iniciar narração do primeiro passo
    if (window.voiceNarrator) {
      window.voiceNarrator.stopNarration();
      setTimeout(() => {
        window.voiceNarrator.narrateCurrentStep();
      }, 1000);
    }
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

    // Narrar o passo atual após um pequeno delay
    setTimeout(() => {
      if (window.voiceNarrator && this.isActive) {
        window.voiceNarrator.narrateCurrentStep();
      }
    }, 800);
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

    // Parar narração atual e narrar conclusão
    if (window.voiceNarrator) {
      window.voiceNarrator.stopNarration();
      setTimeout(() => {
        window.voiceNarrator.narrateCompletion();
      }, 500);
    }

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

    // Parar narração atual
    if (window.voiceNarrator) {
      window.voiceNarrator.stopNarration();
    }

    this.showWelcomeModal();
  }

  showProgressPanel() {
    document.getElementById("progressPanel").classList.remove("hidden");
  }

  hideProgressPanel() {
    document.getElementById("progressPanel").classList.add("hidden");
  }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", () => {
  console.log("Inicializando Tutorial Manager");

  // Inicializar sistema de voz
  window.voiceNarrator = new VoiceNarrator();

  // Inicializar tutorial manager
  window.tutorialManager = new InscricaoTutorialManager();
});

// ===== SISTEMA DE ABAS =====
document.addEventListener("DOMContentLoaded", () => {
  const tabCandidato = document.getElementById("tabCandidato");
  const tabCurso = document.getElementById("tabCurso");
  const contentCandidato = document.getElementById("contentCandidato");
  const contentCurso = document.getElementById("contentCurso");

  tabCandidato.addEventListener("click", () => {
    tabCandidato.classList.add("active");
    tabCurso.classList.remove("active");
    contentCandidato.style.display = "block";
    contentCurso.style.display = "none";
  });

  tabCurso.addEventListener("click", () => {
    tabCurso.classList.add("active");
    tabCandidato.classList.remove("active");
    contentCurso.style.display = "block";
    contentCandidato.style.display = "none";
  });
});

// ===== SISTEMA SIMPLIFICADO E FUNCIONAL DE TOOLTIPS DAS MODALIDADES =====
document.addEventListener("DOMContentLoaded", () => {
  console.log("Inicializando sistema de tooltips das modalidades");

  // Aguardar um pouco para garantir que todos os elementos estejam carregados
  setTimeout(() => {
    initModalityTooltips();
  }, 500);
});

function initModalityTooltips() {
  const modalityLabels = document.querySelectorAll(".modality-options label");
  console.log(`Encontrados ${modalityLabels.length} labels de modalidade`);

  let activeTooltip = null;
  let hoverTimeout = null;

  // Dados das modalidades
  const modalityData = {
    "Prova Agendada": {
      icon: "📝",
      title: "Prova Agendada",
      description: [
        "• Redação online com tema específico",
        "• Modalidade mais comum e flexível",
        "• Agendamento conforme disponibilidade",
        "• Duração: até 2 horas",
        "• Resultado em até 48 horas",
      ],
    },
    ENEM: {
      icon: "🎓",
      title: "ENEM",
      description: [
        "• Para quem fez o exame nos últimos 3 anos",
        "• Média mínima: 450 pontos",
        "• Não precisa fazer nova prova",
        "• Apresentar certificado ou boletim",
        "• Processo mais rápido",
      ],
    },
    "Novo Título": {
      icon: "🎯",
      title: "Novo Título",
      description: [
        "• Para quem já possui graduação completa",
        "• Processo simplificado sem prova",
        "• Apresentação de diploma registrado",
        "• Análise curricular prévia",
        "• Segunda graduação",
      ],
    },
    Transferência: {
      icon: "🔄",
      title: "Transferência",
      description: [
        "• Já estuda o curso em outra instituição",
        "• Quer concluir na UniÚnica",
        "• Análise de disciplinas já cursadas",
        "• Aproveitamento de créditos",
        "• Histórico escolar obrigatório",
      ],
    },
  };

  // Função para fechar tooltip
  function closeTooltip() {
    if (activeTooltip) {
      console.log("Fechando tooltip");
      activeTooltip.style.opacity = "0";
      activeTooltip.style.transform = "translateY(-10px) scale(0.9)";

      setTimeout(() => {
        if (activeTooltip && activeTooltip.parentNode) {
          activeTooltip.remove();
        }
        activeTooltip = null;
      }, 200);
    }

    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
  }

  // Função para criar tooltip
  function createTooltip(modalityName, targetElement) {
    console.log(`Criando tooltip para: ${modalityName}`);

    // Fechar tooltip anterior
    closeTooltip();

    const data = modalityData[modalityName];
    if (!data) {
      console.error(`Dados não encontrados para modalidade: ${modalityName}`);
      return;
    }

    // Criar elemento tooltip
    const tooltip = document.createElement("div");
    tooltip.className = "modality-tooltip-simple";

    // Conteúdo do tooltip
    tooltip.innerHTML = `
      <div class="tooltip-header-simple">
        <span class="tooltip-icon-simple">${data.icon}</span>
        <span class="tooltip-title-simple">${data.title}</span>
        <button class="tooltip-close-simple" type="button" aria-label="Fechar">×</button>
      </div>
      <div class="tooltip-content-simple">
        ${data.description
          .map((item) => `<div class="tooltip-item">${item}</div>`)
          .join("")}
      </div>
    `;

    // Adicionar ao body
    document.body.appendChild(tooltip);
    activeTooltip = tooltip;

    // Posicionar tooltip
    positionTooltip(tooltip, targetElement);

    // Adicionar eventos
    const closeBtn = tooltip.querySelector(".tooltip-close-simple");
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Botão fechar clicado");
      closeTooltip();
    });

    // Manter tooltip aberto quando mouse está sobre ele
    tooltip.addEventListener("mouseenter", () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
    });

    tooltip.addEventListener("mouseleave", () => {
      hoverTimeout = setTimeout(closeTooltip, 300);
    });

    // Auto-fechar após 8 segundos
    setTimeout(() => {
      if (activeTooltip === tooltip) {
        closeTooltip();
      }
    }, 8000);

    console.log("Tooltip criado com sucesso");
  }

  // Função para posicionar tooltip
  function positionTooltip(tooltip, targetElement) {
    const rect = targetElement.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    let top = rect.bottom + 10;

    // Ajustar se sair da tela
    if (left < 10) {
      left = 10;
    } else if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }

    if (top + tooltipRect.height > window.innerHeight - 10) {
      top = rect.top - tooltipRect.height - 10;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;

    console.log(`Tooltip posicionado em: ${left}, ${top}`);
  }

  // Adicionar eventos aos labels
  modalityLabels.forEach((label, index) => {
    console.log(
      `Configurando eventos para label ${index}: ${label.textContent.trim()}`
    );

    label.addEventListener("mouseenter", (e) => {
      const modalityName = label.textContent.trim();
      console.log(`Mouse entrou em: ${modalityName}`);

      // Cancelar timeout anterior
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }

      // Criar tooltip com delay
      hoverTimeout = setTimeout(() => {
        createTooltip(modalityName, label);
      }, 300);
    });

    label.addEventListener("mouseleave", () => {
      console.log("Mouse saiu do label");

      // Cancelar criação se ainda não foi criado
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }

      // Fechar com delay para permitir mover para o tooltip
      hoverTimeout = setTimeout(() => {
        if (activeTooltip && !activeTooltip.matches(":hover")) {
          closeTooltip();
        }
      }, 300);
    });
  });

  // Fechar tooltip ao clicar fora
  document.addEventListener("click", (e) => {
    if (
      activeTooltip &&
      !activeTooltip.contains(e.target) &&
      !e.target.closest(".modality-options")
    ) {
      console.log("Clique fora detectado");
      closeTooltip();
    }
  });

  // Fechar tooltip ao pressionar ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeTooltip) {
      console.log("ESC pressionado");
      closeTooltip();
    }
  });

  console.log("Sistema de tooltips inicializado com sucesso");
}

// ===== ESTILOS PARA TOOLTIPS =====
const tooltipStyles = document.createElement("style");
tooltipStyles.textContent = `
  .modality-tooltip-simple {
    position: fixed;
    background: white;
    border: 2px solid #7c4dff;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    z-index: 9999;
    max-width: 350px;
    min-width: 300px;
    font-family: 'Open Sans', sans-serif;
    opacity: 1;
    transform: translateY(0) scale(1);
    transition: all 0.2s ease;
  }

  .tooltip-header-simple {
    background: linear-gradient(135deg, #7c4dff, #a081ff);
    color: white;
    padding: 12px 15px;
    border-radius: 10px 10px 0 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .tooltip-icon-simple {
    font-size: 1.5em;
    flex-shrink: 0;
  }

  .tooltip-title-simple {
    flex-grow: 1;
    font-weight: 600;
    font-size: 1.1em;
  }

  .tooltip-close-simple {
    background: none;
    border: none;
    color: white;
    font-size: 1.8em;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
    line-height: 1;
  }

  .tooltip-close-simple:hover {
    background: rgba(255,255,255,0.2);
    transform: scale(1.1);
  }

  .tooltip-close-simple:active {
    transform: scale(0.95);
    background: rgba(255,255,255,0.3);
  }

  .tooltip-content-simple {
    padding: 15px;
    color: #333;
    font-size: 0.9em;
  }

  .tooltip-item {
    line-height: 1.6;
    margin-bottom: 6px;
  }

  .tooltip-item:last-child {
    margin-bottom: 0;
  }

  /* Efeitos hover nos labels das modalidades */
  .modality-options label {
    transition: all 0.3s ease;
    position: relative;
  }

  .modality-options label:hover {
    background-color: #f0f0ff;
    border-color: #7c4dff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(124, 77, 255, 0.2);
  }

  .modality-options label:hover::after {
    content: "ℹ️ Informações detalhadas";
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.7em;
    white-space: nowrap;
    z-index: 1000;
    animation: fadeInUp 0.3s ease;
  }

  @keyframes fadeInUp {
    from { 
      opacity: 0; 
      transform: translateX(-50%) translateY(10px);
    }
    to { 
      opacity: 1; 
      transform: translateX(-50%) translateY(0);
    }
  }
`;
document.head.appendChild(tooltipStyles);

// ===== SISTEMA DE VALIDAÇÃO EM TEMPO REAL =====
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

// ===== SISTEMA DE DICAS CONTEXTUAIS =====
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

// ===== ESTILOS ADICIONAIS =====
const additionalStyles = document.createElement("style");
additionalStyles.textContent = `
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

  @keyframes tipSlideIn {
    from { opacity: 0; transform: translateX(-10px) scale(0.9); }
    to { opacity: 1; transform: translateX(0) scale(1); }
  }

  @keyframes tipSlideOut {
    from { opacity: 1; transform: translateX(0) scale(1); }
    to { opacity: 0; transform: translateX(-10px) scale(0.9); }
  }
`;
document.head.appendChild(additionalStyles);

// ===== INICIALIZAÇÃO DOS SISTEMAS =====
document.addEventListener("DOMContentLoaded", () => {
  new FormValidation();
  new ContextualHelp();

  // Efeitos visuais aprimorados
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

// ===== REDIRECIONAMENTO DO FORMULÁRIO =====
document.getElementById("submitButton").addEventListener("click", function (e) {
  e.preventDefault(); // Previne o envio do formulário

  // Parar narração antes de navegar
  if (window.voiceNarrator) {
    window.voiceNarrator.stopNarration();
  }

  window.location.href = "centralcandidato.html"; // Redireciona para a página
});
