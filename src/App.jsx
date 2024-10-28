import { useState } from 'react'
import './App.css'
import Formulario from './components/Formulario/Formulario'
import TableContentData from './components/TableContentData/TableContentData'
import FormularioEncuesta from './components/FormularioEncuesta/FormularioEncuesta'

function App() {

  return (
    <div className='main'>
      <TableContentData />
      {/* <FormularioEncuesta /> */}
    </div>
  )
}

export default App
