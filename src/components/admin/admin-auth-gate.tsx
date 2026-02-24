"use client";

import { useState, useEffect, type ReactNode } from "react";
import { LockSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface AdminAuthGateProps {
  children: ReactNode;
}

export function AdminAuthGate({ children }: AdminAuthGateProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth")
      .then((res) => {
        if (res.ok) {
          setAuthenticated(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pin }),
      });

      if (res.ok) {
        setAuthenticated(true);
      } else {
        setError("비밀번호가 올바르지 않습니다.");
        setPin("");
      }
    } catch {
      setError("서버 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        확인 중...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary mb-3">
                <LockSimple weight="light" className="h-6 w-6" />
              </div>
              <h1 className="text-lg font-semibold">관리자 인증</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                관리자 비밀번호를 입력하세요
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError("");
                }}
                placeholder="비밀번호"
                autoFocus
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">
                로그인
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
