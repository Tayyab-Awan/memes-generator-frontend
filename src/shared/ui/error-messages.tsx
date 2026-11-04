import type { ReactNode } from "react";

interface ErrorMessagesProps {
  messages: string[];
  title?: string;
  action?: ReactNode;
}

export function ErrorMessages({ messages, title, action }: ErrorMessagesProps) {
  if (messages.length === 0) return null;
  return (
    <div
      role="alert"
      className="rounded-lg border border-danger/40 bg-danger-surface p-4 text-sm text-danger"
    >
      {title ? <p className="mb-1 font-semibold">{title}</p> : null}
      {messages.length === 1 ? (
        <p>{messages[0]}</p>
      ) : (
        <ul className="list-disc space-y-1 pl-5">
          {messages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
