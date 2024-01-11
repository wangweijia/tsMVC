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

  @ModelCol({
    type: 'object',
    objectItem: Demo2,
  })
  test4: Demo2 | undefined;

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
    test4: {
      subDemo1: 'bbb1-1',
    },
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

const item0: Demo = tree[0];
const itemCopy: Demo = item0._copy_(true);

item0.test2 = 'cccc';
if (itemCopy.test4) {
  itemCopy.test4.subDemo1 = '2222222';
}

console.log(item0);
console.log(itemCopy);
