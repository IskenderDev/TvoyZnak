import {
  type HTMLAttributes,
  type PropsWithChildren,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { twMerge } from "tailwind-merge";

type TableRootProps = PropsWithChildren<{
  className?: string;
}>;

const TableRoot = ({ className, children }: TableRootProps) => (
  <div className={twMerge("overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm", className)}>
    <table className="hidden min-w-full divide-y divide-slate-100 text-left text-sm text-slate-600 md:table">
      {children}
    </table>
  </div>
);

const TableHead = ({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLTableSectionElement>>) => (
  <thead
    className={twMerge(
      "bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500",
      className,
    )}
    {...props}
  >
    <tr>{children}</tr>
  </thead>
);

const TableHeaderCell = ({ children, className, ...props }: PropsWithChildren<ThHTMLAttributes<HTMLTableCellElement>>) => (
  <th scope="col" className={twMerge("px-6 py-4", className)} {...props}>
    {children}
  </th>
);

const TableBody = ({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLTableSectionElement>>) => (
  <tbody
    className={twMerge("divide-y divide-slate-100 text-sm text-slate-700", className)}
    {...props}
  >
    {children}
  </tbody>
);

const TableRow = ({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLTableRowElement>>) => (
  <tr className={twMerge("bg-white transition hover:bg-slate-50", className)} {...props}>
    {children}
  </tr>
);

const TableCell = ({ children, className, ...props }: PropsWithChildren<TdHTMLAttributes<HTMLTableCellElement>>) => (
  <td className={twMerge("px-6 py-4 align-top text-sm text-slate-700", className)} {...props}>
    {children}
  </td>
);

const TableMobile = ({ children }: PropsWithChildren) => (
  <div className="grid gap-4 md:hidden">{children}</div>
);

const TableCard = ({ children }: PropsWithChildren) => (
  <div className="flex flex-col gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
    {children}
  </div>
);

const TableCardField = ({ label, children }: { label: string } & PropsWithChildren) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
    <div className="text-sm text-slate-700">{children}</div>
  </div>
);

export const Table = Object.assign(TableRoot, {
  Head: TableHead,
  HeaderCell: TableHeaderCell,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  Mobile: TableMobile,
  Card: TableCard,
  CardField: TableCardField,
});

export default Table;
