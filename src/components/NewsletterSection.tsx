"use client";

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewsletterSection() {
  return (
    <section className="rounded-2xl bg-primary px-8 py-12 text-center text-primary-foreground">
      <div className="mx-auto max-w-lg">
        <div className="mb-4 flex justify-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary-foreground/15">
            <Mail className="size-5" />
          </span>
        </div>

        <h1 className="mb-3 text-3xl font-extrabold tracking-tight">
          Camp Creek Market Social
        </h1>

        <p className="mb-8 text-primary-foreground/90 leading-relaxed">
          Join the Camp Creek Market Social that unites everyone as a tribe with channels
          for men, women, dating, shopping, deliveries, drivers, jobs, and business
          promo. Upvote the best TikTok videos that will get shared in the{" "}
          <span className="font-semibold">@CampCreekMarket</span> story.
        </p>

        <a
          href="https://api.campcreekmarket.com/tribe/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="lg"
            className="bg-primary-foreground text-primary font-bold hover:bg-primary-foreground/90"
          >
            Join The Tribe
          </Button>
        </a>

        <p className="mt-5 text-xs text-primary-foreground/50">
          It’s free. No spam, just the tribe.
        </p>
      </div>
    </section>
  );
}