"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sent" | "received"
}

interface ChatBubbleMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sent" | "received"
  isLoading?: boolean
}

interface ChatBubbleAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  fallback: string
}

export function ChatBubble({
  variant = "received",
  className,
  children,
  ...props
}: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "flex w-max max-w-[80%] animate-in fade-in slide-in-from-bottom-1",
        variant === "sent" ? "ml-auto" : "mr-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function ChatBubbleMessage({
  variant = "received",
  isLoading,
  className,
  children,
  ...props
}: ChatBubbleMessageProps) {
  return (
    <div
      className={cn(
        "ml-2 rounded-2xl px-4 py-2 text-sm",
        variant === "sent"
          ? "bg-blue-100 text-blue-900"
          : "bg-gray-100 text-gray-900",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        children
      )}
    </div>
  )
}

export function ChatBubbleAvatar({
  src,
  fallback,
  className,
  ...props
}: ChatBubbleAvatarProps) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow",
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={fallback}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span className="text-xs font-medium">{fallback}</span>
      )}
    </div>
  )
}
