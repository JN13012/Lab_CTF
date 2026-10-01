import { useState } from "react";
import { Check, CheckCircle2, ChevronDown, Info, Lightbulb, Server, XCircle } from "lucide-react";
import { TagChip } from "../../components/ui/TagChip";
import { getRoomPoints, getRoomTasks, isQuestionAnswered, isTaskDone } from "../../ctf/selectors";

function Block({ block }) {
  if (block.type === "code") return <pre className="font-mono">{block.text}</pre>;
  if (block.type === "list") {
    return (
      <ul>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  if (block.type === "note") {
    return (
      <div className="mb-3 flex gap-2 rounded-lg border border-[var(--info)]/30 bg-[var(--info-soft)] px-3 py-2.5 text-sm text-[var(--info)]">
        <Info size={16} className="mt-0.5 shrink-0" />
        {block.text}
      </div>
    );
  }
  return <p>{block.text}</p>;
}

function Question({ question, answered, machineOnline, onAnswer }) {
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState(null);

  if (question.kind === "ack") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[var(--surface-sunken)] px-3 py-2.5">
        <span className="text-sm text-[var(--text-body)]">{question.prompt}</span>
        {answered ? (
          <span className="button button-validated min-h-8 px-3 text-xs">
            <Check size={14} strokeWidth={3} />
            Completed
          </span>
        ) : (
          <button type="button" className="button min-h-8 px-3 text-xs" onClick={() => onAnswer(question)}>
            Complete
          </button>
        )}
      </div>
    );
  }

  const submit = (event) => {
    event.preventDefault();
    if (!value.trim()) {
      setFeedback("empty");
      return;
    }
    const correct = onAnswer(question, value);
    setFeedback(correct ? null : "wrong");
  };

  return (
    <div>
      <label className="block text-sm text-[var(--text-body)]" htmlFor={`q-${question.id}`}>
        {question.prompt}
      </label>
      {answered ? (
        <div className="mt-2 flex gap-2">
          <span className="flex min-w-0 flex-1 items-center rounded-lg border border-[var(--validated)] bg-[var(--validated-soft)] px-3 py-2 font-mono text-sm text-[var(--text)]">
            <span className="truncate">{question.kind === "flag" ? "FLAG{••••••••}" : question.answer[0]}</span>
          </span>
          <span className="button button-validated">
            <CheckCircle2 size={15} />
            Correct
          </span>
        </div>
      ) : question.kind === "flag" && !machineOnline ? (
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-dashed border-[var(--border-strong)] px-3 py-2.5 text-sm text-[var(--text-muted)]">
          <Server size={15} className="shrink-0" />
          Start the target machine first to capture the flag.
        </div>
      ) : (
        <form className="mt-2 flex gap-2" onSubmit={submit}>
          <input
            id={`q-${question.id}`}
            className={`min-w-0 flex-1 rounded-lg border bg-[var(--surface-sunken)] px-3 py-2 font-mono text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] ${
              feedback ? "border-[var(--danger)]" : "border-[var(--border)]"
            }`}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setFeedback(null);
            }}
            placeholder={question.kind === "flag" ? "FLAG{...}" : `Answer format: ${question.format || "***"}`}
            spellCheck="false"
            autoComplete="off"
          />
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      )}
      {feedback === "wrong" && (
        <p className="m-0 mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-[var(--danger)]">
          <XCircle size={13} />
          {question.kind === "flag" ? "Incorrect flag. Keep enumerating." : "Incorrect answer. Try again."}
        </p>
      )}
      {feedback === "empty" && (
        <p className="m-0 mt-1.5 text-xs font-semibold text-[var(--danger)]">Enter an answer first.</p>
      )}
    </div>
  );
}

function TaskCard({ index, task, done, defaultOpen, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section
      className={`overflow-hidden rounded-xl border bg-[var(--surface)] panel ${
        done ? "border-[var(--validated)]/40" : "border-[var(--border)]"
      }`}
    >
      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-[var(--surface-hover)]"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span
          className={`grid size-8 shrink-0 place-items-center rounded-md text-xs font-bold ${
            done ? "bg-[var(--validated)] text-[var(--on-accent)]" : "bg-[var(--surface-sunken)] text-[var(--text-muted)]"
          }`}
        >
          {done ? <Check size={16} strokeWidth={3} /> : index}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block label-mono text-[var(--text-faint)]">
            Task {index}
          </span>
          <strong className="block truncate text-[15px] font-semibold text-[var(--text)]">{task.title}</strong>
        </span>
        {task.machine && (
          <span className="hidden items-center gap-1 rounded-md bg-[var(--surface-sunken)] px-2 py-1 text-[11px] font-semibold text-[var(--text-muted)] sm:inline-flex">
            <Server size={12} />
            Requires machine
          </span>
        )}
        <ChevronDown size={18} className={`shrink-0 text-[var(--text-faint)] transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="reveal border-t border-[var(--border)] px-5 py-5">
          {children}
        </div>
      )}
    </section>
  );
}

export function TaskPanel({ room, runtime, vmState, roomStats, note, onRevealHint, onNotesChange, onAnswerQuestion }) {
  const tasks = getRoomTasks(room);
  const firstOpen = tasks.findIndex((task) => !isTaskDone(runtime, room, task));
  const hintVisible = roomStats.hints > 0;

  return (
    <div className="grid content-start gap-3">
      {tasks.map((task, index) => (
        <TaskCard
          key={`${room.id}-${task.id}`}
          index={index + 1}
          task={task}
          done={isTaskDone(runtime, room, task)}
          defaultOpen={index === (firstOpen === -1 ? 0 : firstOpen)}
        >
          <div className="task-body">
            {task.body.map((block, blockIndex) => (
              <Block key={blockIndex} block={block} />
            ))}
          </div>
          <div className="mt-4 border-t border-[var(--border)] pt-4">
            <span className="kicker">Answer the questions below</span>
            <div className="mt-3 grid gap-4">
              {task.questions.map((question) => (
                <Question
                  key={`${room.id}-${question.id}`}
                  question={question}
                  answered={isQuestionAnswered(runtime, room, question)}
                  machineOnline={vmState === "running"}
                  onAnswer={onAnswerQuestion}
                />
              ))}
            </div>
          </div>
        </TaskCard>
      ))}

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] panel px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
            <Lightbulb size={16} className="text-[var(--warning)]" />
            Need a hint?
          </span>
          {!hintVisible && (
            <button type="button" className="text-sm font-semibold text-[var(--warning)] hover:underline" onClick={onRevealHint}>
              Show hint
            </button>
          )}
        </div>
        {hintVisible && (
          <>
            <p className="m-0 mt-3 text-sm leading-6 text-[var(--text-body)]">{room.hint}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(room.unlocks.length ? room.unlocks : ["basic shell"]).map((tool) => (
                <TagChip key={tool}>{tool}</TagChip>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] panel px-5 py-4">
        <span className="text-sm font-semibold text-[var(--text)]">Notes</span>
        <textarea
          className="mt-3 min-h-28 w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface-sunken)] p-3 font-mono text-sm leading-6 text-[var(--text)] outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--accent)]"
          value={note}
          onChange={(event) => onNotesChange(event.target.value)}
          placeholder="Commands, findings, credentials, things to retry..."
          aria-label="Room notes"
        />
      </section>

      <p className="m-0 text-center text-xs text-[var(--text-faint)]">
        Completing the final flag awards {getRoomPoints(room)} pts
      </p>
    </div>
  );
}
