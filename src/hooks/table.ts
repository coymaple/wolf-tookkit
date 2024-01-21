import { useMount, useSetState } from 'ahooks';
import { message } from 'antd';
import { useCallback, useState } from 'react';

// type ActionType = 'paginate' | 'sort' | 'filter';
enum ActionEnum {
  PAGINATE = 'paginate',
  SORT = 'sort',
  FILTER = 'filter',
}

type TPagination = {
  current: number;
  pageSize: number;
};

type TNOParams = {
  pagination: TPagination;
};

const defaultPagination = {
  current: 1,
  pageSize: 10,
};

interface IUseTableListOptions {
  query: (params: any) => Promise<any>;
  processTableData?: () => void; // 自定义数据处理方法
  applyInMount?: boolean; // 是否在页面加载后立即请求列表数据，默认为 true
  initFilters?: { [x: string]: any }; // 筛选默认值
  initPagination?: TPagination; // 分页默认值
  listField?: string;
  totalField?: string;
  extraParams?: { [x: string]: any }; // 查询的额外参数
}

const getOperateAction = (newParams: TNOParams, oldParams: TNOParams) => {
  const { pagination } = newParams;
  const { pagination: oldPagination } = oldParams;
  if (pagination.current !== oldPagination.current) {
    return ActionEnum.PAGINATE;
  }
  return ActionEnum.SORT;
};

/**
 * 自定义hook，封装了发起请求获取表格列表数据的逻辑
 * @param options
 * @returns
 */
export function useTableList(options: IUseTableListOptions) {
  const {
    query,
    processTableData,
    applyInMount = true,
    initFilters = {},
    initPagination,
    listField = 'data',
    totalField = 'total',
    // extraParams={},
  } = options;

  // loading
  const [loading, setLoading] = useState(false);

  // 列表数据
  const [{ total, dataSource }, setTableData] = useSetState({
    total: 10,
    dataSource: [],
  });

  const [extraParams, setExtraParams] = useState(options?.extraParams || {});

  // 列表查询参数
  const [{ pagination, sorterInfo, filters }, setQueryParams] = useSetState({
    pagination: initPagination || defaultPagination,
    sorterInfo: {},
    filters: initFilters || {},
  });

  const defaultProcessTableData = useCallback(
    (response) => {
      return {
        dataSource: response?.[listField] || [],
        total: response?.[totalField] || 10,
      };
    },
    [listField, totalField],
  );

  // table 列表请求数据处理
  const requestQueryList = useCallback(
    async (params: any) => {
      try {
        setLoading(true);
        const res = await query({
          ...extraParams,
          ...params,
        });
        if (res?.success) {
          const tempTableData = processTableData
            ? processTableData(res)
            : defaultProcessTableData(res);
          setTableData(tempTableData || {});
        } else {
          message.error(res?.message || res?.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [query, processTableData, defaultProcessTableData, extraParams],
  );

  // 需要使用额外参数请求列表的方法
  const handleQueryList = useCallback(
    (extra?: { [x: string]: any }) => {
      const tempParams = {
        ...pagination,
        sorter: sorterInfo,
        ...filters,
        ...(extra || {}),
      };
      requestQueryList(tempParams);
    },
    [pagination, sorterInfo, filters, requestQueryList],
  );

  // 页面加载
  useMount(() => {
    if (applyInMount) {
      requestQueryList({
        ...filters,
        ...pagination,
      });
    }
  });

  // 筛选，将页面重置到第一页
  const handleSearch = useCallback(
    (values: any) => {
      const tempPagination = {
        ...pagination,
        current: 1,
      };
      const tempParams = {
        ...tempPagination,
        sorter: sorterInfo,
        ...values,
        current: 1,
      };
      requestQueryList(tempParams);
      setQueryParams({
        pagination: tempPagination,
        filters: values,
      });
    },
    [sorterInfo, pagination, filters, requestQueryList],
  );

  // 重置，除跳转到第一页之外，还要
  const handleReset = useCallback(
    (values: any) => {
      const tempPagination = {
        ...pagination,
        current: 1,
      };
      const tempParams = {
        ...tempPagination,
        sorter: {},
        ...values,
        current: 1,
      };
      requestQueryList(tempParams);
      setQueryParams({
        pagination: tempPagination,
        filters: values,
        sorterInfo: {},
      });
    },
    [sorterInfo, pagination, filters, requestQueryList],
  );

  // 分页和排序
  const handleTableChange = useCallback(
    (pageMeta, _, sorter, action) => {
      const tmpAction = action
        ? action
        : getOperateAction({ pagination: pageMeta }, { pagination });
      let params = {};
      if (tmpAction === ActionEnum.PAGINATE) {
        params = {
          ...pageMeta,
          sorter: sorterInfo,
          ...filters,
        };
        setQueryParams({
          pagination: pageMeta,
        });
      } else if (tmpAction === ActionEnum.SORT) {
        params = {
          ...pageMeta,
          current: 1,
          sorter,
          ...filters,
        };
        setQueryParams({
          pagination: {
            ...pageMeta,
            current: 1,
          },
          sorterInfo: sorter,
        });
      }
      requestQueryList(params);
    },
    [pagination, sorterInfo, filters, requestQueryList],
  );

  // 取消排序
  const clearSort = () => {
    setQueryParams({
      sorterInfo: {},
    });
  };

  // 返回 columns sorterOrder 字段，用来配合重置（handleReset）取消表格排序ui及相关逻辑
  const setSortOrder = (key: string) => {
    return sorterInfo?.columnKey === key ? sorterInfo?.order : null;
  };
  return {
    tableProps: {
      loading,
      total,
      data: dataSource,
      onChangePage: handleTableChange,
      pageMeta: pagination,
    },
    requestQueryList,
    handleQueryList,
    handleSearch,
    handleReset,
    clearSort,
    setSortOrder,
    setExtraParams,
    filters,
    setFilters: (values: any) => {
      setQueryParams({
        filters: values,
      });
    },
  };
}
