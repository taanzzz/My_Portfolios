import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Play, Pause, Compass, Focus, X, Info } from 'lucide-react';

// --- Configuration ---
const AU = 50; 
const SCALE_PLANET = 1;

// --- Shaders ---

const ATMOSPHERE_VERTEX = `
varying vec3 vNormal;
void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const ATMOSPHERE_FRAGMENT = `
varying vec3 vNormal;
uniform vec3 color;
uniform float intensity;
uniform float power;
void main() {
    float i = pow(0.55 - dot(vNormal, vec3(0, 0, 1.0)), power);
    gl_FragColor = vec4(color, 1.0) * i * intensity;
}
`;

const TAIL_VERTEX = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const TAIL_FRAGMENT = `
varying vec2 vUv;
uniform vec3 color;
uniform float time;
uniform float opacity;
void main() {
    // Gradient fade from head (y=0) to tail (y=1)
    float alpha = smoothstep(1.0, 0.0, vUv.y);
    
    // Dynamic plasma flow effect
    float noise = sin(vUv.y * 20.0 - time * 10.0) * 0.1;
    float core = smoothstep(0.4, 0.0, abs(vUv.x - 0.5));
    
    vec3 finalColor = color + vec3(core * 0.5); // Hotter core
    
    gl_FragColor = vec4(finalColor, (alpha + noise) * opacity * core);
}
`;

// --- Data & Types ---

interface OrbitalElements {
  id: string;
  name: string;
  type: 'star' | 'planet' | 'comet';
  surfaceType?: 'terrestrial' | 'gas' | 'ice';
  a: number; e: number; i: number; L: number; w: number; M: number; n: number;
  color: string; 
  size: number;
  rotationPeriod: number; 
  axialTilt: number;
  description: string;
  atmosphereColor?: string;
  moons?: number;
}

const CELESTIAL_DATA: OrbitalElements[] = [
  { 
      id: 'mercury', name: 'Mercury', type: 'planet', surfaceType: 'terrestrial',
      a: 0.387, e: 0.205, i: 7.0, L: 48.33, w: 29.12, M: 174.79, n: 4.09, 
      color: '#A5A5A5', size: 0.38, rotationPeriod: 1407.6, axialTilt: 0.03,
      description: "The smallest planet in our solar system and closest to the Sun—is only slightly larger than Earth's Moon. Mercury is the fastest planet, zipping around the Sun every 88 Earth days."
  },
  { 
      id: 'venus', name: 'Venus', type: 'planet', surfaceType: 'terrestrial',
      a: 0.723, e: 0.007, i: 3.4, L: 76.68, w: 54.88, M: 50.41, n: 1.60, 
      color: '#E3BB76', size: 0.95, rotationPeriod: 5832.5, axialTilt: 177.3,
      atmosphereColor: '#FFA500',
      description: "Spinning in the opposite direction to most planets, Venus is the hottest planet in our solar system with surface temperatures hot enough to melt lead due to its runaway greenhouse effect."
  },
  { 
      id: 'earth', name: 'Earth', type: 'planet', surfaceType: 'terrestrial',
      a: 1.000, e: 0.017, i: 0.0, L: -11.26, w: 102.94, M: 357.51, n: 0.98, 
      color: '#2244AA', size: 1.0, rotationPeriod: 23.9, axialTilt: 23.4,
      atmosphereColor: '#4488FF',
      description: "Our home planet is the only place we know of so far that's inhabited by living things. It's also the only planet in our solar system with liquid water on the surface."
  },
  { 
      id: 'mars', name: 'Mars', type: 'planet', surfaceType: 'terrestrial',
      a: 1.524, e: 0.093, i: 1.85, L: 49.57, w: 286.50, M: 19.41, n: 0.52, 
      color: '#CC4422', size: 0.53, rotationPeriod: 24.6, axialTilt: 25.2,
      atmosphereColor: '#AA5544',
      description: "Mars is a dusty, cold, desert world with a very thin atmosphere. There is strong evidence that Mars was—billions of years ago—wetter and warmer, with a thick atmosphere."
  },
  { 
      id: 'jupiter', name: 'Jupiter', type: 'planet', surfaceType: 'gas',
      a: 5.204, e: 0.048, i: 1.30, L: 100.46, w: 273.86, M: 20.02, n: 0.083, 
      color: '#E0AE6F', size: 3.0, rotationPeriod: 9.9, axialTilt: 3.1,
      description: "Jupiter is more than twice as massive as the other planets of our solar system combined. The giant planet's Great Red Spot is a centuries-old storm bigger than Earth."
  },
  { 
      id: 'saturn', name: 'Saturn', type: 'planet', surfaceType: 'gas',
      a: 9.582, e: 0.056, i: 2.48, L: 113.66, w: 339.39, M: 317.02, n: 0.033, 
      color: '#FDE047', size: 2.5, rotationPeriod: 10.7, axialTilt: 26.7,
      description: "Adorned with a dazzling, complex system of icy rings, Saturn is unique in our solar system. The other giant planets have rings, but none are as spectacular as Saturn's."
  },
  { 
      id: 'neptune', name: 'Neptune', type: 'planet', surfaceType: 'gas',
      a: 30.07, e: 0.009, i: 1.77, L: 131.78, w: 276.33, M: 256.22, n: 0.006, 
      color: '#3355FF', size: 2.4, rotationPeriod: 16.1, axialTilt: 28.3,
      atmosphereColor: '#5599FF',
      description: "Neptune—the eighth and most distant major planet orbiting our Sun—is dark, cold and whipped by supersonic winds. It was the first planet located through mathematical calculations."
  },
  { 
      id: 'comet1', name: 'C/2025 T1 (ATLAS)', type: 'comet',
      a: 4.5, e: 0.85, i: 15.0, L: 120.0, w: 45.0, M: 0, n: 0.2, 
      color: '#A78BFA', size: 0.2, rotationPeriod: 0, axialTilt: 0,
      description: "A non-periodic comet with a hyperbolic trajectory. As it approaches the sun, its tail grows significantly due to sublimation of volatile ices."
  },
];

// --- Procedural Texture Generator ---
const createPlanetTexture = (data: OrbitalElements) => {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    const baseColor = new THREE.Color(data.color);
    
    // Fill Base
    ctx.fillStyle = `#${baseColor.getHexString()}`;
    ctx.fillRect(0,0,size,size);

    const imgData = ctx.getImageData(0,0,size,size);
    const pixels = imgData.data;

    // Noise Function
    const noise = (x: number, y: number, freq: number) => {
        return (Math.sin(x*freq) + Math.cos(y*freq)) * 0.5;
    };

    for(let y=0; y<size; y++) {
        for(let x=0; x<size; x++) {
            const i = (y*size + x) * 4;
            
            let n = 0;
            if (data.surfaceType === 'gas') {
                // Banded Noise for Gas Giants
                n = Math.sin(y * 0.05 + Math.sin(x * 0.01) * 5.0) * 0.5 + 0.5;
                n += (Math.random() - 0.5) * 0.1;
                
                // Color variation
                pixels[i] = Math.min(255, pixels[i] * (0.8 + n * 0.4));
                pixels[i+1] = Math.min(255, pixels[i+1] * (0.8 + n * 0.4));
                pixels[i+2] = Math.min(255, pixels[i+2] * (0.8 + n * 0.4));
            } else if (data.surfaceType === 'terrestrial') {
                // Detailed Perlin-like Noise for Terrestrial
                const freq = 0.02;
                const n1 = (Math.sin(x*freq) + Math.cos(y*freq)) * 20;
                const n2 = (Math.sin(x*freq*2 + 100) + Math.cos(y*freq*2 + 100)) * 10;
                const finalN = n1 + n2 + (Math.random()*10);
                
                // Continents vs Ocean for Earth-like
                if (data.id === 'earth') {
                     if (finalN > 5) {
                         // Land (Green/Brown)
                         pixels[i] = 34 + finalN * 2;
                         pixels[i+1] = 139 + finalN;
                         pixels[i+2] = 34;
                     } else {
                         // Ocean (Blue)
                         pixels[i] = 10;
                         pixels[i+1] = 20 + Math.abs(finalN)*5;
                         pixels[i+2] = 100 + Math.abs(finalN)*10;
                     }
                } else if (data.id === 'mars') {
                    // Dusty Red
                    pixels[i] = 200 + finalN * 2;
                    pixels[i+1] = 60 + finalN;
                    pixels[i+2] = 30 + finalN;
                } else {
                    // Generic Rocky
                    pixels[i] = Math.min(255, pixels[i] + finalN);
                    pixels[i+1] = Math.min(255, pixels[i+1] + finalN);
                    pixels[i+2] = Math.min(255, pixels[i+2] + finalN);
                }
            }
        }
    }
    
    ctx.putImageData(imgData, 0, 0);
    
    // Cloud Layer for Earth/Venus
    if (['earth', 'venus'].includes(data.id)) {
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        for(let j=0; j<200; j++) {
            const cx = Math.random() * size;
            const cy = Math.random() * size;
            const r = Math.random() * 50 + 20;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI*2);
            ctx.fill();
        }
    }

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
};


