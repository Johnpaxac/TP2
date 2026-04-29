export function TransactionForm({
    descripcion,
    monto,
    tipo,
    editandoId,
    onSubmit,
    onDescripcionChange,
    onMontoChange,
    onTipoChange,
    onCancelEdit,
}) {
    return (
        <section className="panel-formulario">
            <form onSubmit={onSubmit}>
                <label htmlFor="descripcion">Descripcion</label>
                <input id="descripcion" type="text" placeholder="Ej: Supermercado" value={descripcion} onChange={onDescripcionChange} required />
                <label htmlFor="monto">Monto</label>
                <input id="monto" type="number" min="0.01" step="0.01" placeholder="Ej: 12500" value={monto} onChange={onMontoChange} required />
                <label htmlFor="tipo">Tipo</label>
                <select id="tipo" value={tipo} onChange={onTipoChange}>
                    <option value="ingreso">Ingreso</option>
                    <option value="gasto">Gasto</option>
                </select>
                <button type="submit" className="btn-guardar">
                    {editandoId ? 'Guardar cambios' : 'Agregar movimiento'}
                </button>
                {editandoId && (
                    <button type="button" className="btn-secundario" onClick={onCancelEdit}>
                        Cancelar edición
                    </button>
                )}
            </form>
        </section>
    )
}
