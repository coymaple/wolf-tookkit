import { Popconfirm, Space } from 'antd';
import React from 'react';

interface ILinkProps {
  text: string;
  onClick: (r?: any, t?: any) => void;
  disabled?: boolean;
}
const Link = (props: ILinkProps) => {
  const { disabled, onClick, text } = props;
  const handleClick = (e) => {
    e.preventDefault();
    if (!disabled) {
      onClick?.();
    }
  };
  return (
    <a onClick={handleClick} style={{ color: disabled ? '' : '' }}>
      {text}
    </a>
  );
};

interface IPopconfirm {
  disabled?: boolean;
  popconfirm?: string;
  popconfirmConfig?: { [x: string]: any };
}
type TOperateItem = ILinkProps & IPopconfirm;
const OperateItem = (props: TOperateItem) => {
  const { popconfirm, popconfirmConfig, disabled, ...LinkProps } = props;

  return (
    <>
      {popconfirm && (
        <Popconfirm
          title={popconfirm}
          onConfirm={() => {
            LinkProps?.onClick?.();
          }}
          disabled={disabled}
          {...(popconfirmConfig || {})}
        >
          <Link disabled={disabled} {...LinkProps} />
        </Popconfirm>
      )}
      {!popconfirm && <Link disabled={disabled} {...LinkProps} />}
    </>
  );
};

const renderTableOperates = (operatesFn: (r: any) => TOperateItem[]) => {
  return (_: any, r: any) => {
    const operates = operatesFn(r);
    return (
      <Space>
        {operates.map((item, index) => (
          <OperateItem {...item} key={index} />
        ))}
      </Space>
    );
  };
};
export { renderTableOperates };
// export default renderTableOperates;
