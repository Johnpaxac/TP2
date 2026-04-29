function BalanceSummary({ balance, ingresos, gastos, limiteGastos, excedeLimite, onLimiteChange, formatearMoneda }) {
    return (
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
                    step="1"
                    placeholder="Ej: 200000"
                    value={limiteGastos}
                    onChange={onLimiteChange}
                />
                {excedeLimite && <p className="alerta-texto">Atención: superaste tu límite de gastos mensual.</p>}
            </div>
        </section>
    )
}