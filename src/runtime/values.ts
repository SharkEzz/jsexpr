import { Environment } from './environment';

export enum ValueType {
  Boolean = 'Boolean',
  Null = 'Null',
  Number = 'Number',
  Object = 'Object',
  String = 'String',
  FnValue = 'FnValue',
}

export type RuntimeValue = NullVal | BooleanVal | NumberVal | ObjectVal | StringVal | FnValue;

export interface RuntimeVal {
  type: ValueType;
  value: unknown;
}

export interface NullVal extends RuntimeVal {
  type: ValueType.Null;
  value: null;
}

export interface BooleanVal extends RuntimeVal {
  type: ValueType.Boolean;
  value: boolean;
}

export interface NumberVal extends RuntimeVal {
  type: ValueType.Number;
  value: number;
}

export interface ObjectVal extends RuntimeVal {
  type: ValueType.Object;
  value: Map<string, RuntimeValue>;
}

export interface StringVal extends RuntimeVal {
  type: ValueType.String;
  value: string;
}

export type FunctionCall = (args: RuntimeVal[], env: Environment) => RuntimeVal;

export interface FnValue extends RuntimeVal {
  type: ValueType.FnValue;
  value: FunctionCall;
}

export function MK_FUNC(call: FunctionCall): FnValue {
  return { type: ValueType.FnValue, value: call };
}

export function MK_BOOL(b = true): BooleanVal {
  return { type: ValueType.Boolean, value: b };
}

export function MK_NULL(): NullVal {
  return { type: ValueType.Null, value: null };
}

export function MK_STRING(str: string): StringVal {
  return { type: ValueType.String, value: str };
}

export function MK_NUMBER(nb: number): NumberVal {
  return { type: ValueType.Number, value: nb };
}

export function MK_OBJECT(object: Record<string, unknown>): ObjectVal {
  const value = Object.keys(object).map<[string, RuntimeValue]>((key) => {
    const item = object[key];

    const runtimeVal = MAKE_RUNTIME_VAL(item);

    return [key, runtimeVal];
  });

  return {
    type: ValueType.Object,
    value: new Map(value),
  };
}

export function MAKE_RUNTIME_VAL<T>(value: T): RuntimeValue {
  switch (typeof value) {
    case 'boolean':
      return MK_BOOL(value);
    case 'number':
      return MK_NUMBER(value);
    case 'string':
      return MK_STRING(value);
    case 'object':
      return value ? MK_OBJECT(value as Record<string, unknown>) : MK_NULL();
    case 'undefined':
      return MK_NULL();
    default:
      throw new Error('Not handled');
  }
}
