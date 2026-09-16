import './App.css'

function App() {
  return (
    <>
      <h1>Snake React</h1>
      <div className="instruction-wrapper">
        <span className="instruction-trigger">инструкция</span>
        <div className="card">
          <p>
            Управление: WASD или стрелки. Ешь еду (+100 очков),
            не ешь себя. Набери нужный счёт до конца таймера,
            чтобы пройти уровень.
          </p>
        </div>
      </div>
    </>
  )
}

export default App
