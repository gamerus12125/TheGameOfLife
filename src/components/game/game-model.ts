import {
  CELL_BORDER,
  CELL_HEIGHT_COUNT,
  CELL_SIZE,
  CELL_WIDTH_COUNT,
  HEIGHT,
  WIDTH,
} from "@/utils/constants";

type Cell = {
  checked: boolean;
};

export class Game {
  context: CanvasRenderingContext2D;
  board: Array<Array<Cell>> = [];
  savedValue: boolean | undefined = undefined;
  timerId: NodeJS.Timeout | undefined = undefined;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;

    this.initBoard();
  }

  getCell = (x: number, y: number) => {
    if (
      typeof this.board[x] === "undefined" ||
      typeof this.board[x][y] === "undefined"
    ) {
      return { checked: false };
    } else {
      return this.board[x][y];
    }
  };

  setCell = (x: number, y: number, value: Cell, arr?: Array<Array<Cell>>) => {
    if (arr) {
      arr[x][y] = value;
    } else {
      this.board[x][y] = value;
    }
  };

  getCoords = (e: MouseEvent) => {
    return {
      x: Math.floor(e.offsetX / CELL_SIZE),
      y: Math.floor(e.offsetY / CELL_SIZE),
    };
  };

  clearSavedValue = () => {
    this.savedValue = undefined;
  };

  initBoard = () => {
    // Заполнение фона
    this.context.fillStyle = "black";
    this.context.fillRect(0, 0, WIDTH, HEIGHT);

    // Инициализация доски
    for (let y = 0; y < CELL_HEIGHT_COUNT; y++) {
      this.board[y] = [];
      for (let x = 0; x < CELL_WIDTH_COUNT; x++) {
        this.board[y][x] = { checked: false };
      }
    }
    // Заполнение сетки
    this.context.fillStyle = "teal";
    for (let cell_x = 0; cell_x < WIDTH; cell_x += CELL_SIZE) {
      this.context.fillRect(cell_x, 0, CELL_BORDER, HEIGHT);
    }
    for (let cell_y = 0; cell_y < WIDTH; cell_y += CELL_SIZE) {
      this.context.fillRect(0, cell_y, WIDTH, CELL_BORDER);
    }
  };

  toggleCell = (e: MouseEvent) => {
    if ((e.type === "mousemove" && e.buttons > 0) || e.type === "mousedown") {
      const { x, y } = this.getCoords(e);
      const isChecked = this.getCell(x, y).checked;

      if (this.savedValue === undefined) {
        this.savedValue = !isChecked;
      }

      this.drawCell(x, y, this.savedValue);
    }
  };

  findNeighbors = (x: number, y: number) => {
    let counter = 0;
    if (this.getCell(x - 1, y).checked) {
      counter++;
    }
    if (this.getCell(x - 1, y - 1).checked) {
      counter++;
    }
    if (this.getCell(x - 1, y + 1).checked) {
      counter++;
    }
    if (this.getCell(x + 1, y).checked) {
      counter++;
    }

    if (this.getCell(x + 1, y - 1).checked) {
      counter++;
    }
    if (this.getCell(x + 1, y + 1).checked) {
      counter++;
    }

    if (this.getCell(x, y + 1).checked) {
      counter++;
    }

    if (this.getCell(x, y - 1).checked) {
      counter++;
    }
    return counter;
  };

  drawCells = (board: Array<Array<Cell>>) => {
    for (let y = 0; y < CELL_HEIGHT_COUNT; y++) {
      for (let x = 0; x < CELL_WIDTH_COUNT; x++) {
        this.drawCell(x, y, board[x][y].checked);
      }
    }
  };

  drawCell = (x: number, y: number, value: boolean) => {
    this.setCell(x, y, { checked: value });

    if (!value) {
      this.context.fillStyle = "black";
    } else {
      this.context.fillStyle = "teal";
    }

    this.context.fillRect(
      x * CELL_SIZE + CELL_BORDER,
      y * CELL_SIZE + CELL_BORDER,
      CELL_SIZE - CELL_BORDER,
      CELL_SIZE - CELL_BORDER
    );
  };

  update = () => {
    const newBoard = JSON.parse(JSON.stringify(this.board));
    for (let y = 0; y < CELL_HEIGHT_COUNT; y++) {
      for (let x = 0; x < CELL_WIDTH_COUNT; x++) {
        const cell = this.getCell(x, y);
        const neighbors = this.findNeighbors(x, y);
        if (cell.checked) {
          if (neighbors !== 2 && neighbors !== 3) {
            this.setCell(x, y, { checked: false }, newBoard);
          }
        } else {
          if (neighbors === 3) {
            this.setCell(x, y, { checked: true }, newBoard);
          }
        }
      }
    }
    this.drawCells(newBoard);
  };

  startGame = () => {
    this.timerId = setInterval(this.update, 100);
  };

  stopGame = () => {
    clearInterval(this.timerId);
    this.timerId = undefined;
  };
}
