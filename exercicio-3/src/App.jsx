import './App.css'

const cartoes = [
  { id: 1, titulo: 'Título da caixa', texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores exercitationem, corrupti facilis ut sint tempora quo, eius et, hic debitis quos quia illo sunt corporis accusantium vitae quidem tempore nihil.' },
  { id: 2, titulo: 'Título da caixa', texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores exercitationem, corrupti facilis ut sint tempora quo, eius et, hic debitis quos quia illo sunt corporis accusantium vitae quidem tempore nihil.' },
  { id: 3, titulo: 'Título da caixa', texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores exercitationem, corrupti facilis ut sint tempora quo, eius et, hic debitis quos quia illo sunt corporis accusantium vitae quidem tempore nihil.' },
  { id: 4, titulo: 'Título da caixa', texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores exercitationem, corrupti facilis ut sint tempora quo, eius et, hic debitis quos quia illo sunt corporis accusantium vitae quidem tempore nihil.' },
  { id: 5, titulo: 'Título da caixa', texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores exercitationem, corrupti facilis ut sint tempora quo, eius et, hic debitis quos quia illo sunt corporis accusantium vitae quidem tempore nihil.' },
  { id: 6, titulo: 'Título da caixa', texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores exercitationem, corrupti facilis ut sint tempora quo, eius et, hic debitis quos quia illo sunt corporis accusantium vitae quidem tempore nihil.' },
  { id: 7, titulo: 'Título da caixa', texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores exercitationem, corrupti facilis ut sint tempora quo, eius et, hic debitis quos quia illo sunt corporis accusantium vitae quidem tempore nihil.' },
  { id: 8, titulo: 'Título da caixa', texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores exercitationem, corrupti facilis ut sint tempora quo, eius et, hic debitis quos quia illo sunt corporis accusantium vitae quidem tempore nihil.' },
]

function Cartao({ titulo, texto }) {
  return (
    <div className="cartao">
      <h2>{titulo}</h2>
      <p>{texto}</p>
    </div>
  )
}

function App() {
  return (
    <div className="container">
      {cartoes.map((cartao) => (
        <Cartao key={cartao.id} titulo={cartao.titulo} texto={cartao.texto} />
      ))}
    </div>
  )
}

export default App
