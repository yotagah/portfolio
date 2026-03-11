import { Application, Graphics, Container, Sprite, Assets } from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({
    background: "#000000",
    resizeTo: window,
    canvas: document.getElementById("pixi-canvas"),
  });

  let centerX = app.screen.width / 2;
  let centerY = app.screen.height / 2;

  // Load background texture
  const bgTexture = await Assets.load("public/assets/saturn.jpg");

  // Create background sprite
  const bgSprite = new Sprite(bgTexture);
  bgSprite.anchor.set(0.5);
  bgSprite.x = centerX;
  bgSprite.y = centerY;
  const scaleX = app.screen.width / bgTexture.width;
  const scaleY = app.screen.height / bgTexture.height;
  bgSprite.scale.set(Math.max(scaleX, scaleY));
  app.stage.addChild(bgSprite);

  // Create a container for stars
  const starContainer = new Container();
  app.stage.addChild(starContainer);

  // Create stars
  const stars = [];
  let maxDist =
    Math.sqrt((app.screen.width / 2) ** 2 + (app.screen.height / 2) ** 2) + 100;
  for (let i = 0; i < 300; i++) {
    const star = new Graphics();
    star.beginFill(0xffffff);
    star.drawCircle(0, 0, Math.random() * 2 + 1);
    star.endFill();
    star.angle = Math.random() * Math.PI * 2;
    star.speed = Math.random() * 2 + 1;
    star.distance = Math.pow(Math.random(), 2) * maxDist;
    star.x = centerX + Math.cos(star.angle) * star.distance;
    star.y = centerY + Math.sin(star.angle) * star.distance;
    star.scale.set(0.3 + (star.distance / maxDist) * 1.7); // Smaller in center, larger at edges
    star.alpha = 0.2 + (1 - star.distance / maxDist) * 0.8; // Fade out towards edges
    starContainer.addChild(star);
    stars.push(star);
  }

  let animationTime = 0;

  // Animation loop
  app.ticker.add((time) => {
    animationTime += time.elapsedMS;

    // Animate stars
    stars.forEach((star) => {
      const fixedSpeed = star.speed * (star.distance / maxDist + 0.1) * 10; // Faster at edges
      star.x += Math.cos(star.angle) * fixedSpeed;
      star.y += Math.sin(star.angle) * fixedSpeed;
      star.distance += fixedSpeed; // Keep distance increasing at base speed
      star.scale.set(0.3 + (star.distance / maxDist) * 1.7); // Grow as they move out
      star.alpha = 0.2 + (1 - star.distance / maxDist) * 0.8; // Fade out towards edges
      if (star.distance > maxDist) {
        star.x = centerX;
        star.y = centerY;
        star.angle = Math.random() * Math.PI * 2;
        star.speed = Math.random() * 2 + 1;
        star.distance = 0;
        star.scale.set(0.3);
        star.alpha = Math.random() * 0.8 + 0.2;
      }
    });

    // Animate background
    bgSprite.y =
      centerY +
      Math.sin(animationTime * 0.001) * 5 +
      Math.sin(animationTime * 0.05) * 1;
  });

  // Handle resize
  window.addEventListener("resize", () => {
    app.resize();
    const newCenterX = app.screen.width / 2;
    const newCenterY = app.screen.height / 2;
    const newMaxDist =
      Math.sqrt(
        Math.pow(app.screen.width / 2, 2) + Math.pow(app.screen.height / 2, 2),
      ) + 100;
    // Update background
    const newScaleX = app.screen.width / bgTexture.width;
    const newScaleY = app.screen.height / bgTexture.height;
    bgSprite.scale.set(Math.max(newScaleX, newScaleY));
    bgSprite.x = newCenterX;
    bgSprite.y = newCenterY;
    // Update variables
    centerX = newCenterX;
    centerY = newCenterY;
    maxDist = newMaxDist;
  });
})();
