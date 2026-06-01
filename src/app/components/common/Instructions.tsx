'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

function parseSteps(text: string): string[] {
  const byLine = text.split(/\r\n|\n|\r/).map(s => s.trim()).filter(Boolean);
  if (byLine.length > 1) return stripLeadingNumbers(byLine);

  const byNumbered = text
    .split(/(?:^|\s)(?:step\s*)?\d+[\.\-\)]\s*/i)
    .map(s => s.trim())
    .filter(s => s.length > 4);
  if (byNumbered.length > 1) return byNumbered;

  const bySentence = text
    .split(/\.\s+(?=[A-Z])/)
    .map(s => s.trim().replace(/\.$/, ''))
    .filter(s => s.length > 8);
  if (bySentence.length > 1) return bySentence;

  return [text.trim()];
}

function stripLeadingNumbers(steps: string[]): string[] {
  return steps.map(s => s.replace(/^(?:step\s*)?\d+[\.\-\)]\s*/i, '').trim()).filter(Boolean);
}

interface InstructionsProps {
  instructions?: string;
}

export function Instructions({ instructions }: InstructionsProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (!instructions) return null;

  const steps = parseSteps(instructions);

  return (
    <div className="mt-6 md:mt-12 bg-background/80 dark:bg-background/60 backdrop-blur-lg rounded-2xl shadow-md border border-border animate-slide-up overflow-hidden">
      {/* Header — matches IngredientSection header exactly */}
      <div
        className="flex items-center justify-between px-4 py-4 lg:px-6 lg:py-5 cursor-pointer hover:bg-accent/5 transition-colors"
        onClick={() => setCollapsed(prev => !prev)}
        role="button"
        aria-expanded={!collapsed}
      >
        <h2 className="text-lg lg:text-xl font-semibold text-foreground">
          Instructions
          <span className="ml-2 text-sm font-normal text-foreground/40">
            ({steps.length} {steps.length === 1 ? 'step' : 'steps'})
          </span>
        </h2>
        {collapsed
          ? <ChevronDownIcon className="w-5 h-5 text-foreground/50 flex-shrink-0" />
          : <ChevronUpIcon className="w-5 h-5 text-foreground/50 flex-shrink-0" />
        }
      </div>

      {/* Steps */}
      {!collapsed && (
        <div className="px-4 pb-4 lg:px-6 lg:pb-6">
          <ol className="space-y-4">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5 select-none">
                  {i + 1}
                </span>
                <p className="flex-1 text-foreground/80 leading-relaxed break-words text-sm lg:text-base">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
