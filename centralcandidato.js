class CentralCandidatoTutorialManager {
  constructor() {
    this.currentStep = 0;
    this.totalSteps = 5;
    this.isActive = false;
    this.isLoggedIn = false;
    
    this.steps = [
      {
        title: "Acesso à Central",
        text: "Para acessar a Central do Candidato, é necessário informar CPF e data de nascimento. Estes dados foram fornecidos durante a inscrição.",
        tip: "Oriente o candidato a usar exatamente os mesmos dados informados na inscrição.",
        target: "#loginForm",
        position: "center"
      },
      {
        title: "Dados Pessoais",
        text: "Aqui o candidato pode visualizar todos os dados pessoais informados durante a inscrição. Verifique se estão corretos.",
        tip: "Se houver algum erro, oriente o candidato a entrar em contato com o suporte para correção.",
        target: "#candidateDataBox",
        position: "top"
      },
      {
        title: "Informações do Curso",
        text: "Esta seção mostra o curso escolhido, modalidade e polo de estudo. Informações importantes para confirmação.",
        tip: "Essas informações são fundamentais para o candidato confirmar sua escolha antes de prosseguir.",
        target: "#courseDataBox",
        position: "top"
      },
      {
        title: "Status de Documentos",
        text: "Aqui o candidato acompanha o envio e análise de documentos necessários para o processo seletivo.",
        tip: "Status 'Aguardando Envio' significa que o candidato ainda precisa enviar os documentos.",
        target: "#documentsTable",
        position: "top"
      },
      {
        title: "Upload de Documentos",
        text: "Área para envio de documentos. O candidato pode fazer upload dos arquivos necessários diretamente pelo sistema.",
        tip: "Aceita formatos: PDF, JPG, PNG, DOC, DOCX. Tamanho máximo por arquivo: 5MB.",
        target: "#uploadSection",
        position: "top"
      }
    ];
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.showWelcomeModal();
  }
  
  bindEvents() {
    // Tutorial events
    document.getElementById('startTutorial').addEventListener('click', () => {
      this.startTutorial();
    });
    
    document.getElementById('nextStep').addEventListener('click', () => {
      this.nextStep();
    });
    
    document.getElementById('prevStep').addEventListener('click', () => {
      this.prevStep();
    });
    
    document.getElementById('finishTutorial').addEventListener('click', () => {
      this.finishTutorial();
    });
    
    document.getElementById('restartTutorial').addEventListener('click', () => {
      this.restartTutorial();
    });
    
    // Login form
    document.getElementById('accessForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
      this.handleLogout();
    });
    
    // File upload
    document.getElementById('uploadBtn').addEventListener('click', () => {
      document.getElementById('fileInput').click();
    });
    
    document.getElementById('fileInput').addEventListener('change', (e) => {
      this.handleFileUpload(e);
    });
    
    // CPF mask
    document.getElementById('cpf').addEventListener('input', (e) => {
      this.applyCPFMask(e.target);
    });
    
    // Modal close
    document.getElementById('welcomeModal').addEventListener('click', (e) => {
      if (e.target.id === 'welcomeModal') {
        this.startTutorial();
      }
    });
  }
  
  applyCPFMask(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = value;
  }
  
  showWelcomeModal() {
    document.getElementById('welcomeModal').style.display = 'flex';
  }
  
  hideWelcomeModal() {
    document.getElementById('welcomeModal').style.display = 'none';
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
    const overlay = document.getElementById('tutorialOverlay');
    const tipElement = document.getElementById('tutorialTip');
    
    // Se for o primeiro passo e não estiver logado, mostrar tela de login
    if (this.currentStep === 0 && !this.isLoggedIn) {
      this.showLoginScreen();
    }
    // Se for passo 2 ou maior, garantir que está na tela da central
    else if (this.currentStep >= 1 && !this.isLoggedIn) {
      this.showCentralScreen();
    }
    
    // Mostrar overlay
    overlay.classList.remove('hidden');
    
    // Atualizar conteúdo
    document.getElementById('tutorialTitle').textContent = step.title;
    document.getElementById('tutorialText').textContent = step.text;
    document.getElementById('tutorialStep').textContent = this.currentStep + 1;
    document.getElementById('tutorialTotal').textContent = this.totalSteps;
    
    // Mostrar dica se existir
    if (step.tip) {
      document.getElementById('tutorialTipText').textContent = step.tip;
      tipElement.classList.remove('hidden');
    } else {
      tipElement.classList.add('hidden');
    }
    
    // Atualizar botões
    document.getElementById('prevStep').disabled = this.currentStep === 0;
    
    if (this.currentStep === this.totalSteps - 1) {
      document.getElementById('nextStep').classList.add('hidden');
      document.getElementById('finishTutorial').classList.remove('hidden');
    } else {
      document.getElementById('nextStep').classList.remove('hidden');
      document.getElementById('finishTutorial').classList.add('hidden');
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
    const highlight = document.getElementById('highlight');
    
    if (element) {
      const rect = element.getBoundingClientRect();
      highlight.style.top = (rect.top - 5) + 'px';
      highlight.style.left = (rect.left - 5) + 'px';
      highlight.style.width = (rect.width + 10) + 'px';
      highlight.style.height = (rect.height + 10) + 'px';
      highlight.classList.remove('hidden');
      
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }
  
  animateCursor(selector) {
    const element = document.querySelector(selector);
    const cursor = document.getElementById('animatedCursor');
    
    if (element) {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      cursor.style.left = centerX + 'px';
      cursor.style.top = centerY + 'px';
      cursor.classList.remove('hidden');
      
      // Animação especial para upload
      if (selector === '#uploadSection') {
        cursor.style.color = '#28a745';
        cursor.style.fontSize = '28px';
      } else {
        cursor.style.color = '#ff4444';
        cursor.style.fontSize = '24px';
      }
    }
  }
  
  updateProgress() {
    const items = document.querySelectorAll('.progress-item');
    
    items.forEach((item, index) => {
      const icon = item.querySelector('i');
      
      if (index < this.currentStep) {
        item.classList.add('completed');
        item.classList.remove('current');
        icon.className = 'fas fa-check-circle';
      } else if (index === this.currentStep) {
        item.classList.add('current');
        item.classList.remove('completed');
        icon.className = 'fas fa-circle-notch';
      } else {
        item.classList.remove('completed', 'current');
        icon.className = 'fas fa-circle';
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
    document.getElementById('tutorialOverlay').classList.add('hidden');
    document.getElementById('highlight').classList.add('hidden');
    document.getElementById('animatedCursor').classList.add('hidden');
    
    this.showCompletionMessage();
  }
  
  showCompletionMessage() {
    const modal = document.createElement('div');
    modal.className = 'modal';
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
              <li>Fazer upload de arquivos</li>
            </ul>
          </div>
          
          <div class="info-box">
            <i class="fas fa-star"></i>
            <strong>Dica Final:</strong> A Central do Candidato é a ferramenta mais importante para acompanhamento!
          </div>
          
          <p><strong>Você completou todo o treinamento do sistema!</strong></p>
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
  
  handleLogin() {
    const cpf = document.getElementById('cpf').value;
    const nascimento = document.getElementById('nascimento').value;
    
    if (!cpf || !nascimento) {
      this.showAlert('Por favor, preencha todos os campos!', 'warning');
      return;
    }
    
    // Simular validação
    if (cpf.length < 14) {
      this.showAlert('CPF inválido! Digite um CPF válido.', 'error');
      return;
    }
    
    this.simulateLogin();
  }
  
  simulateLogin() {
    this.showAlert('Login realizado com sucesso!', 'success');
    
    setTimeout(() => {
      this.showCentralScreen();
      this.isLoggedIn = true;
    }, 1500);
  }
  
  handleLogout() {
    this.showAlert('Logout realizado com sucesso!', 'info');
    this.showLoginScreen();
    this.isLoggedIn = false;
  }
  
  showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('centralScreen').classList.add('hidden');
  }
  
  showCentralScreen() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('centralScreen').classList.remove('hidden');
  }
  
  handleFileUpload(event) {
    const files = event.target.files;
    if (files.length > 0) {
      let fileNames = Array.from(files).map(file => file.name).join(', ');
      this.showAlert(`Arquivos selecionados: ${fileNames}`, 'success');
      
      // Simular upload
      setTimeout(() => {
        this.updateDocumentStatus();
      }, 2000);
    }
  }
  
  updateDocumentStatus() {
    const statusCell = document.querySelector('.status-pending');
    if (statusCell) {
      statusCell.textContent = 'Em Análise';
      statusCell.className = 'status-approved';
      
      const parecer = statusCell.parentElement.nextElementSibling;
      parecer.textContent = 'Documento recebido e em análise pela equipe';
      
      this.showAlert('Documento enviado com sucesso!', 'success');
    }
  }
  
  showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
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
    
    switch(type) {
      case 'success':
        alertDiv.style.background = '#28a745';
        break;
      case 'error':
        alertDiv.style.background = '#dc3545';
        break;
      case 'warning':
        alertDiv.style.background = '#ffc107';
        alertDiv.style.color = '#212529';
        break;
      default:
        alertDiv.style.background = '#17a2b8';
    }
    
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
      alertDiv.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
  }
  
  restartTutorial() {
    this.hideProgressPanel();
    this.showLoginScreen();
    this.isLoggedIn = false;
    this.showWelcomeModal();
  }
  
  showProgressPanel() {
    document.getElementById('progressPanel').classList.remove('hidden');
  }
  
  hideProgressPanel() {
    document.getElementById('progressPanel').classList.add('hidden');
  }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  new CentralCandidatoTutorialManager();
});

// Adicionar estilos para animações de alerta
const alertStyles = document.createElement('style');
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
`;
document.head.appendChild(alertStyles);

// Funcionalidades adicionais para melhorar a experiência
document.addEventListener('DOMContentLoaded', () => {
  // Adicionar efeitos visuais nos campos de input
  const inputs = document.querySelectorAll('input[type="text"], input[type="date"]');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.style.transform = 'scale(1.02)';
      input.style.boxShadow = '0 4px 12px rgba(110, 0, 168, 0.2)';
    });
    
    input.addEventListener('blur', () => {
      input.style.transform = 'scale(1)';
      input.style.boxShadow = 'none';
    });
  });
  
  // Adicionar efeitos nos botões
  const buttons = document.querySelectorAll('button:not(.btn)');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = 'none';
    });
  });
});

// Sistema de validação aprimorado
class FormValidator {
  constructor() {
    this.rules = {
      cpf: {
        pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
        message: 'CPF deve estar no formato 000.000.000-00'
      },
      nascimento: {
        validate: (value) => {
          const date = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - date.getFullYear();
          return age >= 16 && age <= 100;
        },
        message: 'Data de nascimento deve ser válida (idade entre 16 e 100 anos)'
      }
    };
  }
  
  validateField(fieldName, value) {
    const rule = this.rules[fieldName];
    if (!rule) return { valid: true };
    
    if (rule.pattern) {
      return {
        valid: rule.pattern.test(value),
        message: rule.message
      };
    }
    
    if (rule.validate) {
      return {
        valid: rule.validate(value),
        message: rule.message
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
          message: validation.message
        });
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Inicializar validador
const formValidator = new FormValidator();

// Sistema de dicas contextuais
class ContextualTips {
  constructor() {
    this.tips = {
      'cpf': 'Digite apenas números. A formatação será aplicada automaticamente.',
      'nascimento': 'Utilize a mesma data informada durante a inscrição.',
      'uploadSection': 'Formatos aceitos: PDF, JPG, PNG, DOC, DOCX (máx. 5MB por arquivo)',
      'documentsTable': 'Acompanhe aqui o status de todos os documentos enviados'
    };
    
    this.init();
  }
  
  init() {
    Object.keys(this.tips).forEach(elementId => {
      const element = document.getElementById(elementId);
      if (element) {
        this.addTooltip(element, this.tips[elementId]);
      }
    });
  }
  
  addTooltip(element, text) {
    element.addEventListener('mouseenter', (e) => {
      this.showTooltip(e, text);
    });
    
    element.addEventListener('mouseleave', () => {
      this.hideTooltip();
    });
  }
  
  showTooltip(event, text) {
    const tooltip = document.createElement('div');
    tooltip.id = 'contextualTooltip';
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
    tooltip.style.left = (event.clientX - rect.width / 2) + 'px';
    tooltip.style.top = (event.clientY - rect.height - 10) + 'px';
  }
  
  hideTooltip() {
    const tooltip = document.getElementById('contextualTooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }
}

// Inicializar sistema de dicas
document.addEventListener('DOMContentLoaded', () => {
  new ContextualTips();
});

// Sistema de simulação de dados realistas
class DataSimulator {
  constructor() {
    this.candidateData = {
      names: [
        'FELIPE TOLEDO LOPES DA SILVA',
        'MARIA SANTOS OLIVEIRA',
        'JOÃO PEDRO COSTA',
        'ANA CAROLINA FERREIRA',
        'CARLOS EDUARDO SANTOS'
      ],
      cpfs: [
        '134.920.006-90',
        '987.654.321-00',
        '123.456.789-01',
        '456.789.123-45',
        '789.123.456-78'
      ],
      emails: [
        'lipelopes8@gmail.com',
        'maria.santos@email.com',
        'joao.pedro@gmail.com',
        'ana.carolina@hotmail.com',
        'carlos.eduardo@yahoo.com'
      ],
      courses: [
        'Graduação: Ciência da Computação - Ensino a Distância (EAD)',
        'Graduação: Administração - Ensino a Distância (EAD)',
        'Graduação: Pedagogia - Ensino a Distância (EAD)',
        'Graduação: Enfermagem - Ensino a Distância (EAD)',
        'Graduação: Direito - Ensino a Distância (EAD)'
      ]
    };
  }
  
  getRandomData() {
    const index = Math.floor(Math.random() * this.candidateData.names.length);
    return {
      name: this.candidateData.names[index],
      cpf: this.candidateData.cpfs[index],
      email: this.candidateData.emails[index],
      course: this.candidateData.courses[index]
    };
  }
  
  updateCandidateData() {
    const data = this.getRandomData();
    
    // Atualizar campos se existirem
    const nameField = document.getElementById('nomeField');
    const cpfField = document.getElementById('cpfField');
    const emailField = document.getElementById('emailField');
    const cursoField = document.getElementById('cursoField');
    const userNameSpan = document.getElementById('userName');
    
    if (nameField) nameField.value = data.name;
    if (cpfField) cpfField.value = data.cpf;
    if (emailField) emailField.value = data.email;
    if (cursoField) cursoField.value = data.course;
    if (userNameSpan) userNameSpan.textContent = data.name.split(' ')[0] + ' ' + data.name.split(' ')[1];
  }
}

// Sistema de notificações em tempo real
class RealTimeNotifications {
  constructor() {
    this.notifications = [
      {
        type: 'info',
        message: 'Novo documento disponível para download',
        delay: 5000
      },
      {
        type: 'success',
        message: 'Documento aprovado pela análise',
        delay: 10000
      },
      {
        type: 'warning',
        message: 'Prazo para envio de documentos: 5 dias',
        delay: 15000
      }
    ];
    
    this.init();
  }
  
  init() {
    // Simular notificações apenas se estiver na tela da central
    setTimeout(() => {
      if (!document.getElementById('centralScreen').classList.contains('hidden')) {
        this.startNotifications();
      }
    }, 3000);
  }
  
  startNotifications() {
    this.notifications.forEach((notification, index) => {
      setTimeout(() => {
        this.showNotification(notification);
      }, notification.delay + (index * 2000));
    });
  }
  
  showNotification(notification) {
    const notifDiv = document.createElement('div');
    notifDiv.style.cssText = `
      position: fixed;
      top: ${20 + (document.querySelectorAll('.notification').length * 70)}px;
      right: 20px;
      background: white;
      border-left: 4px solid #6e00a8;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      max-width: 300px;
      z-index: 1001;
      animation: slideInRight 0.3s ease;
    `;
    
    notifDiv.className = 'notification';
    notifDiv.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-bell" style="color: #6e00a8;"></i>
        <span style="flex: 1; font-size: 0.9em;">${notification.message}</span>
        <button onclick="this.closest('.notification').remove()" style="
          background: none;
          border: none;
          font-size: 1.2em;
          cursor: pointer;
          opacity: 0.7;
        ">&times;</button>
      </div>
    `;
    
    document.body.appendChild(notifDiv);
    
    // Auto-remover após 8 segundos
    setTimeout(() => {
      if (notifDiv.parentNode) {
        notifDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notifDiv.remove(), 300);
      }
    }, 8000);
  }
}

