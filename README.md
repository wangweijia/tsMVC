**ts-mvc-model 使用说明**

1\. **项目说明**

> 说明
>
> 作用：提供一个实现 MVC模式，数据模型快速创建，运算 等功能

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 79%" />
</colgroup>
<thead>
<tr class="header">
<th>DTO</th>
<th>指的是数据模型初始化（Data To Object）</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>OTD</td>
<td>指的是数据模型生成数据对象（Object To Data）</td>
</tr>
</tbody>
</table>

2\. **安装与配置**

```npm
npm i ts-mvc-model

yarn add ts-mvc-model
```


```TypeScript
// tsconfig.json
// "experimentalDecorators": true,  开启 ts 的修饰器

{
    ...,
    "compilerOptions":{
        ...,
         "experimentalDecorators": true,
         ...,
    }
    ...
}
```
3\. **功能说明**

> 3.1 **class声明**

```TypeScript
import { ModelBaseClass, ModelEnter } from "@nio-fe/ts-mvc-model";

@ModelEnter()
class TestModel extends ModelBaseClass {

}

const testData = {};
const testItem = new TestModel(testData);
```

-   ModelBaseClass：是一个基础类型，定义的数据模型需要继承
    ModelBaseClass

<!-- -->

-   ModelEnter：数据模型入口修饰器。使用当前修饰器注册数据模型

> 3.2 **属性修饰器**

-   参考案例：

```TypeScript
import { 
    ModelBaseClass, 
    ModelEnter, 
    ModelCol, 
    ModelAutoUUID, 
    ModelPath 
} from "@nio-fe/ts-mvc-model";

@ModelEnter()// 使用 ModelEnter 注册一个 数据模型
export class TestSubModel extends ModelBaseClass {
  @ModelPath({type: 'id'})// 标记这是树状结构中，当前层的唯一标识
  @ModelAutoUUID()
  id = "";

  @ModelCol({})
  test = "";
}

@ModelEnter()// 使用 ModelEnter 注册一个 数据模型
export class TestModel extends ModelBaseClass {
  @ModelPath({type: 'id'})// 标记这是树状结构中，当前层的唯一标识
  @ModelAutoUUID()// 自动生成一个全局唯一的 id
  id = "";

  // 普通属性，直接通过数据源赋值
  @ModelCol({})
  test2 = "";
  
  // test3 为 TestSubModel 类型的对象
  @ModelCol({
      type: 'object',
      objectItem: TestSubModel
  })
  test3: TestSubModel|undefined;

  
  @ModelPath({type: 'source'})// 标记 test4 是树状展开的 数据源
  @ModelCol({
      type: 'array',
      arrayItem: TestSubModel
  })// test4 为 TestSubModel 类型的数组 
  test4: Array<TestSubModel> = [];
}
```

-   ModelAutoUUID：一个自动生成全局唯一标识的修饰器

<!-- -->

