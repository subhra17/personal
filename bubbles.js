const canvas = document.getElementById("bubbleCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Replace with actual paths/URLs of your gf's pics
const gfImages = [
  "img1.jpg",
  "img2.jpg",
  "img3.jpg",
  "img4.jpg",
  "img5.jpg",
  "img6.jpg",
  "img7.jpg"
];

const bubbles = [];
const imgElements = [];

// Preload images
gfImages.forEach(src => {
  const img = new Image();
  img.src = src;
  imgElements.push(img);
});

class Bubble {
  constructor(img) {
    this.img = img;
    this.radius = Math.random() * 50 + 40;
    this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
    this.y = Math.random() * (canvas.height - this.radius * 2) + this.radius;
    this.dx = (Math.random() - 0.5) * 3; // speed X
    this.dy = (Math.random() - 0.5) * 3; // speed Y
  }

  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    ctx.restore();
  }

  update(bubbles) {
    this.x += this.dx;
    this.y += this.dy;

    // Bounce on walls
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    // Bubble-to-bubble collision
    for (let other of bubbles) {
      if (this === other) continue;
      let dx = other.x - this.x;
      let dy = other.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.radius + other.radius) {
        // simple velocity swap
        let tempDx = this.dx;
        let tempDy = this.dy;
        this.dx = other.dx;
        this.dy = other.dy;
        other.dx = tempDx;
        other.dy = tempDy;
      }
    }

    this.draw();
  }
}

class Heart {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 100;
    this.size = 15 + Math.random() * 15;
    this.speed = 1 + Math.random() * 2;
    this.opacity = 0.6 + Math.random() * 0.4;
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = 0.01 + Math.random() * 0.02;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = 'rgba(255, 20, 147, 0.8)'; // pinkish color

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, this.size / 3, 0, this.size);
    ctx.bezierCurveTo(-this.size, this.size / 3, -this.size / 2, -this.size / 2, 0, 0);
    ctx.fill();

    ctx.restore();
  }

  update() {
    this.y -= this.speed;
    this.angle += this.angleSpeed;

    if (this.y + this.size < 0) {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + this.size;
      this.size = 15 + Math.random() * 15;
      this.speed = 0.5 + Math.random() * 2;
      this.opacity = 0.6 + Math.random() * 0.4;
      this.angle = Math.random() * Math.PI * 2;
    }
  }
}

const hearts = [];
const totalHearts = 40;

for (let i = 0; i < totalHearts; i++) {
  hearts.push(new Heart());
}


function init() {
  for (let i = 0; i < imgElements.length; i++) {
    bubbles.push(new Bubble(imgElements[i]));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw hearts first as background
  hearts.forEach(heart => {
    heart.update();
    heart.draw();
  });

  // Draw bubble images on top
  for (let bubble of bubbles) {
    bubble.update(bubbles);
  }

  requestAnimationFrame(animate);
}


window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

setTimeout(() => {
  init();
  animate();
}, 700); // wait for images to load

