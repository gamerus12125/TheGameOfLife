import { ButtonHTMLAttributes, LegacyRef, Ref } from "react";

type ButtonProps = {
    buttonRef?: LegacyRef<HTMLButtonElement>
    className?: string
    variant: "primary" | "secondary"
} & ButtonHTMLAttributes<HTMLButtonElement>
export function UiButton({ buttonRef, className, variant, ...props}: ButtonProps) {
    return <button className={`${variant === "primary" ? "bg-emerald-500 hover:bg-emerald-700" : "bg-rose-500 hover:bg-rose-700"} p-3 rounded-xl  transition-colors ${className}`} ref={buttonRef} {...props}></button>
}