/*
wa.me/6282285357346
github: https://github.com/sadxzyq
Instagram: https://instagram.com/tulisan.ku.id
ini wm gw cok jan di hapus
*/


const WebSocket = require("ws")
const fs = require("fs")

let wss = "wss://doevent-face-real-esrgan.hf.space/queue/join";

async function hd(resolusi, image) {
  return new Promise(async (resolve, reject) => {
    let result = {};
    let send_has_payload = {
      fn_index: 0,
      session_hash: "s3xzm2ie8hj",
    };

    let resolution = {
      low: "2x",
      medium: "4x",
      high: "8x",
    };
    let upTo = resolution[resolusi];

    let send_data_payload = {
      data: [
        "data:image/jpeg;base64," + image.toString("base64"),
        upTo, // Kalau mau di ubah juga bisa jadi "8x", "4x", atau "2x"
      ],
      event_data: null,
      fn_index: 0,
      session_hash: "s3xzm2ie8hj",
    };

    const ws = new WebSocket(wss);
    ws.onopen = function () {
      console.log("Connected to websocket");
    };

    ws.onmessage = async function (event) {
      let message = JSON.parse(event.data);

      switch (message.msg) {
        case "send_hash":
          ws.send(JSON.stringify(send_has_payload));
          break;

        case "send_data":
          console.log("Processing your image....");
          ws.send(JSON.stringify(send_data_payload));
          break;

        case "process_completed":
          result.base64 = message.output.data[0].replace(
            "data:image/png;base64,",
            "",
          );

          break;
      }
    };

    ws.onclose = function (event) {
      if (event.code === 1000) {
        console.log("Process completed️");
      } else {
        throw "Err : WebSocket Connection Error:\n";
      }
      resolve(result);
    };
  });
}

module.exports = { hd }