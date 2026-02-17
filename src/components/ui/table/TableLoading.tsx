import React from 'react';
import { TableRow, TableCell } from './index';

interface TableLoadingProps {
  columns: number;
  rows?: number;
}

export default function TableLoading({ columns, rows = 5 }: TableLoadingProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="animate-pulse">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex} className="px-5 py-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
