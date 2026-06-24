export const CONTENT_PROSE = [
    "prose",
    "prose-base",
    "max-w-none",
    "font-poppins",
    // Override margins via Tailwind variants
    "prose-p:my-1",              // paragraphs: margin 0.25rem top/bottom
    "prose-headings:mt-3 prose-headings:text-[#003479]",       // headings: margin 0.5rem top/bottom
    "prose-ul:my-1",             // unordered lists
    "prose-ol:my-1",             // ordered lists
    "prose-li:my-0",             // list items: zero margin
    "prose-h1:mt-2",             // optional: extra top on H1
    "prose-h1:mb-1",
].join(" ");
