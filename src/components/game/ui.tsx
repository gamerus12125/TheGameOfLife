"use client";
import { HEIGHT, WIDTH } from "@/utils/constants";
import { useEffect, useRef, useState } from "react";
import { UiButton } from "../ui/ui-button";
import { Game } from "./game-model";

export function Board() {
  const [isStop, toggleStop] = useState(true);
  const canvasRef = useRef(null);
  const clearButtonRef = useRef(null);
  const startButtonRef = useRef(null);
  const stopButtonRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    const clearButton = clearButtonRef.current as HTMLButtonElement | null;
    const startButton = startButtonRef.current as HTMLButtonElement | null;
    const stopButton = stopButtonRef.current as HTMLButtonElement | null;
    const context = canvas?.getContext("2d");
    if (context) {
      const game = new Game(context);

      const toggleGameCell = (e: MouseEvent) => {
        game.toggleCell(e);
      };

      canvas?.addEventListener("mousemove", toggleGameCell, true);
      canvas?.addEventListener("mousedown", toggleGameCell, true);
      canvas?.addEventListener("mouseup", game.clearSavedValue, true);
      clearButton?.addEventListener("click", game.initBoard, true);
      startButton?.addEventListener("click", game.startGame, true);
      stopButton?.addEventListener("click", game.stopGame, true);

      return () => {
        canvas?.removeEventListener("mousemove", toggleGameCell, true);
        canvas?.removeEventListener("mousedown", toggleGameCell, true);
        canvas?.removeEventListener("mouseup", game.clearSavedValue, true);
        clearButton?.removeEventListener("click", game.initBoard, true);
        startButton?.removeEventListener("click", game.startGame, true);
        stopButton?.removeEventListener("click", game.stopGame, true);
      };
    }
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        className="border-4 border-emerald-500 rounded-xl"
      />
      <div className="flex gap-5 justify-center">
        <UiButton
          type="button"
          buttonRef={startButtonRef}
          onClick={() => toggleStop(false)}
          disabled={!isStop}
          variant={isStop ? "primary" : "secondary"}
        >
          Старт
        </UiButton>
        <UiButton
          type="button"
          onClick={() => toggleStop(true)}
          variant={!isStop ? "primary" : "secondary"}
          disabled={isStop}
          buttonRef={stopButtonRef}
        >
          Стоп
        </UiButton>
        <UiButton type="button" buttonRef={clearButtonRef} variant="primary">
          Очистить
        </UiButton>
      </div>
    </div>
  );
}
