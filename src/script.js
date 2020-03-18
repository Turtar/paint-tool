const canvas = document.getElementById('canvas');
const srcCanvas = document.getElementById('src-canvas');

let drawFlag = false;
let mode = 'pen';

document.getElementById('img-input').addEventListener('change', ev => {
  let img = new Image();
  img.src = window.URL.createObjectURL(ev.target.files[0]);

  img.onload = () => {
    let srcCtx = srcCanvas.getContext('2d');
    const SRC_CANVAS_W = 500;
    const SRC_CANVAS_H = 500 * (img.height / img.width);
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
  };
});

function drawBg() {
  let ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
drawBg();

document.getElementById('pen-btn').addEventListener('mousedown', ev => {
  // ペンフラグにする
  mode = 'pen';
  let ctx = canvas.getContext('2d');
  ctx.strokeStyle = 'rgb(0, 0, 0)';
});

document.getElementById('sampling-btn').addEventListener('mousedown', ev => {
  mode = 'sampling';
});

document.getElementById('eraser-btn').addEventListener('mousedown', ev => {
  // 消しゴムフラグにする
  mode = 'eraser';
  let ctx = canvas.getContext('2d');
  ctx.strokeStyle = 'rgb(255, 255, 255)';
});

document.getElementById('save-btn').addEventListener('mousedown', ev => {
  // 保存する
  const base64 = canvas.toDataURL('image/jpeg');
  document.getElementById('save-btn').href = base64;
});

function getMousePosition(ev) {
  const rect = ev.target.getBoundingClientRect();
  let x = ev.clientX - rect.left;
  let y = ev.clientY - rect.top;
  return [x, y];
}

let initX = 0;
canvas.addEventListener('mousedown', ev => {
  // マウスを押したときの最初の一点を指定
  // 描画フラグを立てる

  // ペンとサンプリングモードを変更

  drawFlag = true;
  let ctx = canvas.getContext('2d');

  let [x, y] = getMousePosition(ev);
  initX = 0;

  ctx.fillRect(x, y, 1, 1);

  if (mode === 'pen' || mode === 'eraser') {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else if (mode === 'sampling') {
    console.log();
    // サンプリンぐの描画をする
    const srcCtx = srcCanvas.getContext('2d');

    let imageData = srcCtx.getImageData(
      0,
      0,
      srcCanvas.width,
      srcCanvas.height
    );
    ctx.putImageData(
      imageData,
      x,
      y - imageData.height / 2.0,
      x,
      0,
      1,
      imageData.height
    );
  }
});
canvas.addEventListener('mousemove', ev => {
  console.log(true);
  // 描画フラグがたってる間
  // マウスを押しながら動かしたときにラインを引く
  if (!drawFlag) return;
  let ctx = canvas.getContext('2d');
  let [x, y] = getMousePosition(ev);
  if (mode === 'pen' || mode === 'eraser') {
    ctx.lineTo(x, y);
    ctx.stroke();
  } else if (mode === 'sampling') {
    // サンプリンぐの描画をする
    const srcCtx = srcCanvas.getContext('2d');
    let imageData = srcCtx.getImageData(
      0,
      0,
      srcCanvas.width,
      srcCanvas.height
    );
    ctx.putImageData(
      imageData,
      x,
      y - imageData.height / 2.0,
      initX,
      0,
      1,
      imageData.height
    );
    initX = x;
  }
});
canvas.addEventListener('mouseup', ev => {
  // マウスを離したときにラインを引くのを終了する
  // 描画フラグをおる
  //   ctx.closePath();
  drawFlag = false;
});
