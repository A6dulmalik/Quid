"use client";

import { motion, Variants } from "framer-motion";
import { brutalCardColors } from "@/lib/brutalist";
import { UPCOMING_FEATURE_LIST } from "@/lib/upcoming-features";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/**
 * Lists the features in lib/upcoming-features.ts. An entry marked "live"
 * shows a "Live" tag instead of "Coming Soon".
 */
export default function RoadmapSection() {
  return (
    <section id="roadmap" className="relative overflow-hidden py-20 text-foreground">
      <motion.div
        className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 md:max-w-3xl lg:max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div className="max-w-3xl space-y-4" variants={itemVariants}>
          <span className="inline-block brutal-border bg-brutal-violet px-3 py-1 text-xs font-black uppercase tracking-widest text-white">
            Roadmap
          </span>
          <h2 className="text-4xl font-black uppercase leading-tight lg:text-5xl">
            What&apos;s shipping{" "}
            <span className="bg-brutal-lime px-2 text-[#0a0a0a]">next</span>
          </h2>
          <p className="text-base font-medium text-muted-foreground">
            Quid is open source and built in public. These features are in
            progress.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {UPCOMING_FEATURE_LIST.map((feature, idx) => (
            <motion.article
              key={feature.id}
              data-upcoming-feature={feature.id}
              className="flex flex-col gap-4 brutal-border brutal-shadow bg-card p-6"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  aria-hidden="true"
                  className="h-4 w-4 brutal-border"
                  style={{ backgroundColor: brutalCardColors[idx % brutalCardColors.length] }}
                />
                <span
                  className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#0a0a0a] ${
                    feature.status === "live" ? "bg-brutal-lime" : "bg-brutal-yellow"
                  }`}
                >
                  {feature.status === "live" ? "Live" : "Coming Soon"}
                </span>
              </div>
              <h3 className="text-lg font-black uppercase leading-tight">
                {feature.label}
              </h3>
              <p className="text-sm font-medium text-muted-foreground">
                {feature.summary}
              </p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
