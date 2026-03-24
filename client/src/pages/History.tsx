import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Layout from "@/components/Layout";
import { Clock, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

import { SESSION_ID } from "@/lib/session";

export default function History() {
  const { data: history, isLoading } = useQuery({
    queryKey: ["/api/history", SESSION_ID],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/history?sessionId=${SESSION_ID}`);
      return res.json();
    },
  });

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6 animate-fade-slide-up">
          <div className="p-2 rounded-xl bg-primary/10 dark:bg-primary/20">
            <Clock size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Your History</h2>
            <p className="text-sm text-muted-foreground">Names you've generated this session</p>
          </div>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
          </div>
        )}

        {!isLoading && (!history || history.length === 0) && (
          <div className="text-center py-16 animate-fade-slide-up">
            <Clock size={40} className="mx-auto text-muted-foreground mb-4 opacity-30" />
            <p className="text-muted-foreground font-medium mb-2">No history yet</p>
            <p className="text-sm text-muted-foreground mb-6">Generate some names to see them here.</p>
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
              Get a name <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {!isLoading && history && history.length > 0 && (
          <div className="space-y-3 animate-fade-slide-up">
            {history.map((entry: any, i: number) => (
              <div
                key={entry.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
                data-testid={`row-history-${entry.id}`}
              >
                <div className="text-2xl font-black text-muted-foreground/20 w-8 shrink-0 text-right"
                     style={{ fontFamily: "var(--font-display)" }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                      {entry.name.name}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono hidden sm:inline">
                      ({entry.name.pronunciation})
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground italic">"{entry.name.meaning}"</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <BookOpen size={10} className="text-primary" />
                    <span className="text-xs text-primary">{entry.name.verseRef}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">
                  {formatTime(entry.generatedAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
