import React, { useCallback, useEffect, useState } from 'react';

import { Select } from 'antd';

interface IOptions {
  label: any;
  value: any;
}

export interface IEnumSelect {
  fetcher: () => Promise<any>;
  value: any;
  enums?: IOptions[];
  showSearch?: boolean;
  onChange: (value: any) => void;
  onError?: (error: any) => void;
  getOptions?: (value: any) => void;
}

const defaultGetOptions = (values: any[]) => {
  if (!Array.isArray(values)) return [];
  values.map((item) => ({ label: item, value: item }));
};
export default function EnumSelect(props: IEnumSelect) {
  const {
    fetcher,
    value,
    enums,
    showSearch = true,
    onChange,
    onError,
    getOptions,
    ...rest
  } = props;
  const [options, setOptions] = useState<IOptions[]>([]);
  const handleFetch = useCallback(async () => {
    if (Array.isArray(enums)) {
      setOptions(enums);
    } else {
      try {
        const res = await fetcher();
        const tempOptions = getOptions
          ? getOptions(res)
          : defaultGetOptions(res);
        setOptions(tempOptions || []);
      } catch (error) {
        if (typeof onError === 'function') {
          onError(error);
        }
      }
    }
  }, [fetcher, enums]);

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <Select
      {...rest}
      allowClear
      showSearch={showSearch}
      value={value}
      onChange={onChange}
      options={options}
    ></Select>
  );
}
