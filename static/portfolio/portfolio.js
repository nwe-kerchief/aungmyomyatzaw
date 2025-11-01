let selectedLanguage = 'en';

// Cursor with Snow Trail
const customCursor = document.querySelector('.custom-cursor');
const cursorDot = document.querySelector('.cursor-dot');
let lastX = 0, lastY = 0, snowParticles = [];

document.addEventListener('mousemove', (e) => {
  customCursor.style.left = e.clientX + 'px';
  customCursor.style.top = e.clientY + 'px';
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top = e.clientY + 'px';

  const distance = Math.sqrt(Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2));
  if (distance > 10) {
    createSnowParticle(e.clientX, e.clientY);
    lastX = e.clientX;
    lastY = e.clientY;
  }
});

function showProjectSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  
  const parentCodeBlock = section.closest('.code-block');
  const allSections = parentCodeBlock.querySelectorAll('.project-content-section');
  
  allSections.forEach(s => s.style.display = 'none');
  section.style.display = 'block';
}




function createSnowParticle(x, y) {
  const particle = document.createElement('div');
  particle.className = 'snow-particle';
  particle.style.left = x + 'px';
  particle.style.top = y + 'px';
  particle.style.width = (Math.random() * 3 + 2) + 'px';
  particle.style.height = particle.style.width;
  document.body.appendChild(particle);
  snowParticles.push(particle);
  setTimeout(() => {
    particle.remove();
    snowParticles = snowParticles.filter(p => p !== particle);
  }, 800);
  if (snowParticles.length > 30) {
    snowParticles.shift().remove();
  }
}

// Language Selection
function selectLanguage(lang) {
  selectedLanguage = lang;
  document.getElementById('lang-selector').style.display = 'none';
  document.getElementById('loading-progress').style.display = 'block';
  document.getElementById('loading-text').textContent = lang === 'en' ? 'Loading...' : 'တင်နေသည်...';
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 20;
    if(progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => document.getElementById('loading-screen').classList.add('hidden'), 500);
    }
    document.getElementById('progress-bar').style.width = progress + '%';
  }, 150);
}

// ============================================
// NEW 3D LOADING EFFECT - PARTICLES + WAVES
// ============================================
const loadingCanvas = document.getElementById('loading-canvas');
const loadingScene = new THREE.Scene();
const loadingCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const loadingRenderer = new THREE.WebGLRenderer({ canvas: loadingCanvas, alpha: true, antialias: false });
loadingRenderer.setSize(window.innerWidth, window.innerHeight);
loadingRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

// Particle system
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 800;
const posArray = new Float32Array(particlesCount * 3);
const velocities = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i += 3) {
  posArray[i] = (Math.random() - 0.5) * 60;
  posArray[i + 1] = (Math.random() - 0.5) * 60;
  posArray[i + 2] = (Math.random() - 0.5) * 60;
  velocities[i] = (Math.random() - 0.5) * 0.02;
  velocities[i + 1] = (Math.random() - 0.5) * 0.02;
  velocities[i + 2] = (Math.random() - 0.5) * 0.02;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  color: 0x00ff00,
  transparent: true,
  opacity: 0.7,
  blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
loadingScene.add(particlesMesh);

// Connection lines
const linesGeometry = new THREE.BufferGeometry();
const linesMaterial = new THREE.LineBasicMaterial({
  color: 0x00ff00,
  transparent: true,
  opacity: 0.3
});
const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
loadingScene.add(linesMesh);

loadingCamera.position.z = 30;

function animateLoading() {
  if(!document.getElementById('loading-screen').classList.contains('hidden')) {
    requestAnimationFrame(animateLoading);
    
    const positions = particlesGeometry.attributes.position.array;
    for(let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];
      
      if(Math.abs(positions[i]) > 30) velocities[i] *= -1;
      if(Math.abs(positions[i + 1]) > 30) velocities[i + 1] *= -1;
      if(Math.abs(positions[i + 2]) > 30) velocities[i + 2] *= -1;
    }
    particlesGeometry.attributes.position.needsUpdate = true;
    
    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.0005;
    
    loadingRenderer.render(loadingScene, loadingCamera);
  }
}
animateLoading();