-   ModelCol：属性修饰器，用于声明数据模型中的属性（数据模型中只有被ModelCol
    修饰器标识的属性，才会在初始化的时候自动初始化数据）

  <table>
  <colgroup>
  <col style="width: 11%" />
  <col style="width: 22%" />
  <col style="width: 15%" />
  <col style="width: 42%" />
  <col style="width: 8%" />
  </colgroup>
  <thead>
  <tr class="header">
  <th colspan="5">ModelCol参数说明</th>
  </tr>
  </thead>
  <tbody>
  <tr class="odd">
  <td>参数</td>
  <td>参数可选值</td>
  <td>参数类型</td>
  <td>说明</td>
  <td>默认值</td>
  </tr>
  <tr class="even">
  <td>type</td>
  <td>'single'|'object'|'array'|'date'</td>
  <td>非必填，字符串</td>
  <td>标识数据类型</td>
  <td>'single'</td>
  </tr>
  <tr class="odd">
  <td>key</td>
  <td></td>
  <td>非必填，字符串</td>
  <td>初始化数据，对应数据中的属性名，不填默认
  数据模型中的属性名和数据的属性名一致</td>
  <td>undefined</td>
  </tr>
  <tr class="even">
  <td>enableNULL</td>
  <td>false|true</td>
  <td>非必填，boolean</td>
  <td>标记数据初始化的时候，当数据中属性的值是null时，是否也给数据模型中的属性赋值为null</td>
  <td>false</td>
  </tr>
  <tr class="odd">
  <td>formatValue</td>
  <td>(value: any, baseValue: any) =&gt; any</td>
  <td>非必填，回调方法</td>
  <td>用于动态初始化数据模型当前属性。value是当前属性从传入数中解析出来的原始数据。baseValue是数据初始化时的原始数据源。返回值最终会赋值给数据模型</td>
  <td>undefined</td>
  </tr>
  <tr class="even">
  <td>formatData</td>
  <td>(value: any, baseValue: any) =&gt; any;</td>
  <td>非必填，回调方法</td>
  <td>用于动态生成当前属性对应的数据对象值。value是当前属性从传入数中解析出来的原始数据。baseValue是当前数据模型。返回值最终会赋值给生成的
  数据对象</td>
  <td>undefined</td>
  </tr>
  <tr class="odd">
  <td>ignoreDTO</td>
  <td>false|true</td>
  <td>非必填，boolean</td>
  <td>数据模型初始化时是否忽略当前属性</td>
  <td>false</td>
  </tr>
  <tr class="even">
  <td>ignoreOTD</td>
  <td>false|true</td>
  <td>非必填，boolean</td>
  <td>数据模型生成数据对象时是否忽略当前属性</td>
  <td>false</td>
  </tr>
  </tbody>
  </table>

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 17%" />
<col style="width: 25%" />
<col style="width: 45%" />
</colgroup>
<thead>
<tr class="header">
<th colspan="4">ModelCol的type属性详细说明</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>type可选值</td>
<td>ModelCol补充参数</td>
<td>ModelCol补充参数类型</td>
<td>参数说明</td>
</tr>
<tr class="even">
<td>'single'</td>
<td>无</td>
<td></td>
<td>未指定特殊类型，直接把源数据中的值赋值给当前属性</td>
</tr>
<tr class="odd">
<td>'object'</td>
<td>objectItem（必填）</td>
<td>'self' | 其他满足mvc的数据模型对象</td>
<td>'self'用于指代当前数据模型，用于实现数据模型递归嵌套自己的场景</td>
</tr>
<tr class="even">
<td>'array'</td>
<td>arrayItem（必填）</td>
<td>'self' | 其他满足mvc的数据模型对象</td>
<td>'self'用于指代当前数据模型，用于实现数据模型递归嵌套自己的场景</td>
</tr>
<tr class="odd">
<td rowspan="2">'date'</td>
<td>formatDTOKey（非必填）</td>
<td>Dayjs 格式化参数，类似：'YYYY-MM-DD'</td>
<td>待实现（目前可以使用formatValue，动态实现）</td>
</tr>
<tr class="even">
<td>formatOTDKey（非必填）</td>
<td>Dayjs 格式化参数，类似：'YYYY-MM-DD'</td>
<td>待实现（目前可以使用formatData，动态实现）</td>
</tr>
</tbody>
</table>

-   ModelPath：路径修饰器，用于标记树状类型的路径与生成tableV2
    树状数据渲染需要的path参数

<table>
<colgroup>
<col style="width: 10%" />
<col style="width: 16%" />
<col style="width: 73%" />
</colgroup>
<thead>
<tr class="header">
<th colspan="3">ModelPath config参数</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>参数名称</td>
<td>参数类型</td>
<td>参数说明</td>
</tr>
<tr class="even">
<td>type</td>
<td>'id' | 'source'（必填）</td>
<td>id：标记当前字段作为树状数据展开，当前层的唯一标识。'source'：标记当前字段作为树状数据展开的下一层数据源。</td>
</tr>
<tr class="odd">
<td>pathName</td>
<td>字符串（非必填）</td>
<td>为了兼容
一套数据模型中可能会存在多种类型的树状结构，可以为树状结构设置路径名称。一条完整的路径需要使用相同的名字。</td>
</tr>
</tbody>
</table>

> 3.3 **生命周期**

-   \_init\_

```TypeScript
import { ModelBaseClass, ModelEnter, ModelCol, ModelAutoUUID } from "@nio-fe/ts-mvc-model";

@ModelEnter()
export class TestModel extends ModelBaseClass {
  @ModelAutoUUID()
  id = "";

  @ModelCol({})
  test = "";
  
  _init_(...p: any): void {
      // p: new 初始化的参数集合
      // 可以使用 this，对当前数据模型中的 数据再次处理
      
      console.log(this.test);
      this.test = 'xxxxxx'
  }

}
```

-   类型：回调函数（非必选）

<!-- -->

-   调用时机：当前数据模型 New
    初始化完成之后（在类的constructor方法完成之后）

<!-- -->

-   作用：可以使用this获取数据模型中的任何属性，对当前数据模型进行初始化后的再次处理

<!-- -->

-   \_initUUID\_

```TypeScript
import { ModelBaseClass, ModelEnter, ModelCol, ModelAutoUUID } from "@nio-fe/ts-mvc-model";

@ModelEnter()
export class TestModel extends ModelBaseClass {
  @ModelAutoUUID()
  id = "";

  @ModelCol({})
  test = "";
  
  _initUUID_(oldUuid: string): string {
      return '自定义的uuid'
  }

}
```

-   类型：回调函数（非必选）

<!-- -->

-   调用时机：ModelAutoUUID 修饰器生成唯一标识的时候