// --- Class Definition ---

class KeplerBody {
  elements: OrbitalElements;
  root: THREE.Group;
  mesh: THREE.Mesh;
  orbitLine: THREE.Line;
  labelDiv: HTMLDivElement;
  atmosphere?: THREE.Mesh;
  tailMesh?: THREE.Mesh;
  tailMaterial?: THREE.ShaderMaterial;
  
  constructor(data: OrbitalElements, scene: THREE.Group, container: HTMLElement) {
    this.elements = data;
    
    // 1. Root Group
    this.root = new THREE.Group();
    this.root.userData = { id: data.id }; // For Raycasting
    scene.add(this.root);

    // 2. Planet Mesh
    const geometry = new THREE.SphereGeometry(data.size * SCALE_PLANET, 64, 64);
    
    let material: THREE.Material;
    
    if (data.type === 'planet') {
        const texture = createPlanetTexture(data);
        material = new THREE.MeshStandardMaterial({ 
          map: texture,
          roughness: data.surfaceType === 'gas' ? 1 : 0.6,
          metalness: 0.1,
        });
    } else {
        // Comet Nucleus
        material = new THREE.MeshStandardMaterial({ 
          color: data.color, 
          roughness: 0.9 
        });
    }

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.userData = { id: data.id }; // Make mesh clickable
    
    // 3. Hierarchy & Effects
    if (data.type === 'planet') {
        const tiltGroup = new THREE.Group();
        tiltGroup.rotation.z = THREE.MathUtils.degToRad(data.axialTilt);
        this.root.add(tiltGroup);
        tiltGroup.add(this.mesh);

        // Atmosphere Shader
        if (data.atmosphereColor) {
             const atmGeo = new THREE.SphereGeometry(data.size * SCALE_PLANET * 1.2, 64, 64);
             const atmMat = new THREE.ShaderMaterial({
                 vertexShader: ATMOSPHERE_VERTEX,
                 fragmentShader: ATMOSPHERE_FRAGMENT,
                 blending: THREE.AdditiveBlending,
                 side: THREE.BackSide,
                 transparent: true,
                 uniforms: {
                     color: { value: new THREE.Color(data.atmosphereColor) },
                     intensity: { value: 0.6 },
                     power: { value: 4.0 }
                 }
             });
             this.atmosphere = new THREE.Mesh(atmGeo, atmMat);
             tiltGroup.add(this.atmosphere);
        }

        // Rings
        if(data.id === 'saturn') {
            const ringGeo = new THREE.RingGeometry(data.size * 1.4, data.size * 2.2, 64);
            const ringMat = new THREE.MeshStandardMaterial({ 
                color: 0xAA8866, side: THREE.DoubleSide, transparent: true, opacity: 0.8 
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2;
            this.mesh.add(ring);
        }
    } else {
        // Comet Setup
        this.root.add(this.mesh);
        
        // Dynamic Tail Shader
        const tailGeo = new THREE.PlaneGeometry(data.size * 2, data.size * 20, 1, 10);
        // Pivot point at tip
        tailGeo.translate(0, data.size * 10, 0); 

        this.tailMaterial = new THREE.ShaderMaterial({
            vertexShader: TAIL_VERTEX,
            fragmentShader: TAIL_FRAGMENT,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: {
                color: { value: new THREE.Color(data.color) },
                time: { value: 0 },
                opacity: { value: 0.8 }
            }
        });

        this.tailMesh = new THREE.Mesh(tailGeo, this.tailMaterial);
        // Initial rotation to lie flat
        this.tailMesh.rotation.x = Math.PI / 2; 
        this.root.add(this.tailMesh);
    }

    // 4. Orbit Line
    this.orbitLine = this.createOrbitLine();
    scene.add(this.orbitLine);

    // 5. Label
    this.labelDiv = document.createElement('div');
    this.labelDiv.className = "absolute text-xs font-bold text-white pointer-events-none select-none text-shadow-sm transition-opacity duration-300 z-10";
    this.labelDiv.style.textShadow = "0 0 4px #000";
    this.labelDiv.textContent = data.name;
    if(data.type === 'comet') this.labelDiv.style.color = data.color;
    container.appendChild(this.labelDiv);
  }

  // ... (Orbit Math methods same as before, omitted for brevity but included in update)
  solveKepler(M: number, e: number): number {
    let E = M;
    for (let i = 0; i < 10; i++) { 
      const delta = E - e * Math.sin(E) - M;
      E = E - delta / (1 - e * Math.cos(E));
    }
    return E;
  }

  getPosition(daysOffset: number): THREE.Vector3 {
    const { a, e, i, L, w, M, n } = this.elements;
    const currentM_rad = ((M + n * daysOffset) * Math.PI) / 180;
    const E = this.solveKepler(currentM_rad, e);
    const xv = a * (Math.cos(E) - e);
    const yv = a * Math.sqrt(1 - e * e) * Math.sin(E);

    const i_rad = (i * Math.PI) / 180;
    const L_rad = (L * Math.PI) / 180;
    const w_rad = (w * Math.PI) / 180;

    const x = xv * (Math.cos(w_rad) * Math.cos(L_rad) - Math.sin(w_rad) * Math.sin(L_rad) * Math.cos(i_rad)) -
              yv * (Math.sin(w_rad) * Math.cos(L_rad) + Math.cos(w_rad) * Math.sin(L_rad) * Math.cos(i_rad));
    const y = xv * (Math.cos(w_rad) * Math.sin(L_rad) + Math.sin(w_rad) * Math.cos(L_rad) * Math.cos(i_rad)) -
              yv * (Math.sin(w_rad) * Math.sin(L_rad) - Math.cos(w_rad) * Math.cos(L_rad) * Math.cos(i_rad));
    const z = xv * (Math.sin(w_rad) * Math.sin(i_rad)) + 
              yv * (Math.cos(w_rad) * Math.sin(i_rad));

    return new THREE.Vector3(x * AU, z * AU, -y * AU); 
  }

  createOrbitLine(): THREE.Line {
    const points = [];
    const segments = 180; 
    for (let j = 0; j <= segments; j++) {
       // ... reused math ...
       const E_rad = (j / segments) * 2 * Math.PI;
      const { a, e, i, L, w } = this.elements;
      const xv = a * (Math.cos(E_rad) - e);
      const yv = a * Math.sqrt(1 - e * e) * Math.sin(E_rad);
      const i_rad = (i * Math.PI) / 180;
      const L_rad = (L * Math.PI) / 180;
      const w_rad = (w * Math.PI) / 180;

      const x = xv * (Math.cos(w_rad) * Math.cos(L_rad) - Math.sin(w_rad) * Math.sin(L_rad) * Math.cos(i_rad)) -
                yv * (Math.sin(w_rad) * Math.cos(L_rad) + Math.cos(w_rad) * Math.sin(L_rad) * Math.cos(i_rad));
      const y = xv * (Math.cos(w_rad) * Math.sin(L_rad) + Math.sin(w_rad) * Math.cos(L_rad) * Math.cos(i_rad)) -
                yv * (Math.sin(w_rad) * Math.sin(L_rad) - Math.cos(w_rad) * Math.cos(L_rad) * Math.cos(i_rad));
      const z = xv * (Math.sin(w_rad) * Math.sin(i_rad)) + yv * (Math.cos(w_rad) * Math.sin(i_rad));
      points.push(new THREE.Vector3(x * AU, z * AU, -y * AU));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
        color: this.elements.type === 'comet' ? this.elements.color : 0x444444,
        transparent: true,
        opacity: this.elements.type === 'comet' ? 0.6 : 0.3
    });
    return new THREE.Line(geometry, material);
  }

  update(daysOffset: number, camera: THREE.Camera, container: HTMLElement, time: number) {
    // 1. Position
    const pos = this.getPosition(daysOffset);
    this.root.position.copy(pos);
    
    // 2. Rotation & Comet Effects
    if (this.elements.type === 'planet') {
        const totalHours = daysOffset * 24;
        this.mesh.rotation.y = (totalHours / this.elements.rotationPeriod) * Math.PI * 2;
        
        // Face atmosphere towards camera for rim effect optimization if needed (handled by shader usually)
        if (this.atmosphere) {
            // Shader handles view direction
        }
    } else if (this.elements.type === 'comet' && this.tailMesh && this.tailMaterial) {
        // Tail Logic: Points AWAY from Sun (0,0,0)
        const sunPos = new THREE.Vector3(0,0,0);
        const directionToSun = new THREE.Vector3().subVectors(pos, sunPos).normalize();
        
        // Align tail with vector away from sun
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), directionToSun);
        this.tailMesh.setRotationFromQuaternion(quaternion);

        // Update Shader Uniforms
        this.tailMaterial.uniforms.time.value = time;
        
        // Scale opacity/size by distance to sun (simulate melting)
        const dist = pos.length();
        const intensity = Math.max(0.2, 1.0 - (dist / (10 * AU))); // Brighter when closer
        this.tailMaterial.uniforms.opacity.value = intensity;
        
        // Tail grows when closer
        const scale = 1.0 + intensity * 5.0;
        this.tailMesh.scale.set(1, scale, 1);
    }