// ============================================
// MATRIX RAIN BACKGROUND
// ============================================
const matrixCanvas = document.getElementById('matrix-canvas');
const matrixCtx = matrixCanvas.getContext('2d');
matrixCanvas.width = window.innerWidth;
matrixCanvas.height = window.innerHeight;

const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
const fontSize = 14;
const columns = matrixCanvas.width / fontSize;
const drops = [];

for(let i = 0; i < columns; i++) {
  drops[i] = Math.random() * -100;
}

function drawMatrix() {
  matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  
  matrixCtx.fillStyle = '#0f0';
  matrixCtx.font = fontSize + 'px monospace';
  
  for(let i = 0; i < drops.length; i++) {
    const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
    matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize);
    
    if(drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(drawMatrix, 50);

// ============================================
// MAIN 3D BACKGROUND - PARTICLES + NETWORK
// ============================================
const canvas = document.getElementById('canvas-3d');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

// Main particle system
const mainParticlesGeometry = new THREE.BufferGeometry();
const mainParticlesCount = window.innerWidth < 768 ? 300 : 600;
const mainPosArray = new Float32Array(mainParticlesCount * 3);
const mainVelocities = new Float32Array(mainParticlesCount * 3);

for(let i = 0; i < mainParticlesCount * 3; i += 3) {
  mainPosArray[i] = (Math.random() - 0.5) * 80;
  mainPosArray[i + 1] = (Math.random() - 0.5) * 80;
  mainPosArray[i + 2] = (Math.random() - 0.5) * 80;
  mainVelocities[i] = (Math.random() - 0.5) * 0.015;
  mainVelocities[i + 1] = (Math.random() - 0.5) * 0.015;
  mainVelocities[i + 2] = (Math.random() - 0.5) * 0.015;
}

mainParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(mainPosArray, 3));
const mainParticlesMaterial = new THREE.PointsMaterial({
  size: 0.08,
  color: 0x00ff00,
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending
});

const mainParticlesMesh = new THREE.Points(mainParticlesGeometry, mainParticlesMaterial);
scene.add(mainParticlesMesh);

// Network connections
const maxDistance = 15;
function updateConnections() {
  const positions = mainParticlesGeometry.attributes.position.array;
  const linePositions = [];
  
  for(let i = 0; i < mainParticlesCount; i++) {
    for(let j = i + 1; j < mainParticlesCount; j++) {
      const i3 = i * 3;
      const j3 = j * 3;
      
      const dx = positions[i3] - positions[j3];
      const dy = positions[i3 + 1] - positions[j3 + 1];
      const dz = positions[i3 + 2] - positions[j3 + 2];
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      if(distance < maxDistance) {
        linePositions.push(positions[i3], positions[i3 + 1], positions[i3 + 2]);
        linePositions.push(positions[j3], positions[j3 + 1], positions[j3 + 2]);
      }
    }
  }
  
  const linesGeo = new THREE.BufferGeometry();
  linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  
  const linesMat = new THREE.LineBasicMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0.15
  });
  
  scene.remove(scene.children.find(child => child.type === 'LineSegments'));
  const lines = new THREE.LineSegments(linesGeo, linesMat);
  scene.add(lines);
}

camera.position.z = 40;

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

let frameCount = 0;
function animate() {
  requestAnimationFrame(animate);
  
  const positions = mainParticlesGeometry.attributes.position.array;
  for(let i = 0; i < mainParticlesCount * 3; i += 3) {
    positions[i] += mainVelocities[i];
    positions[i + 1] += mainVelocities[i + 1];
    positions[i + 2] += mainVelocities[i + 2];
    
    if(Math.abs(positions[i]) > 40) mainVelocities[i] *= -1;
    if(Math.abs(positions[i + 1]) > 40) mainVelocities[i + 1] *= -1;
    if(Math.abs(positions[i + 2]) > 40) mainVelocities[i + 2] *= -1;
  }
  mainParticlesGeometry.attributes.position.needsUpdate = true;
  
  // Update connections every 5 frames for performance
  frameCount++;
  if(frameCount % 5 === 0) {
    updateConnections();
  }
  
  mainParticlesMesh.rotation.y += 0.0005;
  
  camera.position.x = mouseX * 3;
  camera.position.y = mouseY * 3;
  camera.lookAt(0, 0, 0);
  
  renderer.render(scene, camera);
}
animate();

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

