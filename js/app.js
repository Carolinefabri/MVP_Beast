let faseAtual = 1;
let diaAtual = 1;
let treinos = [];

// ELEMENTOS
const selectFase = document.getElementById('selectFase');
const selectDia = document.getElementById('selectDia');
const listaExercicios = document.getElementById('listaExercicios');
const totalExercicios = document.getElementById('totalExercicios');
const treinoHeader = document.getElementById('treinoHeader');
const treinoTitulo = document.getElementById('treinoTitulo');
const treinoSubtitulo = document.getElementById('treinoSubtitulo');
const resumoTreino = document.getElementById('resumoTreino');
const resumoExercicios = document.getElementById('resumoExercicios');
const resumoSeries = document.getElementById('resumoSeries');
const checkboxConcluido = document.getElementById('checkboxConcluido');
const treinoConcluido = document.getElementById('treinoConcluido');

// CARREGAR JSON
fetch('dados/treinos.json')
  .then(res => res.json())
  .then(data => {
    treinos = data;
    renderizarExercicios();
  });

// FILTRA TREINO
function filtrarTreino(fase, dia) {
  return treinos.find(t => t.fase === fase && t.dia === dia);
}

// CALCULA TOTAL DE SÉRIES
function calcularSeries(exercicios) {
  return exercicios.reduce((total, exercicio) => {
    return total + parseInt(exercicio.repeticoes);
  }, 0);
}

