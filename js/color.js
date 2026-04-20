/* ============================================
   Color — Three.js
   Demostración interactiva del producto
   componente a componente (Hadamard) entre
   el color de la luz y el color del objeto,
   visualizado con un cubo 3D en Three.js.
   ============================================ */

(function () {
    'use strict';

    var initialized = false;

    // Observar cuando el contenido expandible se hace visible
    var expandable = document.getElementById('expand-colores');
    if (!expandable) return;

    // Usar MutationObserver para detectar cuando se añade la clase "open"
    var observer = new MutationObserver(function () {
        if (expandable.classList.contains('open') && !initialized) {
            // Pequeño delay para que el CSS termine la transición y el canvas tenga tamaño
            setTimeout(initColorDemo, 350);
            initialized = true;
        }
    });
    observer.observe(expandable, { attributes: true, attributeFilter: ['class'] });

    function initColorDemo() {
        var canvas = document.getElementById('canvas-color');
        var container = document.getElementById('demo-color-container');
        if (!canvas || !container) return;

        // --- Three.js setup ---
        var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setClearColor(0x1a1a2e, 1);

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        camera.position.set(2.5, 2, 4);

        var controls = new THREE.OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.enableZoom = true;

        // --- Cubo principal con MeshBasicMaterial ---
        // Usamos BasicMaterial para que el color sea exactamente el resultado
        // del producto luz × objeto, sin iluminación de Three.js
        var cubeGeo = new THREE.BoxGeometry(2, 2, 2);
        var cubeMat = new THREE.MeshBasicMaterial({ color: 0xff804f });
        var cube = new THREE.Mesh(cubeGeo, cubeMat);
        scene.add(cube);

        // --- Grilla de referencia ---
        var gridHelper = new THREE.GridHelper(8, 8, 0x444466, 0x333355);
        gridHelper.position.y = -1.2;
        scene.add(gridHelper);

        // --- Indicador de la fuente de luz (esferita brillante) ---
        var lightIndicatorMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        var lightIndicator = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 16, 16),
            lightIndicatorMat
        );
        lightIndicator.position.set(3, 2.5, 3);
        scene.add(lightIndicator);

        // --- DOM helpers ---
        function el(id) { return document.getElementById(id); }
        function fmt(v) { return (v / 100).toFixed(2); }

        var sliderIds = {
            lightR: 'light-r', lightG: 'light-g', lightB: 'light-b',
            objR: 'obj-r', objG: 'obj-g', objB: 'obj-b'
        };

        // --- Update ---
        function update() {
            var lr = parseInt(el(sliderIds.lightR).value);
            var lg = parseInt(el(sliderIds.lightG).value);
            var lb = parseInt(el(sliderIds.lightB).value);
            var or_ = parseInt(el(sliderIds.objR).value);
            var og = parseInt(el(sliderIds.objG).value);
            var ob = parseInt(el(sliderIds.objB).value);

            // Normalizar a 0-1
            var lrN = lr / 100, lgN = lg / 100, lbN = lb / 100;
            var orN = or_ / 100, ogN = og / 100, obN = ob / 100;

            // Producto componente a componente
            var rr = lrN * orN;
            var rg = lgN * ogN;
            var rb = lbN * obN;

            // Actualizar labels
            el('light-r-val').textContent = fmt(lr);
            el('light-g-val').textContent = fmt(lg);
            el('light-b-val').textContent = fmt(lb);
            el('obj-r-val').textContent = fmt(or_);
            el('obj-g-val').textContent = fmt(og);
            el('obj-b-val').textContent = fmt(ob);

            // Actualizar vectores
            el('light-vec').textContent = 'vec3(' + fmt(lr) + ', ' + fmt(lg) + ', ' + fmt(lb) + ')';
            el('obj-vec').textContent = 'vec3(' + fmt(or_) + ', ' + fmt(og) + ', ' + fmt(ob) + ')';
            el('result-vec').textContent = 'vec3(' + rr.toFixed(2) + ', ' + rg.toFixed(2) + ', ' + rb.toFixed(2) + ')';

            // Actualizar breakdown
            el('calc-r').innerHTML = fmt(lr) + ' &times; ' + fmt(or_) + ' = <strong>' + rr.toFixed(2) + '</strong>';
            el('calc-g').innerHTML = fmt(lg) + ' &times; ' + fmt(og) + ' = <strong>' + rg.toFixed(2) + '</strong>';
            el('calc-b').innerHTML = fmt(lb) + ' &times; ' + fmt(ob) + ' = <strong>' + rb.toFixed(2) + '</strong>';

            // Aplicar color resultante al cubo 3D
            cubeMat.color.setRGB(rr, rg, rb);

            // Color del indicador de luz
            lightIndicatorMat.color.setRGB(lrN, lgN, lbN);
        }

        // --- Vincular sliders ---
        Object.values(sliderIds).forEach(function (id) {
            var slider = el(id);
            if (slider) {
                slider.addEventListener('input', update);
            }
        });

        // --- Presets ---
        document.querySelectorAll('.preset-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                el(sliderIds.lightR).value = this.dataset.lr;
                el(sliderIds.lightG).value = this.dataset.lg;
                el(sliderIds.lightB).value = this.dataset.lb;
                el(sliderIds.objR).value = this.dataset.or;
                el(sliderIds.objG).value = this.dataset.og;
                el(sliderIds.objB).value = this.dataset.ob;
                update();

                // Feedback visual
                document.querySelectorAll('.preset-btn').forEach(function (b) {
                    b.classList.remove('preset-active');
                });
                this.classList.add('preset-active');
            });
        });

        // --- Animación ---
        var time = 0;
        function animate() {
            requestAnimationFrame(animate);
            time += 0.008;

            // Rotación suave del cubo
            cube.rotation.y += 0.005;

            // La esfera de luz orbita alrededor
            lightIndicator.position.x = Math.cos(time) * 3.5;
            lightIndicator.position.z = Math.sin(time) * 3.5;
            lightIndicator.position.y = 2 + Math.sin(time * 0.7) * 0.5;

            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        // --- Resize ---
        var ro = new ResizeObserver(function () {
            var w = canvas.clientWidth;
            var h = canvas.clientHeight;
            if (w > 0 && h > 0) {
                renderer.setSize(w, h, false);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
            }
        });
        ro.observe(canvas);

        // Init
        update();
    }
})();
