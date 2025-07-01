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
        "Bem-vindo à Central do Candidato! Aqui você aprenderá como navegar nesta ferramenta essencial. Você vai aprender a fazer login na central, visualizar dados pessoais dos candidatos, conferir informações do curso, acompanhar envio de documentos, e verificar status da inscrição. IMPORTANTE: Esta é a área mais importante para o candidato acompanhar seu processo!",

      step0:
        "Para acessar a Central do Candidato, é necessário informar CPF e data de nascimento. Estes dados foram fornecidos durante a inscrição. Fique atento sempre a colocar o CPF e a data de nascimento correta no ato da matrícula para não ocorrer problema no acesso a central do candidato.",

      step1:
        "Aqui o candidato pode visualizar todos os dados pessoais informados durante a inscrição. Verifique se estão corretos. Se houver algum erro, gentileza entrar em contato com o seu consultor para realizar a correção.",

      step2:
        "Esta seção mostra o curso escolhido, modalidade e polo de estudo. Informações importantes para confirmação. Essas informações são fundamentais para o candidato confirmar sua escolha antes de prosseguir.",

      step3:
        "Aqui o candidato acompanha o envio e análise de documentos necessários para o processo seletivo. Status 'Aguardando Envio' significa que o candidato ainda precisa enviar os documentos.",

      step4:
        "Área para envio de documentos. O candidato pode fazer upload dos arquivos necessários diretamente pelo sistema. Aceita formatos: PDF, JPG, PNG, DOC, DOCX. Tamanho máximo por arquivo: 5MB.",

      completion:
        "Parabéns! Você dominou a Central do Candidato! Agora você sabe como orientar candidatos sobre como fazer login na central, verificar dados pessoais, acompanhar informações do curso, monitorar status de documentos, e fazer upload de arquivos para o processo seletivo. Use as setas do teclado para navegar no tutorial, pressione ESC para sair, e as caixas se posicionam automaticamente próximas aos elementos. Pratique orientando candidatos sobre o acesso, ajude no envio correto de documentos, acompanhe o status dos processos seletivos, e oriente sobre prazos e procedimentos. A Central do Candidato é a ferramenta mais importante para acompanhamento do processo seletivo!",
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
class CentralCandidatoTutorialManager {
  constructor() {
    this.currentStep = 0;
    this.totalSteps = 5;
    this.isActive = false;
    this.isLoggedIn = false;
    this.scrollPosition = 0; // Posição atual do scroll
    this.isScrollBlocked = false; // Estado do bloqueio

    this.steps = [
      {
        title: "Acesso à Central",
        text: "Para acessar a Central do Candidato, é necessário informar CPF e data de nascimento. Estes dados foram fornecidos durante a inscrição.",
        tip: "Fique atento sempre a colocar o CPF e a data de nascimento correta no ato da matrícula para não ocorrer problema no acesso a central do candidato.",
        target: "#loginForm",
        position: "bottom",
      },
      {
        title: "Dados Pessoais",
        text: "Aqui o candidato pode visualizar todos os dados pessoais informados durante a inscrição. Verifique se estão corretos.",
        tip: "Se houver algum erro, gentileza entrar em contato com o seu consultor para realizar a correção.",
        target: "#candidateDataBox",
        position: "right",
      },
      {
        title: "Informações do Curso",
        text: "Esta seção mostra o curso escolhido, modalidade e polo de estudo. Informações importantes para confirmação.",
        tip: "Essas informações são fundamentais para o candidato confirmar sua escolha antes de prosseguir.",
        target: "#courseDataBox",
        position: "right",
      },
      {
        title: "Status de Documentos",
        text: "Aqui o candidato acompanha o envio e análise de documentos necessários para o processo seletivo.",
        tip: "Status 'Aguardando Envio' significa que o candidato ainda precisa enviar os documentos.",
        target: "#documentsTable",
        position: "top",
      },
      {
        title: "Upload de Documentos",
        text: "Área para envio de documentos. O candidato pode fazer upload dos arquivos necessários diretamente pelo sistema.",
        tip: "Aceita formatos: PDF, JPG, PNG, DOC, DOCX. Tamanho máximo por arquivo: 5MB.",
        target: "#uploadSection",
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

    // Login form
    document.getElementById("accessForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
      this.handleLogout();
    });

    // File upload
    document.getElementById("uploadBtn").addEventListener("click", () => {
      document.getElementById("fileInput").click();
    });

    document.getElementById("fileInput").addEventListener("change", (e) => {
      this.handleFileUpload(e);
    });

    // CPF mask
    document.getElementById("cpf").addEventListener("input", (e) => {
      this.applyCPFMask(e.target);
    });

    // Modal close
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
  }

  // SISTEMA SIMPLIFICADO DE SCROLL
  blockScroll() {
    if (this.isScrollBlocked) return;

    this.scrollPosition = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${this.scrollPosition}px`;
    document.body.style.width = "100%";
    document.body.style.left = "0";
    this.isScrollBlocked = true;

    console.log(`Scroll bloqueado na posição: ${this.scrollPosition}`);
  }

  unblockScroll() {
    if (!this.isScrollBlocked) return;

    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    document.body.style.left = "";

    window.scrollTo(0, this.scrollPosition);
    this.isScrollBlocked = false;

    console.log(`Scroll desbloqueado, restaurado para: ${this.scrollPosition}`);
  }

  // NOVA FUNÇÃO: Ajustar scroll de forma controlada (versão melhorada)
  adjustScrollForElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
      console.log(`Elemento ${selector} não encontrado`);
      return;
    }

    // Temporariamente desbloquear para calcular posições
    const wasBlocked = this.isScrollBlocked;
    if (wasBlocked) {
      document.body.style.position = "";
      document.body.style.overflow = "";
      window.scrollTo(0, this.scrollPosition);
    }

    // Aguardar um frame para o DOM se atualizar
    requestAnimationFrame(() => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const currentScroll = window.scrollY;

      console.log(
        `Elemento ${selector} - Top: ${rect.top}, Bottom: ${rect.bottom}, Viewport: ${viewportHeight}`
      );

      // NOVO: Verificação especial para uploadSection
      const isUploadSection = selector === "#uploadSection";
      const marginTop = isUploadSection ? 200 : 100; // Mais margem para upload
      const marginBottom = isUploadSection ? 150 : 100; // Mais margem inferior para upload

      // Verificar se elemento precisa ser ajustado
      const needsAdjustment =
        rect.top < marginTop || rect.bottom > viewportHeight - marginBottom;

      if (needsAdjustment) {
        let newScrollPosition;

        if (isUploadSection) {
          // Para uploadSection, posicionar para que haja bastante espaço acima
          const elementTop = rect.top + currentScroll;
          newScrollPosition = Math.max(0, elementTop - viewportHeight * 0.4); // 40% da viewport acima
          console.log(
            `Posicionamento especial para uploadSection: ${newScrollPosition}`
          );
        } else {
          // Calcular nova posição ideal para outros elementos
          const elementCenter = rect.top + currentScroll + rect.height / 2;
          newScrollPosition = Math.max(0, elementCenter - viewportHeight / 2);
        }

        console.log(
          `Ajustando scroll de ${currentScroll} para ${newScrollPosition}`
        );

        // Fazer scroll suave
        window.scrollTo({
          top: newScrollPosition,
          behavior: "smooth",
        });

        // Aguardar scroll completar e atualizar posição
        setTimeout(() => {
          this.scrollPosition = window.scrollY;
          if (wasBlocked) {
            this.blockScroll();
          }
          console.log(`Scroll ajustado para: ${this.scrollPosition}`);
        }, 600);
      } else {
        // Elemento já visível, apenas rebloquear se necessário
        if (wasBlocked) {
          this.blockScroll();
        }
        console.log(
          `Elemento ${selector} já está visível, sem ajuste necessário`
        );
      }
    });
  }

  applyCPFMask(input) {
    let value = input.value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    input.value = value;
  }

  showWelcomeModal() {
    document.getElementById("welcomeModal").style.display = "flex";
    this.blockScroll();

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

    console.log(`\n=== PASSO ${this.currentStep + 1}: ${step.title} ===`);

    // Se for o primeiro passo e não estiver logado, mostrar tela de login
    if (this.currentStep === 0 && !this.isLoggedIn) {
      this.showLoginScreen();
    }
    // Se for passo 2 ou maior, garantir que está na tela da central
    else if (this.currentStep >= 1 && !this.isLoggedIn) {
      this.showCentralScreen();
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

    // SEGUNDO: Ajustar scroll se necessário (com delay para mudanças de tela)
    if (step.target) {
      setTimeout(
        () => {
          this.adjustScrollForElement(step.target);
        },
        this.currentStep === 1 ? 1600 : 300
      ); // Delay maior no passo 2 por causa do login
    }

    // TERCEIRO: Destacar elemento (com delay para aguardar ajuste de scroll)
    setTimeout(
      () => {
        this.highlightElement(step.target);
      },
      this.currentStep === 1 ? 2200 : 900
    );

    // QUARTO: Animar cursor (com delay)
    setTimeout(
      () => {
        this.animateCursor(step.target);
      },
      this.currentStep === 1 ? 2300 : 1000
    );

    // QUINTO: Posicionar caixa do tutorial (com delay maior)
    setTimeout(
      () => {
        this.positionTutorialBox(step.target, step.position);
      },
      this.currentStep === 1 ? 2400 : 1100
    );

    // SEXTO: Adicionar efeito hover ao elemento destacado
    setTimeout(
      () => {
        this.addHoverEffect(step.target);
      },
      this.currentStep === 1 ? 2500 : 1200
    );

    // SÉTIMO: Narrar o passo atual após todos os ajustes
    setTimeout(
      () => {
        if (window.voiceNarrator && this.isActive) {
          window.voiceNarrator.narrateCurrentStep();
        }
      },
      this.currentStep === 1 ? 3000 : 1500
    );
  }

  // FUNÇÃO CORRIGIDA DE POSICIONAMENTO COM AJUSTE INTELIGENTE
  positionTutorialBox(selector, position) {
    const element = document.querySelector(selector);
    const tutorialBox = document.querySelector(".tutorial-box");

    console.log(`Posicionando tutorial box para: ${selector}`);

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

      console.log(`Element rect:`, elementRect);
      console.log(`Box rect:`, boxRect);
      console.log(`Viewport: ${viewportWidth}x${viewportHeight}`);

      let top, left;
      let finalPosition = position;

      // NOVO: Verificação especial para elementos no final da página
      const isElementAtBottom = elementRect.bottom > viewportHeight * 0.7;
      const isUploadSection = selector === "#uploadSection";

      console.log(
        `Elemento no final da página: ${isElementAtBottom}, É upload section: ${isUploadSection}`
      );

      // Calcular posição inicial baseada na preferência
      switch (position) {
        case "top":
          top = elementRect.top - boxRect.height - 20;
          left = elementRect.left + elementRect.width / 2 - boxRect.width / 2;
          break;

        case "bottom":
          // NOVO: Se elemento está no final da página, forçar posição "top"
          if (isElementAtBottom || isUploadSection) {
            top = elementRect.top - boxRect.height - 30; // Mais espaço para upload
            finalPosition = "top";
            console.log(
              `Forçando posição 'top' para elemento no final da página`
            );
          } else {
            top = elementRect.bottom + 20;
          }
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
          // NOVO: Para posição padrão, também verificar se está no final
          if (isElementAtBottom || isUploadSection) {
            top = elementRect.top - boxRect.height - 30;
            finalPosition = "top";
          } else {
            top = elementRect.bottom + 20;
            finalPosition = "bottom";
          }
          left = elementRect.left + elementRect.width / 2 - boxRect.width / 2;
          break;
      }

      // Ajustar se sair da tela horizontalmente
      if (left < 20) {
        left = 20;
        console.log(`Ajustado left para não sair da tela: ${left}`);
      } else if (left + boxRect.width > viewportWidth - 20) {
        left = viewportWidth - boxRect.width - 20;
        console.log(`Ajustado left para não sair da tela direita: ${left}`);
      }

      // NOVO: Ajuste vertical mais inteligente
      if (top < 20) {
        // Se não cabe acima, tentar abaixo
        if (finalPosition === "top" || position === "top") {
          const bottomPosition = elementRect.bottom + 20;
          if (bottomPosition + boxRect.height <= viewportHeight - 20) {
            top = bottomPosition;
            finalPosition = "bottom";
            console.log(`Mudando para posição 'bottom' pois não cabe acima`);
          } else {
            // Se não cabe nem acima nem abaixo, centralizar na viewport
            top = Math.max(20, (viewportHeight - boxRect.height) / 2);
            finalPosition = "center";
            console.log(`Centralizando na viewport: ${top}`);
          }
        } else {
          top = 20;
        }
      } else if (top + boxRect.height > viewportHeight - 20) {
        // Se sai por baixo, tentar acima
        const topPosition = elementRect.top - boxRect.height - 20;
        if (topPosition >= 20) {
          top = topPosition;
          finalPosition = "top";
          console.log(`Mudando para posição 'top' pois sai por baixo`);
        } else {
          // Se não cabe nem acima nem abaixo, ajustar para caber
          top = Math.max(20, viewportHeight - boxRect.height - 20);
          console.log(`Ajustando para caber na viewport: ${top}`);
        }
      }

      // NOVO: Ajuste especial para uploadSection
      if (isUploadSection) {
        // Garantir que o tutorial box fique bem visível acima do elemento
        const idealTop = elementRect.top - boxRect.height - 50;
        if (idealTop >= 20) {
          top = idealTop;
          finalPosition = "top";
          console.log(`Posicionamento especial para uploadSection: ${top}`);
        } else {
          // Se não cabe acima, posicionar no meio da viewport
          top = Math.max(20, (viewportHeight - boxRect.height) / 2);
          finalPosition = "center";
          console.log(`Upload section: centralizando na viewport: ${top}`);
        }
      }

      // Aplicar a classe de posição final
      tutorialBox.classList.add(`position-${finalPosition}`);

      // Aplicar posição final
      const finalTop = Math.max(
        20,
        Math.min(top, viewportHeight - boxRect.height - 20)
      );
      const finalLeft = Math.max(
        20,
        Math.min(left, viewportWidth - boxRect.width - 20)
      );

      tutorialBox.style.top = `${finalTop}px`;
      tutorialBox.style.left = `${finalLeft}px`;
      tutorialBox.style.visibility = "visible";

      console.log(
        `Tutorial box posicionado: top=${finalTop}, left=${finalLeft}, position=${finalPosition}`
      );
      console.log(
        `Elemento visível na viewport: ${
          elementRect.top >= 0 && elementRect.bottom <= viewportHeight
        }`
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

      console.log(`Elemento ${selector} destacado em:`, rect);
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

      // Animação especial para upload
      if (selector === "#uploadSection") {
        cursor.style.color = "#28a745";
        cursor.style.fontSize = "32px";
      } else {
        cursor.style.color = "#ff4444";
        cursor.style.fontSize = "28px";
      }

      console.log(`Cursor posicionado em: ${centerX}, ${centerY}`);
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

  updateProgress() {
    console.log(
      `Atualizando progresso: ${this.currentStep + 1}/${this.totalSteps}`
    );

    const progressItems = document.querySelectorAll(".progress-item");

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
      } else if (index === this.currentStep) {
        // Passo atual
        item.classList.add("current");
        icon.className = "fas fa-circle-notch";
      } else {
        // Passos futuros
        icon.className = "fas fa-circle";
      }
    });
  }

  nextStep() {
    if (this.currentStep < this.totalSteps - 1) {
      // Se estiver no primeiro passo, simular login
      if (this.currentStep === 0) {
        this.simulateLogin();
      }

      this.currentStep++;
      this.showStep();
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;

      // Se voltar para o primeiro passo, mostrar tela de login
      if (this.currentStep === 0) {
        this.showLoginScreen();
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
          <p>🎉 <strong>Parabéns! Você dominou a Central do Candidato!</strong></p>
          <p>Agora você sabe como orientar candidatos sobre:</p>

          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4 style="margin: 0 0 10px 0; color: #28a745;">✅ Conhecimentos adquiridos:</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Como fazer login na central</li>
              <li>Verificar dados pessoais</li>
              <li>Acompanhar informações do curso</li>
              <li>Monitorar status de documentos</li>
              <li>Fazer upload de arquivos para o processo seletivo</li>
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
              <li>Pratique orientando candidatos sobre o acesso</li>
              <li>Ajude no envio correto de documentos</li>
              <li>Acompanhe o status dos processos seletivos</li>
              <li>Oriente sobre prazos e procedimentos</li>
            </ul>

            <!-- NOVO: Botão para página inicial do tutor -->
            <div style="margin-top: 20px; text-align: center; padding-top: 15px; border-top: 1px solid #ddd;">
              <p style="margin-bottom: 10px; font-weight: 600; color: #666;">
                <i class="fas fa-graduation-cap"></i> Quer aprender mais?
              </p>
              <button class="btn btn-info" onclick="window.open('https://uniunica.github.io/tutor/', '_blank')" style="
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                text-decoration: none;
                font-size: 1em;
              " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(102, 126, 234, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                <i class="fas fa-home"></i> Página Inicial do Tutor
              </button>
              <p style="margin-top: 8px; font-size: 0.85em; color: #888;">
                Acesse outros tutoriais e continue aprendendo!
              </p>
            </div>
          </div>

          <div class="info-box">
            <i class="fas fa-star"></i>
            <strong>Dica Final:</strong> A Central do Candidato é a ferramenta mais importante para acompanhamento do processo seletivo!
          </div>

          <p><strong>Você completou todo o treinamento do sistema!</strong></p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-success" onclick="this.closest('.modal').remove()">
            <i class="fas fa-medal"></i> Sou um Expert!
          </button>
          <button class="btn btn-primary" onclick="window.location.href='../index.html'">
            <i class="fas fa-arrow-left"></i> Voltar ao Menu Principal
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  handleLogin() {
    const cpf = document.getElementById("cpf").value;
    const nascimento = document.getElementById("nascimento").value;

    if (!cpf || !nascimento) {
      this.showAlert("Por favor, preencha todos os campos!", "warning");
      return;
    }

    // Simular validação
    if (cpf.length < 14) {
      this.showAlert("CPF inválido! Digite um CPF válido.", "error");
      return;
    }

    this.simulateLogin();
  }

  simulateLogin() {
    this.showAlert("Login realizado com sucesso!", "success");

    setTimeout(() => {
      this.showCentralScreen();
      this.isLoggedIn = true;
    }, 1500);
  }

  handleLogout() {
    this.showAlert("Logout realizado com sucesso!", "info");
    this.showLoginScreen();
    this.isLoggedIn = false;

    // Parar narração se estiver ativa
    if (window.voiceNarrator) {
      window.voiceNarrator.stopNarration();
    }
  }

  showLoginScreen() {
    document.getElementById("loginScreen").classList.remove("hidden");
    document.getElementById("centralScreen").classList.add("hidden");
  }

  showCentralScreen() {
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("centralScreen").classList.remove("hidden");
  }

  handleFileUpload(event) {
    const files = event.target.files;
    if (files.length > 0) {
      let fileNames = Array.from(files)
        .map((file) => file.name)
        .join(", ");
      this.showAlert(`Arquivos selecionados: ${fileNames}`, "success");

      // Simular upload
      setTimeout(() => {
        this.updateDocumentStatus();
      }, 2000);
    }
  }

  updateDocumentStatus() {
    const statusCell = document.querySelector(".status-pending");
    if (statusCell) {
      statusCell.textContent = "Em Análise";
      statusCell.className = "status-approved";

      const parecer = statusCell.parentElement.nextElementSibling;
      parecer.textContent = "Documento recebido e em análise pela equipe";

      this.showAlert("Documento enviado com sucesso!", "success");
    }
  }

  showAlert(message, type = "info") {
    const alertDiv = document.createElement("div");
    alertDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 1001;
      animation: slideInRight 0.3s ease;
    `;

    switch (type) {
      case "success":
        alertDiv.style.background = "#28a745";
        break;
      case "error":
        alertDiv.style.background = "#dc3545";
        break;
      case "warning":
        alertDiv.style.background = "#ffc107";
        alertDiv.style.color = "#212529";
        break;
      default:
        alertDiv.style.background = "#17a2b8";
    }

    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
  }

  restartTutorial() {
    this.hideProgressPanel();
    this.showLoginScreen();
    this.isLoggedIn = false;

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
  // Inicializar sistema de voz
  window.voiceNarrator = new VoiceNarrator();

  // Inicializar tutorial manager
  window.tutorialManager = new CentralCandidatoTutorialManager();
});

// ===== ESTILOS ADICIONAIS =====
const alertStyles = document.createElement("style");
alertStyles.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  /* Indicador de scroll sendo ajustado */
  .scroll-adjusting {
    transition: all 0.6s ease;
  }

