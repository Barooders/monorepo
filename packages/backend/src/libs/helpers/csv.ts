import { parse } from 'csv-parse';
import * as fs from 'fs';
import { camelCase } from 'lodash';

export const extractRowsFromCSVFile = async (
  dataFolder: string,
  filename: string,
  {
    from,
    to,
  }: {
    from?: number;
    to?: number;
  },
  delimiter = ',',
): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const data: any[] = [];
    fs.createReadStream(`${dataFolder}/${filename}`)
      .pipe(
        parse({
          delimiter,
          relax_quotes: true,
          from_line: from,
          to_line: to,
        }),
      )
      .on('data', function (row) {
        data.push(row);
      })
      .on('end', function () {
        resolve(data);
      })
      .on('error', function (error) {
        reject(error);
      });
  });
};

export const extractRowsFromCSVRawText = async (
  rawText: string,
  {
    from,
    to,
  }: {
    from?: number;
    to?: number;
  },
  delimiter = ',',
): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const data: any[] = [];
    parse(rawText, {
      delimiter,
      relax_quotes: true,
      from_line: from,
      to_line: to,
    })
      .on('data', function (row) {
        data.push(row);
      })
      .on('end', function () {
        resolve(data);
      })
      .on('error', function (error) {
        reject(error);
      });
  });
};

export const fromRowsToObject = (
  headers: string[],
  rows: string[][],
): Record<string, string>[] => {
  return rows.map((row) =>
    headers
      .map(camelCase)
      .reduce((item, header, index) => ({ ...item, [header]: row[index] }), {}),
  );
};