// Navigation
let currentX = 0, currentY = 0, gameKeyboardActive = false;
const container = document.getElementById('sections-container');
const navArrows = document.querySelectorAll('.nav-arrow[data-direction]');

function updatePosition() {
  container.style.transform = `translate(${-currentX * 100}vw, ${-currentY * 100}vh)`;
}

function navigate(direction) {
  if (gameKeyboardActive) return;
  
  // ONLY block UP/DOWN on project 1 and 2 (x=1,2)
  // Block completely - no navigation at all
  if ((currentX === 1 || currentX === 2) && currentY === 1) {
    if (direction === 'up' || direction === 'down') {
      return; // Don't navigate
    }
  }
  
  // All other logic NORMAL - unchanged
  if (direction === 'up') {
    if (currentY === 0 && currentX === 0) { currentY = -1; currentX = 0; }
    else if (currentY === -1 || currentY === 1) { currentY = 0; currentX = 0; }
    else if (currentY === 0 && (currentX === -1 || currentX === 1)) { currentY = 0; currentX = 0; }
  } 
  else if (direction === 'down') {
    if (currentY === 0 && currentX === 0) { currentY = 1; currentX = 0; }
    else if (currentY === -1 || currentY === 1) { currentY = 0; currentX = 0; }
    else if (currentY === 0 && (currentX === -1 || currentX === 1)) { currentY = 0; currentX = 0; }
  } 
  else if (direction === 'left') {
    if (currentY === 0) {
      if (currentX === -1) currentX = 0;
      else if (currentX === 0) currentX = -1;
      else if (currentX === 1) currentX = 0;
    } else if (currentY === -1) { currentY = 0; currentX = 0; }
    else if (currentY === 1) {
      if (currentX === 0) currentX = -1;
      else if (currentX === -1) currentX = -2;
      else if (currentX === -2) currentX = -3;
      else if (currentX === -3) currentX = 0;
      else if (currentX === 1) currentX = 0;
      else if (currentX === 2) currentX = 1;
      else if (currentX === 3) currentX = 2;
    }
  } 
  else if (direction === 'right') {
    if (currentY === 0) {
      if (currentX === -1) currentX = 0;
      else if (currentX === 0) currentX = 1;
      else if (currentX === 1) currentX = 0;
    } else if (currentY === -1) { currentY = 0; currentX = 0; }
    else if (currentY === 1) {
      if (currentX === 0) currentX = 1;
      else if (currentX === 1) currentX = 2;
      else if (currentX === 2) currentX = 3;
      else if (currentX === 3) currentX = 0;
      else if (currentX === -1) currentX = 0;
      else if (currentX === -2) currentX = -1;
      else if (currentX === -3) currentX = -2;
    }
  }

  updatePosition();
  updateMinimap(currentX, currentY);
  setTimeout(() => {
    if (currentX === -1 && currentY === 1) initSnakeGame();
    if (currentX === -2 && currentY === 1) initTicTacToe();
    if (currentX === -3 && currentY === 1) initMemoryGame();
  }, 100);
}



