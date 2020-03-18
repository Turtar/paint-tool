const canvas = document.getElementById("canvas");
const srcCanvas = document.getElementById("src-canvas");
const ctx = canvas.getContext("2d");

let drawFlag = false;
let mode = "pen";
// let img;
let imgData;
let startX = 0;
let offsetX = 0;

document.getElementById("img-input").addEventListener("change", ev => {
  img = new Image();
  img.src = window.URL.createObjectURL(ev.target.files[0]);

  img.onload = () => {
    let srcCtx = srcCanvas.getContext("2d");
    // const SRC_CANVAS_W = 500;
    // const SRC_CANVAS_H = 500 * (img.height / img.width);
    const SRC_CANVAS_W = 100 * (img.width / img.height);
    const SRC_CANVAS_H = 100;
    srcCanvas.width = SRC_CANVAS_W;
    srcCanvas.height = SRC_CANVAS_H;
    srcCtx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      SRC_CANVAS_W,
      SRC_CANVAS_H
    );
    imgData = srcCtx.getImageData(0, 0, srcCanvas.width, srcCanvas.height);
  };
});

function drawBg() {
  // let ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
drawBg();

document.getElementById("pen-btn").addEventListener("mousedown", ev => {
  // ペンフラグにする
  mode = "pen";
  // let ctx = canvas.getContext("2d");
  ctx.strokeStyle = "rgb(0, 0, 0)";
});

document.getElementById("sampling-btn").addEventListener("mousedown", ev => {
  mode = "sampling";
});

document.getElementById("eraser-btn").addEventListener("mousedown", ev => {
  // 消しゴムフラグにする
  mode = "eraser";
  // let ctx = canvas.getContext("2d");
  ctx.strokeStyle = "rgb(255, 255, 255)";
});

document.getElementById("save-btn").addEventListener("mousedown", ev => {
  // 保存する
  const base64 = canvas.toDataURL("image/jpeg");
  document.getElementById("save-btn").href = base64;
});

function getMousePosition(ev) {
  const rect = ev.target.getBoundingClientRect();
  let x = ev.clientX - rect.left;
  let y = ev.clientY - rect.top;
  return [x, y];
}

function drawPen(x, y) {
  if (!drawFlag) {
    ctx.fillRect(x, y, 1, 1);
    ctx.beginPath();
    ctx.moveTo(x, y);
    return;
  }
  ctx.lineTo(x, y);
  ctx.stroke();
}

function drawSampling(x, y) {
  // サンプリンぐの描画をする
  if (!drawFlag) {
    offsetX = 0;
  }
  ctx.putImageData(
    imgData,
    x,
    y - imgData.height / 2.0,
    offsetX,
    0,
    1,
    imgData.height
  );
  offsetX++;
}

canvas.addEventListener("mousedown", ev => {
  let [x, y] = getMousePosition(ev);
  if (mode === "pen" || mode === "eraser") {
    drawPen(x, y);
  } else if (mode === "sampling") {
    drawSampling(x, y);
  }
  drawFlag = true;
});

canvas.addEventListener("mousemove", ev => {
  if (!drawFlag) return;
  let [x, y] = getMousePosition(ev);
  if (mode === "pen" || mode === "eraser") {
    drawPen(x, y);
  } else if (mode === "sampling") {
    drawSampling(x, y);
  }
});

canvas.addEventListener("mouseup", ev => {
  drawFlag = false;
});
