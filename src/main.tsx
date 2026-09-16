import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Instruction } from './Instruction.tsx'
import { Snake } from './Snake.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Instruction />
    <Snake />
  </StrictMode>,
)
