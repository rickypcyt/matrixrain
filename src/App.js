import React, { useEffect, useRef } from "react";

const MatrixRain = () => {
  const canvasRef = useRef(null);
  const katakana =
    "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
  const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "0123456789";
  let context;
  let fontSize = 20;
  let rainDrops = [];

  useEffect(() => {
    const canvas = canvasRef.current;
    context = canvas.getContext("2d");

    // Función para inicializar el lienzo y las gotas de lluvia
    const initialize = () => {
      // Establecer el tamaño del lienzo
      canvas.width = window.innerWidth-15;
      canvas.height = window.innerHeight;

      // Calcular el número de gotas de lluvia basado en el ancho del lienzo
      const numRainDrops = Math.floor(canvas.width / fontSize);

      // Inicializar la posición vertical de las gotas de lluvia
      for (let i = 0; i < numRainDrops; i++) {
        rainDrops[i] = Math.floor(Math.random() * canvas.height);
      }
    };

    // Función para dibujar en el lienzo
    const draw = () => {
      context.fillStyle = "rgba(0, 0, 0, 0.05)";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = "#0F0";
      context.font = fontSize + "px monospace";

      const alphabet =
        katakana + nums + latin;

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(
          Math.floor(Math.random() * alphabet.length)
        );
        context.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    // Función para inicializar y comenzar la animación
    const animate = () => {
      initialize();

      // Llama a la función 'draw' repetidamente para animar el lienzo
      const loop = () => {
        draw();
        setTimeout(loop, 50); // Change the time delay here to make it slower
      };

      loop(); // Comienza la animación
    };

    // Iniciar la animación cuando se cargue el DOM
    animate();

    // Limpiar el lienzo cuando el componente se desmonte
    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default MatrixRain;
