---
title: DynamicSelect
nav: 组件
toc: content
order: 1
---

# DynamicSelect

## 动态获取下拉列表数据源

```tsx
import { DynamicSelect } from 'wolf-toolkit';

const Example = () => {
  const fetcher = () => {
    return {
      data: [
        { text: '苹果', code: 'apple' },
        { text: '梨', code: 'pear' },
        { text: '香蕉', code: 'banana' },
      ],
      success: true,
    };
  };
  const formatter = (values) => {
    const data = values?.data;
    return data.map(({ text, code }) => ({ label: text, value: code }));
  };
  return (
    <DynamicSelect
      fetcher={fetcher}
      formatter={formatter}
      afterSuccess={(res) => console.log(res)}
      style={{ width: 200 }}
    />
  );
};
export default Example;
```

## 获取下拉列表时传入参数

```tsx
import { useMemo } from 'react';
import { DynamicSelect } from 'wolf-toolkit';

const Example = () => {
  const fetcher = (p) => {
    console.log('固定参数', p);
    return {
      data: [
        { text: '苹果', code: 'apple' },
        { text: '梨', code: 'pear' },
        { text: '香蕉', code: 'banana' },
      ],
      success: true,
    };
  };
  const formatter = (values) => {
    const data = values?.data;
    return data.map(({ text, code }) => ({ label: text, value: code }));
  };
  const params = useMemo(() => ({ name: 'string' }));
  return (
    <DynamicSelect
      params={params}
      fetcher={fetcher}
      formatter={formatter}
      afterSuccess={(res) => console.log(res)}
      style={{ width: 200 }}
    />
  );
};
export default Example;
```

## 可搜索

```tsx
import { DynamicSelect } from 'wolf-toolkit';

const Example = () => {
  const fetcher = () => {
    return {
      data: [
        { text: '苹果', code: 'apple' },
        { text: '梨', code: 'pear' },
        { text: '香蕉', code: 'banana' },
      ],
      success: true,
    };
  };
  const formatter = (values) => {
    const data = values?.data;
    return data.map(({ text, code }) => ({ label: text, value: code }));
  };
  return (
    <DynamicSelect
      showSearch
      fetcher={fetcher}
      formatter={formatter}
      afterSuccess={(res) => console.log(res)}
      style={{ width: 200 }}
    />
  );
};
export default Example;
```

## API

| 参数             | 说明                                              | 类型                           | 默认值 | 版本 |
| ---------------- | ------------------------------------------------- | ------------------------------ | ------ | ---- | --- | --- |
| value            | 指定当前选中的条目                                | any                            |        |      |
| onChange         | 选中 option，或 input 的 value 变化时，调用此函数 | (values: any) => void          |        |      |
| params           | 外部传入的参数                                    | any                            |        |      |
| formatter        | 数据格式化方法，返回渲染下拉列表的数据            | (res: any) => TOptions[]       |        |      |
| fetcher          | 请求下拉列表数据源的方法                          | (params?: any) => Promise<any> |        |      |
| onError          | 发生异常后的处理                                  | (error: any) => void           |        |      |
| afterSuccess     | fetcher 请求成功之后调用的函数                    | (res: any) => void             |        |      |
| showSearch       | 是否开启搜索                                      | boolean                        | false  |      |
| optionFilterProp |                                                   |                                |        |      |     |     |
