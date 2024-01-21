import { useDeepCompareEffect } from 'ahooks';
import { Button, Checkbox, Col, Form, Input, Row, Select, Space } from 'antd';
import React, { useCallback, useMemo } from 'react';
import type { IDynamicSelect } from '../DynamicSelect';
import DynamicSelect from '../DynamicSelect';

type TType = 'input' | 'select' | 'dynamicSelect' | 'single' | 'custom';
interface IBaseFilterItems {
  type: TType;
  label: string;
  name: string;
  placeholder?: string;
  customRender?: React.ReactNode; // 自定义渲染
  labelCol?: { span: number };
}
export type IFilterItem = IBaseFilterItems & Partial<IDynamicSelect>;

export interface ISearchBar {
  filterItems: IFilterItem[];
  filters?: { [x: string]: any }; // 筛选默认值
  labelCol?: { span: number };
  // buttonPositon 按钮组位置, tail：跟在表单后面，right 居右，默认具有
  buttonPositon?: 'tail' | 'right';
  cols?: number; // 每行cols列, 默认3列
  onSearch: (values: any) => void;
  onReset: () => void;
  customRenderButtons?: (buttons: React.ReactNode[]) => React.ReactNode[]; // 自定义按钮渲染方法
}

// 按钮组样式
const buttonAlign = {
  tail: {
    display: 'flex',
    justifyContent: 'left',
  },
  right: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
};
const SearchBar: React.FC<ISearchBar> = (props) => {
  const {
    filterItems = [],
    filters = {},
    cols = 3,
    labelCol,
    buttonPositon = 'right',
    customRenderButtons,
    onSearch,
    onReset,
  } = props;
  const [form] = Form.useForm();

  const cellSpan = useMemo(() => Math.floor(24 / cols), [cols]);

  // 筛选表单默认值
  useDeepCompareEffect(() => {
    form.setFieldsValue(filters);
  }, [filters]);

  // 筛选
  const handleSearch = useCallback(() => {
    const values = form.getFieldsValue();
    onSearch(values);
  }, [onSearch]);

  // 重置
  const handleReset = useCallback(() => {
    form.resetFields();
    onReset();
  }, [onReset]);

  // 计算按钮组在栅格系统中占据的空间
  const buttonsSpan = useMemo(() => {
    const len = filterItems?.length || 0;
    if (buttonPositon === 'right') {
      return 24 - (len % cols) * cellSpan;
    } else if (buttonPositon === 'tail') {
      return cellSpan;
    } else {
      return 6;
    }
  }, [buttonPositon, cellSpan, filterItems?.length]);

  // 渲染按钮组
  const renderButtons = useMemo(() => {
    const defaultRender = [
      <Button type="primary" onClick={handleSearch} key="query">
        查询
      </Button>,
      <Button onClick={handleReset} key="reset">
        重置
      </Button>,
    ];
    if (typeof customRenderButtons === 'function') {
      return customRenderButtons(defaultRender);
    }
    return defaultRender;
  }, [customRenderButtons, handleSearch, handleReset]);

  return (
    <Form
      form={form}
      labelCol={labelCol || { span: 6 }}
      wrapperCol={{ span: 24 }}
      labelAlign="right"
    >
      <Row gutter={16}>
        {filterItems.map((item) => {
          const { label, name, type, placeholder, ...rest } = item;
          return (
            <Col key={name} span={cellSpan}>
              {type === 'input' && (
                <Form.Item label={label} name={name} labelCol={rest?.labelCol}>
                  <Input allowClear placeholder={`请填写${label}`} />
                </Form.Item>
              )}

              {type === 'dynamicSelect' && (
                <Form.Item label={label} name={name} labelCol={rest?.labelCol}>
                  <DynamicSelect
                    {...rest}
                    allowClear
                    placeholder={placeholder || `请选择${label}`}
                  />
                </Form.Item>
              )}

              {type === 'select' && (
                <Form.Item label={label} name={name} labelCol={rest?.labelCol}>
                  <Select
                    allowClear
                    {...rest}
                    placeholder={placeholder || `请选择${label}`}
                  />
                </Form.Item>
              )}

              {type === 'single' && (
                <Form.Item
                  label={label}
                  name={name}
                  valuePropName="checked"
                  labelCol={rest?.labelCol}
                >
                  <Checkbox>{rest?.singleText}</Checkbox>
                </Form.Item>
              )}

              {type === 'custom' && (
                <Form.Item
                  label={label}
                  name={name}
                  {...rest}
                  labelCol={rest?.labelCol}
                >
                  {rest?.customRender}
                </Form.Item>
              )}
            </Col>
          );
        })}

        <Col span={buttonsSpan}>
          {/* 操作按钮组 */}
          <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
            <div style={buttonAlign[buttonPositon]}>
              <Space>{renderButtons}</Space>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default SearchBar;
