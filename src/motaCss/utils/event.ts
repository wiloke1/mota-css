import { OnData } from '../types';

export type Id = number;
interface Observer<ListenerT> {
  id: number;
  listener: ListenerT;
}
type Observers<ListenerT> = Observer<ListenerT>[];
interface Events {
  [eventType: string]: Observers<(data: any) => void>;
}
type ArrayElement<A> = A extends (infer T)[] ? T : never;
type Args<T> = T extends (args: infer D) => void ? D : never;

interface IEventEmitter<EventsT extends Events> {
  on<E extends keyof EventsT>(eventType: E, listener: ArrayElement<EventsT[E]>['listener']): Id;
  off(id: Id): void;
  emit<E extends keyof EventsT>(eventType: E, data: Args<ArrayElement<EventsT[E]>['listener']>): void;
}

class EventEmitter<EventsT extends Events> implements IEventEmitter<EventsT> {
  private id: Id;
  private events: EventsT;

  constructor() {
    this.id = 0;
    this.events = {} as EventsT;
  }

  public on<E extends keyof EventsT>(eventType: E, listener: ArrayElement<EventsT[E]>['listener']) {
    this.id++;
    this.events = {
      ...this.events,
      [eventType]: [
        ...(this.events[eventType] || []),
        {
          listener,
          id: this.id,
        },
      ],
    };
    return this.id;
  }

  public off(id: Id) {
    for (const eventType in this.events) {
      this.events = {
        ...this.events,
        [eventType]: this.events[eventType].filter(item => item.id !== id),
      };
    }
  }

  public emit<E extends keyof EventsT>(eventType: E, data: Args<ArrayElement<EventsT[E]>['listener']>) {
    if (this.events[eventType]) {
      this.events[eventType].forEach(({ listener }) => {
        listener(data);
      });
    }
  }
}

export const event = new EventEmitter<{
  success: Observers<(data: OnData) => void>;
  failure: Observers<(data: OnData) => void>;
}>();
