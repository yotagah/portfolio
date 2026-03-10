import { Application, Graphics, Container } from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({
    background: "#000000",
    resizeTo: window,
    canvas: document.getElementById("pixi-canvas"),
  });

  // Create a container for stars
  const starContainer = new Container();
  app.stage.addChild(starContainer);

  // Create stars
  const stars = [];
  let centerX = app.screen.width / 2;
  let centerY = app.screen.height / 2;
  let maxDist = Math.max(app.screen.width, app.screen.height) / 2 + 100;
  for (let i = 0; i < 200; i++) {
    const star = new Graphics();
    const alpha = Math.random() * 0.8 + 0.2;
    star.beginFill(0xffffff, alpha);
    star.drawCircle(0, 0, Math.random() * 2 + 1);
    star.endFill();
    star.x = centerX;
    star.y = centerY;
    star.angle = Math.random() * Math.PI * 2;
    star.speed = Math.random() * 2 + 1;
    star.distance = 0;
    starContainer.addChild(star);
    stars.push(star);
  }

  // Create ship
  const ship = new Graphics();
  ship.beginFill(0x00ff00);
  ship.moveTo(0, -10);
  ship.lineTo(-5, 10);
  ship.lineTo(5, 10);
  ship.closePath();
  ship.endFill();
  app.stage.addChild(ship);

  // Ship positions for each section (x, y)
  const shipPositions = [
    { x: app.screen.width / 2, y: app.screen.height / 2 }, // intro
    { x: app.screen.width * 0.2, y: app.screen.height * 1.5 },
    { x: app.screen.width * 0.8, y: app.screen.height * 2.5 },
    { x: app.screen.width * 0.3, y: app.screen.height * 3.5 },
    { x: app.screen.width * 0.7, y: app.screen.height * 4.5 },
    { x: app.screen.width * 0.5, y: app.screen.height * 5.5 },
  ];

  let currentSection = 0;
  let targetX = shipPositions[0].x;
  let targetY = shipPositions[0].y;

  // Scroll event
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const sectionHeight = window.innerHeight;
    const newSection = Math.floor(scrollY / sectionHeight);
    if (newSection !== currentSection && newSection < shipPositions.length) {
      currentSection = newSection;
      targetX = shipPositions[currentSection].x;
      targetY = shipPositions[currentSection].y;
    }
  });

  // Animation loop
  app.ticker.add((time) => {
    // Animate stars
    stars.forEach((star) => {
      star.x += Math.cos(star.angle) * star.speed;
      star.y += Math.sin(star.angle) * star.speed;
      star.distance += star.speed;
      if (star.distance > maxDist) {
        star.x = centerX;
        star.y = centerY;
        star.angle = Math.random() * Math.PI * 2;
        star.speed = Math.random() * 2 + 1;
        star.distance = 0;
      }
    });

    // Move ship towards target
    const dx = targetX - ship.x;
    const dy = targetY - ship.y;
    ship.x += dx * 0.05;
    ship.y += dy * 0.05;

    // Rotate ship slightly
    ship.rotation = Math.sin(time.elapsedMS * 0.001) * 0.1;
  });

  // Handle resize
  window.addEventListener("resize", () => {
    app.resize();
    const newCenterX = app.screen.width / 2;
    const newCenterY = app.screen.height / 2;
    const newMaxDist = Math.max(app.screen.width, app.screen.height) / 2 + 100;
    // Update ship positions relative to new screen
    shipPositions.forEach((pos, index) => {
      if (index === 0) {
        pos.x = newCenterX;
        pos.y = newCenterY;
      } else {
        pos.x = (pos.x / centerX) * newCenterX;
        pos.y = (pos.y / centerY) * newCenterY;
      }
    });
    // Update variables
    centerX = newCenterX;
    centerY = newCenterY;
    maxDist = newMaxDist;
  });
})();
