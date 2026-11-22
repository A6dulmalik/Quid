"use client";

import { motion, Variants } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

const faqData = [
  {
    question: "How do you make sure reports are useful?",
    answer:
      "Every hunter signs in with a Stellar wallet, so each report is tied to an on-chain identity. You review every report and only approved ones are paid.",
  },
  {
    question: "Can I choose who tests my dApp?",
    answer:
      "Yes. A mission can require hunters to hold a minimum balance of a token you pick, and you set the maximum number of hunters.",
  },
  {
    question: "How quickly will I get reports?",
    answer:
      "It depends on the reward and how many hunters are active. A mission stays open until it fills, you close it, or its deadline passes.",
  },
  {
    question: "How much does a Mission cost?",
    answer:
      "You set the reward per hunter and the number of hunters. The total is escrowed in the quid-store contract when you publish, and unused escrow is refunded if you cancel.",
  },
  {
    question: "Where are reports stored?",
    answer:
      "Report content is pinned to IPFS and only its content ID is stored on-chain. Anyone with the content ID can read a report, so don't include private information.",
  },
  {
    question: "How does it work?",
    answer:
      "Create a mission with a test plan and reward, then publish. Hunters submit reports, you review them, and approved hunters are paid from escrow.",
  },
];

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function FAQSection() {
  return (
    <section className="relative px-4 py-16 text-foreground sm:px-6 sm:py-24 md:py-32 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-12">
        <header className="flex w-full flex-col items-center gap-4 text-center">
          <h2 className="w-full text-3xl font-black uppercase tracking-tight md:text-5xl">
            Common Questions From Creators
          </h2>
          <p className="w-full text-base font-medium text-muted-foreground">
            Covers all the popular inquiries you may have.
          </p>
        </header>

        <Accordion
          type="single"
          collapsible
          defaultValue="item-0"
          className="flex w-full flex-col gap-3"
        >
          {faqData.map((faq, index) => (
            <motion.div
              key={`faq-${index}`}
              className="w-full"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={itemVariants}
            >
              <AccordionItem
                value={`item-${index}`}
                className="brutal-border brutal-shadow w-full bg-card px-4 data-[state=open]:pb-2"
              >
                <AccordionTrigger className="py-4 hover:no-underline [&>svg]:text-foreground">
                  <h3 className="text-left text-base font-bold text-foreground md:text-lg">
                    {faq.question}
                  </h3>
                </AccordionTrigger>
                {faq.answer && (
                  <AccordionContent className="pb-4">
                    <div className="mb-3 h-[2px] w-full bg-foreground" />
                    <p className="text-sm font-medium leading-relaxed text-muted-foreground md:text-base">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                )}
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