navArrows.forEach(arrow => {
  arrow.addEventListener('click', () => navigate(arrow.getAttribute('data-direction')));
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
  if (gameKeyboardActive) return;
  
  // Disable UP/DOWN on mobile projects ONLY
  const isProject1 = Math.abs(currentX - 1) < 0.1 && Math.abs(currentY - 1) < 0.1;
  const isProject2 = Math.abs(currentX - 2) < 0.1 && Math.abs(currentY - 1) < 0.1;
  const isProject3 = Math.abs(currentX - 3) < 0.1 && Math.abs(currentY - 1) < 0.1;
  const isProjectSection = isProject1 || isProject2 || isProject3;
  const isMobile = window.innerWidth < 1024;
  
  // Block UP/DOWN on mobile projects
  if (isMobile && isProjectSection) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      return; // Don't navigate
    }
  }
  
  // Normal navigation
  if (e.key === 'ArrowUp') { e.preventDefault(); navigate('up'); }
  if (e.key === 'ArrowDown') { e.preventDefault(); navigate('down'); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); navigate('left'); }
  if (e.key === 'ArrowRight') { e.preventDefault(); navigate('right'); }
});


let touchStartX = 0, touchStartY = 0;
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

function updateMinimap(x, y) {
  document.querySelectorAll('.minimap-cell[data-pos], .game-label[data-pos]').forEach(cell => {
    const pos = cell.getAttribute('data-pos');
    if (pos) {
      const [cellX, cellY] = pos.split(',').map(Number);
      cell.classList.toggle('active', cellX === x && cellY === y);
    }
  });
}

document.querySelectorAll('.minimap-cell[data-pos], .game-label[data-pos]').forEach(cell => {
  cell.addEventListener('click', () => {
    const pos = cell.getAttribute('data-pos');
    if (pos) {
      const [targetX, targetY] = pos.split(',').map(Number);
      currentX = targetX;
      currentY = targetY;
      updatePosition();
      updateMinimap(currentX, currentY);
      
      setTimeout(() => {
        if (currentX === -1 && currentY === 1) initSnakeGame();
        if (currentX === -2 && currentY === 1) initTicTacToe();
        if (currentX === -3 && currentY === 1) initMemoryGame();
      }, 100);
    }
  });
});

updatePosition();
updateMinimap(0, 0);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  loadingCamera.aspect = window.innerWidth / window.innerHeight;
  loadingCamera.updateProjectionMatrix();
  loadingRenderer.setSize(window.innerWidth, window.innerHeight);
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
});

// GAMES CODE (Snake, Tic-Tac-Toe, Memory) - Same as before
let snakeInitialized = false;

function initSnakeGame() {
  if (snakeInitialized) return;
  snakeInitialized = true;
  
  const content = document.getElementById('snake-content');
  content.innerHTML = `
    <div><span class="prompt">root@ammz:~/games/snake$</span> cat README.md</div>
    <div style="margin: 0.8rem 0; font-size: 0.85rem;">
      <span class="keyword">🐍 SNAKE GAME</span><br>
      <span class="comment"># Eat yellow food, don't hit walls</span>
    </div>
    <div><span class="prompt">root@ammz:~/games/snake$</span> <span>python3 snake.py</span><span class="typing-cursor"></span></div><br><br>
    <div style="margin: 0.5rem 0; font-size: 0.8rem;">
      <span class="string">Press ENTER to start | ESC to exit</span>
    </div>
  `;
  
  const keyHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      startSnakeGame();
      document.removeEventListener('keydown', keyHandler);
    }
  };
  document.addEventListener('keydown', keyHandler);
}

