// ========================
// Demostracion de iluminacion
// ========================
(function initPhongDemo() {
    const canvas = document.getElementById('canvas-phong');
    const container = document.getElementById('demo-phong-container');

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x1a1a2e, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    const controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = true;

    // Esfera con material Phong
    const sphereGeo = new THREE.SphereGeometry(1.5, 64, 64);
    const sphereMat = new THREE.MeshPhongMaterial({
        color: 0x4488ff,
        shininess: 30,
        specular: 0xffffff,
        emissive: 0x000000
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // Pequeña esfera de referencia (suelo)
    const floorGeo = new THREE.PlaneGeometry(8, 8);
    const floorMat = new THREE.MeshPhongMaterial({ color: 0x333355, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.6;
    scene.add(floor);

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 50);
    pointLight.position.set(3, 3, 3);
    scene.add(pointLight);

    // Indicador de posición de luz
    const lightIndicator = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    lightIndicator.position.copy(pointLight.position);
    scene.add(lightIndicator);

    // Controles UI
    const toggleAmbient = document.getElementById('toggle-ambient');
    const toggleDiffuse = document.getElementById('toggle-diffuse');
    const toggleSpecular = document.getElementById('toggle-specular');
    const sliderShininess = document.getElementById('slider-shininess');
    const shininessVal = document.getElementById('shininess-value');

    const baseColor = 0x4488ff;
    let showAmbient = true, showDiffuse = true, showSpecular = true;

    toggleAmbient.addEventListener('change', (e) => {
        showAmbient = e.target.checked;
        ambientLight.intensity = showAmbient ? 0.3 : 0;
    });

    toggleDiffuse.addEventListener('change', (e) => {
        showDiffuse = e.target.checked;
        updatePhongMaterial();
    });

    toggleSpecular.addEventListener('change', (e) => {
        showSpecular = e.target.checked;
        updatePhongMaterial();
    });

    sliderShininess.addEventListener('input', (e) => {
        shininessVal.textContent = e.target.value;
        sphereMat.shininess = parseFloat(e.target.value);
    });

    function updatePhongMaterial() {
        if (!showDiffuse && !showSpecular) {
            pointLight.intensity = 0;
            sphereMat.specular.set(0x000000);
        } else if (!showDiffuse) {
            pointLight.intensity = 1;
            sphereMat.specular.set(0xffffff);
            sphereMat.color.set(0x000000);
        } else if (!showSpecular) {
            pointLight.intensity = 1;
            sphereMat.specular.set(0x000000);
            sphereMat.color.set(baseColor);
        } else {
            pointLight.intensity = 1;
            sphereMat.specular.set(0xffffff);
            sphereMat.color.set(baseColor);
        }
    }

    // Animar la posición de la luz
    let time = 0;
    function animatePhong() {
        requestAnimationFrame(animatePhong);
        time += 0.01;
        pointLight.position.x = Math.cos(time) * 4;
        pointLight.position.z = Math.sin(time) * 4;
        pointLight.position.y = 2 + Math.sin(time * 0.5);
        lightIndicator.position.copy(pointLight.position);
        controls.update();
        renderer.render(scene, camera);
    }
    animatePhong();

    // Resize
    const ro = new ResizeObserver(() => {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    });
    ro.observe(canvas);
})();