<!-- -->

-   作用：自定义生成的uuid

> 3.4 **内置方法**

-   基础案例数据：

```TypeScript
import { 
    ModelBaseClass, 
    ModelEnter, 
    ModelCol, 
    ModelAutoUUID, 
    ModelPath 
} from "@nio-fe/ts-mvc-model";

@ModelEnter()
export class TestSubModel extends ModelBaseClass {
  @ModelPath({type: id})// 标记这是树状结构中，当前层的唯一标识
  @ModelAutoUUID()
  id = "";

  @ModelCol({})
  subTest = "";
}

@ModelEnter()
export class TestModel extends ModelBaseClass {
  @ModelPath({type: id})// 标记这是树状结构中，当前层的唯一标识
  @ModelAutoUUID()// 自动生成一个全局唯一的 id
  id = "";

  // 普通属性，直接通过数据源赋值
  @ModelCol({})
  test2 = "";
  
  // test3 为 TestSubModel 类型的对象
  @ModelCol({
      type: 'object',
      objectItem: TestSubModel
  })
  test3: TestSubModel;

  
  @ModelPath({type: 'source'})// 标记 test4 是树状展开的 数据源
  @ModelCol({
      type: 'array',
      arrayItem: TestSubModel
  })// test4 为 TestSubModel 类型的数组 
  test4: Array<TestSubModel>;
}
```

-   \_OTD\_

1.  实例方法：数据模型生成数据对象的内置方法。

```TypeScript
_OTD_(): any {
    //...
}
```

```TypeScript
const subData = { subTest: 'subTest' };
const data = {test2: 'test2', test3: subData, test4: [subData] }
const testModel: TestModel = new TestModel(data);

const obj = testModel._OTD_();

console.log(obj);

/*
{
    test2: 'test2', 
    test3:  { 
        subTest: 'subTest' 
    },
    test4: [
        {subTest: 'subTest'},
        {subTest: 'subTest'}
    ]
}
*/
```

-   \_init\_path\_

```TypeScript
_init_path_(basePath: Array<string | number> = [], pathName?: string): Array<string | number>{
    //...
}
```

1.  实例方法：动态递归初始化树状数据中的path，在数据模型中会生成一个
    \_path\_:Array&lt;string&gt; 参数。

<!-- -->

1.  未指定特殊的pathName，数据模型在初始化时默认会自动调用当前方法

<!-- -->

1.  参数：

<!-- -->

1.  basePath: Array&lt;string | number&gt; = \[\]; 为生成的路径
    添加前置基础路径，默认为空

<!-- -->

1.  pathName?: string;
    生成指定路径时使用，生成路径时，会根据pathName匹配 ModelPath
    修饰器中的pathName，使用匹配到的ModelPath({type: 'id'}) 生成路径

```TypeScript
// 默认生成 path

const subData = { subTest: 'subTest' };
const data = {test2: 'test2', test3: subData, test4: [subData] }
const testModel: TestModel = new TestModel(data);

// log testModel

/*
{
    id: '1',
    test2: 'test2',
    test3: [
        {
            id: '2',
            subTest: 'subTest',
            _path_: ['1', '2']
        },
        {
            id: '3',
            subTest: 'subTest',
            _path_: ['1', '3']
        },
    ],
    _path_: ['1']
}

*/
```

-   \_tree\_to\_list\_

1.  实例方法：树状结构数据模型展开成 列表 类型数据结构

```TypeScript
_init_path_(basePath: Array<string | number> = [], pathName?: string): Array<string | number>{
    //...
}
```

```TypeScript
const subData = { subTest: 'subTest' };
const data = {test2: 'test2', test3: subData, test4: [subData] }
const dataList = [data, data];

const tree: Array<TestModel> = dataList.map((item) => new TestModel(item));

const list: Array<TestModel> = [];
tree.forEach((item) => item._init_path_(list))

// log list
/*
[
   {
       id: '1',
       test2: 'test2',
       test3: [
        ...
       ],
       _path_: ['1']
   },
   {
        id: '2',
        subTest: 'subTest',
        _path_: ['1', '2']
    },
    {
        id: '3',
        subTest: 'subTest',
        _path_: ['1', '3']
    },
   {
       id: '4',
       test2: 'test2',
       test3: [
        ...
       ],
       _path_: ['4']
   },
   {
        id: '5',
        subTest: 'subTest',
        _path_: ['4', '5']
    },
    {
        id: '6',
        subTest: 'subTest',
        _path_: ['4', '6']
    },
]
*/
```

-   \_copy\_

```TypeScript
_copy_(deep?: boolean) {
    return any;
}
```

1.  实例方法：用于复制当前数据模型，生成一个新的数据模型

<!-- -->

1.  参数：

<!-- -->