function startSnakeGame() {
  gameKeyboardActive = true;
  const content = document.getElementById('snake-content');
  
  content.innerHTML = `
    <div><span class="prompt">root@ammz:~/games/snake$</span> python3 snake.py</div>
    <div style="margin: 0.5rem 0; font-size: 0.8rem;">
      Score: <span id="snake-score" style="color: #0f0;">0</span> | <span style="color: #0f08;">WASD/Arrows | ESC=exit</span>
    </div>
    <div class="game-canvas-center">
      <canvas id="snake-canvas" width="400" height="400"></canvas>
    </div>
    <div style="margin-top: 0.5rem;"><span class="prompt">root@ammz:~/games/snake$</span> <span class="typing-cursor"></span></div>
  `;
  
  const canvas = document.getElementById('snake-canvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('snake-score');
  
  const gridSize = 20, tileCount = 20;
  let snake = [{x: 10, y: 10}];
  let food = {x: 15, y: 15};
  let dx = 0, dy = 0, score = 0, gameRunning = true, gameLoop;
  
  function drawGame() {
    if (!gameRunning) return;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (dx !== 0 || dy !== 0) {
      const head = {x: snake[0].x + dx, y: snake[0].y + dy};
      
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount ||
          snake.some(s => s.x === head.x && s.y === head.y)) {
        gameOver();
        return;
      }
      
      snake.unshift(head);
      
      if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.textContent = score;
        food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
      } else {
        snake.pop();
      }
    }
    
    ctx.fillStyle = '#0f0';
    snake.forEach(s => ctx.fillRect(s.x * gridSize, s.y * gridSize, gridSize - 2, gridSize - 2));
    
    ctx.fillStyle = '#ff0';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    
    gameLoop = setTimeout(() => requestAnimationFrame(drawGame), 120);
  }
  
  function gameOver() {
    gameRunning = false;
    clearTimeout(gameLoop);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f00';
    ctx.font = '28px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 20);
    ctx.fillStyle = '#0f0';
    ctx.font = '20px JetBrains Mono';
    ctx.fillText('Score: ' + score, canvas.width/2, canvas.height/2 + 15);
    ctx.font = '16px JetBrains Mono';
    ctx.fillText('ESC to exit', canvas.width/2, canvas.height/2 + 45);
  }
  
  const controls = (e) => {
    if (e.key === 'Escape') {
      gameRunning = false;
      clearTimeout(gameLoop);
      gameKeyboardActive = false;
      snakeInitialized = false;
      document.removeEventListener('keydown', controls);
      initSnakeGame();
      e.preventDefault();
      return;
    }
    
    if (!gameRunning) return;
    
    if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && dy === 0) { dx = 0; dy = -1; e.preventDefault(); }
    if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && dy === 0) { dx = 0; dy = 1; e.preventDefault(); }
    if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && dx === 0) { dx = -1; dy = 0; e.preventDefault(); }
    if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && dx === 0) { dx = 1; dy = 0; e.preventDefault(); }
  };
  
  document.addEventListener('keydown', controls);
  drawGame();
}

// TIC-TAC-TOE & MEMORY GAMES - Same implementation as before
let tttInitialized = false;

function initTicTacToe() {
  if (tttInitialized) return;
  tttInitialized = true;
  
  const content = document.getElementById('ttt-content');
  content.innerHTML = `
    <div><span class="prompt">root@ammz:~/games/tictactoe$</span> cat README.md</div>
    <div style="margin: 0.8rem 0; font-size: 0.85rem;">
      <span class="keyword">⭕ TIC-TAC-TOE</span><br>
      <span class="comment"># You=X, AI=O. Get 3 in a row!</span>
    </div>
    <div><span class="prompt">root@ammz:~/games/tictactoe$</span> <span>python3 tictactoe.py</span><span class="typing-cursor"></span></div><br><br>
    <div style="margin: 0.5rem 0; font-size: 0.8rem;">
      <span class="string">Press ENTER to start | ESC to exit</span>
    </div>
  `;
  
  const keyHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      startTicTacToe();
      document.removeEventListener('keydown', keyHandler);
    }
  };
  document.addEventListener('keydown', keyHandler);
}

