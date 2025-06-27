class TutorialManager {
  constructor() {
    this.currentStep = 0;
    this.totalSteps = 5;
    this.isActive = false;

    this.steps = [
      {
        title: "Bem-vindo Parceiro(a)!",
        text: "Esta é a página principal do processo seletivo. Aqui você encontra todas as informações importantes sobre o processo de matrícula dos cursos de graduação disponíveis.",
        target: ".card",
        position: "center",
      },
      {
        title: "Informações do Curso",
        text: "Aqui você pode ver o tipo de curso, o processo seletivo atual e outras informações relevantes.",
        target: "#courseTitle",
        position: "bottom",
      },
      {
        title: "Período de Inscrições",
        text: "Esta seção mostra o período exato em que as inscrições estão abertas. Sempre verifique estas datas!",
        target: "#enrollmentInfo",
        position: "top",
      },
      {
        title: "Central do Candidato",
        text: "Use este botão para acessar informações a central do candidato, acompanhar status de inscrições e muito mais.",
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
          <i class="fas fa-trophy"></i>
          <h2>Parabéns!</h2>
        </div>
        <div class="modal-body">
          <p>Você concluiu o tutorial com sucesso! 🎉</p>
          <p>Agora você já sabe como navegar pela página inicial de inscrições.</p>
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

    // Remover modal após 10 segundos
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 10000);
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
  new TutorialManager();
});

// Adicionar funcionalidade aos botões principais
document.addEventListener("DOMContentLoaded", () => {
  // Simular ação do botão Central do Candidato
  document.getElementById("candidateCenter").addEventListener("click", () => {
    alert(
      "🎓 Central do Candidato\n\nEm um site real, este botão levaria você para:\n• Acompanhar suas inscrições\n• Ver resultados\n• Gerenciar dados pessoais\n• Histórico de processos seletivos"
    );
  });

  // Redirecionar para página de inscrição
  document.getElementById("enrollButton").addEventListener("click", () => {
    window.location.href = "inscricao.html";
  });
});
