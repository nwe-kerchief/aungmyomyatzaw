    let selectedLanguage = 'en';

    // Cursor
    const customCursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');

    document.addEventListener('mousemove', (e) => {
      customCursor.style.left = e.clientX + 'px';
      customCursor.style.top = e.clientY + 'px';
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
    });

    // Language Selection
    function selectLanguage(lang) {
      selectedLanguage = lang;
      document.getElementById('lang-selector').style.display = 'none';
      document.getElementById('loading-progress').style.display = 'block';
      
      const loadingText = document.getElementById('loading-text');
      loadingText.textContent = lang === 'en' ? 'Loading...' : 'တင်နေသည်...';
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if(progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
          }, 500);
        }
        document.getElementById('progress-bar').style.width = progress + '%';
      }, 150);
    }

    // 3D Loading Background
    const loadingCanvas = document.getElementById('loading-canvas');
    const loadingScene = new THREE.Scene();
    const loadingCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const loadingRenderer = new THREE.WebGLRenderer({ canvas: loadingCanvas, alpha: true, antialias: false });
    loadingRenderer.setSize(window.innerWidth, window.innerHeight);
    loadingRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const gridHelper = new THREE.GridHelper(20, 20, 0x00ff00, 0x00ff00);
    gridHelper.material.opacity = 0.5;
    gridHelper.material.transparent = true;
    loadingScene.add(gridHelper);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 50;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x00ff00,
      transparent: true,
      opacity: 0.6
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    loadingScene.add(particlesMesh);

    loadingCamera.position.set(0, 10, 10);
    loadingCamera.lookAt(0, 0, 0);

    function animateLoading() {
      if(!document.getElementById('loading-screen').classList.contains('hidden')) {
        requestAnimationFrame(animateLoading);
        gridHelper.rotation.y += 0.005;
        particlesMesh.rotation.y += 0.001;
        loadingRenderer.render(loadingScene, loadingCamera);
      }
    }
    animateLoading();

    // Burmese text
    const burmeseLayer = document.getElementById('burmese-layer');
    const burmeseWords = ['မင်္ဂလာပါ', 'ကျေးဇူးတင်ပါတယ်', 'AMMZ', 'Developer', 'Myanmar'];
    
    for(let i = 0; i < 10; i++) {
      const word = document.createElement('div');
      word.className = 'burmese-word';
      word.textContent = burmeseWords[i % burmeseWords.length];
      word.style.top = (i * 10) + '%';
      word.style.animationDelay = (i * 2) + 's';
      burmeseLayer.appendChild(word);
    }

    // 3D Background
    const canvas = document.getElementById('canvas-3d');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const cubes = [];
    const cubeCount = window.innerWidth < 768 ? 15 : 30;
    
    for(let i = 0; i < cubeCount; i++) {
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      const cube = new THREE.Mesh(geometry, material);
      
      cube.position.x = (Math.random() - 0.5) * 50;
      cube.position.y = (Math.random() - 0.5) * 50;
      cube.position.z = (Math.random() - 0.5) * 50;
      
      scene.add(cube);
      cubes.push(cube);
    }

    camera.position.z = 20;

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
      requestAnimationFrame(animate);
      
      cubes.forEach(cube => {
        cube.rotation.x += 0.002;
        cube.rotation.y += 0.002;
      });
      
      camera.position.x = mouseX * 5;
      camera.position.y = mouseY * 5;
      camera.lookAt(0, 0, 0);
      
      renderer.render(scene, camera);
    }
    animate();

    // Navigation
    let currentX = 0;
    let currentY = 0;

    const container = document.getElementById('sections-container');
    const navArrows = document.querySelectorAll('.nav-arrow[data-direction]');

    function updatePosition() {
      container.style.transform = `translate(${-currentX * 100}vw, ${-currentY * 100}vh)`;
    }

    function navigate(direction) {
      if (direction === 'up') {
        if (currentY === 0 && currentX === 0) {
          currentY = -1;
          currentX = 0;
        } else if (currentY === -1) {
          currentY = 0;
          currentX = 0;
        } else if (currentY === 1) {
          currentY = 0;
          currentX = 0;
        } else if (currentY === 0 && (currentX === -1 || currentX === 1)) {
          currentY = 0;
          currentX = 0;
        }
      } 
      else if (direction === 'down') {
        if (currentY === 0 && currentX === 0) {
          currentY = 1;
          currentX = 0;
        } else if (currentY === -1) {
          currentY = 0;
          currentX = 0;
        } else if (currentY === 1) {
          currentY = 0;
          currentX = 0;
        } else if (currentY === 0 && (currentX === -1 || currentX === 1)) {
          currentY = 0;
          currentX = 0;
        }
      } 
      else if (direction === 'left') {
        if (currentY === 0) {
          if (currentX === -1) {
            currentX = 0;
          } else if (currentX === 0) {
            currentX = -1;
          } else if (currentX === 1) {
            currentX = 0;
          }
        } else if (currentY === -1) {
          currentY = 0;
          currentX = 0;
        } else if (currentY === 1) {
          if (currentX === 0) {
            currentX = 3;
          } else if (currentX === 1) {
            currentX = 0;
          } else if (currentX === 2) {
            currentX = 1;
          } else if (currentX === 3) {
            currentX = 2;
          }
        }
      } 
      else if (direction === 'right') {
        if (currentY === 0) {
          if (currentX === -1) {
            currentX = 0;
          } else if (currentX === 0) {
            currentX = 1;
          } else if (currentX === 1) {
            currentX = 0;
          }
        } else if (currentY === -1) {
          currentY = 0;
          currentX = 0;
        } else if (currentY === 1) {
          if (currentX === 0) {
            currentX = 1;
          } else if (currentX === 1) {
            currentX = 2;
          } else if (currentX === 2) {
            currentX = 3;
          } else if (currentX === 3) {
            currentY = 0;
            currentX = 0;
          }
        }
      }

      updatePosition();
    }

    navArrows.forEach(arrow => {
      arrow.addEventListener('click', () => {
        navigate(arrow.getAttribute('data-direction'));
      });
    });

    let scrollTimeout;
    window.addEventListener('wheel', (e) => {
      e.preventDefault();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          navigate(e.deltaY > 0 ? 'down' : 'up');
        } else {
          navigate(e.deltaX > 0 ? 'right' : 'left');
        }
      }, 100);
    }, { passive: false });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigate('up');
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigate('down');
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigate('left');
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigate('right');
      }
    });

    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;
      
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 50) navigate('right');
        else if (diffX < -50) navigate('left');
      } else {
        if (diffY > 50) navigate('down');
        else if (diffY < -50) navigate('up');
      }
    });

    function showAbout() {
      document.getElementById('about-content').style.display = 'block';
      document.getElementById('experience-content').style.display = 'none';
    }

    function showExperience() {
      document.getElementById('about-content').style.display = 'none';
      document.getElementById('experience-content').style.display = 'block';
    }

    updatePosition();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      loadingCamera.aspect = window.innerWidth / window.innerHeight;
      loadingCamera.updateProjectionMatrix();
      loadingRenderer.setSize(window.innerWidth, window.innerHeight);
    });