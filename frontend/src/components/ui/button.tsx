import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "danger"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uaf-green disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-uaf-green text-white hover:bg-green-800 shadow-md hover:shadow-lg": variant === "default",
                        "bg-uaf-accent text-uaf-dark hover:bg-yellow-500": variant === "secondary",
                        "border border-input bg-transparent hover:bg-uaf-muted text-uaf-dark": variant === "outline",
                        "hover:bg-uaf-muted hover:text-uaf-dark": variant === "ghost",
                        "bg-red-600 text-white hover:bg-red-700": variant === "danger",
                        "h-10 px-4 py-2": size === "default",
                        "h-9 rounded-md px-3": size === "sm",
                        "h-11 rounded-md px-8": size === "lg",
                        "h-10 w-10": size === "icon",
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