  /* NOVO: Estilo para posição centralizada */
  .tutorial-box.position-center {
    transform: translateX(-50%);
    left: 50% !important;
  }

  .tutorial-box.position-center::before {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #6e00a8;
  }

  /* Melhorar visibilidade do tutorial box no upload */
  .tutorial-box.position-top {
    box-shadow: 0 -4px 20px rgba(110, 0, 168, 0.3);
  }

  .tutorial-box.position-center {
    box-shadow: 0 8px 30px rgba(110, 0, 168, 0.4);
    border: 3px solid #6e00a8;
  }
`;
document.head.appendChild(alertStyles);

// ===== FUNCIONALIDADES ADICIONAIS =====
document.addEventListener("DOMContentLoaded", () => {
  // Adicionar efeitos visuais nos campos de input
  const inputs = document.querySelectorAll(
    'input[type="text"], input[type="date"]'
  );
  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      input.style.transform = "scale(1.02)";
      input.style.boxShadow = "0 4px 12px rgba(110, 0, 168, 0.2)";
    });

    input.addEventListener("blur", () => {
      input.style.transform = "scale(1)";
      input.style.boxShadow = "none";
    });
  });

  // Adicionar efeitos nos botões
  const buttons = document.querySelectorAll("button:not(.btn)");
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      button.style.transform = "translateY(-2px)";
      button.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "translateY(0)";
      button.style.boxShadow = "none";
    });
  });
});

// ===== SISTEMA DE VALIDAÇÃO =====
class FormValidator {
  constructor() {
    this.rules = {
      cpf: {
        pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
        message: "CPF deve estar no formato 000.000.000-00",
      },
      nascimento: {
        validate: (value) => {
          const date = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - date.getFullYear();
          return age >= 16 && age <= 100;
        },
        message:
          "Data de nascimento deve ser válida (idade entre 16 e 100 anos)",
      },
    };
  }

  validateField(fieldName, value) {
    const rule = this.rules[fieldName];
    if (!rule) return { valid: true };

    if (rule.pattern) {
      return {
        valid: rule.pattern.test(value),
        message: rule.message,
      };
    }

    if (rule.validate) {
      return {
        valid: rule.validate(value),
        message: rule.message,
      };
    }

    return { valid: true };
  }

  validateForm(formData) {
    const errors = [];

    for (const [field, value] of Object.entries(formData)) {
      const validation = this.validateField(field, value);
      if (!validation.valid) {
        errors.push({
          field,
          message: validation.message,
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// ===== SISTEMA DE DICAS CONTEXTUAIS =====
class ContextualTips {
  constructor() {
    this.tips = {
      cpf: "Digite apenas números. A formatação será aplicada automaticamente.",
      nascimento: "Utilize a mesma data informada durante a inscrição.",
      uploadSection:
        "Formatos aceitos: PDF, JPG, PNG, DOC, DOCX (máx. 5MB por arquivo)",
      documentsTable: "Acompanhe aqui o status de todos os documentos enviados",
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
      z-index: 1002;
      max-width: 250px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      pointer-events: none;
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

// ===== SISTEMA DE SIMULAÇÃO DE DADOS =====
class DataSimulator {
  constructor() {
    this.candidateData = {
      names: [
        "FELIPE TOLEDO LOPES DA SILVA",
        "MARIA SANTOS OLIVEIRA",
        "JOÃO PEDRO COSTA",
        "ANA CAROLINA FERREIRA",
        "CARLOS EDUARDO SANTOS",
      ],
      cpfs: [
        "134.920.006-90",
        "987.654.321-00",
        "123.456.789-01",
        "456.789.123-45",
        "789.123.456-78",
      ],
      emails: [
        "lipelopes8@gmail.com",
        "maria.santos@email.com",
        "joao.pedro@gmail.com",
        "ana.carolina@hotmail.com",
        "carlos.eduardo@yahoo.com",
      ],
      courses: [
        "Graduação: Ciência da Computação - Ensino a Distância (EAD)",
        "Graduação: Administração - Ensino a Distância (EAD)",
        "Graduação: Pedagogia - Ensino a Distância (EAD)",
        "Graduação: Enfermagem - Ensino a Distância (EAD)",
        "Graduação: Direito - Ensino a Distância (EAD)",
      ],
    };
  }

  getRandomData() {
    const index = Math.floor(Math.random() * this.candidateData.names.length);
    return {
      name: this.candidateData.names[index],
      cpf: this.candidateData.cpfs[index],
      email: this.candidateData.emails[index],
      course: this.candidateData.courses[index],
    };
  }

  updateCandidateData() {
    const data = this.getRandomData();

    // Atualizar campos se existirem
    const nameField = document.getElementById("nomeField");
    const cpfField = document.getElementById("cpfField");
    const emailField = document.getElementById("emailField");
    const cursoField = document.getElementById("cursoField");
    const userNameSpan = document.getElementById("userName");

    if (nameField) nameField.value = data.name;
    if (cpfField) cpfField.value = data.cpf;
    if (emailField) emailField.value = data.email;
    if (cursoField) cursoField.value = data.course;
    if (userNameSpan)
      userNameSpan.textContent =
        data.name.split(" ")[0] + " " + data.name.split(" ")[1];
  }
}

// ===== INICIALIZAÇÃO DOS SISTEMAS AUXILIARES =====
document.addEventListener("DOMContentLoaded", () => {
  const formValidator = new FormValidator();
  new ContextualTips();

  // Inicializar simulador de dados
  const dataSimulator = new DataSimulator();

  // Atualizar dados após login simulado
  setTimeout(() => {
    if (
      !document.getElementById("centralScreen").classList.contains("hidden")
    ) {
      dataSimulator.updateCandidateData();
    }
  }, 2000);
});

// ===== RECURSOS DE ACESSIBILIDADE =====
class AccessibilityFeatures {
  constructor() {
    this.init();
  }

  init() {
    this.addKeyboardNavigation();
    this.addScreenReaderSupport();
    this.addHighContrastMode();
  }

  addKeyboardNavigation() {
    document.addEventListener("keydown", (e) => {
      // ESC para fechar modais
      if (e.key === "Escape") {
        const modal = document.querySelector(".modal");
        if (modal && !window.tutorialManager?.isActive) {
          modal.style.display = "none";
        }
      }

      // Enter para submeter formulários
      if (e.key === "Enter" && e.target.tagName === "INPUT") {
        const form = e.target.closest("form");
        if (form) {
          form.dispatchEvent(new Event("submit"));
        }
      }
    });
  }

  addScreenReaderSupport() {
    // Adicionar labels apropriados
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      if (!input.getAttribute("aria-label") && input.previousElementSibling) {
        const label = input.previousElementSibling.textContent;
        input.setAttribute("aria-label", label);
      }
    });
  }

  addHighContrastMode() {
    // Botão para modo alto contraste
    const contrastBtn = document.createElement("button");
    contrastBtn.innerHTML = '<i class="fas fa-adjust"></i>';
    contrastBtn.title = "Alternar Alto Contraste";
    contrastBtn.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 20px;
      background: #333;
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      cursor: pointer;
      z-index: 994;
      font-size: 1.2em;
    `;

