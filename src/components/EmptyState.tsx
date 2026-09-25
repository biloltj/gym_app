import type { LucideIcon } from "lucide-react";

export default function EmptyState({ icon: Icon, message }: { icon: LucideIcon; message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 text-neutral-600">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-neutral-500">{message}</p>
    </div>
  );
}
