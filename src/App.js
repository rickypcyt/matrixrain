import React, { useEffect, useRef, useState } from "react";

const MatrixRain = () => {
  // Referencia al canvas
  const canvasRef = useRef(null);

  // Estado para el tamaño de la fuente
  const [fontSize, setFontSize] = useState(20);

  // Estado para los colores de la fuente
  const [fontColors, setFontColors] = useState(() => {
    const storedColors = localStorage.getItem("fontColors");
    return storedColors ? JSON.parse(storedColors) : ["#0F0"];
  });

  // Estado para controlar si el menú desplegable está abierto o cerrado
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Estado para la velocidad de la animación
  const [speed, setSpeed] = useState(3);

  // Estado para los tipos de caracteres seleccionados
  const [selectedCharacters, setSelectedCharacters] = useState([
    "Numbers",
    "Characters",
    "Katakana",
  ]);

  // Función para manejar el cambio de tamaño de fuente
  const handleFontSizeChange = (size) => {
    setFontSize(size);
    setDropdownOpen(false);
  };

  // Función para manejar el cambio de color de fuente
  const handleFontColorChange = (color) => {
    let updatedFontColors = [...fontColors];
    const colorIndex = updatedFontColors.indexOf(color);
    if (colorIndex !== -1) {
      updatedFontColors.splice(colorIndex, 1);
    } else {
      updatedFontColors = [...updatedFontColors, color];
    }
    setFontColors(updatedFontColors);
    localStorage.setItem("fontColors", JSON.stringify(updatedFontColors));
  };

  // Función para manejar el cambio de velocidad de animación
  const handleSpeedChange = (selectedSpeed) => {
    setSpeed(selectedSpeed);
    setDropdownOpen(false);
  };

  // Efecto para inicializar el canvas y la animación
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Caracteres para la animación
    const Katakana =
      "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
    const Characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const Numbers = "0123456789";
    let rainDrops = [];

    // Función para inicializar el canvas y los elementos de la animación
    const initialize = () => {
      canvas.width = window.innerWidth - 15;
      canvas.height = window.innerHeight;

      context.fillStyle = "#000";
      context.fillRect(0, 0, canvas.width, canvas.height);

      const numRainDrops = Math.floor(canvas.width / fontSize);

      for (let i = 0; i < numRainDrops; i++) {
        rainDrops[i] = Math.floor(Math.random() * canvas.height);
      }
    };

    // Función para dibujar la animación
    const draw = () => {
      context.fillStyle = "rgba(0, 0, 0, 0.05)";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.font = fontSize + "px monospace";

      let charactersToUse = "";
      if (selectedCharacters.includes("Numbers")) charactersToUse += Numbers;
      if (selectedCharacters.includes("Characters"))
        charactersToUse += Characters;
      if (selectedCharacters.includes("Katakana")) charactersToUse += Katakana;

      for (let i = 0; i < rainDrops.length; i++) {
        const colorIndex = i % fontColors.length;
        const color = fontColors[colorIndex];
        context.fillStyle = color;

        const text = charactersToUse.charAt(
          Math.floor(Math.random() * charactersToUse.length)
        );
        context.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    let animationFrameId;
    let lastTimestamp = 0;

    // Función para animar la matriz
    const animate = (timestamp) => {
      const deltaTime = timestamp - lastTimestamp;
      if (deltaTime > 1000 / (10 * speed)) {
        draw();
        lastTimestamp = timestamp;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    // Inicializar canvas y comenzar animación
    initialize();
    animationFrameId = requestAnimationFrame(animate);

    // Manejar cambio de tamaño de ventana
    const handleResize = () => {
      initialize();
    };

    window.addEventListener("resize", handleResize);

    // Limpieza del efecto
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [fontSize, fontColors, speed, selectedCharacters]);

  // Tamaños de fuente disponibles
  const fontSizes = [16, 20, 24, 28, 32];

  // Velocidades de animación disponibles
  const speeds = [1, 2, 3, 4];

  return (
    <div style={{ position: "relative" }}>
      <canvas ref={canvasRef}></canvas>

      {/* Menú desplegable para opciones */}
      {dropdownOpen && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "5px",
            zIndex: "100",
          }}
        >
          <div>
            <strong>Font Size:</strong>
            <br />
            {fontSizes.map((size) => (
              <label key={size}>
                <input
                  type="radio"
                  name="fontSize"
                  value={size}
                  checked={fontSize === size}
                  onChange={() => handleFontSizeChange(size)}
                />
                {size}px
              </label>
            ))}
          </div>
          <div>
            <strong>Font Color:</strong>
            <br />
            <div style={{ display: "flex", flexDirection: "column" }}>
              {["#0F0", "#00F", "#F00", "#FF0", "#0FF"].map((color) => (
                <label key={color} style={{ marginBottom: "5px" }}>
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: color,
                      display: "inline-block",
                      marginRight: "5px",
                    }}
                  ></span>
                  <input
                    type="checkbox"
                    value={color}
                    checked={fontColors.includes(color)}
                    onChange={() => handleFontColorChange(color)}
                  />
                </label>
              ))}
            </div>
          </div>
          <div>
            <strong>Animation Speed:</strong>
            <br />
            {speeds.map((s) => (
              <label key={s}>
                <input
                  type="radio"
                  name="speed"
                  value={s}
                  checked={speed === s}
                  onChange={() => handleSpeedChange(s)}
                />
                {s}x
              </label>
            ))}
          </div>
          <div>
            <strong>Characters:</strong>
            <br />
            {["Numbers", "Characters", "Katakana"].map((charType) => (
              <label key={charType}>
                <input
                  type="checkbox"
                  value={charType}
                  checked={selectedCharacters.includes(charType)}
                  onChange={() => {
                    const updatedCharacters = selectedCharacters.includes(
                      charType
                    )
                      ? selectedCharacters.filter((c) => c !== charType)
                      : [...selectedCharacters, charType];
                    setSelectedCharacters(updatedCharacters);
                  }}
                />
                {charType}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Botón para abrir/cerrar el menú desplegable */}
      <button
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "5px 10px",
          fontSize: "16px",
          cursor: "pointer",
          border: "none",
          borderRadius: "5px",
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          color: "#000",
        }}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        Options
      </button>
    </div>
  );
};

export default MatrixRain;
