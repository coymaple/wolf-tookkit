import { Select } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

type TOptions = {
  label: any;
  value: any;
};
export interface IDynamicSelect {
  value?: any;
  onChange?: (value: any) => void;
  params?: any; // 外部传入的参数
  formatter: (res: any) => TOptions[]; // 数据格式化方法，返回渲染下拉列表的数据
  fetcher: (params?: any) => Promise<any>; // 请求下拉列表数据源的方法
  onError?: (error: any) => void; // 发生异常后的处理
  afterSuccess?: (res: any) => void; // fetcher 请求成功之后

  showSearch?: boolean; // 是否开启搜索
  // optionFilterProp?: string; // 搜索字段，默认 label
  [x: string]: any; // Select 其他props
}
const DynamicSelect: React.FC<IDynamicSelect> = (props) => {
  const {
    params,
    showSearch = false,
    // optionFilterProp = 'label',
    fetcher,
    onError,
    formatter,
    afterSuccess,
    ...rest
  } = props;
  const [options, setOptions] = useState<any[]>([]);
  // const memorizedParams = useMemo(() => params, [params]);

  const handleFetch = useCallback(
    async (params: any) => {
      try {
        const res = await fetcher(params);
        const tempOptions = formatter(res);
        setOptions(tempOptions);
        if (typeof afterSuccess === 'function') afterSuccess(res);
      } catch (error) {
        if (typeof onError === 'function') onError(error);
      }
    },
    [fetcher],
  );

  // 组件创建后请求后端获取数据
  useEffect(() => {
    handleFetch(params);
  }, [params]);

  return (
    <Select
      {...rest}
      showSearch={showSearch}
      optionFilterProp="label"
      options={options}
      // dropdownMatchSelectWidth={false}
    ></Select>
  );
};

export default DynamicSelect;