    // 3. Label Position
    if (this.labelDiv.style.opacity !== '0') {
        const tempV = pos.clone().project(camera);
        const x = (tempV.x * .5 + .5) * container.clientWidth;
        const y = (tempV.y * -.5 + .5) * container.clientHeight;
        
        if(tempV.z > 1 || Math.abs(tempV.x) > 1.1 || Math.abs(tempV.y) > 1.1) {
             this.labelDiv.style.display = 'none';
        } else {
             this.labelDiv.style.display = 'block';
             this.labelDiv.style.transform = `translate(-50%, -50%) translate(${x}px, ${y - 25}px)`;
        }
    }
  }

  setOpacity(opacity: number) {
      if (this.mesh.material instanceof THREE.Material) {
          this.mesh.material.transparent = true;
          this.mesh.material.opacity = opacity;
          this.mesh.visible = opacity > 0.01;
      }
      this.orbitLine.visible = opacity > 0.01;
      this.labelDiv.style.opacity = opacity > 0.5 ? '1' : '0';
  }
}

// ... (Galaxy/Universe functions remain same, omitted for brevity) ...

const PixelVerseApp: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedBody, setSelectedBody] = useState<OrbitalElements | null>(null);
  const [zoomLevel, setZoomLevel] = useState('SOLAR SYSTEM');
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(0.5);

  const bodiesRef = useRef<KeplerBody[]>([]);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const mouseRef = useRef(new THREE.Vector2());
  const raycasterRef = useRef(new THREE.Raycaster());
  
  // Selection Logic
  const handleCanvasClick = (event: React.MouseEvent) => {
    if (!mountRef.current || !cameraRef.current) return;
    
    // Calculate mouse position in normalized device coordinates
    const rect = mountRef.current.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    // Intersect with planets
    const meshes = bodiesRef.current.map(b => b.mesh);
    const intersects = raycasterRef.current.intersectObjects(meshes);

    if (intersects.length > 0) {
        const id = intersects[0].object.userData.id;
        const data = CELESTIAL_DATA.find(d => d.id === id);
        if (data) {
            setSelectedBody(data);
            // Camera animation logic handled in update loop
        }
    } else {
        setSelectedBody(null);
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;
    
    // --- Scene Init ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000005');
    scene.fog = new THREE.FogExp2(0x000005, 0.00002);

    const camera = new THREE.PerspectiveCamera(55, mountRef.current.clientWidth / mountRef.current.clientHeight, 1, 200000);
    camera.position.set(0, 300, 500);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    // --- Solar System ---
    const solarGroup = new THREE.Group();
    scene.add(solarGroup);

    // Sun (With Bloom Sprite)
    const sunGeo = new THREE.SphereGeometry(15, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xFFDD00 });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    
    const spriteMat = new THREE.SpriteMaterial({ 
        map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/glow.png'), 
        color: 0xFF8800, 
        blending: THREE.AdditiveBlending 
    });
    const sunGlow = new THREE.Sprite(spriteMat);
    sunGlow.scale.set(100, 100, 1);
    sun.add(sunGlow);
    solarGroup.add(sun);

    // Lighting
    const light = new THREE.PointLight(0xffffff, 2, 5000);
    solarGroup.add(light);
    scene.add(new THREE.AmbientLight(0x222222));

    // Initialize Bodies
    CELESTIAL_DATA.forEach(data => {
        bodiesRef.current.push(new KeplerBody(data, solarGroup, mountRef.current!));
    });

    // --- Loop ---
    let days = 0;
    let time = 0;
    let animId: number;
    
    const animate = () => {
        animId = requestAnimationFrame(animate);
        time += 0.01;
        
        if (!paused) days += speed;

        // Update Physics
        bodiesRef.current.forEach(body => {
            body.update(days, camera, mountRef.current!, time);
        });

        // Camera Logic
        const dist = camera.position.length();
        if (dist > 3000) setZoomLevel('INTERSTELLAR');
        else setZoomLevel('SOLAR SYSTEM');

        controls.update();
        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if (!mountRef.current) return;
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', handleResize);
        mountRef.current?.removeChild(renderer.domElement);
        renderer.dispose();
        bodiesRef.current.forEach(b => b.labelDiv.remove());
        bodiesRef.current = [];
    };
  }, []);

  // Effect to move camera when body selected
  useEffect(() => {
      if (selectedBody && controlsRef.current && cameraRef.current) {
          const bodyObj = bodiesRef.current.find(b => b.elements.id === selectedBody.id);
          if (bodyObj) {
              const targetPos = bodyObj.root.position;
              // Smoothly animate controls target (simplified for this snippet)
              controlsRef.current.target.copy(targetPos);
              
              // Move camera close
              const offset = new THREE.Vector3(20, 10, 20); // Zoom offset
              // Ideally use Tweening library here for smoothness, simplified:
              controlsRef.current.minDistance = 5;
          }
      }
  }, [selectedBody]);

  return (
    <div className="w-full h-full bg-black relative font-sans text-white overflow-hidden">
        {/* 3D Canvas */}
        <div ref={mountRef} className="w-full h-full cursor-crosshair" onClick={handleCanvasClick} />

        {/* HUD Overlay */}
        <div className="absolute top-0 left-0 p-6 pointer-events-none w-full flex justify-between">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black uppercase tracking-tighter drop-shadow-lg">PixelVerse <span className="text-yellow-400">4.0</span></h1>
                <div className="flex items-center gap-2 text-green-400 bg-black/60 px-2 py-1 rounded w-fit backdrop-blur-md border border-green-500/30">
                    <Compass size={16} /> {zoomLevel}
                </div>
            </div>
            {selectedBody && (
                <button onClick={() => setSelectedBody(null)} className="pointer-events-auto bg-red-500/80 hover:bg-red-500 p-2 rounded border border-white/20 transition-colors">
                    <X size={24} />
                </button>
            )}
        </div>

        {/* Info Panel (When Selected) */}
        {selectedBody && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 md:w-96 bg-black/80 backdrop-blur-xl border-l-4 border-yellow-400 p-6 m-4 shadow-2xl transition-all animate-in slide-in-from-right duration-300">
                <h2 className="text-4xl font-black uppercase mb-2 text-yellow-400">{selectedBody.name}</h2>
                <div className="flex gap-2 mb-4 text-xs font-mono uppercase text-gray-400">
                    <span>{selectedBody.type}</span>
                    <span>•</span>
                    <span>{selectedBody.surfaceType || 'N/A'}</span>
                </div>
                <p className="text-sm leading-relaxed text-gray-200 mb-6 border-l-2 border-white/20 pl-3">
                    {selectedBody.description}
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div className="bg-white/10 p-2 rounded">
                        <span className="block text-gray-500">Orbit Period</span>
                        <span className="text-lg font-bold">{selectedBody.a} AU</span>
                    </div>
                    <div className="bg-white/10 p-2 rounded">
                        <span className="block text-gray-500">Day Length</span>
                        <span className="text-lg font-bold">{selectedBody.rotationPeriod}h</span>
                    </div>
                </div>
            </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center gap-4 shadow-xl">
             <button onClick={() => setPaused(!paused)} className="hover:text-yellow-400 transition-colors">
                 {paused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />}
             </button>
             <div className="h-6 w-px bg-white/20" />
             <span className="text-xs font-bold uppercase text-gray-400">Speed</span>
             <input 
                type="range" min="0" max="2" step="0.1" 
                value={speed} 
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-24 accent-yellow-400 cursor-pointer"
             />
        </div>
    </div>
  );
};

export default PixelVerseApp;