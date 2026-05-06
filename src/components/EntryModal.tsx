import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dailog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/Button";
// import { div } from "./ui/div";
import { Textarea } from "./ui/textarea";
import { Minus, Plus } from "lucide-react";

export const TYPES_OF_WORK = ["Bug fixes", "Development", "Design", "Testing", "Meeting", "Research"];

export interface Entry {
  id: number;
  timesheetId: number;
  date: string; // ISO date e.g. 2024-01-21
  taskName: string;
  hours: number;
  projectName: string;
  typeOfWork: string;
  description?: string;
}

export interface Project {
  id: number;
  name: string;
}
interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  projects: Project[];
  defaultDate: string;
  editing: Entry | null;
  onSubmit: (data: {
    date: string;
    taskName: string;
    hours: number;
    projectName: string;
    typeOfWork: string;
    description?: string;
  }) => Promise<void>;
}
export default function EntryModal({
  open,
  onOpenChange,
  projects,
  defaultDate,
  editing,
  onSubmit,
}: Props) {
  const [project, setProject] = useState("");
  const [typeOfWork, setTypeOfWork] = useState("Bug fixes");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState(12);
  const [submitting, setSubmitting] = useState(false);
console.log(projects)

  useEffect(() => {
    if (open) {
      setProject(editing?.projectName || "");
      setTypeOfWork(editing?.typeOfWork || "Bug fixes");
      setDescription(editing?.description || editing?.taskName || "");
      setHours(editing?.hours ?? 12);
    }
  }, [open, editing]);

  const canSubmit = project && typeOfWork && description.trim() && hours > 0;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await onSubmit({
        date: defaultDate,
        taskName: description.trim().split("\n")[0].slice(0, 80),
        hours,
        projectName: project,
        typeOfWork,
        description,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="bg-[#ffffff]">
      <DialogContent data-testid="entry-modal" className="sm:max-w-lg bg-[#ffffff]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {editing ? "Edit Entry" : "Add New Entry"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div className="space-y-1.5">
            <div className="text-sm font-semibold text-slate-800">Select Project *</div>
            <Select value={project} onValueChange={setProject}>
              <SelectTrigger data-testid="entry-project-select" className="h-10 w-[17.5vw]">
                <SelectValue placeholder="Project Name" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.name}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <div className="text-sm font-semibold text-slate-800">Type of Work *</div>
            <Select value={typeOfWork} onValueChange={setTypeOfWork}>
              <SelectTrigger data-testid="entry-type-select" className="h-10 w-[17.5vw]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPES_OF_WORK.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <div className="text-sm font-semibold text-slate-800">Task description *</div>
            <Textarea
              data-testid="entry-description-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write text here ..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-slate-400">A note for extra info</p>
          </div>

          <div className="space-y-1.5">
            <div className="text-sm font-semibold text-slate-800">Hours *</div>
            <div className="flex items-center ">
              <button
                type="button"
                data-testid="entry-hours-decrement"
                onClick={() => setHours((h) => Math.max(0, h - 1))}
                className="h-10 w-[2.17vw] rounded-l-lg bg-[#F3F4F6] border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                data-testid="entry-hours-input"
                type="number"
                value={hours}
                min={0}
                onChange={(e) => setHours(Math.max(0, Number(e.target.value) || 0))}
                className="h-10 w-[3vw] text-center border border-slate-200  outline-none focus:border-blue-500 tabular-nums"
              />
              <button
                type="button"
                data-testid="entry-hours-increment"
                onClick={() => setHours((h) => h + 1)}
                className="h-10 w-[2.17vw] rounded-r-lg bg-[#F3F4F6]  border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 sm:justify-start gap-2">
          <Button
            data-testid="entry-submit-button"
            onClick={submit}
            disabled={!canSubmit || submitting}
            className="bg-[#1C64F2] w-[14vw] rounded-lg hover:bg-blue-700 text-white px-8 h-11"
          >
            {editing ? "Save changes" : "Add entry"}
          </Button>
          <Button
            data-testid="entry-cancel-button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-8 h-11 w-[14vw] rounded-lg border border-[#E5E7EB] "
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
