import { useState } from "react";
import { Heart, Share2, RefreshCw, BookOpen, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { BiblicalName } from "../../../shared/schema";
import { useToast } from "@/hooks/use-toast";

interface NameCardProps {
  name: BiblicalName;
  isFavorite: boolean;
  onFavorite: () => void;
  onNext: () => void;
  isLoading: boolean;
  animKey: number;
}

const packLabels: Record<string, string> = {
  heroes: "Heroes of Faith",
  women: "Women of the Bible",
  kings: "Kings & Rulers",
  prophets: "Prophets",
  new_testament: "New Testament",
};

const testamentColors: Record<string, string> = {
  OT: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  NT: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
};

export default function NameCard({ name, isFavorite, onFavorite, onNext, isLoading, animKey }: NameCardProps) {
  const { toast } = useToast();
  const [speaking, setSpeaking] = useState(false);

  const handleShare = async () => {
    const text = `My drive-thru name is ${name.name}! 📖 "${name.story.slice(0, 120)}..." Learn more at biblenamefinder.com`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `My Bible Name: ${name.name}`, text, url: "https://biblenamefinder.com" });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard!", description: "Share your Bible name with friends." });
    }
  };

  const handleSpeak = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(`${name.name}. ${name.pronunciation}. ${name.name} means "${name.meaning}".`);
    utterance.rate = 0.85;
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      key={animKey}
      className="animate-fade-slide-up w-full max-w-lg mx-auto"
    >
      {/* Main card */}
      <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-primary opacity-80" />

        <div className="p-6 sm:p-8">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-5 animate-fade-slide-in stagger-1">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${testamentColors[name.testament]}`}>
              {name.testament === "OT" ? "Old Testament" : "New Testament"}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
              {packLabels[name.pack] || name.pack}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
              {name.gender}
            </span>
          </div>

          {/* Name */}
          <div className="mb-1 animate-fade-slide-in stagger-2">
            <h1
              className="name-shimmer text-5xl sm:text-6xl font-black tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
              data-testid="text-biblical-name"
            >
              {name.name}
            </h1>
          </div>

          {/* Pronunciation + meaning */}
          <div className="flex flex-wrap items-center gap-3 mb-6 animate-fade-slide-in stagger-3">
            <button
              onClick={handleSpeak}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-pronounce"
            >
              <Volume2 size={14} className={speaking ? "text-primary animate-pulse" : ""} />
              <span className="font-mono text-xs">{name.pronunciation}</span>
            </button>
            <span className="text-muted-foreground text-xs">·</span>
            <span className="text-sm text-muted-foreground italic">"{name.meaning}"</span>
          </div>

          {/* Divider */}
          <div className="border-t border-border mb-6" />

          {/* Story */}
          <div className="animate-fade-slide-in stagger-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={14} className="text-primary shrink-0" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Their Story</span>
            </div>
            <p
              className="text-base leading-relaxed text-foreground"
              data-testid="text-name-story"
            >
              {name.story}
            </p>
          </div>

          {/* Verse */}
          <div className="mt-5 p-4 rounded-xl bg-muted/60 border border-border animate-fade-slide-in stagger-4">
            <p className="text-sm italic text-muted-foreground leading-relaxed">
              "{name.verse}"
            </p>
            <p className="mt-2 text-xs font-semibold text-primary">{name.verseRef}</p>
          </div>
        </div>

        {/* Action bar */}
        <div className="border-t border-border px-6 py-4 flex items-center justify-between gap-3 bg-muted/30">
          <button
            onClick={onFavorite}
            data-testid="button-favorite"
            className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
              isFavorite
                ? "text-red-500 bg-red-50 dark:bg-red-950/30"
                : "text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
            }`}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
            <span className="hidden sm:inline">{isFavorite ? "Saved" : "Save"}</span>
          </button>

          <Button
            onClick={onNext}
            disabled={isLoading}
            data-testid="button-next-name"
            className="flex-1 max-w-[200px] gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-10"
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
            New Name
          </Button>

          <button
            onClick={handleShare}
            data-testid="button-share"
            className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Share2 size={16} />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Drive-thru tip */}
      <div className="mt-4 text-center text-xs text-muted-foreground animate-fade-slide-in animation-delay-300">
        💡 Use <span className="font-semibold text-foreground">{name.name}</span> as your name at the drive-thru!
      </div>
    </div>
  );
}
