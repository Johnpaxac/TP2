export function TransactionItem({ movimiento, formatearMoneda, onEdit, onDelete }) {
    return (
        <li className={movimiento.tipo === 'ingreso' ? 'ingreso' : 'gasto'}>
            <div>
                <p>{movimiento.descripcion}</p>
                <span>{movimiento.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}</span>
            </div>
            <div className="movimiento-acciones">
                <strong>{formatearMoneda(movimiento.monto)}</strong>
                <button type="button" onClick={() => onEdit(movimiento)}>
                    Editar
                </button>
                <button type="button" onClick={() => onDelete(movimiento.id)}>
                    Borrar
                </button>
            </div>
        </li>
    )
}