// Funcionalidades de acessibilidade
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
    document.addEventListener('keydown', (e) => {
      // ESC para fechar modais
      if (e.key === 'Escape') {
        const modal = document.querySelector('.modal');
        if (modal) {
          modal.style.display = 'none';
        }
      }
      
      // Enter para submeter formulários
      if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        const form = e.target.closest('form');
        if (form) {
          form.dispatchEvent(new Event('submit'));
        }
      }
    });
  }
  
  addScreenReaderSupport() {
    // Adicionar labels apropriados
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      if (!input.getAttribute('aria-label') && input.previousElementSibling) {
        const label = input.previousElementSibling.textContent;
        input.setAttribute('aria-label', label);
      }
    });
  }
  
  addHighContrastMode() {
    // Botão para modo alto contraste
    const contrastBtn = document.createElement('button');
    contrastBtn.innerHTML = '<i class="fas fa-adjust"></i>';
    contrastBtn.title = 'Alternar Alto Contraste';
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
    
    contrastBtn.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
    });
    
    document.body.appendChild(contrastBtn);
    
    // CSS para modo alto contraste
    const contrastStyles = document.createElement('style');
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
document.addEventListener('DOMContentLoaded', () => {
  new AccessibilityFeatures();
});

// Sistema de analytics simulado para acompanhar uso do tutorial
class TutorialAnalytics {
  constructor() {
    this.events = [];
    this.startTime = Date.now();
  }
  
