import { ModelCol, ModelAutoUUID, ModelEnter, ModelBaseClass, ModelPath } from '../src/index';

@ModelEnter()
class Demo2 extends ModelBaseClass {
  @ModelPath({
    type: 'id',
  })
  @ModelAutoUUID()
  uuid = '';

  @ModelCol({})
  subDemo1 = '';
}

@ModelEnter()
export class Demo extends ModelBaseClass {
  @ModelPath({
    type: 'id',
  })
  @ModelAutoUUID()
  uuid = '';

  @ModelCol({})
  test2 = '';

  // @ModelCol({
  //   type: 'date',
  // })
  // test3 = '';

  // @ModelCol({
  //   type: 'object',
  //   objectItem: Demo2,
  //   ignoreOTD: true,
  // })
  // test4 = '';

  @ModelPath({
    type: 'source',
  })
  @ModelCol({
    type: 'array',
    arrayItem: Demo2,
  })
  test5: Array<Demo2> = [];
}

const dataList = [
  {
    test2: 'test2-1',
    test5: [
      {
        subDemo1: '1-1',
      },
      {
        subDemo1: '1-2',
      },
    ],
  },
  {
    test2: 'test2-2',
    test5: [
      {
        subDemo1: '2-1',
      },
      {
        subDemo1: '2-2',
      },
    ],
  },
  {
    test2: 'test2-3',
    test5: [
      {
        subDemo1: '3-1',
      },
      {
        subDemo1: '3-2',
      },
    ],
  },
];

const tree = dataList.map((item) => new Demo(item));

// list.forEach((item) => {
//   item.test5.forEach((sub) => {
//     console.log(sub);
//   });
// });

const list: Array<any> = [];

tree.forEach((item) => item._tree_to_list_(list));

console.log(list);

// const subItem = {
//   subDemo1: 1,
//   dddd: 2,
// };

// const demo = new Demo({
//   wwjTest: 'wwjTest',
//   test2: 'test2',
//   test3: 'test3',
//   test4: subItem,
//   test5: [subItem],
// });

// const t = Demo.InitWithList<Demo>([
//   {
//     wwjTest: 'wwjTest',
//     test2: 'test2',
//     test3: 'test3',
//     test4: subItem,
//     test5: [subItem],
//   },
//   // {
//   //   wwjTest: 'wwjTest2',
//   //   test2: 'test-2',
//   //   test3: 'test-2',
//   //   test4: subItem,
//   //   test5: [subItem],
//   // },
//   // {
//   //   wwjTest: 'wwjTest3',
//   //   test2: 'test-3',
//   //   test3: 'test-3',
//   //   test4: subItem,
//   //   test5: [subItem],
//   // },
// ]);

// console.log('t', t);
// console.log('init');
// console.log(demo);

// console.log(demo._OTD_());

// console.log('otd');
// console.log(demo._OTD_());
// console.log('-');
