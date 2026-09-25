import React from "react";
import { GlassFilter } from "../ui/liquid-radio";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export default function GenderInput({ value, onChange }) {
  return (
    <div className="inline-flex h-9 rounded-lg bg-input/50 p-0.5">
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="group relative inline-grid grid-cols-2 items-center gap-2 text-sm font-medium after:absolute after:inset-y-0 after:w-1/2 after:rounded-md after:bg-background/80 after:shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] after:transition-transform after:duration-300 after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] has-[:focus-visible]:after:outline has-[:focus-visible]:after:outline-2 has-[:focus-visible]:after:outline-ring/70 data-[state=B]:after:translate-x-0 data-[state=G]:after:translate-x-full"
        data-state={value}
      >
        <div
          className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-md"
          style={{ filter: 'url("#radio-glass")' }}
        />
        
        {/* Boy Option */}
        <label
          htmlFor="gender-B"
          className="relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-4 transition-colors text-muted-foreground/70 group-data-[state=G]:text-muted-foreground/70 group-data-[state=B]:text-foreground"
        >
          Boy
          <RadioGroupItem id="gender-B" value="B" className="sr-only" />
        </label>

        {/* Girl Option */}
        <label
          htmlFor="gender-G"
          className="relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-4 transition-colors text-muted-foreground/70 group-data-[state=B]:text-muted-foreground/70 group-data-[state=G]:text-foreground"
        >
          Girl
          <RadioGroupItem id="gender-G" value="G" className="sr-only" />
        </label>

        <GlassFilter />
      </RadioGroup>
    </div>
  );
}