/**
 * Simple Event Emitter — for decoupled event handling
 */

type Listener<T = any> = (data: T) => void;

export class Emitter<T = any> {
  private listeners: Set<Listener<T>> = new Set();

  on(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => this.listeners.delete(listener);
  }

  off(listener: Listener<T>): void {
    this.listeners.delete(listener);
  }

  emit(data: T): void {
    this.listeners.forEach((listener) => {
      try {
        listener(data);
      } catch (err) {
        console.error('[Emitter] Listener error:', err);
      }
    });
  }

  clear(): void {
    this.listeners.clear();
  }
}
