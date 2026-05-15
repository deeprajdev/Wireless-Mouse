const WebSocket = require('ws');
const express = require('express');
const path = require('path');

const {
  mouse,
  Button,
  Point
} = require('@nut-tree-fork/nut-js');

const httpApp = express();

httpApp.use(express.static(path.join(__dirname, 'public')));

const server = httpApp.listen(3000, () => {
  console.log('HTTP server running on port 3000');
});

const wss = new WebSocket.Server({ server });

console.log('WebSocket server running');

mouse.config.mouseSpeed = 1500;

const SCROLL_SPEED_MULTIPLIER = 8;

wss.on('connection', (ws) => {

  console.log('Phone connected!');

  ws.on('message', async (raw) => {

    try {

      const msg = JSON.parse(raw);

      // MOVE MOUSE
      if (msg.type === 'move') {

        const pos = await mouse.getPosition();

        await mouse.setPosition(
          new Point(
            pos.x + msg.dx,
            pos.y + msg.dy
          )
        );
      }

      // CLICK
      if (msg.type === 'click') {

        await mouse.click(
          msg.button === 'right'
            ? Button.RIGHT
            : Button.LEFT
        );
      }

      // SCROLL
      if (msg.type === 'scroll') {

        const scrollAmount =
        Math.max(
          1,
          Math.round(Math.abs(msg.dy) * SCROLL_SPEED_MULTIPLIER)
        );

        if (msg.dy > 0) {
          await mouse.scrollDown(scrollAmount);
        }

        if (msg.dy < 0) {
          await mouse.scrollUp(scrollAmount);
        }
      }

    } catch (err) {

      console.log('Error:', err);

    }

  });

  ws.on('close', () => {

    console.log('Phone disconnected');

  });

});
