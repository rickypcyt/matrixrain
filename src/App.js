import React, { useEffect, useRef, useState } from "react";

const MatrixRain = () => {
  const canvasRef = useRef(null);
  const [fontSize, setFontSize] = useState(20);
  const [fontColors, setFontColors] = useState(() => {
    const storedColors = localStorage.getItem("fontColors");
    return storedColors ? JSON.parse(storedColors) : ["#0F0"];
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [speed, setSpeed] = useState(4); // Default speed
  const [selectedCharacters, setSelectedCharacters] = useState([
    "Numbers",
    "Characters",
    "Katakana",
  ]);

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    setDropdownOpen(false);
  };

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

  const handleSpeedChange = (selectedSpeed) => {
    setSpeed(selectedSpeed);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const Katakana =
      "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
    const Characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const Numbers = "0123456789";
    let rainDrops = [];

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

    const draw = () => {
      context.fillStyle = "rgba(0, 0, 0, 0.05)";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.font = fontSize + "px monospace";

      let charactersToUse = "";
      if (selectedCharacters.includes("Numbers")) charactersToUse += Numbers;
      if (selectedCharacters.includes("Characters")) charactersToUse += Characters;
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

    const animate = (timestamp) => {
      const deltaTime = timestamp - lastTimestamp;
      if (deltaTime > 1000 / (10 * speed)) {
        // Adjust the denominator to control speed
        draw();
        lastTimestamp = timestamp;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    initialize();
    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [fontSize, fontColors, speed, selectedCharacters]);

  const fontSizes = [16, 20, 24, 28, 32];
  const speeds = [4, 3, 2, 1]; // Adjust speed options as needed

  return (
    <div style={{ position: "relative" }}>
      <canvas ref={canvasRef}></canvas>

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
            <strong>Tamaño de Fuente:</strong>
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
            <strong>Color de Fuente:</strong>
            <br />
            {["#0F0", "#00F", "#F00", "#FF0", "#0FF"].map((color) => (
              <label key={color}>
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
          <div>
            <strong>Velocidad de Animación:</strong>
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
            <strong>Caracteres:</strong>
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
