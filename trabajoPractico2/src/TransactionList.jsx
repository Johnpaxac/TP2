import { TransactionItem } from "./TransactionItem"

export function TransactionList({ movimientos, formatearMoneda, onEdit, onDelete }) {
    return (
        <section className="movimientos-panel">
            <h3>Ultimos movimientos</h3>
            {movimientos.length === 0 ? (
                <p className="empty-state">Aun no registraste movimientos.</p>
            ) : (
                <ul>
                    {movimientos.map((movimiento) => (
                        <TransactionItem
                            key={movimiento.id}
                            movimiento={movimiento}
                            formatearMoneda={formatearMoneda}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </ul>
            )}
        </section>
    )
}
