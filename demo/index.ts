import { ModelCol, ModelAutoUUID, ModelEnter, ModelBaseClass } from '../src/index';

@ModelEnter()
export class Demo extends ModelBaseClass {
  @ModelAutoUUID()
  uuid = '';

  @ModelCol({})
  test1 = '';
}

const demo = new Demo({});
console.log(demo);
