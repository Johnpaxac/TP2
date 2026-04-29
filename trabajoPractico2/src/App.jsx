import { useMemo, useState } from 'react'
import './App.css'

import {BalanceSummary} from './BalanceSummary'
import {TransactionForm} from './TransactionForm'
import {TransactionList} from './TransactionList'

function Header({ mostrarFormulario, onToggleFormulario }) {
    return (
        <header className="encabezado">
            <div>
                <p className="kicker">Control Financiero</p>
                <h1>Gestor de Gastos Personales</h1>
            </div>
            <button type="button" className="toggle-form" onClick={onToggleFormulario} aria-expanded={mostrarFormulario}>
                {mostrarFormulario ? 'Cerrar' : 'Agregar'}
            </button>
        </header>
    )
}

function App() {
    const [descripcion, setDescripcion] = useState('')
    const [monto, setMonto] = useState('')
    const [tipo, setTipo] = useState('ingreso')
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [movimientos, setMovimientos] = useState([])
    const [limiteGastos, setLimiteGastos] = useState('')
    const [editandoId, setEditandoId] = useState(null)
    const { balance, ingresos, gastos } = useMemo(() => {
        const resumen = movimientos.reduce((acc, mov) => {
            if (mov.tipo === 'ingreso') {
                acc.ingresos += mov.monto
                acc.balance += mov.monto
            } else {
                acc.gastos += mov.monto
                acc.balance -= mov.monto
            }
            return acc
        }, { balance: 0, ingresos: 0, gastos: 0 })
        return resumen
    }, [movimientos])
    const limiteNumerico = Number(limiteGastos)
    const excedeLimite = limiteNumerico > 0 && gastos > limiteNumerico
    const formatearMoneda = (valor) =>
        valor.toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
        })
    const agregarMovimiento = (evento) => {
        evento.preventDefault()
        const valorNumerico = Number(monto)
        const descripcionLimpia = descripcion.trim()
        if (!descripcionLimpia || Number.isNaN(valorNumerico) || valorNumerico <= 0) {
            return
        }
        if (editandoId) {
            setMovimientos((previo) =>
                previo.map((movimiento) =>
                    movimiento.id === editandoId
                        ? { ...movimiento, descripcion: descripcionLimpia, monto: valorNumerico, tipo }
                        : movimiento,
                ),
            )
        } else {
            const nuevoMovimiento = {
                id: crypto.randomUUID(),
                descripcion: descripcionLimpia,
                monto: valorNumerico,
                tipo,
            }
            setMovimientos((previo) => [nuevoMovimiento, ...previo])
        }
        setDescripcion('')
        setMonto('')
        setTipo('ingreso')
        setEditandoId(null)
        setMostrarFormulario(false)
    }
    const iniciarEdicion = (movimiento) => {
        setDescripcion(movimiento.descripcion)
        setMonto(String(movimiento.monto))
        setTipo(movimiento.tipo)
        setEditandoId(movimiento.id)
        setMostrarFormulario(true)
    }
    const eliminarMovimiento = (id) => {
        setMovimientos((previo) => previo.filter((movimiento) => movimiento.id !== id))
        if (editandoId === id) {
            setDescripcion('')
            setMonto('')
            setTipo('ingreso')
            setEditandoId(null)
            setMostrarFormulario(false)
        }
    }
    const cancelarEdicion = () => {
        setDescripcion('')
        setMonto('')
        setTipo('ingreso')
        setEditandoId(null)
    }

    return (
        <div className="app-shell">
            <Header mostrarFormulario={mostrarFormulario} onToggleFormulario={() => setMostrarFormulario((abierto) => !abierto)} />
            <BalanceSummary
                balance={balance}
                ingresos={ingresos}
                gastos={gastos}
                limiteGastos={limiteGastos}
                excedeLimite={excedeLimite}
                onLimiteChange={(evento) => setLimiteGastos(evento.target.value)}
                formatearMoneda={formatearMoneda}
            />
            {mostrarFormulario && (
                <TransactionForm
                    descripcion={descripcion}
                    monto={monto}
                    tipo={tipo}
                    editandoId={editandoId}
                    onSubmit={agregarMovimiento}
                    onDescripcionChange={(evento) => setDescripcion(evento.target.value)}
                    onMontoChange={(evento) => setMonto(evento.target.value)}
                    onTipoChange={(evento) => setTipo(evento.target.value)}
                    onCancelEdit={cancelarEdicion}
                />
            )}
            <TransactionList movimientos={movimientos} formatearMoneda={formatearMoneda} onEdit={iniciarEdicion} onDelete={eliminarMovimiento} />
        </div>
    )
}
export default App