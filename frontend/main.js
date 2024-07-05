// Seleciona as seções por seus IDs
const homeSection = document.getElementById("home");
const uploadSection = document.getElementById("upload");
const processedSection = document.getElementById("processed");

// Seleciona os botões por seus IDs
const homeBtn = document.getElementById("homeBtn");
const uploadBtn = document.getElementById("uploadBtn");
const processedBtn = document.getElementById("processedBtn");
const uploadBtnHome = document.getElementById("uploadBtnHome");
const processedBtnHome = document.getElementById("processedBtnHome");

// Função para redefinir as seções, ocultando todas e mostrando apenas a seção fornecida
function resetSections(section) {
  homeSection.classList.remove("isVisible");
  uploadSection.classList.remove("isVisible");
  processedSection.classList.remove("isVisible");

  // Mostra a seção fornecida
  section.classList.add("isVisible");

  // Reinicia a página atual ao mudar de seção
  currentPage = 1;

  // Se a seção fornecida for a seção de arquivos processados, chama a função renderTable
  if (section === processedSection) {
    renderTable();
  }
}

// Adiciona ouvintes de eventos aos botões para chamar a função resetSections com a seção correspondente
homeBtn.addEventListener("click", () => {
  resetSections(homeSection);
});

uploadBtn.addEventListener("click", () => {
  resetSections(uploadSection);
});

processedBtn.addEventListener("click", () => {
  resetSections(processedSection);
});

uploadBtnHome.addEventListener("click", () => {
  resetSections(uploadSection);
});

processedBtnHome.addEventListener("click", () => {
  resetSections(processedSection);
});

// Variáveis para armazenar dados e controlar a paginação
let tableContent = [];
let currentPage = 1;
const rowsPerPage = 2;
let fileData = [];

// Função para renderizar a tabela com paginação
function renderTable(page = 1) {
  // Limpa os conteúdos anteriores
  tableContent = [];

  // Faz uma requisição para obter os dados dos arquivos processados
  fetch("/list")
    .then((response) => response.json())
    .then((data) => {
      fileData = data; // Armazena os dados dos arquivos processados
      const tbody = document.getElementById("table-body"); // Obtém o elemento do corpo da tabela

      // Verifica se há arquivos processados
      if (fileData.length === 0) {
        tbody.innerHTML =
          '<tr><td colspan="5">Nenhum arquivo processado.</td></tr>';
        return;
      }

      // Calcula os índices de início e fim para paginação
      const startIndex = (page - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const paginatedData = fileData.slice(startIndex, endIndex); // Obtém os dados paginados

      // Itera sobre os dados paginados e cria as linhas da tabela
      for (let i = 0; i < paginatedData.length; i++) {
        let globalIndex = startIndex + i; // Calcula o índice global
        let row = `
          <tr>
            <td><a href="/download/${paginatedData[i].documento}" target="_blank">${paginatedData[i].documento}</a></td>
            <td>${formatCNPJs(paginatedData[i].cnpj)}</td>
            <td>${formatValoresMonetarios(paginatedData[i].valorMonetario)}</td>
            <td>${formatEmpresas(paginatedData[i].empresas)}</td>
            <td onclick="moreInfo(${globalIndex})" class="more-info">Mais informações</td>
            <td onclick="shareData(${globalIndex})" class="more-info">Compartilhar</td>
          </tr>
        `;
        tableContent.push(row); // Adiciona a linha à lista de conteúdos da tabela
      }

      tbody.innerHTML = tableContent.join(""); // Adiciona as linhas ao corpo da tabela

      // Atualiza os controles de paginação
      document.getElementById("pageNumber").textContent = page;
      document.getElementById("prevPage").disabled = page === 1;
      document.getElementById("nextPage").disabled = endIndex >= fileData.length;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      const tbody = document.getElementById("table-body");
      tbody.innerHTML = '<tr><td colspan="5">Erro ao carregar arquivos processados.</td></tr>';
    });
}


// Função para formatar os CNPJs para exibição na tabela
function formatCNPJs(cnpjs) {
  return cnpjs.map(cnpj => `${cnpj.valor}`).join("<br><br>");
}

// Função para formatar os valores monetários para exibição na tabela
function formatValoresMonetarios(valores) {
  return valores.map(valor => `${valor.valor}`).join("<br><br>");
}

// Função para formatar as empresas para exibição na tabela
function formatEmpresas(empresas) {
  return empresas.map(empresa => `${empresa.valor}`).join("<br><br>");
}

// Função para destacar texto em uma string
function highlightText(texto, inicio, fim) {
  return `${texto.substring(0, inicio)}<span class="highlight">${texto.substring(inicio, fim)}</span>${texto.substring(fim)}`;
}

// Função para compartilhar os dados de uma linha da tabela
function shareData(index) {
  // Obtém os dados diretamente do fileData, usando o índice global
  const dataToShare = fileData[index];
  
  // Formata os dados para compartilhar
  const shareText = `
    Documento: ${dataToShare.documento}
    CNPJs: ${dataToShare.cnpj.map(cnpj => cnpj.valor).join(", ")}
    Valores Monetários: ${dataToShare.valorMonetario.map(valor => valor.valor).join(", ")}
    Empresas: ${dataToShare.empresas.map(empresa => empresa.valor).join(", ")}
  `;
  
  navigator.clipboard
    .writeText(shareText)
    .then(() => {
      alert("Dados copiados para a área de transferência.");
    })
    .catch((err) => {
      console.error("Erro ao copiar dados:", err);
      alert("Erro ao copiar dados.");
    });
}

// Inicializa a tabela com a primeira página
renderTable(currentPage);

// Ouvintes de eventos para os botões de paginação
document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable(currentPage);
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  currentPage++;
  renderTable(currentPage);
});

// Função para exibir mais informações
function moreInfo(index) {
  const moreInfoRow = document.getElementById("more-info-row");
  const dados = fileData[index]; // Obter dados do arquivo correspondente ao índice atual
  moreInfoRow.innerHTML = `
    <tr>
      <td>${formatContextos(dados.cnpj)}</td>
      <td>${formatContextos(dados.valorMonetario)}</td>
      <td>${formatContextos(dados.empresas)}</td>
    </tr>
  `;
  openModal();
}


// Função para formatar os contextos para exibição no modal
function formatContextos(dados) {
  return dados.map(item => {
    const texto = item.contexto;
    const inicio = item.inicio;
    const fim = item.fim;
    const textoFormatado = highlightText(texto, inicio, fim);
    return textoFormatado;
  }).join("<br><br>");
}

// Seleciona o elemento de tela cheia (modal) pelo seu ID
const fullscreen = document.getElementById("fullscreen");

// Adiciona um ouvinte de evento para fechar o modal quando ele é clicado
fullscreen.addEventListener("click", () => {
  fullscreen.classList.remove("isVisible");
});

// Função para abrir o modal, adicionando a classe 'isVisible'
function openModal() {
  fullscreen.classList.add("isVisible");
}

document.getElementById('submitButton').addEventListener('click', () => {
  resetSections(processedSection);
})

document.getElementById('pdfUpload').addEventListener('change', function() {
  var submitButton = document.getElementById('submitButton');
  var fileNameDisplay = document.getElementById('fileName');

  if (this.files.length > 0) {
      var fileName = this.files[0].name;
      fileNameDisplay.textContent = fileName;
      submitButton.classList.remove('disabled-button');
      submitButton.classList.add('action-btn');
      submitButton.disabled = false;
  } else {
      fileNameDisplay.textContent = '';
      submitButton.classList.add('disabled-button');
      submitButton.classList.remove('action-btn');
      submitButton.disabled = true;
  }
});