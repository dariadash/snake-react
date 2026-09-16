import './Instruction.css'

export const Instruction = () => {
  return (
    <>
      <h1>Snake Game</h1>
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
