import { ModelCol, ModelAutoUUID, ModelEnter } from '../src/index';

@ModelEnter()
export class Demo {
  @ModelAutoUUID()
  uuid = '';

  @ModelCol({})
  test1 = '';

  constructor(p) {}
}

const demo = new Demo({});
console.log(demo);