  trackEvent(eventName, data = {}) {
    this.events.push({
      event: eventName,
      timestamp: Date.now(),
      data: data
    });
    
    console.log(`📊 Analytics: ${eventName}`, data);
  }
  
  trackTutorialCompletion(timeSpent, stepsCompleted) {
    this.trackEvent('tutorial_completed', {
      timeSpent: timeSpent,
      stepsCompleted: stepsCompleted,
      completionRate: (stepsCompleted / 5) * 100
    });
  }
  
  trackUserInteraction(element, action) {
    this.trackEvent('user_interaction', {
      element: element,
      action: action
    });
  }
  
  generateReport() {
    const totalTime = Date.now() - this.startTime;
    const report = {
      totalEvents: this.events.length,
      sessionDuration: totalTime,
      events: this.events
    };
    
    console.log('📈 Tutorial Analytics Report:', report);
    return report;
  }
}

// Inicializar analytics
const analytics = new TutorialAnalytics();

// Integração com o sistema de tutorial existente
document.addEventListener('DOMContentLoaded', () => {
  // Rastrear início do tutorial
  const originalStartTutorial = CentralCandidatoTutorialManager.prototype.startTutorial;
  CentralCandidatoTutorialManager.prototype.startTutorial = function() {
    analytics.trackEvent('tutorial_started');
    originalStartTutorial.call(this);
  };
  
  // Rastrear conclusão do tutorial
  const originalFinishTutorial = CentralCandidatoTutorialManager.prototype.finishTutorial;
  CentralCandidatoTutorialManager.prototype.finishTutorial = function() {
    analytics.trackTutorialCompletion(Date.now() - analytics.startTime, this.totalSteps);
    originalFinishTutorial.call(this);
  };
});

// Função para demonstrar funcionalidades avançadas
function demonstrateAdvancedFeatures() {
  console.log('🚀 Funcionalidades Avançadas Ativadas:');
  console.log('✅ Sistema de validação de formulários');
  console.log('✅ Dicas contextuais');
  console.log('✅ Simulação de dados realistas');
  console.log('✅ Notificações em tempo real');
  console.log('✅ Recursos de acessibilidade');
  console.log('✅ Analytics de tutorial');
  
  // Inicializar simulador de dados e notificações
  const dataSimulator = new DataSimulator();
  const notifications = new RealTimeNotifications();
  
  // Atualizar dados após login simulado
  setTimeout(() => {
    if (!document.getElementById('centralScreen').classList.contains('hidden')) {
      dataSimulator.updateCandidateData();
    }
  }, 2000);
}

// Executar demonstração
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(demonstrateAdvancedFeatures, 1000);
});