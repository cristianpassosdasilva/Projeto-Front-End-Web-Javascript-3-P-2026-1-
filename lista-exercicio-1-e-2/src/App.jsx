import './App.css'

function CaixaAcessoInformacao() {
  return (
    <div className="caixa-acesso">
      <h2>Acesso à Informação</h2>
      <p>Veja dados de transparência e governança</p>
    </div>
  )
}

function CaixaMenuDestaque() {
  return (
    <div className="caixa-menu">
      <span>PLANO DE</span>
      <span>DESENVOLVIMENTO</span>
      <span>INSTITUCIONAL</span>
    </div>
  )
}

function Exercicio({ title, children }) {
  return (
    <section className="exercicio">
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function App() {
  return (
    <main className="pagina">
      <Exercicio title="Exercício 1">
        <CaixaAcessoInformacao />
      </Exercicio>

      <Exercicio title="Exercício 2">
        <CaixaAcessoInformacao />
        <div className="grade-menu">
          <CaixaMenuDestaque />
        </div>
      </Exercicio>
    </main>
  )
}

export default App
