"use client";

import type { CaptionPosition } from "@/shared/api/types";
import {
  CAPTION_POSITIONS,
  FONT_SCALE_STEP,
  MAX_CAPTION_LENGTH,
  MAX_CAPTIONS,
  MAX_FONT_SCALE,
  MIN_CAPTIONS,
  MIN_FONT_SCALE,
} from "@/shared/constants";
import { Button } from "@/shared/ui/button";
import type { CaptionDraft } from "./caption-draft";

const POSITION_LABELS: Record<CaptionPosition, string> = {
  top: "Top",
  center: "Center",
  bottom: "Bottom",
};

const fieldClasses =
  "min-h-11 rounded-lg border border-border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring";

interface CaptionEditorProps {
  captions: CaptionDraft[];
  errors: Record<string, string | undefined>;
  disabled: boolean;
  onChange: (id: string, patch: Partial<CaptionDraft>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

export function CaptionEditor({
  captions,
  errors,
  disabled,
  onChange,
  onAdd,
  onRemove,
}: CaptionEditorProps) {
  return (
    <section aria-labelledby="captions-heading" className="space-y-4">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="captions-heading" className="text-lg font-semibold">
          Captions
        </h2>
        <p className="text-sm text-muted">
          {captions.length} / {MAX_CAPTIONS}
        </p>
      </div>

      <ol className="space-y-4">
        {captions.map((caption, index) => (
          <li key={caption.id}>
            <CaptionRow
              caption={caption}
              index={index}
              error={caption.touched ? errors[caption.id] : undefined}
              disabled={disabled}
              canRemove={captions.length > MIN_CAPTIONS}
              onChange={(patch) => onChange(caption.id, patch)}
              onRemove={() => onRemove(caption.id)}
            />
          </li>
        ))}
      </ol>

      <Button
        variant="secondary"
        onClick={onAdd}
        disabled={disabled || captions.length >= MAX_CAPTIONS}
        className="w-full sm:w-auto"
      >
        Add caption
      </Button>
    </section>
  );
}

interface CaptionRowProps {
  caption: CaptionDraft;
  index: number;
  error: string | undefined;
  disabled: boolean;
  canRemove: boolean;
  onChange: (patch: Partial<CaptionDraft>) => void;
  onRemove: () => void;
}

function CaptionRow({
  caption,
  index,
  error,
  disabled,
  canRemove,
  onChange,
  onRemove,
}: CaptionRowProps) {
  const base = caption.id;
  const number = index + 1;
  const counterId = `${base}-counter`;
  const errorId = `${base}-error`;

  return (
    <fieldset
      disabled={disabled}
      className="space-y-3 rounded-xl border border-border bg-surface p-4"
    >
      <legend className="sr-only">Caption {number}</legend>

      <div className="space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor={`${base}-text`} className="text-sm font-medium">
            Caption {number}
          </label>
          <span id={counterId} className="text-xs text-muted tabular-nums">
            {caption.text.length} / {MAX_CAPTION_LENGTH}
          </span>
        </div>
        <input
          id={`${base}-text`}
          type="text"
          value={caption.text}
          maxLength={MAX_CAPTION_LENGTH}
          autoComplete="off"
          placeholder={
            caption.position === "bottom" ? "Bottom text" : "Top text"
          }
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${counterId} ${errorId}` : counterId}
          onChange={(event) => onChange({ text: event.target.value })}
          onBlur={() => onChange({ touched: true })}
          className={`${fieldClasses} w-full ${error ? "border-danger" : ""}`}
        />
        {error ? (
          <p id={errorId} className="text-sm text-danger">
            {error}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_auto_1.5fr]">
        <div className="flex flex-col gap-1">
          <label htmlFor={`${base}-position`} className="text-sm font-medium">
            Position
          </label>
          <select
            id={`${base}-position`}
            value={caption.position}
            onChange={(event) =>
              onChange({ position: event.target.value as CaptionPosition })
            }
            className={fieldClasses}
          >
            {CAPTION_POSITIONS.map((position) => (
              <option key={position} value={position}>
                {POSITION_LABELS[position]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={`${base}-color`} className="text-sm font-medium">
            Colour
          </label>
          <div className="flex min-h-11 items-center gap-2">
            <input
              id={`${base}-color`}
              type="color"
              value={caption.color.toLowerCase()}
              onChange={(event) =>
                onChange({ color: event.target.value.toUpperCase() })
              }
              className="h-11 w-12 cursor-pointer rounded-lg border border-border bg-background p-1 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
            />
            <span className="font-mono text-xs text-muted" aria-hidden="true">
              {caption.color.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-1 sm:col-span-1">
          <div className="flex items-baseline justify-between gap-2">
            <label htmlFor={`${base}-size`} className="text-sm font-medium">
              Font size
            </label>
            <output
              htmlFor={`${base}-size`}
              className="text-xs text-muted tabular-nums"
            >
              {caption.fontScale.toFixed(1)}×
            </output>
          </div>
          <input
            id={`${base}-size`}
            type="range"
            min={MIN_FONT_SCALE}
            max={MAX_FONT_SCALE}
            step={FONT_SCALE_STEP}
            value={caption.fontScale}
            aria-valuetext={`${caption.fontScale.toFixed(1)} times`}
            onChange={(event) =>
              onChange({
                fontScale: Math.round(Number(event.target.value) * 10) / 10,
              })
            }
            className="h-11 w-full cursor-pointer accent-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="secondary"
          onClick={onRemove}
          disabled={!canRemove}
          aria-label={`Remove caption ${number}`}
        >
          Remove
        </Button>
      </div>
    </fieldset>
  );
}
