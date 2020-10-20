/* eslint-disable no-process-exit */
import * as figlet from 'figlet';
import * as blessed from 'blessed';
import {resolve} from 'path';
const program = blessed.program();
const screen = blessed.screen({
  smartCSR: true,
});
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
screen.title = 'my window title';
const text = (text: string, opts: Record<string, any>): Promise<string> =>
  new Promise(resolve =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    resolve(figlet.textSync(text, {font: 'big', ...opts}))
  );
program.key(['escape', 'q', 'C-c'], () => {
  program.clear();
  program.disableMouse();
  program.showCursor();
  program.normalBuffer();
  process.exit(0);
});
let time = new Date();
(async () => {
  let textArray: string[] = (
    await text(
      `${time
        .getHours()
        .toString()
        .padEnd(2, '0')}-${time.getMinutes().toString().padStart(2, '0')}`,
      {
        horizontalLayout: 'full',
      }
    )
  ).split('\n');
  textArray.forEach((e, i) => (textArray[i] = `{center}${e}{/center}`));
  textArray.pop();
  // Create a box perfectly centered horizontally and vertically.
  const box = blessed.box({
    top: 'center',
    left: 'center',
    width: '300',
    valign: 'middle',
    height: '199',
    content: textArray.join('\n'),
    tags: true,
    border: {
      type: 'line',
    },
    style: {
      blink: true,
      border: {
        fg: '#f0f0f0',
      },
    },
  });
  box.setLabel(
    `${time
      .getDate()
      .toString()
      .padStart(2, '0')}/${time
      .getMonth()
      .toString()
      .padStart(2, '0')}/${time.getFullYear()}`
  );
  screen.title = 'Monday Tuesday Wednesday Thursday Friday Saturday Sunday'.split(
    ' '
  )[time.getDay()];
  // Append our box to the screen.
  screen.append(box);
  screen.render();
  setInterval(() => {
    box.setLabel(
      `${time
        .getDate()
        .toString()
        .padStart(2, '0')}/${time
        .getMonth()
        .toString()
        .padStart(2, '0')}/${time.getFullYear()}`
    );
    box.setContent(textArray.join('\n'));
    screen.render();
    time = new Date();
  }, 500);
  setInterval(async () => {
    textArray = (
      await text(
        `${time
          .getHours()
          .toString()
          .padEnd(2, '0')}=${time.getMinutes().toString().padStart(2, '0')}`,
        {
          horizontalLayout: 'full',
        }
      )
    ).split('\n');
    textArray.forEach((e, i) => (textArray[i] = `{center}${e}{/center}`));
    textArray.pop();
  }, 2000);
  await sleep(1000);
  setInterval(async () => {
    textArray = (
      await text(
        `${time
          .getHours()
          .toString()
          .padEnd(2, '0')}-${time.getMinutes().toString().padStart(2, '0')}`,
        {
          horizontalLayout: 'full',
        }
      )
    ).split('\n');
    textArray.forEach((e, i) => (textArray[i] = `{center}${e}{/center}`));
    textArray.pop();
    time = new Date();
  }, 2000);
})();
