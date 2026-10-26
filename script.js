const salarioInput = document.getElementById("salario");
const diasInput = document.getElementById("dias");
const horasInput = document.getElementById("horas");
const valorHoraEl = document.getElementById("valorHora");

const nomeInput = document.getElementById("nomeProduto");
const precoInput = document.getElementById("precoProduto");
const botaoAdicionar = document.getElementById("adicionar");
const lista = document.getElementById("lista");
const vazio = document.getElementById("vazio");

const produtos = [];

function formatarDinheiro(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Hora de trabalho = salário / dias trabalhados / horas por dia
function calcularValorHora() {
  const salario = Number(salarioInput.value);
  const dias = Number(diasInput.value);
  const horas = Number(horasInput.value);

  if (salario <= 0 || dias <= 0 || horas <= 0) return 0;
  return salario / dias / horas;
}

function formatarTempo(totalHoras, horasPorDia) {
  const horas = Math.floor(totalHoras);
  const minutos = Math.round((totalHoras - horas) * 60);
  const textoHoras = minutos === 60
    ? `${horas + 1}h`
    : `${horas}h ${String(minutos).padStart(2, "0")}min`;

  const diasDeTrabalho = totalHoras / horasPorDia;
  return { textoHoras, diasDeTrabalho };
}

function renderizar() {
  const valorHora = calcularValorHora();
  const horasPorDia = Number(horasInput.value) || 1;
  const dias = Number(diasInput.value) || 1;

  valorHoraEl.textContent = formatarDinheiro(valorHora);

  lista.innerHTML = "";
  vazio.style.display = produtos.length ? "none" : "block";

  produtos.forEach((produto, indice) => {
    const item = document.createElement("li");
    item.className = "item";

    let tempoHtml = "<strong>—</strong><span>Preencha seu salário</span>";
    if (valorHora > 0) {
      const totalHoras = produto.preco / valorHora;
      const { textoHoras, diasDeTrabalho } = formatarTempo(totalHoras, horasPorDia);
      const meses = diasDeTrabalho / dias;
      tempoHtml = `
        <strong>${textoHoras}</strong>
        <span>${diasDeTrabalho.toFixed(1).replace(".", ",")} dias de trabalho
        · ${meses.toFixed(1).replace(".", ",")} meses</span>
      `;
    }

    item.innerHTML = `
      <div>
        <div class="item-nome"></div>
        <div class="item-preco">${formatarDinheiro(produto.preco)}</div>
      </div>
      <div class="item-tempo">${tempoHtml}</div>
      <button type="button" class="remover" title="Remover">✕</button>
    `;
    item.querySelector(".item-nome").textContent = produto.nome;
    item.querySelector(".remover").addEventListener("click", () => {
      produtos.splice(indice, 1);
      renderizar();
    });

    lista.appendChild(item);
  });
}

function adicionarProduto() {
  const nome = nomeInput.value.trim() || "Produto";
  const preco = Number(precoInput.value);

  if (preco <= 0) {
    precoInput.focus();
    return;
  }

  produtos.push({ nome, preco });
  nomeInput.value = "";
  precoInput.value = "";
  nomeInput.focus();
  renderizar();
}

botaoAdicionar.addEventListener("click", adicionarProduto);
[nomeInput, precoInput].forEach((input) =>
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") adicionarProduto();
  })
);
[salarioInput, diasInput, horasInput].forEach((input) =>
  input.addEventListener("input", renderizar)
);

renderizar();
