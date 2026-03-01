"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { EventForm } from "@/components/calendar/event-form";
import { addCalendarEvent } from "@/lib/calendar-store";
import { useAdmin } from "@/hooks/use-admin";

export default function NewEventPage() {
  const router = useRouter();
  const { isAdmin, loading } = useAdmin();

  useEffect(() => {
    if (!loading && !isAdmin) router.replace("/admin/login");
  }, [loading, isAdmin, router]);

  if (loading || !isAdmin) return null;

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
