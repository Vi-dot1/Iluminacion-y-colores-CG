// ========================
// Demostracion de fuentes de luz
// ========================
(function initLightsDemo() {
    const canvas = document.getElementById('canvas-lights');
    const container = document.getElementById('demo-lights-container');

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x0f0f23, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(5, 5, 7);

    const controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 0.5, 0);

    // Objetos de la escena
    // Suelo
    const floorGeo = new THREE.PlaneGeometry(14, 14);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x444466, roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Esfera
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 32, 32),
        new THREE.MeshStandardMaterial({ color: 0xff6688, roughness: 0.3, metalness: 0.2 })
    );
    sphere.position.set(-2, 0.8, 0);
    sphere.castShadow = true;
    scene.add(sphere);

    // Cubo
    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.2, 1.2),
        new THREE.MeshStandardMaterial({ color: 0x66aaff, roughness: 0.4, metalness: 0.1 })
    );
    cube.position.set(0, 0.6, 0);
    cube.castShadow = true;
    scene.add(cube);

    // Toroide
    const torus = new THREE.Mesh(
        new THREE.TorusGeometry(0.6, 0.25, 32, 64),
        new THREE.MeshStandardMaterial({ color: 0x88ff88, roughness: 0.3, metalness: 0.3 })
    );
    torus.position.set(2, 0.8, 0);
    torus.castShadow = true;
    scene.add(torus);

    // Cilindro
    const cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 1.6, 32),
        new THREE.MeshStandardMaterial({ color: 0xffcc44, roughness: 0.5, metalness: 0.1 })
    );
    cylinder.position.set(0, 0.8, -2);
    cylinder.castShadow = true;
    scene.add(cylinder);

    // Ambient suave
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.08);
    scene.add(ambientLight);

    // Luces
    let currentLight = null;
    let currentHelper = null;

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(3, 5, 2);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 20;
    dirLight.shadow.camera.left = -5;
    dirLight.shadow.camera.right = 5;
    dirLight.shadow.camera.top = 5;
    dirLight.shadow.camera.bottom = -5;

    const pointLightSrc = new THREE.PointLight(0xffffff, 1, 20);
    pointLightSrc.position.set(3, 5, 2);
    pointLightSrc.castShadow = true;
    pointLightSrc.shadow.mapSize.width = 1024;
    pointLightSrc.shadow.mapSize.height = 1024;

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(3, 5, 2);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.3;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.target.position.set(0, 0, 0);


    const sliderIntensity = document.getElementById('slider-intensity');

    function setLight(type) {
        // Remover luz y helper previos
        if (currentLight) scene.remove(currentLight);
        if (currentHelper) scene.remove(currentHelper);
        if (spotLight.target.parent) scene.remove(spotLight.target);

        const directionalNote = document.getElementById('directional-note');

        switch (type) {
            case 'directional':
                currentLight = dirLight;
                scene.add(dirLight);
                currentHelper = new THREE.DirectionalLightHelper(dirLight, 1);
                scene.add(currentHelper);
                // La intensidad se puede cambiar, pero es constante en toda la escena
                sliderIntensity.disabled = false;
                directionalNote.style.display = 'block';
                updateCodeSnippet('directional');
                break;
            case 'point':
                currentLight = pointLightSrc;
                scene.add(pointLightSrc);
                currentHelper = new THREE.PointLightHelper(pointLightSrc, 0.5);
                scene.add(currentHelper);
                sliderIntensity.disabled = false;
                directionalNote.style.display = 'none';
                updateCodeSnippet('point');
                break;
            case 'spot':
                currentLight = spotLight;
                scene.add(spotLight);
                scene.add(spotLight.target);
                currentHelper = new THREE.SpotLightHelper(spotLight);
                scene.add(currentHelper);
                sliderIntensity.disabled = false;
                directionalNote.style.display = 'none';
                updateCodeSnippet('spot');
                break;
        }
    }

    // Snippets de código
    function updateCodeSnippet(type) {
        const codeEl = document.getElementById('code-light-source');
        const snippets = {
            directional: `// Three.js — Luz Direccional
const light = new THREE.DirectionalLight(0xffffff, 1.0);
light.position.set(3, 5, 2);
light.castShadow = true;

// Configurar sombras
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 20;

scene.add(light);`,
            point: `// Three.js — Luz Puntual
const light = new THREE.PointLight(0xffffff, 1.0, 20);
light.position.set(3, 5, 2);
light.castShadow = true;

// El tercer parámetro (20) es la distancia
// máxima de alcance de la luz
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;

scene.add(light);`,
            spot: `// Three.js — Reflector (Spotlight)
const light = new THREE.SpotLight(0xffffff, 1.0);
light.position.set(3, 5, 2);
light.angle = Math.PI / 6;  // Ancho del cono
light.penumbra = 0.3;       // Suavidad del borde
light.castShadow = true;

// Apuntar hacia un objetivo
light.target.position.set(0, 0, 0);
scene.add(light.target);

scene.add(light);`
        };
        codeEl.textContent = snippets[type] || '';
    }

    // Inicializar con luz direccional
    setLight('directional');

    // Botones de tipo
    const btns = document.querySelectorAll('.demo-btn[data-light]');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            setLight(btn.dataset.light);
        });
    });

    // Controles
    const intensityVal = document.getElementById('intensity-value');
    sliderIntensity.addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        intensityVal.textContent = v.toFixed(1);
        if (currentLight) currentLight.intensity = v;
    });

    const sliderPosX = document.getElementById('slider-pos-x');
    const posXVal = document.getElementById('pos-x-value');
    sliderPosX.addEventListener('input', (e) => {
        posXVal.textContent = e.target.value;
        if (currentLight) currentLight.position.x = parseFloat(e.target.value);
        if (currentHelper && currentHelper.update) currentHelper.update();
    });

    const sliderPosY = document.getElementById('slider-pos-y');
    const posYVal = document.getElementById('pos-y-value');
    sliderPosY.addEventListener('input', (e) => {
        posYVal.textContent = e.target.value;
        if (currentLight) currentLight.position.y = parseFloat(e.target.value);
        if (currentHelper && currentHelper.update) currentHelper.update();
    });

    // Animación
    function animateLights() {
        requestAnimationFrame(animateLights);
        // Rotar objetos suavemente
        cube.rotation.y += 0.005;
        torus.rotation.x += 0.008;
        torus.rotation.y += 0.005;
        controls.update();
        if (currentHelper && currentHelper.update) currentHelper.update();
        renderer.render(scene, camera);
    }
    animateLights();

    // Resize
    const ro2 = new ResizeObserver(() => {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    });
    ro2.observe(canvas);
})();