function startTicTacToe() {
  gameKeyboardActive = true;
  const content = document.getElementById('ttt-content');
  
  content.innerHTML = `
    <div><span class="prompt">root@ammz:~/games/tictactoe$</span> python3 tictactoe.py</div>
    <div style="margin: 0.5rem 0; font-size: 0.8rem;">
      <span id="ttt-status" style="color: #0f0;">Your turn (X)</span> | <span style="color: #0f08;">R=restart ESC=exit</span>
    </div>
    <div style="display: flex; justify-content: center; margin: 1rem 0;">
      <div id="ttt-board" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.4rem; max-width: 300px; width: 100%;"></div>
    </div>
    <div style="margin-top: 0.5rem;"><span class="prompt">root@ammz:~/games/tictactoe$</span> <span class="typing-cursor"></span></div>
  `;
  
  let board = ['', '', '', '', '', '', '', '', ''];
  let gameActive = true, currentPlayer = 'X';
  const boardEl = document.getElementById('ttt-board');
  
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.style.cssText = `aspect-ratio: 1; background: rgba(0, 255, 0, 0.1); border: 2px solid #0f0; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; cursor: pointer; transition: all 0.2s;`;
    
    cell.addEventListener('click', () => {
      if (board[i] !== '' || !gameActive || currentPlayer !== 'X') return;
      board[i] = 'X';
      updateBoard();
      if (checkWinner('X')) { endGame('🎉 You Win!', '#0f0'); return; }
      if (board.every(c => c !== '')) { endGame('🤝 Draw!', '#ff0'); return; }
      currentPlayer = 'O';
      document.getElementById('ttt-status').textContent = 'AI thinking...';
      setTimeout(aiMove, 400);
    });
    
    cell.addEventListener('mouseenter', () => {
      if (board[i] === '' && gameActive && currentPlayer === 'X') cell.style.background = 'rgba(0, 255, 0, 0.25)';
    });
    cell.addEventListener('mouseleave', () => {
      if (board[i] === '') cell.style.background = 'rgba(0, 255, 0, 0.1)';
    });
    
    boardEl.appendChild(cell);
  }
  
  const cells = boardEl.children;
  
  function updateBoard() {
    for (let i = 0; i < 9; i++) {
      cells[i].textContent = board[i];
      cells[i].style.color = board[i] === 'X' ? '#0f0' : '#f0f';
    }
  }
  
  function aiMove() {
    const empty = board.map((c, i) => c === '' ? i : null).filter(i => i !== null);
    
    if (Math.random() > 0.35) {
      for (let i of empty) {
        board[i] = 'O';
        if (checkWinner('O')) { updateBoard(); endGame('🤖 AI Wins!', '#f00'); return; }
        board[i] = '';
      }
      for (let i of empty) {
        board[i] = 'X';
        if (checkWinner('X')) { board[i] = 'O'; updateBoard(); currentPlayer = 'X'; document.getElementById('ttt-status').textContent = 'Your turn (X)'; return; }
        board[i] = '';
      }
      if (board[4] === '') { board[4] = 'O'; updateBoard(); currentPlayer = 'X'; document.getElementById('ttt-status').textContent = 'Your turn (X)'; return; }
    }
    
    const move = empty[Math.floor(Math.random() * empty.length)];
    board[move] = 'O';
    updateBoard();
    if (checkWinner('O')) { endGame('🤖 AI Wins!', '#f00'); return; }
    if (board.every(c => c !== '')) { endGame('🤝 Draw!', '#ff0'); return; }
    currentPlayer = 'X';
    document.getElementById('ttt-status').textContent = 'Your turn (X)';
  }
  
  function checkWinner(player) {
    const patterns = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
    return patterns.some(p => p.every(i => board[i] === player));
  }
  
  function endGame(message, color) {
    gameActive = false;
    document.getElementById('ttt-status').textContent = message;
    document.getElementById('ttt-status').style.color = color;
  }
  
  function restart() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    updateBoard();
    document.getElementById('ttt-status').textContent = 'Your turn (X)';
    document.getElementById('ttt-status').style.color = '#0f0';
  }
  
  const controls = (e) => {
    if (e.key === 'Escape') {
      gameKeyboardActive = false;
      tttInitialized = false;
      document.removeEventListener('keydown', controls);
      initTicTacToe();
      e.preventDefault();
    }
    if (e.key === 'r' || e.key === 'R') { restart(); e.preventDefault(); }
  };
  document.addEventListener('keydown', controls);
}

let memInitialized = false;

