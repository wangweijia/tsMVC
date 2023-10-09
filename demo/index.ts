import { ModelCol, ModelAutoUUID, ModelEnter, ModelBaseClass } from '../src/index';

@ModelEnter()
class Demo2 extends ModelBaseClass {
  @ModelCol({})
  subDemo1 = '';

  @ModelCol({
    key: 'dddd',
  })
  subDemo2 = '';
}

@ModelEnter()
export class Demo extends ModelBaseClass {
  @ModelAutoUUID()
  uuid = '';

  @ModelCol({
    key: 'wwjTest',
  })
  test1 = '';

  @ModelCol({})
  test2 = '';

  @ModelCol({
    type: 'date',
  })
  test3 = '';

  @ModelCol({
    type: 'object',
    objectItem: Demo2,
    ignoreOTD: true,
  })
  test4 = '';

  @ModelCol({
    type: 'array',
    arrayItem: Demo2,
  })
  test5 = '';
}

const subItem = {
  subDemo1: 1,
  dddd: 2,
};

const demo = new Demo({
  wwjTest: 'wwjTest',
  test2: 'test2',
  test3: 'test3',
  test4: subItem,
  test5: [subItem],
});

const t = Demo.InitWithList<Demo>([
  {
    wwjTest: 'wwjTest',
    test2: 'test2',
    test3: 'test3',
    test4: subItem,
    test5: [subItem],
  },
  // {
  //   wwjTest: 'wwjTest2',
  //   test2: 'test-2',
  //   test3: 'test-2',
  //   test4: subItem,
  //   test5: [subItem],
  // },
  // {
  //   wwjTest: 'wwjTest3',
  //   test2: 'test-3',
  //   test3: 'test-3',
  //   test4: subItem,
  //   test5: [subItem],
  // },
]);

// console.log('t', t);
// console.log('init');
// console.log(demo);

console.log(demo._OTD_());

// console.log('otd');
// console.log(demo._OTD_());
// console.log('-');