1.  deep：非必填。默认为非深拷贝，只会copy数据模型第一层。当deep为true时，会递归复制
    type为'array'和'objecg'的属性

-   InitWithList

1.  静态类方法：快速初始化列表数据源的

```TypeScript
static InitWithList<T>(items: Array<any>): Array<T> {
    //...
}
```

```TypeScript
const subData = { subTest: 'subTest' };
const data = {test2: 'test2', test3: subData, test4: [subData] }
const dataList = [data, data];

// 使用 map 创建
// const tree: Array<TestModel> = dataList.map((item) => new TestModel(item));

const tree: Array<TestModel> = TestModel.InitWithList<TestModel>(dataList);
```


-   TreeToList

1.  静态类方法：快速把数据模型从 tree 拉平成 list

<!-- -->

1.  参数说明：

<!-- -->

1.  array： 需要拉平的tree数据模型

<!-- -->

1.  pathName：指定tree数据展开路径的自定义名称。如果设置，会根据pathName匹配
    ModelPath 修饰器中的pathName，使用匹配到的ModelPath({type:
    'source'}) 生成路径

```TypeScript
static TreeToList<T extends ModelBaseClass>(array: Array<T>, pathName?: string): Array<T> {
    // ...
}
```

```TypeScript
const subData = { subTest: 'subTest' };
const data = {test2: 'test2', test3: subData, test4: [subData] }
const dataList = [data, data];

const tree: Array<TestModel> = TestModel.InitWithList<TestModel>(dataList);
const list: Array<TestModel> = TestModel.TreeToList(tree);

// log list
/*
[
   {
       id: '1',
       test2: 'test2',
       test3: [
        ...
       ],
       _path_: ['1']
   },
   {
        id: '2',
        subTest: 'subTest',
        _path_: ['1', '2']
    },
    {
        id: '3',
        subTest: 'subTest',
        _path_: ['1', '3']
    },
   {
       id: '4',
       test2: 'test2',
       test3: [
        ...
       ],
       _path_: ['4']
   },
   {
        id: '5',
        subTest: 'subTest',
        _path_: ['4', '5']
    },
    {
        id: '6',
        subTest: 'subTest',
        _path_: ['4', '6']
    },
]
*/

```

4\. **一些使用场景**

1.  数据没有唯一标识，前端快速生成一个唯一标识

```TypeScript
import { 
    ModelBaseClass, 
    ModelEnter, 
    ModelCol, 
    ModelAutoUUID, 
} from "@nio-fe/ts-mvc-model";

@ModelEnter()
export class TestModel extends ModelBaseClass {
  @ModelAutoUUID()
  id = "";

  @ModelCol({})
  test = "";
}
```

1.  服务端数据源字段命名发生变化，前端通过数据模型实现数据映射

```TypeScript
import { 
    ModelBaseClass, 
    ModelEnter, 
    ModelCol
} from "@nio-fe/ts-mvc-model";

@ModelEnter()
export class TestModel extends ModelBaseClass {
  @ModelCol({
      key: 'testt'
  })// 服务端返回的数据 字段名：testt，数据模型数据名：test
  test = "";
}
```

1.  服务端数据源字段类型发生变化，前端通过数据模型实现数据映射

```TypeScript
import { 
    ModelBaseClass, 
    ModelEnter, 
    ModelCol
} from "@nio-fe/ts-mvc-model";

@ModelEnter()
export class TestModel extends ModelBaseClass {
  @ModelCol({
      key: 'test'
  })
  test: Array<string> = [];
  
  //  前端希望展示 通过 ‘|’ 拼接的 test数组中的数据
  @ModelCol({
      key: 'test',
      formatValue:(value: Array<string>)=>{
          return value.join('|')
      }
  })
  testStr = '';
}

const data = {test: ['a', 'b']};
const testModel = new TestModel(data);

// log testModel
/*
{
    test:  ['a', 'b'],
    testStr: 'a|b'
}
*/

```

1.  前端组件入参数据格式与最终提交数据格式不一致，前端进行数据转换

```TypeScript
import { 
    ModelBaseClass, 
    ModelEnter, 
    ModelCol
} from "@nio-fe/ts-mvc-model";

@ModelEnter()
export class TestModel extends ModelBaseClass {

    // 前端复选组件 生成的数据是 字符串列表，服务端需要接收 使用逗号分隔的  字符串
  @ModelCol({
      key: 'test',
      formatData: (value: Array<string>)=> {
          return value.join(',')
      }
  })
  test: Array<string> = [];
}

const data = {test: []};
const testModel = new TestModel(data);

// 模拟组件赋值
/*
<select v-model="testModel.test">
    <option>...</option>
</select>
*/
testModel.test = ['a', 'b'];
const submitData = testModel._OTD_();

// log submitData
/*
{
    test: 'a,b',
}
*/
```
