import { MK_BOOL, MK_NULL, MK_NUMBER, MK_OBJECT, MK_STRING, RuntimeValue } from './values';

export function createGlobalEnv() {
  const env = new Environment();
  env.declareVar('true', MK_BOOL(true));
  env.declareVar('false', MK_BOOL(false));
  env.declareVar('null', MK_NULL());

  return env;
}

export class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeValue>;
  // private isGlobal = false;

  constructor(parentENV?: Environment) {
    // this.isGlobal = !!parentENV;
    this.parent = parentENV;
    this.variables = new Map();
  }

  declareVar<T extends RuntimeValue>(varname: string, value: T) {
    if (this.variables.has(varname)) {
      throw new Error('Cannot declare variable as it is already defined');
    }

    this.variables.set(varname, value);
    return value;
  }

  declareVarFromJS<T>(varname: string, value: T) {
    if (this.variables.has(varname)) {
      throw new Error('Cannot declare variable as it is already defined');
    }

    switch (typeof value) {
      case 'number':
        this.variables.set(varname, MK_NUMBER(value));
        break;
      case 'boolean':
        this.variables.set(varname, MK_BOOL(value));
        break;
      case 'object':
        this.variables.set(varname, value ? MK_OBJECT(value) : MK_NULL()); // Handle special case where typeof null === 'object'
        break;
      case 'string':
        this.variables.set(varname, MK_STRING(value));
        break;
      case 'undefined':
        this.variables.set(varname, MK_NULL());
      default:
        throw new Error(`Invalid value type: ${typeof value}`);
    }

    return this.lookupVar(varname);
  }

  lookupVar(varname: string): RuntimeValue {
    const env = this.resolve(varname);
    return env.variables.get(varname) as RuntimeValue;
  }

  resolve(varname: string): Environment {
    if (this.variables.has(varname)) {
      return this;
    }

    if (this.parent === undefined) {
      throw new Error('Cannot resolve variable as it does not exist.');
    }

    return this.parent.resolve(varname);
  }
}
