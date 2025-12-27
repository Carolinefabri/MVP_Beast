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

// RENDERIZA EXERCÍCIOS
function renderizarExercicios() {
  const treino = filtrarTreino(faseAtual, diaAtual);

  if (!treino) {
    listaExercicios.innerHTML = `
      <div class="vazio">
        <div class="vazio-icone">📋</div>
        <div class="vazio-texto">Nenhum treino cadastrado</div>
      </div>`;
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
      <div class="exercicio-imagem-container">
        <div class="exercicio-numero">${i + 1}</div>
        ${ex.urlImagem 
          ? `<img src="${ex.urlImagem}">` 
          : `<div class="placeholder-icon">🏋️</div>`}
      </div>
      <div class="exercicio-info">
        <div class="exercicio-nome">${ex.nome}</div>
        <div class="exercicio-series">📊 ${ex.repeticoes}</div>
        ${ex.observacoes 
          ? `<div class="exercicio-obs">💡 ${ex.observacoes}</div>` 
          : ''}
      </div>
    </div>
  `).join('');
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
  "Desenhe sistemas, não metas."
];

function mostrarFraseDiaria() {
  const elemento = document.getElementById("fraseDiaria");
  if (!elemento) return;

  // Usa o dia do ano para escolher a frase
  const hoje = new Date();
  const inicioAno = new Date(hoje.getFullYear(), 0, 0);
  const diff = hoje - inicioAno;
  const umDia = 1000 * 60 * 60 * 24;
  const diaDoAno = Math.floor(diff / umDia);

  const indice = diaDoAno % frases.length;
  elemento.textContent = frases[indice];
}

mostrarFraseDiaria();

