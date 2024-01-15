import { Form, Input, Select } from 'antd';
import React, { useEffect } from 'react';
import EnumSelect from '../EnumSelect';

import type { IEnumSelect } from '../EnumSelect';

type FilterType = 'input' | 'select' | 'enumselect';

// 表单组件
const formMap = {
  input: Input,
  select: Select,
  enumselect: EnumSelect,
};

// 表单配置项
interface IBaseFilter {
  type: FilterType;
  label: string;
  name: string;
}
type IFilter = IBaseFilter & IEnumSelect;

// SearchBar props
interface ISearchBar {
  filters: any;
  filterItems: IFilter[];
  onSearch: (values: any) => void;
  onClear: () => void;
}

const { Item, useForm } = Form;

export default function SearchBar(props: ISearchBar) {
  const { filters, filterItems = [] } = props;
  const [form] = useForm();
  useEffect(() => {}, [filters]);
  return (
    <Form form={form}>
      {filterItems.map(({ type, label, name, ...rest }) => {
        const FormComp = formMap[type] || Input;
        return (
          <Item key={name} label={label} name={name}>
            <FormComp {...rest} />
          </Item>
        );
      })}
    </Form>
  );
}
