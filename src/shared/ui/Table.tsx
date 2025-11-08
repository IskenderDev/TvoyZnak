import { type PropsWithChildren } from "react";
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

const TableHead = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <thead
    className={twMerge(
      "bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500",
      className,
    )}
  >
    <tr>{children}</tr>
  </thead>
);

const TableHeaderCell = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <th scope="col" className={twMerge("px-6 py-4", className)}>
    {children}
  </th>
);

const TableBody = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <tbody className={twMerge("divide-y divide-slate-100 text-sm text-slate-700", className)}>
    {children}
  </tbody>
);

const TableRow = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <tr className={twMerge("bg-white transition hover:bg-slate-50", className)}>{children}</tr>
);

const TableCell = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <td className={twMerge("px-6 py-4 align-top text-sm text-slate-700", className)}>
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
