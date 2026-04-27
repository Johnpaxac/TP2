import { useMemo, useState } from 'react'
import './App.css'

function App() {
    const [descripcion, setDescripcion] = useState('')
    const [monto, setMonto] = useState('')
    const [tipo, setTipo] = useState('ingreso')
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [movimientos, setMovimientos] = useState([])
    const [limiteGastos, setLimiteGastos] = useState('')
    const [editandoId, setEditandoId] = useState(null)

    const { balance, ingresos, gastos } = useMemo(() => {
        const resumen = movimientos.reduce(
            (acc, mov) => {
                if (mov.tipo === 'ingreso') {
                    acc.ingresos += mov.monto
                    acc.balance += mov.monto
                } else {
                    acc.gastos += mov.monto
                    acc.balance -= mov.monto
                }
                return acc
            },
            { balance: 0, ingresos: 0, gastos: 0 },
        )

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
            <header className="encabezado">
                <div>
                    <p className="kicker">Control Financiero</p>
                    <h1>Gestor de Gastos Personales</h1>
                </div>

                <button
                    type="button"
                    className="toggle-form"
                    onClick={() => setMostrarFormulario((abierto) => !abierto)}
                    aria-expanded={mostrarFormulario}
                >
                    {mostrarFormulario ? 'Cerrar' : 'Agregar'}
                </button>
            </header>

            <section className={`balance-card ${excedeLimite ? 'alerta' : ''}`} aria-live="polite">
                <p className="balance-label">Balance actual</p>
                <h2>{formatearMoneda(balance)}</h2>

                <div className="resumen-grid">
                    <article>
                        <span>Ingresos</span>
                        <strong>{formatearMoneda(ingresos)}</strong>
                    </article>

                    <article>
                        <span>Gastos</span>
                        <strong>{formatearMoneda(gastos)}</strong>
                    </article>
                </div>

                <div className="limite-box">
                    <label htmlFor="limiteGastos">Límite de gastos mensual</label>
                    <input
                        id="limiteGastos"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Ej: 200000"
                        value={limiteGastos}
                        onChange={(evento) => setLimiteGastos(evento.target.value)}
                    />
                    {excedeLimite && (
                        <p className="alerta-texto">Atención: superaste tu límite de gastos mensual.</p>
                    )}
                </div>
            </section>

            {mostrarFormulario && (
                <section className="panel-formulario">
                    <form onSubmit={agregarMovimiento}>
                        <label htmlFor="descripcion">Descripcion</label>
                        <input
                            id="descripcion"
                            type="text"
                            placeholder="Ej: Supermercado"
                            value={descripcion}
                            onChange={(evento) => setDescripcion(evento.target.value)}
                            required
                        />

                        <label htmlFor="monto">Monto</label>
                        <input
                            id="monto"
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="Ej: 12500"
                            value={monto}
                            onChange={(evento) => setMonto(evento.target.value)}
                            required
                        />

                        <label htmlFor="tipo">Tipo</label>
                        <select id="tipo" value={tipo} onChange={(evento) => setTipo(evento.target.value)}>
                            <option value="ingreso">Ingreso</option>
                            <option value="gasto">Gasto</option>
                        </select>

                        <button type="submit" className="btn-guardar">
                            {editandoId ? 'Guardar cambios' : 'Agregar movimiento'}
                        </button>
                        {editandoId && (
                            <button type="button" className="btn-secundario" onClick={cancelarEdicion}>
                                Cancelar edición
                            </button>
                        )}
                    </form>
                </section>
            )}

            <section className="movimientos-panel">
                <h3>Ultimos movimientos</h3>

                {movimientos.length === 0 ? (
                    <p className="empty-state">Aun no registraste movimientos.</p>
                ) : (
                    <ul>
                        {movimientos.map((mov) => (
                            <li key={mov.id} className={mov.tipo === 'ingreso' ? 'ingreso' : 'gasto'}>
                                <div>
                                    <p>{mov.descripcion}</p>
                                    <span>{mov.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}</span>
                                </div>
                                <div className="movimiento-acciones">
                                    <strong>{formatearMoneda(mov.monto)}</strong>
                                    <button type="button" onClick={() => iniciarEdicion(mov)}>
                                        Editar
                                    </button>
                                    <button type="button" onClick={() => eliminarMovimiento(mov.id)}>
                                        Borrar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    )
}

export default App


