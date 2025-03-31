"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { MessageCircle, X } from "lucide-react"
import { Button } from "./button"

interface ExpandableChatProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  position?: "bottom-right" | "bottom-left"
  icon?: React.ReactNode
  children: React.ReactNode
}

interface ExpandableChatHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
interface ExpandableChatBodyProps extends React.HTMLAttributes<HTMLDivElement> {}
interface ExpandableChatFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const ExpandableChatContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}>({
  isOpen: false,
  setIsOpen: () => {},
})

export function ExpandableChat({
  size = "md",
  position = "bottom-right",
  icon,
  className,
  children,
  ...props
}: ExpandableChatProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const sizeClasses = {
    sm: "w-[300px]",
    md: "w-[350px]",
    lg: "w-[400px]",
  }

  const positionClasses = {
    "bottom-right": "right-4 bottom-4",
    "bottom-left": "left-4 bottom-4",
  }

  return (
    <ExpandableChatContext.Provider value={{ isOpen, setIsOpen }}>
      <div className={cn("fixed z-50", positionClasses[position])} {...props}>
        <motion.button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {icon || <MessageCircle className="h-6 w-6" />}
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={cn(
                "absolute bottom-16",
                position === "bottom-right" ? "right-0" : "left-0",
                sizeClasses[size],
                "bg-white rounded-lg shadow-xl overflow-hidden flex flex-col",
                "border border-gray-200",
                className
              )}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ExpandableChatContext.Provider>
  )
}

export function ExpandableChatHeader({
  className,
  children,
  ...props
}: ExpandableChatHeaderProps) {
  const { setIsOpen } = React.useContext(ExpandableChatContext)

  return (
    <div
      className={cn("p-4 flex items-center justify-between", className)}
      {...props}
    >
      {children}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(false)}
        className="h-8 w-8 rounded-full"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function ExpandableChatBody({
  className,
  ...props
}: ExpandableChatBodyProps) {
  return (
    <div
      className={cn("flex-1 overflow-y-auto p-4 space-y-4", className)}
      {...props}
    />
  )
}

export function ExpandableChatFooter({
  className,
  ...props
}: ExpandableChatFooterProps) {
  return <div className={cn("p-4", className)} {...props} />
}

export function ChatMessageList({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const bottomRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [children])

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {children}
      <div ref={bottomRef} />
    </div>
  )
}

export function ChatInput({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex w-full resize-none border-0 bg-transparent px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      rows={1}
      {...props}
    />
  )
}
