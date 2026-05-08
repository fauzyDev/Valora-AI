"use client"

/**
 * tooltip.tsx
 *
 * Wrappers kecil di atas komponen Tooltip dari paket `@base-ui/react/tooltip`.
 * Semua dokumentasi disediakan dalam Bahasa Indonesia.
 */

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import React from "react";
import { cn } from "@/lib/utils";

/**
 * TooltipProvider
 *
 * Provider yang membungkus tooltip (mis. untuk mengatur delay global).
 * Parameter `delay` default ke 0.
 */
function TooltipProvider({
  delay = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (<TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delay} {...props} />);
}

/**
 * Tooltip
 *
 * Root wrapper untuk instance tooltip. Gunakan ini untuk mengelompokkan
 * `TooltipTrigger` dan `TooltipContent`.
 */
function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

/**
 * TooltipTrigger
 *
 * Trigger yang akan menampilkan tooltip saat di-hover atau difokus.
 * Komponen ini hanya meneruskan props ke `TooltipPrimitive.Trigger`.
 */
function TooltipTrigger({
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return (
    <TooltipPrimitive.Trigger 
      data-slot="tooltip-trigger"
      {...props}
    >
      {children}
    </TooltipPrimitive.Trigger>
  );
}

interface TooltipContentProps extends React.ComponentProps<typeof TooltipPrimitive.Popup> {
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  alignOffset?: number;
}

/**
 * TooltipContent
 *
 * Konten tooltip yang muncul. Parameter seperti `side`, `align`, dan `sideOffset`
 * dapat dikonfigurasi untuk mengubah posisi popup.
 */
function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50">
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}>
          {children}
          <TooltipPrimitive.Arrow
            className="z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5" />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
