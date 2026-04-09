// src/constants/events.ts

// Mouse Events
export type MouseEvent = React.MouseEvent;
export type MouseEventHandler<T = Element> = React.MouseEventHandler<T>;

// Keyboard Events
export type KeyboardEvent = React.KeyboardEvent;
export type KeyboardEventHandler<T = Element> = React.KeyboardEventHandler<T>;

// Form Events
export type FormEvent = React.FormEvent;
export type FormEventHandler<T = Element> = React.FormEventHandler<T>;

// Change Events
export type ChangeEvent = React.ChangeEvent;
export type ChangeEventHandler<T = Element> = React.ChangeEventHandler<T>;
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type InputChangeEventHandler =
  React.ChangeEventHandler<HTMLInputElement>;

// Focus Events
export type FocusEvent = React.FocusEvent;
export type FocusEventHandler<T = Element> = React.FocusEventHandler<T>;

// Drag Events
export type DragEvent = React.DragEvent;
export type DragEventHandler<T = Element> = React.DragEventHandler<T>;

// Clipboard Events
export type ClipboardEvent = React.ClipboardEvent;
export type ClipboardEventHandler<T = Element> = React.ClipboardEventHandler<T>;

// Pointer Events
export type PointerEvent = React.PointerEvent;
export type PointerEventHandler<T = Element> = React.PointerEventHandler<T>;

// Touch Events
export type TouchEvent = React.TouchEvent;
export type TouchEventHandler<T = Element> = React.TouchEventHandler<T>;

// Wheel Events
export type WheelEvent = React.WheelEvent;
export type WheelEventHandler<T = Element> = React.WheelEventHandler<T>;

// Animation Events
export type AnimationEvent = React.AnimationEvent;
export type AnimationEventHandler<T = Element> = React.AnimationEventHandler<T>;

// Transition Events
export type TransitionEvent = React.TransitionEvent;
export type TransitionEventHandler<T = Element> =
  React.TransitionEventHandler<T>;
