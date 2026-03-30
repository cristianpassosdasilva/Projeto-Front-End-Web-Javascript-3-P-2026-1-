window.addEventListener("DOMContentLoaded", () => {
  // Inicia a aplicação apenas quando o HTML já foi carregado.
  iniciarAplicacao();
});

const CHAVE_API = "6d1be00c6f8c0c9343598c8a18b0aa7a";
const URL_BASE_API = "https://api.themoviedb.org/3";
const URL_BASE_IMAGEM = "https://image.tmdb.org/t/p/w500";
const URL_POSTER_FALLBACK =
  "https://placehold.co/500x750/202033/d0d0dc?text=Sem+imagem";
const LIMITE_FILMES = 10;
const IDIOMA = "pt-BR";

const selectGenero = document.getElementById("genreSelect");
const mensagemStatus = document.getElementById("statusMessage");
const gradeFilmes = document.getElementById("moviesGrid");
let mapaGeneros = new Map();

// Carrega os dados iniciais e configura o evento de filtro por gênero.
async function iniciarAplicacao() {
  if (!CHAVE_API) {
    mostrarStatus(
      "Insira sua API key no arquivo script.js para carregar os filmes.",
      "error"
    );
    return;
  }

  try {
    mostrarStatus("Carregando gêneros...");
    mapaGeneros = await buscarGeneros();
    preencherSelectGeneros(mapaGeneros);

    selectGenero.addEventListener("change", aoTrocarGenero);
    await carregarFilmes();
  } catch (error) {
    console.error("Erro ao carregar filmes:", error);
    mostrarStatus(
      "Não foi possível carregar os filmes. Verifique sua API key e tente novamente.",
      "error"
    );
  }
}

// Faz chamada HTTP para qualquer endpoint da API já com chave e idioma.
async function buscarJson(endpoint) {
  const separador = endpoint.includes("?") ? "&" : "?";
  const url = `${URL_BASE_API}${endpoint}${separador}api_key=${CHAVE_API}&language=${IDIOMA}`;

  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error(`Falha na API TMDB: ${resposta.status}`);
  }

  return resposta.json();
}

// Busca os gêneros e cria um mapa no formato id -> nome.
async function buscarGeneros() {
  const dados = await buscarJson("/genre/movie/list");
  const mapa = new Map();

  dados.genres.forEach((genero) => {
    mapa.set(genero.id, genero.name);
  });

  return mapa;
}

// Retorna os filmes populares limitados ao total definido.
async function buscarFilmesPopulares() {
  const dados = await buscarJson("/movie/popular?page=1");
  return dados.results.slice(0, LIMITE_FILMES);
}

// Retorna filmes populares de um gênero específico.
async function buscarFilmesPorGenero(idGenero) {
  const dados = await buscarJson(
    `/discover/movie?sort_by=popularity.desc&include_adult=false&page=1&with_genres=${encodeURIComponent(
      idGenero
    )}`
  );

  return dados.results.slice(0, LIMITE_FILMES);
}

// Monta o select de gêneros em ordem alfabética.
function preencherSelectGeneros(generos) {
  const generosOrdenados = [...generos.entries()].sort((a, b) =>
    a[1].localeCompare(b[1], "pt-BR")
  );

  const fragmento = document.createDocumentFragment();

  generosOrdenados.forEach(([idGenero, nomeGenero]) => {
    const option = document.createElement("option");
    option.value = String(idGenero);
    option.textContent = nomeGenero;
    fragmento.appendChild(option);
  });

  selectGenero.appendChild(fragmento);
}

// Captura o gênero selecionado no select e recarrega os filmes.
async function aoTrocarGenero(event) {
  const idGeneroSelecionado = event.target.value;
  await carregarFilmes(idGeneroSelecionado);
}

// Decide entre populares ou filtrados e atualiza status da interface.
async function carregarFilmes(idGenero = "") {
  const temFiltroGenero = Boolean(idGenero);
  mostrarStatus(
    temFiltroGenero
      ? "Buscando filmes por gênero..."
      : "Carregando filmes populares..."
  );

  const filmes = temFiltroGenero
    ? await buscarFilmesPorGenero(idGenero)
    : await buscarFilmesPopulares();

  mostrarFilmes(filmes, mapaGeneros);

  const complemento = temFiltroGenero
    ? `do gênero ${mapaGeneros.get(Number(idGenero)) || "selecionado"}`
    : "mais populares";

  mostrarStatus(`Exibindo ${filmes.length} filmes ${complemento}.`, "success");
}

// Renderiza os cards de filmes (frente com poster e verso com detalhes).
function mostrarFilmes(filmes, generos) {
  gradeFilmes.innerHTML = "";

  if (filmes.length === 0) {
    mostrarStatus("Nenhum filme encontrado para esse filtro.", "error");
    return;
  }

  filmes.forEach((filme) => {
    const cardFilme = document.createElement("article");
    cardFilme.className = "cartao-filme";
    const tituloSeguro = escaparHtml(filme.title || "Filme sem título");

    const nomesGeneros = filme.genre_ids
      .map((idGenero) => generos.get(idGenero))
      .filter(Boolean)
      .join(", ");

    const sinopseSegura = escaparHtml(
      filme.overview || "Sinopse indisponível."
    );

    const lancamentoFormatado = filme.release_date
      ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
          new Date(`${filme.release_date}T00:00:00`)
        )
      : "Data indisponível";

    const totalAvaliacoes = Number.isFinite(filme.vote_count)
      ? new Intl.NumberFormat("pt-BR").format(filme.vote_count)
      : "N/A";

    const avaliacaoFormatada = Number.isFinite(filme.vote_average)
      ? filme.vote_average.toFixed(1)
      : "N/A";

    const urlPoster = filme.poster_path
      ? `${URL_BASE_IMAGEM}${filme.poster_path}`
      : URL_POSTER_FALLBACK;

    cardFilme.innerHTML = `
      <div class="cartao-filme__flip">
        <div class="cartao-filme__frente">
          <img src="${urlPoster}" alt="Poster do filme ${tituloSeguro}" loading="lazy" />
        </div>
        <div class="cartao-filme__verso">
          <h3>${tituloSeguro}</h3>
          <p><strong>Gênero:</strong> ${escaparHtml(
            nomesGeneros || "Não informado"
          )}</p>
          <p><strong>Lançamento:</strong> ${lancamentoFormatado}</p>
          <p><strong>Avaliações:</strong> ${totalAvaliacoes}</p>
          <p><strong>Avaliação:</strong> ⭐ ${avaliacaoFormatada}</p>
          <p class="sinopse">${sinopseSegura}</p>
        </div>
      </div>
    `;

    gradeFilmes.appendChild(cardFilme);
  });
}

// Exibe mensagens de carregamento, sucesso e erro na área de status.
function mostrarStatus(mensagem, tipo = "default") {
  mensagemStatus.textContent = mensagem;
  mensagemStatus.className = "mensagem-status";

  if (tipo === "error") {
    mensagemStatus.classList.add("mensagem-status--erro");
  }

  if (tipo === "success") {
    mensagemStatus.classList.add("mensagem-status--sucesso");
  }
}

// Escapa caracteres especiais antes de montar HTML dinâmico.
function escaparHtml(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
