window.addEventListener("DOMContentLoaded", () => {
    mostrarTrabalhadores();
});

const formatarMoeda = (valor) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const listarTrabalhadores = (pessoas) =>
    pessoas
        .map(
            ({ nomeCompleto, idade, sexo, salario }) =>
                `${nomeCompleto} | ${idade} anos | ${sexo} | ${formatarMoeda(salario)}`
        )
        .join(" | ");

const maioresDeIdade = (pessoas) =>
    pessoas
        .filter(({ idade }) => idade >= 18)
        .map(({ nomeCompleto, idade }) => `${nomeCompleto} (${idade} anos)`);

const nomesMasculinos = (pessoas) =>
    pessoas.filter(({ sexo }) => sexo === "M").map(({ nomeCompleto }) => nomeCompleto);

const pessoaMaiorSalario = (pessoas) =>
    pessoas.reduce((maior, atual) => (atual.salario > maior.salario ? atual : maior));

const existeMulherAcimaDeCincoMil = (pessoas) =>
    pessoas.some(({ sexo, salario }) => sexo === "F" && salario > 5000);

const mediaSalarialPorSexo = (pessoas, sexo) => {
    const pessoasDoSexo = pessoas.filter((pessoa) => pessoa.sexo === sexo);

    if (pessoasDoSexo.length === 0) {
        return "Nao ha registros";
    }

    const totalSalarios = pessoasDoSexo.reduce(
        (acumulador, pessoa) => acumulador + pessoa.salario,
        0
    );

    return formatarMoeda(totalSalarios / pessoasDoSexo.length);
};

const mostrarTrabalhadores = () => {
    const maiorSalario = pessoaMaiorSalario(trabalhadores);

    document.getElementById("lista-trabalhadores").textContent = listarTrabalhadores(trabalhadores);
    document.getElementById("maiores-idade").textContent = maioresDeIdade(trabalhadores).join(", ");
    document.getElementById("nomes-homens").textContent = nomesMasculinos(trabalhadores).join(", ");
    document.getElementById("maior-salario").textContent =
        `${maiorSalario.nomeCompleto}, ${maiorSalario.idade} anos, ${maiorSalario.sexo}, ${formatarMoeda(maiorSalario.salario)}`;
    document.getElementById("mulher-acima-5000").textContent =
        existeMulherAcimaDeCincoMil(trabalhadores) ? "Sim" : "Nao";
    document.getElementById("media-homens").textContent = mediaSalarialPorSexo(trabalhadores, "M");
    document.getElementById("media-mulheres").textContent = mediaSalarialPorSexo(trabalhadores, "F");
};
