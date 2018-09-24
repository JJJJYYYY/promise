declare type ThenHandle<T> = (onFulfilled: Function, onRejected: Function) => IFPromise<T>
declare type CatchHandle<T> = (onRejected: Function) => IFPromise<T>

declare type FulfilledHandle<T> = (value?: T) => void
declare type RejectedHandle = (reason: any) => void

declare type Thenable<T> = {
  then: Function
}

declare type PromiseHandle <T> = (onFulfilled: FulfilledHandle<T>, onRejected: RejectedHandle) => void

type SequenceItem <T> = IFPromise<T> | FulfilledHandle<T> | RejectedHandle
declare type Sequence <T> = Array<SequenceItem<T>>

declare interface IFPromise<T> {
  constructor (handle: PromiseHandle<T>): void;
  _result?: T;
  _status: number;
  _sequence: Sequence<T>;
  +then: ThenHandle<T>;
  +catch: CatchHandle<T>;
}