    contrastBtn.addEventListener("click", () => {
      document.body.classList.toggle("high-contrast");
    });

    document.body.appendChild(contrastBtn);

    // CSS para modo alto contraste
    const contrastStyles = document.createElement("style");
    contrastStyles.textContent = `
      .high-contrast {
        filter: contrast(150%) brightness(120%);
      }

      .high-contrast .modal-content,
      .high-contrast .box,
      .high-contrast .tutorial-box {
        border: 2px solid #000 !important;
      }

      .high-contrast input,
      .high-contrast button {
        border: 2px solid #000 !important;
      }
    `;
    document.head.appendChild(contrastStyles);
  }
}

// Inicializar recursos de acessibilidade
document.addEventListener("DOMContentLoaded", () => {
  new AccessibilityFeatures();
});

// Função para demonstrar funcionalidades avançadas
function demonstrateAdvancedFeatures() {
  console.log("🚀 Central do Candidato - Funcionalidades Ativadas:");
  console.log("✅ Sistema de narração de voz integrado");
  console.log("✅ Tutorial guiado interativo");
  console.log("✅ Sistema de validação de formulários");
  console.log("✅ Dicas contextuais");
  console.log("✅ Simulação de dados realistas");
  console.log("✅ Recursos de acessibilidade");
  console.log("✅ Scroll inteligente durante tutorial");
  console.log("✅ Posicionamento automático de elementos");
  console.log("✅ Controles de voz com configurações avançadas");
}

// Executar demonstração
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(demonstrateAdvancedFeatures, 1000);
});
