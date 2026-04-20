// ========================
// boton de expandir/cerrar
// ========================
function toggleExpand(id, boton) {
    const elemento = document.getElementById(id);
    const estaAbierto = elemento.classList.toggle('open');
    boton.textContent = estaAbierto ? '← Cerrar' : 'Seguir leyendo →';
}


// ========================
// Tarjetas de tipos de luz:
// click para fijar/soltar
// ========================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.light-type-card').forEach(tarjeta => {
        tarjeta.addEventListener('click', () => {
            const estabaFija = tarjeta.classList.contains('fijo');

            // Soltar todas las demás
            document.querySelectorAll('.light-type-card.fijo').forEach(t => {
                t.classList.remove('fijo');
            });

            // Si no estaba fija, fijarla
            if (!estabaFija) {
                tarjeta.classList.add('fijo');
            }
        });
    });
});
