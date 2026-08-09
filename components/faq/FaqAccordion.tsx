"use client";

import { useState } from "react";

import { FAQ_ITEMS } from "@/constants/faq";

/**
 * Un seul item ouvert à la fois, comme le comportement d'origine
 * (FAQ.html retirait la classe "active" des autres items au clic).
 */
export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-list">
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;
        const answerId = `faq-answer-${index}`;

        return (
          <div key={item.question} className={`faq-item ${isOpen ? "active" : ""}`}>
            <button
              type="button"
              className="faq-question"
              aria-expanded={isOpen}
              aria-controls={answerId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <h3>{item.question}</h3>
              <span className="faq-icon" aria-hidden="true">
                +
              </span>
            </button>
            <div id={answerId} className="faq-answer" role="region">
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
