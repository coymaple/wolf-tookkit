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