function initMemoryGame() {
  if (memInitialized) return;
  memInitialized = true;
  
  const content = document.getElementById('mem-content');
  content.innerHTML = `
    <div><span class="prompt">root@ammz:~/games/memory$</span> cat README.md</div>
    <div style="margin: 0.8rem 0; font-size: 0.85rem;">
      <span class="keyword">🧠 MEMORY GAME</span><br>
      <span class="comment"># Match all pairs in 30 seconds!</span>
    </div>
    <div><span class="prompt">root@ammz:~/games/memory$</span> <span>python3 memory.py</span><span class="typing-cursor"></span></div><br><br>
    <div style="margin: 0.5rem 0; font-size: 0.8rem;">
      <span class="string">Press ENTER to start | ESC to exit</span>
    </div>
  `;
  
  const keyHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      startMemoryGame();
      document.removeEventListener('keydown', keyHandler);
    }
  };
  document.addEventListener('keydown', keyHandler);
}

function startMemoryGame() {
  gameKeyboardActive = true;
  const content = document.getElementById('mem-content');
  
  const emojis = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎬', '🎸'];
  const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
  
  let flipped = [], matched = [], moves = 0, canClick = true, timeLeft = 30, timerInterval;
  
  content.innerHTML = `
    <div><span class="prompt">root@ammz:~/games/memory$</span> python3 memory.py</div>
    <div style="margin: 0.5rem 0; font-size: 0.8rem;">
      Time: <span id="mem-timer" style="color: #0f0;">30s</span> | Moves: <span id="mem-moves">0</span> | Matched: <span id="mem-matched">0/8</span> | <span style="color: #0f08;">R=restart ESC=exit</span>
    </div>
    <div style="display: flex; justify-content: center; margin: 1rem 0;">
      <div id="mem-board" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.4rem; max-width: 300px; width: 100%;"></div>
    </div>
    <div style="margin-top: 0.5rem;"><span class="prompt">root@ammz:~/games/memory$</span> <span class="typing-cursor"></span></div>
  `;
  
  const boardEl = document.getElementById('mem-board');
  cards.forEach((emoji) => {
    const card = document.createElement('div');
    card.dataset.emoji = emoji;
    card.style.cssText = `aspect-ratio: 1; background: rgba(0, 255, 0, 0.1); border: 2px solid #0f0; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 2rem; cursor: pointer; transition: all 0.3s;`;
    card.textContent = '?';
    
    card.addEventListener('click', () => {
      if (!canClick || flipped.includes(card) || matched.includes(card.dataset.emoji)) return;
      
      card.textContent = card.dataset.emoji;
      card.style.background = 'rgba(0, 255, 0, 0.3)';
      flipped.push(card);
      
      if (flipped.length === 2) {
        canClick = false;
        moves++;
        document.getElementById('mem-moves').textContent = moves;
        
        const [card1, card2] = flipped;
        
        if (card1.dataset.emoji === card2.dataset.emoji) {
          matched.push(card1.dataset.emoji);
          document.getElementById('mem-matched').textContent = `${matched.length}/8`;
          flipped = [];
          canClick = true;
          
          if (matched.length === 8) {
            clearInterval(timerInterval);
            setTimeout(() => {
              document.getElementById('mem-timer').parentElement.innerHTML = 
                `<span style="color: #0f0;">🎉 Won in ${moves} moves with ${timeLeft}s left!</span> | <span style="color: #0f08;">ESC=exit</span>`;
            }, 300);
          }
        } else {
          setTimeout(() => {
            card1.textContent = '?';
            card2.textContent = '?';
            card1.style.background = 'rgba(0, 255, 0, 0.1)';
            card2.style.background = 'rgba(0, 255, 0, 0.1)';
            flipped = [];
            canClick = true;
          }, 800);
        }
      }
    });
    
    boardEl.appendChild(card);
  });
  
  timerInterval = setInterval(() => {
    timeLeft--;
    const timerEl = document.getElementById('mem-timer');
    timerEl.textContent = timeLeft + 's';
    
    if (timeLeft <= 10) timerEl.style.color = '#ff0';
    if (timeLeft <= 5) timerEl.style.color = '#f00';
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      canClick = false;
      document.getElementById('mem-timer').parentElement.innerHTML = 
        `<span style="color: #f00;">⏰ Time's Up!</span> | <span style="color: #0f08;">R=retry ESC=exit</span>`;
    }
  }, 1000);
  
  function restart() {
    clearInterval(timerInterval);
    gameKeyboardActive = false;
    memInitialized = false;
    startMemoryGame();
  }
  
  const controls = (e) => {
    if (e.key === 'Escape') {
      clearInterval(timerInterval);
      gameKeyboardActive = false;
      memInitialized = false;
      document.removeEventListener('keydown', controls);
      initMemoryGame();
      e.preventDefault();
    }
    if (e.key === 'r' || e.key === 'R') {
      document.removeEventListener('keydown', controls);
      restart();
      e.preventDefault();
    }
  };
  document.addEventListener('keydown', controls);
}


