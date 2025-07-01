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
        "Bem-vindo ao tutorial interativo de graduação! Este é um site espelho criado especialmente para ensinar nossos parceiros como realizar matrículas de graduação. Você será guiado passo a passo através de um tutorial interativo com cursor guiado, explicações detalhadas e dicas práticas. Use as setas do teclado ou botões para navegar, e pressione ESC para sair do tutorial. Pronto para começar?",

      step0:
        "Bem-vindo, parceiro! Esta é a página principal do processo seletivo. Aqui você encontra informações introdutórias sobre o processo de matrícula dos cursos de graduação disponíveis. Esta interface é similar ao site real que você usará para fazer as matrículas.",

      step1:
        "Aqui você pode ver o tipo de curso e o processo seletivo atual do semestre. Note que está escrito 'CURSOS EAD - Processo Seletivo II 2025/2' e 'ÚNICA EAD'. Essas informações são importantes para identificar qual modalidade e instituição você está matriculando o aluno.",

      step2:
        "Esta seção mostra o período exato em que as inscrições estão abertas. Sempre verifique estas datas! No exemplo, as inscrições vão de 23 de junho de 2025 às 00:00 até 31 de dezembro de 2025 às 23:59. É fundamental verificar se o período está ativo antes de tentar fazer uma matrícula.",

      step3:
        "Use este botão para acessar informações da central do candidato, acompanhar status de inscrições e muito mais. A Central do Candidato é onde o aluno pode verificar o andamento de sua inscrição, fazer upload de documentos e acompanhar todo o processo seletivo.",

      step4:
        "Este é o botão principal! Clique aqui para iniciar uma nova inscrição no processo seletivo. Este botão te levará para o formulário de matrícula onde você preencherá todos os dados do aluno. Vamos experimentar clicar nele!",

      completion:
        "Parabéns! Você concluiu o tutorial com sucesso! Agora você já sabe como navegar pela página inicial de inscrições. Lembre-se: use as setas do teclado para navegar no tutorial, pressione ESC para sair, e as caixas de diálogo se posicionam automaticamente. Em alguns segundos, o botão 'Fazer Inscrição' começará a piscar para indicar que você deve clicar nele! Os próximos passos são: acessar a Central do Candidato, clicar em 'Fazer Inscrição' para realizar uma matrícula, e sempre verificar os prazos de inscrição.",
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
class TutorialManager {
  constructor() {
    this.currentStep = 0;
    this.totalSteps = 5;
    this.isActive = false;
    this.tutorialCompleted = false;

    this.steps = [
      {
        title: "Bem-vindo Parceiro(a)!",
        text: "Esta é a página principal do processo seletivo. Aqui você encontra informações introdutórias sobre o processo de matrícula dos cursos de graduação disponíveis.",
        target: ".card",
        position: "center",
      },
      {
        title: "Informações do Curso",
        text: "Aqui você pode ver o tipo de curso, o processo seletivo atual/semestre atual.",
        target: "#courseTitle",
        position: "right",
      },
      {
        title: "Período de Inscrições",
        text: "Esta seção mostra o período exato em que as inscrições estão abertas. Sempre verifique estas datas!",
        target: "#enrollmentInfo",
        position: "right",
      },
      {
        title: "Central do Candidato",
        text: "Use este botão para acessar informações da central do candidato, acompanhar status de inscrições e muito mais.",
        target: "#candidateCenter",
        position: "top",
      },
      {
        title: "Fazer Inscrição",
        text: "Este é o botão principal! Clique aqui para iniciar uma nova inscrição no processo seletivo. Vamos experimentar!",
        target: "#enrollButton",
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
  }

  showWelcomeModal() {
    document.getElementById("welcomeModal").style.display = "flex";

    // Narrar boas-vindas após um delay
    setTimeout(() => {
      if (window.voiceNarrator) {
        window.voiceNarrator.narrateWelcome();
      }
    }, 1500);
  }

  hideWelcomeModal() {
    document.getElementById("welcomeModal").style.display = "none";
  }

  startTutorial() {
    this.hideWelcomeModal();
    this.isActive = true;
    this.currentStep = 0;
    this.tutorialCompleted = false;
    this.showProgressPanel();
    this.showStep();

    // Remover animação do botão se estiver ativa
    this.deactivateEnrollButtonPulse();

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

    // Mostrar overlay
    overlay.classList.remove("hidden");

    // Atualizar conteúdo
    document.getElementById("tutorialTitle").textContent = step.title;
    document.getElementById("tutorialText").textContent = step.text;
    document.getElementById("tutorialStep").textContent = this.currentStep + 1;
    document.getElementById("tutorialTotal").textContent = this.totalSteps;

    // Atualizar botões
    document.getElementById("prevStep").disabled = this.currentStep === 0;

    if (this.currentStep === this.totalSteps - 1) {
      document.getElementById("nextStep").classList.add("hidden");
      document.getElementById("finishTutorial").classList.remove("hidden");
    } else {
      document.getElementById("nextStep").classList.remove("hidden");
      document.getElementById("finishTutorial").classList.add("hidden");
    }

    // Posicionar caixa do tutorial próxima ao elemento
    this.positionTutorialBox(step.target, step.position);

    // Destacar elemento
    this.highlightElement(step.target);

    // Animar cursor
    this.animateCursor(step.target);

    // Atualizar progresso
    this.updateProgress();

    // Adicionar efeito hover ao elemento destacado
    this.addHoverEffect(step.target);

    // Narrar o passo atual após um pequeno delay
    setTimeout(() => {
      if (window.voiceNarrator && this.isActive) {
        window.voiceNarrator.narrateCurrentStep();
      }
    }, 800);
  }

  positionTutorialBox(selector, position) {
    const element = document.querySelector(selector);
    const tutorialBox = document.querySelector(".tutorial-box");

    if (!element || !tutorialBox) return;

    // Remover classes de posição anteriores
    tutorialBox.classList.remove(
      "position-top",
      "position-bottom",
      "position-left",
      "position-right",
      "position-center"
    );

    const elementRect = element.getBoundingClientRect();
    const boxRect = tutorialBox.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top, left;

    switch (position) {
      case "top":
        top = elementRect.top - boxRect.height - 20;
        left = elementRect.left + elementRect.width / 2 - boxRect.width / 2;
        tutorialBox.classList.add("position-top");
        break;

      case "bottom":
        top = elementRect.bottom + 20;
        left = elementRect.left + elementRect.width / 2 - boxRect.width / 2;
        tutorialBox.classList.add("position-bottom");
        break;

      case "left":
        top = elementRect.top + elementRect.height / 2 - boxRect.height / 2;
        left = elementRect.left - boxRect.width - 20;
        tutorialBox.classList.add("position-left");
        break;

      case "right":
        top = elementRect.top + elementRect.height / 2 - boxRect.height / 2;
        left = elementRect.right + 20;
        tutorialBox.classList.add("position-right");
        break;

      case "center":
      default:
        top = elementRect.bottom + 30;
        left = elementRect.left + elementRect.width / 2 - boxRect.width / 2;
        tutorialBox.classList.add("position-bottom");
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
      tutorialBox.classList.remove("position-top");
      tutorialBox.classList.add("position-bottom");
    } else if (top + boxRect.height > viewportHeight - 20) {
      top = elementRect.top - boxRect.height - 20;
      tutorialBox.classList.remove("position-bottom");
      tutorialBox.classList.add("position-top");
    }

    tutorialBox.style.top = `${top}px`;
    tutorialBox.style.left = `${left}px`;
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

      // Scroll suave para o elemento
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
    this.tutorialCompleted = true;
    document.getElementById("tutorialOverlay").classList.add("hidden");
    document.getElementById("highlight").classList.add("hidden");
    document.getElementById("animatedCursor").classList.add("hidden");

    // Remover efeito hover
    const element = document.querySelector(".tutorial-highlight-hover");
    if (element) {
      element.classList.remove("tutorial-highlight-hover");
    }

    // Parar narração atual e narrar conclusão
    if (window.voiceNarrator) {
      window.voiceNarrator.stopNarration();
      setTimeout(() => {
        window.voiceNarrator.narrateCompletion();
      }, 500);
    }

    // Mostrar mensagem de conclusão
    this.showCompletionMessage();

    // Ativar animação do botão após 3 segundos
    setTimeout(() => {
      this.activateEnrollButtonPulse();
    }, 3000);
  }

  // Nova função para ativar a animação do botão
  activateEnrollButtonPulse() {
    const enrollButton = document.getElementById("enrollButton");
    if (enrollButton && this.tutorialCompleted) {
      enrollButton.classList.add("btn-pulse-active");

      // Adicionar tooltip
      const tooltip = document.createElement("div");
      tooltip.className = "btn-pulse-tooltip";
      tooltip.textContent = "👇 Clique aqui para fazer sua inscrição!";
      enrollButton.style.position = "relative";
      enrollButton.appendChild(tooltip);

      // Remover animação após 30 segundos ou quando clicado
      const removeAnimation = () => {
        enrollButton.classList.remove("btn-pulse-active");
        if (tooltip.parentNode) {
          tooltip.remove();
        }
        enrollButton.removeEventListener("click", removeAnimation);
      };

      enrollButton.addEventListener("click", removeAnimation);

      // Auto-remover após 60 segundos
      setTimeout(removeAnimation, 60000);
    }
  }

  // Nova função para desativar a animação do botão
  deactivateEnrollButtonPulse() {
    const enrollButton = document.getElementById("enrollButton");
    if (enrollButton) {
      enrollButton.classList.remove("btn-pulse-active");
      const tooltip = enrollButton.querySelector(".btn-pulse-tooltip");
      if (tooltip) {
        tooltip.remove();
      }
    }
  }

  showCompletionMessage() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <i class="fas fa-trophy"></i>
          <h2>Parabéns!</h2>
        </div>
        <div class="modal-body">
          <p>Você concluiu o tutorial com sucesso! 🎉</p>
          <p>Agora você já sabe como navegar pela página inicial de inscrições.</p>
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>💡 Dicas importantes:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Use as <strong> setas do teclado</strong> para navegar no tutorial</li>
              <li>Pressione <strong>ESC</strong> para sair do tutorial</li>
              <li>As caixas de diálogo se posicionam automaticamente</li>
            </ul>
          </div>
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ffc107;">
            <p><strong>🎯 Próximo passo:</strong></p>
            <p>Em alguns segundos, o botão <strong>"Fazer Inscrição"</strong> começará a piscar para indicar que você deve clicar nele!</p>
          </div>
          <p><strong>Próximos passos:</strong></p>
          <ul>
            <li><i class="fas fa-user-graduate"></i> Acesse a Central do Candidato</li>
            <li><i class="fas fa-pencil-alt"></i> Clique em "Fazer Inscrição" para realizar uma matrícula</li>
            <li><i class="fas fa-calendar-alt"></i> Sempre verifique os prazos de inscrição</li>
          </ul>
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

  restartTutorial() {
    this.tutorialCompleted = false;
    this.deactivateEnrollButtonPulse();
    this.hideProgressPanel();

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
  window.tutorialManager = new TutorialManager();
});

// ===== FUNCIONALIDADES DOS BOTÕES PRINCIPAIS =====
document.addEventListener("DOMContentLoaded", () => {
  // Redirecionar para Central do Candidato
  document.getElementById("candidateCenter").addEventListener("click", () => {
    // Parar narração antes de navegar
    if (window.voiceNarrator) {
      window.voiceNarrator.stopNarration();
    }
    window.location.href = "centralcandidato.html";
  });

  // Redirecionar para página de inscrição
  document.getElementById("enrollButton").addEventListener("click", () => {
    // Parar narração antes de navegar
    if (window.voiceNarrator) {
      window.voiceNarrator.stopNarration();
    }
    window.location.href = "inscricao.html";
  });
});

// ===== EFEITOS VISUAIS EXTRAS =====
document.addEventListener("DOMContentLoaded", () => {
  // Efeito parallax sutil no fundo
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector("body::before");
    if (parallax) {
      document.body.style.backgroundPosition = `center ${scrolled * 0.5}px`;
    }
  });

  // Efeito hover nos botões principais
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      button.style.transform = "translateY(-2px)";
      button.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "translateY(0)";
      button.style.boxShadow = "none";
    });
  });

  // Efeito de digitação no título
  const title = document.querySelector(".header-content h1");
  if (title) {
    const text = title.textContent;
    title.textContent = "";
    title.style.borderRight = "2px solid white";

    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        title.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        setTimeout(() => {
          title.style.borderRight = "none";
        }, 1000);
      }
    };

    setTimeout(typeWriter, 1000);
  }
});
