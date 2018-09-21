declare type ThenHandle<T> = (onFulfilled: Function, onRejected: Function) => IFPromise<T>
declare type CatchHandle<T> = (onRejected: Function) => IFPromise<T>

declare type FulfilledHandle<T> = (value: T) => any
declare type RejectedHandle = (reason: any) => any

declare type Thenable<T> = {
  then: Function
}

declare type PromiseHandle <T> = (FulfilledHandle<T>, RejectedHandle) => any

type SequenceItem <T> = IFPromise<T> | FulfilledHandle<T> | RejectedHandle
declare type Sequence <T> = Array<SequenceItem<T>>

declare interface IFPromise<T> {
  constructor <T> (handle: Function): any;
  _result?: any;
  _status: number;
  _sequence: Sequence <T>;
  +then: ThenHandle<T>;
  +catch: CatchHandle<T>;
}