// CRIAR MODAL DE IMAGEM
function criarModalImagem() {
  const modal = document.createElement('div');
  modal.id = 'modalImagem';
  modal.style.cssText = `
    display: none;
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.95);
    justify-content: center;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
  `;

  const conteudo = document.createElement('div');
  conteudo.style.cssText = `
    position: relative;
    max-width: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  const img = document.createElement('img');
  img.id = 'imagemModal';
  img.style.cssText = `
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 8px;
  `;

  const btnFechar = document.createElement('button');
  btnFechar.innerHTML = '✕';
  btnFechar.style.cssText = `
    position: absolute;
    top: -40px;
    right: 0;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    font-size: 30px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s;
  `;
  btnFechar.onclick = fecharModal;

  conteudo.appendChild(btnFechar);
  conteudo.appendChild(img);
  modal.appendChild(conteudo);
  document.body.appendChild(modal);

  // Fechar ao clicar fora da imagem
  modal.onclick = (e) => {
    if (e.target === modal) {
      fecharModal();
    }
  };
}

// ABRIR MODAL COM IMAGEM
function abrirImagem(urlImagem) {
  const modal = document.getElementById('modalImagem');
  const img = document.getElementById('imagemModal');
  
  if (!modal) {
    criarModalImagem();
    abrirImagem(urlImagem);
    return;
  }

  img.src = urlImagem;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// FECHAR MODAL
function fecharModal() {
  const modal = document.getElementById('modalImagem');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// RENDERIZA EXERCÍCIOS
function renderizarExercicios() {
  const treino = filtrarTreino(faseAtual, diaAtual);

  if (!treino) {
    listaExercicios.innerHTML = `
      <div class="vazio">
        <div class="vazio-icone">📋</div>
        <div class="vazio-texto">Nenhum treino cadastrado</div>
      </div>`;
    checkboxConcluido.style.display = 'none';
    return;
  }

  treinoHeader.style.display = 'block';
  treinoTitulo.textContent = treino.nome;
  treinoSubtitulo.textContent = `${treino.exercicios.length} exercícios`;

  totalExercicios.textContent = `${treino.exercicios.length} exercícios`;

  resumoTreino.style.display = 'block';
  resumoExercicios.textContent = treino.exercicios.length;
  resumoSeries.textContent = calcularSeries(treino.exercicios);

  listaExercicios.innerHTML = treino.exercicios.map((ex, i) => `
    <div class="exercicio-card">
      <div class="exercicio-imagem-container ${ex.urlImagem ? 'clicavel' : ''}" 
           ${ex.urlImagem ? `onclick="abrirImagem('${ex.urlImagem}')"` : ''}>
        <div class="exercicio-numero">${i + 1}</div>
        ${ex.urlImagem 
          ? `<img src="${ex.urlImagem}">
             <div class="zoom-hint">🔍</div>` 
          : `<div class="placeholder-icon">🏋️</div>`}
      </div>
      <div class="exercicio-info">
        <div class="exercicio-nome">${ex.nome}</div>
        <div class="exercicio-series">📊 ${ex.repeticoes}</div>
        ${ex.observacoes 
          ? `<div class="exercicio-obs">💡 ${ex.observacoes}</div>` 
          : ''}
      </div>
      <div class="exercicio-checkbox">
        <input type="checkbox" id="ex_${faseAtual}_${diaAtual}_${i}" class="exercicio-check" onchange="salvarCheckExercicio(${faseAtual}, ${diaAtual}, ${i})">
        <label for="ex_${faseAtual}_${diaAtual}_${i}" class="check-label"></label>
      </div>
    </div>
  `).join('');

  // Carregar estados salvos dos checkboxes dos exercícios
  carregarChecksExercicios();
  
  // Esconder checkbox geral do treino
  checkboxConcluido.style.display = 'none';
}

// EVENTOS
selectFase.addEventListener('change', e => {
  faseAtual = parseInt(e.target.value);
  renderizarExercicios();
});

selectDia.addEventListener('change', e => {
  diaAtual = parseInt(e.target.value);
  renderizarExercicios();
});

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    fecharModal();
  }
});

// FRASES DIÁRIAS
const frases = [
  "Pequenos hábitos. Grandes resultados.",
  "1% melhor todos os dias.",
  "O sucesso é um sistema, não um objetivo.",
  "Você se torna o que repete.",
  "A consistência vence a motivação.",
  "Mude quem você é, não só o que faz.",
  "Cada ação é um voto para quem você quer ser.",
  "Hábitos moldam identidades.",
  "O que você faz diariamente define você.",
  "Seja a pessoa que não falha.",
  "Nunca falhe duas vezes.",
  "O progresso invisível é progresso.",
  "A disciplina constrói liberdade.",
  "O tempo amplia hábitos.",
  "Resultados seguem rotinas.",
  "Faça o hábito fácil.",
  "O ambiente vence a força de vontade.",
  "Prepare o caminho para vencer.",
  "O que é fácil se repete.",
  "Desenhe sistemas, não metas.",
  "Faster than yesterday."
];

function mostrarFraseDiaria() {
  const elemento = document.getElementById("fraseDiaria");
  if (!elemento) return;

  const hoje = new Date();
  const inicioAno = new Date(hoje.getFullYear(), 0, 0);
  const diff = hoje - inicioAno;
  const umDia = 1000 * 60 * 60 * 24;
  const diaDoAno = Math.floor(diff / umDia);

  const indice = diaDoAno % frases.length;
  elemento.textContent = frases[indice];
}

mostrarFraseDiaria();

// GERENCIAR CHECKBOXES DOS EXERCÍCIOS
function obterChaveExercicio(fase, dia, index) {
  const hoje = new Date().toISOString().split('T')[0];
  return `exercicio_${fase}_${dia}_${index}_${hoje}`;
}

function salvarCheckExercicio(fase, dia, index) {
  const checkbox = document.getElementById(`ex_${fase}_${dia}_${index}`);
  const chave = obterChaveExercicio(fase, dia, index);
  localStorage.setItem(chave, checkbox.checked);
}

function carregarChecksExercicios() {
  const treino = filtrarTreino(faseAtual, diaAtual);
  if (!treino) return;
  
  treino.exercicios.forEach((ex, i) => {
    const checkbox = document.getElementById(`ex_${faseAtual}_${diaAtual}_${i}`);
    if (checkbox) {
      const chave = obterChaveExercicio(faseAtual, diaAtual, i);
      const estadoSalvo = localStorage.getItem(chave);
      checkbox.checked = estadoSalvo === 'true';
    }
  });
  
  // Limpar checkboxes de dias anteriores
  limparChecksAntigos();
}

function limparChecksAntigos() {
  const hoje = new Date().toISOString().split('T')[0];
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('exercicio_')) {
      const dataCheck = key.split('_').pop();
      if (dataCheck !== hoje) {
        localStorage.removeItem(key);
      }
    }
  });
}

// Remover funções antigas do checkbox geral (não são mais necessárias)
treinoConcluido.removeEventListener('change', salvarEstadoCheckbox);