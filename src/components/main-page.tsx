import { Board } from "./game/ui";

export function MainPage() {
    return(
        <main className="w-screen h-screen flex flex-col items-center justify-center">
            <Board />
        </main>
    )
}