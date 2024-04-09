/* eslint-disable @next/next/no-img-element */
import { Breakpoint, useBreakpoint } from '@/hooks/useBreakpoint';
import debounce from 'lodash/debounce';
import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { Column, Table } from 'react-virtualized/dist/es/Table';
import 'react-virtualized/styles.css';
React.useLayoutEffect = React.useEffect;

const HEADER_HEIGHT = 32;
const MAX_NUMBER_OF_DESKTOP_ROWS = 5.5;
const MAX_NUMBER_OF_MOBILE_ROWS = 3.5;

type RowData = Record<string, string | JSX.Element>;
type ColumnKeys = keyof RowData;

interface ColumnDefinition {
  width: number;
  label: string;
}

type PropsType = {
  searchPlaceholder: string;
  width: number;
  height?: number;
  desktopRowHeight: number;
  mobileRowHeight: number;
  rows: RowData[];
  columns: {
    desktopColumns: Record<ColumnKeys, ColumnDefinition>;
    highlightedMobileColumns: ColumnKeys[];
  };
  gap?: number;
};

const VirtualizedTable: React.FC<PropsType> = ({
  searchPlaceholder,
  width,
  height,
  desktopRowHeight,
  mobileRowHeight,
  rows,
  columns,
  gap = 16,
}) => {
  const [searchedTerm, setSearchedTerm] = useState('');
  const [filteredRows, setFilteredRows] = useState(rows);

  const breakpoint = useBreakpoint();
  const displayDesktopTable =
    breakpoint === Breakpoint.XXL || breakpoint === Breakpoint.XL;
  const mobileColumnWidth = window.innerWidth - 30; // A bit hacky but 30px is the 2x15px padding of the parent container

  useEffect(() => {
    setFilteredRows(
      searchedTerm
        ? rows.filter((row) => {
            const values = Object.values(row).map((value) =>
              typeof value === 'string'
                ? value
                : typeof value?.props === 'object'
                  ? Object.values(value.props).filter(
                      (value) => typeof value === 'string',
                    )
                  : '',
            );
            return JSON.stringify(values)
              .toLowerCase()
              .includes(searchedTerm.toLowerCase());
          })
        : rows,
    );
  }, [searchedTerm, rows]);

  return (
    <>
      <div className="mb-3 flex w-full items-center rounded bg-gray-100 p-2 text-gray-600 sm:w-96">
        <FiSearch />
        <input
          placeholder={searchPlaceholder}
          type="text"
          className="ml-2 w-full bg-transparent focus:outline-none"
          onChange={debounce((e) => setSearchedTerm(e.target.value), 300)}
        />
      </div>
      {displayDesktopTable ? (
        <Table
          className="w-fit rounded-lg border border-zinc-200"
          width={width}
          height={
            height ??
            HEADER_HEIGHT +
              Math.min(MAX_NUMBER_OF_DESKTOP_ROWS, filteredRows.length) *
                desktopRowHeight
          }
          headerHeight={HEADER_HEIGHT}
          rowHeight={desktopRowHeight + gap}
          rowCount={filteredRows.length}
          rowGetter={({ index }) => filteredRows[index]}
          headerRowRenderer={({ className, columns, style }) => (
            <div
              className={`${className} rounded-t-lg bg-gray-100`}
              role="row"
              style={style}
            >
              {columns}
            </div>
          )}
          rowRenderer={({ className, columns, key, style }) => (
            <div
              className={`${className} hover:bg-gray-50`}
              key={key}
              role="row"
              style={{ ...style, paddingBottom: gap }}
            >
              {columns}
            </div>
          )}
          gridClassName="rounded-b-lg"
        >
          {Object.entries(columns.desktopColumns).map(
            ([key, { width, label }]) => (
              <Column
                headerRenderer={({ label }) => (
                  <div className="p-2 text-xs font-semibold uppercase text-gray-600">
                    {label}
                  </div>
                )}
                cellRenderer={({ cellData }) => (
                  <div className="m-0 flex h-full items-center p-2 text-sm text-gray-600">
                    {cellData}
                  </div>
                )}
                headerStyle={{ margin: '0' }}
                label={label}
                key={key}
                dataKey={key}
                width={width}
                style={{ margin: '0', height: '100%' }}
              />
            ),
          )}
        </Table>
      ) : (
        <Table
          className="w-full"
          width={mobileColumnWidth}
          height={MAX_NUMBER_OF_MOBILE_ROWS * mobileRowHeight}
          rowHeight={mobileRowHeight + gap}
          rowCount={filteredRows.length}
          rowGetter={({ index }) => filteredRows[index]}
          headerHeight={0}
          disableHeader
          rowRenderer={({ key, style, columns }) => {
            return (
              <div
                key={key}
                style={{ ...style, paddingBottom: gap }}
              >
                {columns}
              </div>
            );
          }}
        >
          <Column
            cellRenderer={({ rowData }) => (
              <>
                <div className="m-0 h-full w-full overflow-hidden rounded-lg border border-zinc-200 text-sm text-gray-600">
                  <div className="flex h-full flex-col">
                    <div className="flex flex-col gap-4 px-4 py-5">
                      {columns.highlightedMobileColumns.map((key) => (
                        <div
                          className="w-fit"
                          key={key}
                        >
                          {rowData[key]}
                        </div>
                      ))}
                    </div>
                    <div className="flex h-full flex-wrap gap-y-4 bg-gray-100 p-4">
                      {Object.keys(rowData)
                        .filter(
                          (key) =>
                            !columns.highlightedMobileColumns.includes(key),
                        )
                        .map((key) => (
                          <div
                            className="w-1/2 pr-3"
                            key={key}
                          >
                            <p className="text-xs font-semibold uppercase">
                              {columns.desktopColumns[key].label}
                            </p>
                            <p>{rowData[key]}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </>
            )}
            dataKey={'unused-key'}
            cellDataGetter={({ rowData }) => {
              return rowData;
            }}
            width={mobileColumnWidth}
            style={{ margin: '0', height: '100%' }}
          />
        </Table>
      )}
    </>
  );
};
export default VirtualizedTable;
