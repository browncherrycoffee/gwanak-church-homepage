"use client";

import { useRouter } from "next/navigation";
import { EventForm } from "@/components/calendar/event-form";
import { addCalendarEvent } from "@/lib/calendar-store";

export default function NewEventPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">새 일정 추가</h1>
      <EventForm
        onSubmit={(data) => {
          addCalendarEvent(data);
          router.push("/calendar");
        }}
      />
    </div>
  );
}
