var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xDDDDDD, 1);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(80, WIDTH / HEIGHT);
camera.position.z = 4.5;
camera.position.x = -1.2;
camera.position.y = 2;

camera.rotation.set(0, -0.5, 0);
scene.add(camera);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

/**
 * 
 * @param {Numero de lados} nlados 
 * @param {Tamanio de lados} ladoigual 
 * @returns {arreglo de vertices}
 */

function poligono(nlados, ladoigual) {
  const vertices = [];
  const ang = (2 * Math.PI) / nlados;
  for (let i = 0; i < nlados; i++) {
    let x = ladoigual * Math.cos(i * ang);
    let y = ladoigual * Math.sin(i * ang);
    vertices.push(new THREE.Vector3(x, y, 0));
  }
  return vertices;
}

/**
 *  HECHA CON AYUDA DE CHATGPT
 * @param {VerticesBaseAbajo, vertices de un polygono base} vertices 
 * @param {Altura del poligono} height 
 * @param {Numero de lados} sides 
 * @param { apotema del polígono regular de la base inferior} lowerApothem 
 * @param {valor porcentual que determine el apotema del polígono de la base superior , con respecto base inferior} topApothemPercent 
 * @returns devuelve una geometria del polygono armada.
 */

function troncoPiramide(vertices, height, sides, lowerApothem, topApothemPercent) {
  const geometry = new THREE.BufferGeometry();

  // Calculate the number of vertices for the lower and upper base polygons
  const lowerBaseVertices = poligono(sides, lowerApothem);
  const upperBaseVertices = poligono(sides, lowerApothem * topApothemPercent);

  // Calculate the number of vertices for the sides of the truncated pyramid
  const numVertices = (sides + 1) * 2;

  // Create an array to hold all the vertices
  const allVertices = new Float32Array(numVertices * 3);

  // Fill the array with vertices of lower base
  for (let i = 0; i < sides; i++) {
    allVertices[i * 3] = lowerBaseVertices[i].x;
    allVertices[i * 3 + 1] = lowerBaseVertices[i].y;
    allVertices[i * 3 + 2] = 0;
  }

  // Fill the array with vertices of upper base
  for (let i = 0; i < sides; i++) {
    allVertices[(sides + 1 + i) * 3] = upperBaseVertices[i].x;
    allVertices[(sides + 1 + i) * 3 + 1] = upperBaseVertices[i].y;
    allVertices[(sides + 1 + i) * 3 + 2] = height;
  }

  // Add the center point of the lower base as the last vertex
  allVertices[sides * 3] = 0;
  allVertices[sides * 3 + 1] = 0;
  allVertices[sides * 3 + 2] = 0;

  // Add the center point of the upper base as the last vertices
  for (let i = 0; i < sides; i++) {
    allVertices[(sides + 1 + sides + i) * 3] = upperBaseVertices[i].x;
    allVertices[(sides + 1 + sides + i) * 3 + 1] = upperBaseVertices[i].y;
    allVertices[(sides + 1 + sides + i) * 3 + 2] = height;
  }

  // Set the positions attribute of the geometry
  geometry.setAttribute('position', new THREE.BufferAttribute(allVertices, 3));

  // Calculate the indices for the faces
  const indices = [];

  // Create the indices for the sides
  for (let i = 0; i < sides; i++) {
    indices.push(i, (i + 1) % sides, i + sides + 1);
    indices.push(i + sides + 1, (i + 1) % sides, (i + 1) % sides + sides + 1);
  }

  // Create the indices for the bottom base
  for (let i = 0; i < sides - 2; i++) {
    indices.push(0, i + 1, i + 2);
  }

  // Create the indices for the top base
  for (let i = 0; i < sides - 2; i++) {
    indices.push(sides + 1, sides + 2 + i, sides + 3 + i);
  }

  // Set the indices attribute of the geometry
  geometry.setIndex(indices);

  return geometry;
}

// Definir parametros tronco piramidal
const nlados = 6;
const altura = 5;
const ApotemBaseabajo = 2;
const ProcentajeApotemBaseArriba = 0.5;
const arrayver = [];


// LLamar tronco piremide para crear geometria del tronco
const geometry = troncoPiramide(arrayver, altura, nlados, ApotemBaseabajo, ProcentajeApotemBaseArriba);

// Crear 2 mesh para mostarr geometria y delineado.
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
const kolor = new THREE.Color({ color: 0x00ff00 });
const material2 = new THREE.MeshBasicMaterial({kolor, wireframe: true});
const mesh2 = new THREE.Mesh(geometry, material2);

//aniadir mesh a la escena
scene.add(mesh);
scene.add(mesh2);

    
//animation
  var animate = function(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-1, 2, 4);
scene.add(light);

const size = 150;
const divisions = 160;
const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();