"use client";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const buttonVariants = cva("inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50", { variants: { variant: { default: "bg-primary text-primary-foreground hover:opacity-90", outline: "border bg-background hover:bg-muted", ghost: "hover:bg-muted", destructive: "bg-destructive text-destructive-foreground hover:opacity-90" }, size: { sm: "h-8 px-2", default: "h-9 px-3", lg: "h-10 px-4" } }, defaultVariants: { variant: "default", size: "default" } });
export function Button({ className, variant, size, asChild = false, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) { const Comp = asChild ? Slot : "button"; return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />; }
