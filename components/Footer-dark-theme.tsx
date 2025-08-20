/* eslint-disable import/no-unresolved */
/* eslint-disable tailwindcss/migration-from-tailwind-2 */
import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import WorldMap from "./ui/world-map";

const Footer = () => {
  return (
    <footer className="relative mt-10 overflow-hidden bg-gray-900">
      <div className="absolute inset-0 hidden size-full opacity-20 md:block">
        <WorldMap fullSize={true} />
      </div>
      <div className="container relative z-10 mx-auto px-6 py-8">
        <div className="mb-6 flex flex-col items-center">
          <Link href={`/`}>
            <Image
              src="/assets/friguslogo.png"
              width={1200000}
              height={1200000}
              alt="Frigus Fiesta"
              className="mb-10 mt-5 h-40 w-auto"
            />
          </Link>
          <div className="grid w-full max-w-4xl grid-cols-1 gap-6 text-center md:grid-cols-3">
            <div>
              <div className="mb-3 inline-flex items-center justify-center rounded-full bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur-sm">
                <MapPin className="size-5 text-gray-300" />
              </div>
              <p className="mb-1 text-base font-bold text-gray-100">
                Our Location
              </p>
              <Link
                href="https://maps.google.com/?q=Jawahar+Nagar,+Sainikpuri,+Hyderabad,+Telangana,+India-+500094"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-sm text-gray-400 hover:text-white hover:underline"
              >
                37-74/15/3A C 158, JJ NAGAR NEREDMET SAINIKPURI DEFENCE COLONY 
                <br />
                MALKAJGIRI 500094
              </Link>
            </div>
            <div>
              <div className="mb-3 inline-flex items-center justify-center rounded-full bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur-sm">
                <Phone className="size-5 text-gray-300" />
              </div>
              <p className="mb-1 text-base font-bold text-gray-100">
                Contact Phone
              </p>
              <Link
                href="tel:+919182684160"
                className="cursor-pointer text-sm text-gray-400 hover:text-white hover:underline"
              >
                91-91826-84160
              </Link>
            </div>
            <div>
              <div className="mb-3 inline-flex items-center justify-center rounded-full bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur-sm">
                <Mail className="size-5 text-gray-300" />
              </div>
              <p className="mb-1 text-base font-bold text-gray-100">
                Email Address
              </p>
              <Link
                href="mailto:info@frigusfiesta.com"
                className="cursor-pointer text-sm text-gray-400 hover:text-white hover:underline"
              >
                info@frigusfiesta.com
              </Link>
            </div>
          </div>
        </div>
        <div className="mb-6 flex justify-center space-x-4">
          {[
            // { Icon: Facebook, href: "/", label: "Facebook" },
            {
              Icon: Instagram,
              href: "https://www.instagram.com/frigusfiesta?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
              label: "Instagram",
            },
            {
              Icon: Linkedin,
              href: "https://www.linkedin.com/in/frigus-fiesta-24000b369/",
              label: "LinkedIn",
            },
            {
              Icon: Youtube,
              href: "https://www.youtube.com/@FrigusFiesta",
              label: "YouTube",
            },
          ].map(({ Icon, href, label }, index) => (
            <Link
              key={index}
              href={href}
              className="flex size-12 items-center justify-center rounded-full bg-white/10 text-gray-300 ring-1 ring-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-yellow-400 hover:text-black"
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon className="size-5" />
            </Link>
          ))}
        </div>
        <div className="border-t border-gray-600 pt-4">
          <div className="flex flex-col items-center justify-between space-y-3 md:flex-row md:space-y-0">
            <p className="text-xs text-gray-400">
              ©2025 Frigus Fiesta | Developed by{" "}
              <Link
                href="https://www.electroplix.com/"
                target="_blank"
                className="font-semibold text-gray-200 hover:text-white hover:underline"
              >
                Electroplix
              </Link>
            </p>
            <div className="flex items-center space-x-4 text-xs">
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white hover:underline"
              >
                Terms & Conditions
              </Link>
              <div className="h-3 w-px bg-white/20"></div>
              <Link
                href="/privacy-policy"
                className="text-gray-400 hover:text-white hover:underline"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;