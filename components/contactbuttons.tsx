"use client";

import React from "react";
import Image from "next/image";

export default function ContactButtons() {
  return (
    <div className="contact-stack" role="group" aria-label="Contact actions">
      <a
        href="https://wa.me/919000701000"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
        className="contact-button whatsapp-button"
      >
        <Image
          src="/assets/whatsapp.png"
          alt="WhatsApp"
          width={32}
          height={32}
          className="contact-icon"
          sizes="32px"
          priority
        />
      </a>
    </div>
  );
}
