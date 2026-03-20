import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About this blog.",
};

export default function AboutPage() {
  return (
    <div className="about-page max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-4">
        Hi, I'm <span className="text-blue-500">Venkata Narayana Reddy Nadikattu</span>
      </h1>

      <p className="mb-4">
        I am a <strong>Frontend Developer</strong> currently working at{" "}
        <strong>P2PAI</strong>. I enjoy building modern web applications
        using technologies like React and Next.js, focusing on clean UI,
        performance, and user experience.
      </p>
    </div>
  );
}