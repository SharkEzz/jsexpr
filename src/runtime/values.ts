export enum ValueType {
  Boolean = 'Boolean',
  Null = 'Null',
  Number = 'Number',
  Object = 'Object',
  String = 'String',
}

export type RuntimeValue = NullVal | BooleanVal | NumberVal | ObjectVal | StringVal;

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

export function MK_OBJECT(object: object): ObjectVal {
  return {
    type: ValueType.Object,
    value: new Map(MK_OBJECT_VAL(object as Record<string, unknown>)),
  };
}

function MK_OBJECT_VAL(object: Record<string, unknown>): [string, RuntimeValue][] {
  const value = Object.keys(object).map<[string, RuntimeValue]>((key) => {
    const item = object[key];

    switch (typeof item) {
      case 'boolean':
        return [key, MK_BOOL(item)];
      case 'number':
        return [key, MK_NUMBER(item)];
      case 'string':
        return [key, MK_STRING(item)];
      case 'object':
        return [key, !!item ? MK_OBJECT(item) : MK_NULL()];
      default:
        throw new Error('Failed to create object');
    }
  });

  return value;
}
