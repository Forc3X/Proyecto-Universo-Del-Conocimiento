# ⚛️ Submódulo Numérix (`app/components/numerix/`)

Componentes gráficos e interactivos del **Nivel 1 de Numérix (Salto Cuántico)**, diseñados con estética de **Montaña Cuántica Futurista** (obsidiana, zafiro, cristal cian bioluminiscente `#00F0FF` y oro energético `#F59E0B`).

---

## 📄 Archivos del Módulo

### 1. `MapaMontañaCuantica.tsx`
Renderiza el escenario principal SVG (`viewBox="0 0 1000 700"`) y gestiona el recorrido lineal en **"S" ascendente de 20 cubos isométricos**:

- **`EscenarioMontaña` (Montaña Rocosa 3D en 4 Niveles):**
  - **Nivel 0 (Raíces Flotantes):** Estalactitas y raíces rocosas colgantes con sombra abisal y grietas de magma cian.
  - **Nivel 1 (Meseta Base — Casillas `01` a `06`):** Gran plataforma rocosa con acantilados facetados iluminados/sombreados y circuitos impresos.
  - **Nivel 2 (Terraza Media — Casillas `07` a `13`):** Escalón elevado con muros verticales de roca que sostienen la diagonal central.
  - **Nivel 3 (Cumbre Superior — Casillas `14` a `20`):** Meseta de gran altitud con pared frontal de acantilado, cascada de energía cuántica vertical y plataforma del Santuario en `20`.
  - **12 Racimos de Cristales Bioluminiscentes (`RacimoCristales`):** Distribuidos por las laderas en variantes ámbar-magenta, cian-azul y violeta-rosa.
- **`RielEnergiaCuantica`:** Conducto continuo de fibra óptica dorada y núcleo láser cian con partículas animadas que une las casillas `01` a `20`.
- **`CuboIsometrico` (Casillas `01` a `19`):**
  - **Normales:** Cristal traslúcido cian (`#00F0FF`) con operadores matemáticos (`+`, `−`, `×`, `÷`, `π`) grabados en sus dos caras laterales.
  - **Especiales (`04`, `08`, `12`, `16`):** Cristal ámbar/dorado (`#FBBF24`) que activa el Reactor de Propulsión (+2 casillas y 1 Núcleo Cuántico).
  - **Trampas (`06`, `10`, `14`):** Cristal coral/rojo láser (`#FF5757`) con símbolos `√` y `∑` que activa la Alerta de Impacto.
- **`PortalInicioCuantico` (detrás de Casilla `01`):** Arco monolítico de cristal cian con vórtice energético.
- **`SantuarioArmilar20` (Casilla `20`):** Pirámide escalonada de cuarzo con 4 pilares cristalinos y la **Gran Esfera Armilar Dorada** giratoria en la cima (ubicada en `x: 184, y: 248`, separada limpiamente del cubo `19` en `x: 272, y: 178`).
- **`JovenAstronauta`:** Token del jugador con casco espacial, visor azul estelar y mochila propulsora que salta paso a paso entre cubos.

---

### 2. `ModalesNumerix.tsx`
Contiene las **3 tarjetas modales tecnológicas** que se abren según el tipo de casilla donde aterriza el astronauta:

1. **`ModalReactorCuantico`:**
   - **Modo Secuencia (`modo="secuencia"`):** Muestra 4 cubos 3D traslúcidos flotando en arco para ordenarlos de menor a mayor en las 4 ranuras cian de la base circular del reactor.
   - **Modo Pregunta (`modo="pregunta"`):** Presenta retos de suma, resta, multiplicación y división de 1 y 2 cifras con 4 cubos de respuesta y botón lateral `PISTA CUÁNTICA`.
2. **`ModalAlertaImpacto`:**
   - Marco táctico atornillado con cabecera `⚠️ ALERTA DE IMPACTO - ESCUDO ANTIMATERIA`.
   - Muestra 3 asteroides cristalinos 3D con miras tácticas `[ ]` y un **Cañón Deflector Antimateria** que gira y dispara un rayo láser cian hacia el asteroide seleccionado (`PAR`, `IMPAR` o `MÚLTIPLO DE 5`).
3. **`ModalGuardianArmilar`:**
   - Duelo final en 3 fases (`SELLOS ARMILARES: FASE 1/3` a `3/3`) con la **Gran Esfera Armilar Dorada** en el centro, los 4 Núcleos Cuánticos (`+`, `−`, `×`, `÷`) activos arriba a la izquierda y el visor holográfico del problema a la izquierda.
   - Si el jugador falla una fase, el botón **`NUEVA PREGUNTA ↻`** solicita automáticamente una **pregunta distinta** del banco con sus opciones barajadas al azar.