// Scrollable content for projects
let currentScrollElement = null;

document.addEventListener('wheel', (e) => {
  // Check if we're in project 1 or 2
  const isProject1 = currentX === 1 && currentY === 1;
  const isProject2 = currentX === 2 && currentY === 1;
  
  if (!isProject1 && !isProject2) return;
  
  // Find the scrollable code block
  const codeBlock = document.querySelector('.code-block');
  if (!codeBlock || codeBlock.scrollHeight <= codeBlock.clientHeight) return;
  
  // Allow scrolling inside project
  e.stopPropagation();
  codeBlock.scrollTop += e.deltaY;
}, { passive: true });

// Scroll with UP/DOWN nav buttons for projects
document.addEventListener('keydown', (e) => {
  const isProject1 = currentX === 1 && currentY === 1;
  const isProject2 = currentX === 2 && currentY === 1;
  
  if (!isProject1 && !isProject2) return;
  if (gameKeyboardActive) return;
  
  const codeBlock = document.querySelector('.code-block');
  if (!codeBlock) return;
  
  const scrollAmount = 80;
  
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    codeBlock.scrollTop -= scrollAmount;
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    codeBlock.scrollTop += scrollAmount;
  }
});


// Home button click handler
document.querySelector('.nav-arrow.home-btn').addEventListener('click', () => {
  currentX = 0;
  currentY = 0;
  updatePosition();
  updateMinimap(currentX, currentY);
});


function showCertModal(imageName) {
  const modal = document.getElementById('certModal');
  const img = document.getElementById('certImage');
  img.src = `./certificates/${imageName}`; // Adjust path if needed
  modal.classList.add('active');
}

function closeCertModal(event) {
  if (event && event.target.id !== 'certModal') return;
  const modal = document.getElementById('certModal');
  modal.classList.remove('active');
}

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCertModal();
});


const certImageMap = {
  'freecodecamp': '/static/portfolio/certificates/freecodecamp.jpg',
  'python': '/static/portfolio/certificates/python.jpg',
  'html': '/static/portfolio/certificates/html.jpg',
  'network': '/static/portfolio/certificates/networking.jpg',
  'repair': '/static/portfolio/certificates/repair.jpg'
};

let currentCertImage = null;
let hoverTimeout = null;

document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    clearTimeout(hoverTimeout); // Clear any pending hide
    
    const certName = this.getAttribute('data-cert');
    if (!certImageMap[certName]) return;
    
    // Create image only once
    if (!currentCertImage) {
      currentCertImage = document.createElement('img');
      currentCertImage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 350px;
        max-height: 70vh;
        border: 3px solid #0f0;
        border-radius: 12px;
        box-shadow: 0 0 40px rgba(0, 255, 0, 0.8);
        z-index: 5000;
        opacity: 0;
        transition: opacity 0.3s ease-out;
        pointer-events: none;
      `;
      document.body.appendChild(currentCertImage);
    }
    
    // Load image & show
    currentCertImage.src = certImageMap[certName];
    currentCertImage.style.opacity = '1';
  });
  
  card.addEventListener('mouseleave', function() {
    // Delay hide to prevent flickering
    hoverTimeout = setTimeout(() => {
      if (currentCertImage) {
        currentCertImage.style.opacity = '0';
      }
    }, 100);
  });
});
