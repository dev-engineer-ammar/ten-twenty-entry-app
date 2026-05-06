import React, { useEffect, useMemo, useState } from "react";
import StatusBadge from "../components/StatusBadge";
// import { Timesheet, timesheetsApi } from "../lib/api";
import { Link } from "react-router-dom";
import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import Cookies from "js-cookie";

import type { TimesheetStatus, Timesheet } from "../services/interfaces";

function fmtRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const monthSame = s.getMonth() === e.getMonth();
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  if (monthSame) {
    return `${s.getDate()} - ${e.getDate()} ${e.toLocaleString("en-US", { month: "long" })}, ${e.getFullYear()}`;
  }
  return `${s.toLocaleString("en-US", opts)} - ${e.toLocaleString("en-US", opts)}`;
}

const ACTION_LABEL: Record<string, string> = {
  COMPLETED: "View",
  INCOMPLETE: "Update",
  MISSING: "Create",
};

export default function TimesheetsListPage() {
  const [status, setStatus] = useState<string>("ALL");
  const [dateRange, setDateRange] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortAsc, setSortAsc] = useState(true);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["timesheets", page, pageSize, status, dateRange, sortAsc],
    queryFn: async () => {
      const fromDate = dateRangeToFrom(dateRange);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
        status: status === "ALL" ? "" : status,
        sort: sortAsc ? "asc" : "desc",
        ...(fromDate && { from: fromDate }),
      });
      const token = Cookies.get("accessToken");
      const res = await api.get(`/timesheets/`, params, token);
      return res.data;
    },
  });

  const items: Timesheet[] = data?.items || data || [];
  const total = data?.total || items.length;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    setPage(1);
  }, [status, dateRange, pageSize]);
  const pageNumbers = useMemo(
    () => buildPageNumbers(page, totalPages),
    [page, totalPages],
  );

  const styles: Record<TimesheetStatus, string> = {
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    INCOMPLETE: "bg-amber-50 text-amber-700 border-amber-100",
    MISSING: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <div className="min-h-[64.196vh] flex flex-col bg-slate-50">
      <main className="flex-1">
        <div className="w-full mx-auto  pt-8 pb-2">
          <div
            data-testid="timesheets-card"
            className="bg-white rounded-xl border border-slate-200 shadow-sm"
          >
            <div className="p-8">
              <h1 className="text-2xl font-bold text-slate-900">
                Your Timesheets
              </h1>
              <div className="mt-6 flex items-center gap-3">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger
                    data-testid="filter-date-range"
                    className="h-10 w-44 rounded-md !bg-[#ffffff] border-slate-200"
                  >
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#ffffff]">
                    <SelectItem value="ALL">All time</SelectItem>
                    <SelectItem value="JAN_2024">January 2024</SelectItem>
                    <SelectItem value="FEB_2024">February 2024</SelectItem>
                    <SelectItem value="MAR_2024">March 2024</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger
                    data-testid="filter-status"
                    className="h-10 w-44 rounded-md !bg-[#ffffff] border-slate-200"
                  >
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#ffffff]">
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="INCOMPLETE">Incomplete</SelectItem>
                    <SelectItem value="MISSING">Missing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-6 overflow-hidden rounded-lg border border-slate-100">
                <table
                  className="w-full text-sm"
                  data-testid="timesheets-table"
                >
                  <thead className="bg-[#f8f8f8]">
                    <tr className="text-left text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                      <th className="py-3 px-5 w-24">
                        <button
                          data-testid="sort-week"
                          onClick={() => setSortAsc((s) => !s)}
                          className="flex items-center gap-1 hover:text-slate-700"
                        >
                          Week <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                      <th className="py-3 px-5">
                        <span className="flex items-center gap-1">
                          Date <ArrowUpDown className="h-3 w-3" />
                        </span>
                      </th>
                      <th className="py-3 px-5">
                        <span className="flex items-center gap-1">
                          Status <ArrowUpDown className="h-3 w-3" />
                        </span>
                      </th>
                      <th className="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-12 text-center text-slate-400"
                        >
                          Loading…
                        </td>
                      </tr>
                    ) : items.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-12 text-center text-slate-400"
                        >
                          No timesheets found
                        </td>
                      </tr>
                    ) : (
                      items.map((t, index) => (
                        <tr
                          key={t.id}
                          data-testid={`timesheet-row-${index}`}
                          className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors"
                        >
                          <td className="py-4 px-5 bg-[#f8f8f8] text-slate-900 font-medium">
                            {(page - 1) * pageSize + index + 1}
                          </td>
                          <td className="py-4 px-5 text-slate-700">
                            {fmtRange(t.startDate, t.endDate)}
                          </td>
                          <td className="py-4 px-5">
                            <StatusBadge status={t.status} />
                          </td>
                          <td className="py-4 px-5 text-right">
                            <Link
                              data-testid={`timesheet-action-${t.weekNumber}`}
                              to={`/timesheets/${t.id}`}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              {ACTION_LABEL[t.status]}
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between bg-[#ffffff]">
                <Select
                  value={String(pageSize)}
                  onValueChange={(v) => {
                    setPageSize(Number(v));
                    setPage(1);
                  }}
                >
                  <SelectTrigger
                    data-testid="page-size-select"
                    className="h-9 w-32 rounded-md bg-[#ffffff] border-slate-200 text-sm"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#ffffff]">
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center" data-testid="pagination">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 h-9 rounded-l-lg border border-slate-200 text-sm disabled:opacity-40"
                  >
                    Previous
                  </button>

                  {pageNumbers.map((n, idx) => (
                    <button
                      key={idx}
                      onClick={() => typeof n === "number" && setPage(n)}
                      disabled={n === "..."}
                      className={`w-9 h-9 text-sm border ${
                        n === page
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      } ${n === "..." ? "cursor-default" : ""}`}
                    >
                      {n}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-3 h-9 rounded-r-lg border border-slate-200 text-sm disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function dateRangeToFrom(value: string): string | undefined {
  if (value === "JAN_2024") return "2024-01-01";
  if (value === "FEB_2024") return "2024-02-01";
  if (value === "MAR_2024") return "2024-03-01";
  return undefined;
}

function buildPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 8) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  const window = [current - 1, current, current + 1].filter(
    (n) => n > 1 && n < total,
  );
  pages.push(1);
  if ((window[0] ?? 2) > 2) pages.push("...");
  window.forEach((n) => pages.push(n));
  if ((window[window.length - 1] ?? total - 1) < total - 1) pages.push("...");
  pages.push(total);
  return pages;
}
