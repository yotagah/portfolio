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
  for (let i = 0; i < 200; i++) {
    const star = new Graphics();
    star.beginFill(0xffffff, Math.random() * 0.8 + 0.2);
    star.drawCircle(0, 0, Math.random() * 2 + 1);
    star.endFill();
    star.x = Math.random() * app.screen.width;
    star.y = Math.random() * app.screen.height * 2; // Extra height for scroll
    star.speed = Math.random() * 0.5 + 0.1;
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
      star.y -= star.speed;
      if (star.y < -10) {
        star.y = app.screen.height + 10;
        star.x = Math.random() * app.screen.width;
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
    // Recalculate positions if needed
  });
})();
