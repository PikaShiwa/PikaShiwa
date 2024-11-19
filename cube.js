const canvas = document.getElementById("cubeCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const perspective = 400;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
let cubeSize = 100; // Initial size of the cube
let zooming = false;
let zoomStopped = false;

let angleX = 0;
let angleY = 0;

function rotateX(x, y, z, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const newY = y * cos - z * sin;
    const newZ = y * sin + z * cos;
    return [x, newY, newZ];
}

function rotateY(x, y, z, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const newX = x * cos + z * sin;
    const newZ = -x * sin + z * cos;
    return [newX, y, newZ];
}

function project(x, y, z) {
    const factor = perspective / (perspective + z);
    const newX = x * factor + centerX;
    const newY = y * factor + centerY;
    return [newX, newY];
}

function drawCube() {
    const vertices = [
        [-cubeSize, -cubeSize, -cubeSize],
        [cubeSize, -cubeSize, -cubeSize],
        [cubeSize, cubeSize, -cubeSize],
        [-cubeSize, cubeSize, -cubeSize],
        [-cubeSize, -cubeSize, cubeSize],
        [cubeSize, -cubeSize, cubeSize],
        [cubeSize, cubeSize, cubeSize],
        [-cubeSize, cubeSize, cubeSize],
    ];

    const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const rotatedVertices = vertices.map(([x, y, z]) => {
        [x, y, z] = rotateX(x, y, z, angleX);
        [x, y, z] = rotateY(x, y, z, angleY);
        return project(x, y, z);
    });

    ctx.strokeStyle = "white";
    edges.forEach(([start, end]) => {
        const [x1, y1] = rotatedVertices[start];
        const [x2, y2] = rotatedVertices[end];
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    });

    if (!zooming) {
        angleX += 0.02;
        angleY += 0.02;
    }

    requestAnimationFrame(drawCube);
}

// Zoom effect
function startZoom() {
    zooming = true;
    let zoomInterval = setInterval(() => {
        if (!zoomStopped) {
            cubeSize += 20; // Gradually increase size
            if (cubeSize >= canvas.width * 0.75) { // Stop zoom halfway
                zoomStopped = true;
                clearInterval(zoomInterval);
            }
        }
    }, 50); // Adjust zoom speed
}

drawCube();