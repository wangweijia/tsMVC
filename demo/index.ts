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

  @ModelCol({
    type: 'date',
    formatDTOKey() {
      return {
        format: 'YYYY-MM-DD HH/mm',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      };
    },
    formatOTDKey() {
      return {
        valueFormat: 'YYYY-MM-DD',
      };
    },
  })
  time: string = '';
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

const data = JSON.parse(
  JSON.stringify({
    subDemo1: 'cccc',
    time: '2024-01-15 00/01',
  }),
);

const item = new Demo2(data);

console.log('item', item);
console.log('item2', item._OTD_());
