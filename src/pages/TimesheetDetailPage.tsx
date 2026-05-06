import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import EntryModal from "../components/EntryModal";
// import { toast } from "sonner";
import api from "../services/api";
import type { Entry, Project, Timesheet } from "../services/interfaces";
import Cookies from "js-cookie";


function fmtRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.getDate()} - ${e.getDate()} ${e.toLocaleString("en-US", {
    month: "long",
  })}, ${e.getFullYear()}`;
}

function eachDay(start: string, end: string): string[] {
  const days: string[] = [];
  const s = new Date(start);
  const e = new Date(end);
  const cur = new Date(s);
  while (cur <= e) {
    days.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

function fmtDayLabel(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}`;
}

export default function TimesheetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [defaultDate, setDefaultDate] = useState<string | null>(null);

  const refresh = async () => {
    if (!id) return;

    try {
      const token = Cookies.get('accessToken');
      const [tsRes, entriesRes] = await Promise.all([
        api.get(`/timesheets/${id}`, {}, token),
        api.get(`/entries`, { timesheetId: id }),
        api.get(`/projects`),
      ]);

      setTimesheet(tsRes.data);
      setEntries(entriesRes.data);
      setProjects([
        { id: 1, name: "Homepage Development" },
        { id: 2, name: "Game Development" },
        { id: 3, name: "UI/UX Design" },
        { id: 4, name: "Testing" },
        { id: 5, name: "Meeting" },
        { id: 6, name: "Research" },
      ]);
    } catch (err) {
      console.error("Error loading data", err);
    }
  };

  useEffect(() => {
    refresh();
  }, [id]);

  const totalHours = useMemo(
    () => entries.reduce((s, e) => s + e.hours, 0),
    [entries],
  );
  const target = timesheet?.targetHours ?? 40;
  const pct = Math.min(100, Math.round((totalHours / target) * 100));

  const days = useMemo(
    () => (timesheet ? eachDay(timesheet.startDate, timesheet.endDate) : []),
    [timesheet],
  );

  const byDay = useMemo(() => {
    const map: Record<string, Entry[]> = {};
    days.forEach((d) => (map[d] = []));
    entries.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [days, entries]);

  const handleAdd = (date: string) => {
    setEditing(null);
    setDefaultDate(date);
    setModalOpen(true);
  };

  const handleEdit = (entry: Entry) => {
    setEditing(entry);
    setDefaultDate(entry.date);
    setModalOpen(true);
  };


  const handleDelete = async (entry: Entry) => {
    try {
      const token = Cookies.get('accessToken');
      await api.delete(`/entries/${entry.id}`, {}, token);
      await refresh();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSubmit = async (data: any) => {
    if (!timesheet) return;

    try {
      if (editing) {
        await api.put(`/entries/${editing.id}`, {
          ...data,
          timesheetId: timesheet.id,
        });
      } else {
        await api.post(`/entries`, {
          ...data,
          timesheetId: timesheet.id,
        });
      }

      setModalOpen(false);
      await refresh();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col bg-slate-50">
      <main className="flex-1">
        <div className="max-w-[1440px] mx-auto pt-8 pb-2">
          <div
            data-testid="timesheet-detail-card"
            className="bg-white rounded-xl border border-slate-200 shadow-sm"
          >
            <div className="p-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    This week's timesheet
                  </h1>
                  {timesheet && (
                    <p
                      className="mt-1 text-sm text-slate-500"
                      data-testid="timesheet-range"
                    >
                      {fmtRange(timesheet.startDate, timesheet.endDate)}
                    </p>
                  )}
                </div>
                <div className="text-right" data-testid="hours-progress">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-700 font-medium">
                      {totalHours}/{target} hrs
                    </span>
                    <span className="text-sm text-slate-500">{pct}%</span>
                  </div>
                  <div className="mt-2 w-56 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-400 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-6" data-testid="day-list">
                {days.map((d) => (
                  <div key={d} className="grid grid-cols-[80px_1fr] gap-6">
                    <div
                      className="text-sm font-semibold text-slate-700 pt-3"
                      data-testid={`day-label-${d}`}
                    >
                      {fmtDayLabel(d)}
                    </div>
                    <div className="space-y-2">
                      {byDay[d]?.map((entry) => (
                        <div
                          key={entry.id}
                          data-testid={`entry-row-${entry.id}`}
                          className="flex items-center gap-4 px-4 py-3 border border-slate-200 rounded-md bg-white hover:border-slate-300 transition-colors"
                        >
                          <span className="flex-1 text-sm text-slate-800 truncate">
                            {entry.taskName}
                          </span>
                          <span className="text-xs text-slate-400 tabular-nums">
                            {entry.hours} hrs
                          </span>
                          <span className="px-2 py-1 text-[11px] font-medium bg-blue-50 text-blue-700 rounded">
                            {entry.projectName}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              data-testid={`entry-menu-${entry.id}`}
                              className="text-slate-400 hover:text-slate-600 outline-none"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                data-testid={`entry-edit-${entry.id}`}
                                onClick={() => handleEdit(entry)}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                data-testid={`entry-delete-${entry.id}`}
                                onClick={() => handleDelete(entry)}
                                className="text-red-600 focus:text-red-700"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                      <button
                        data-testid={`add-task-${d}`}
                        onClick={() => handleAdd(d)}
                        className="w-full py-3 border border-dashed border-blue-300 bg-blue-50/40 hover:bg-blue-50 rounded-md text-sm font-medium text-blue-600 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Add new task
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <EntryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        projects={projects}
        defaultDate={defaultDate || ""}
        editing={editing}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
