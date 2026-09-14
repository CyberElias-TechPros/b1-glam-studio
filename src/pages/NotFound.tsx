import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Layout from "@/components/Layout";
import { Magnetic, Marquee, Ornament, Reveal, SplitText } from "@/components/motion/Reveal";

export default function NotFound() {
  const location = useLocation();

  return (
    <Layout>
      <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-32 pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_0%,hsl(40_62%_62%_/_0.12),transparent_60%)]" />
        <div className="grain pointer-events-none absolute inset-0 -z-10" />

        <div className="shell relative text-center">
          <Reveal variant="fade">
            <Ornament className="mx-auto mb-8 max-w-xs" />
          </Reveal>

          <p className="eyebrow mb-6">Error 404</p>

          <SplitText as="h1" text="This page slipped off the vanity" className="display-xl mx-auto max-w-[24ch]" />

          <Reveal variant="up" delay={0.3}>
            <p className="lede mx-auto mt-7 max-w-lg text-center">
              The link you followed doesn't exist — but the studio is very much open.
              {location.pathname !== "/" && (
                <>
                  {" "}
                  <span className="text-muted-foreground/70">({location.pathname})</span>
                </>
              )}
            </p>
          </Reveal>

          <Reveal variant="up" delay={0.4} className="mt-11 flex flex-wrap justify-center gap-4">
            <Magnetic strength={0.2}>
              <Link to="/" className="btn btn-gold shine">
                <ArrowLeft size={14} />
                Back to home
              </Link>
            </Magnetic>
            <Link to="/booking" className="btn btn-outline">
              Book a session
              <ArrowUpRight size={14} />
            </Link>
          </Reveal>

          <Reveal variant="fade" delay={0.55}>
            <div className="mx-auto mt-16 hidden max-w-xl sm:block">
              <Marquee
                items={["Bridal", "Owambe", "Editorial", "Masterclass"]}
                itemClassName="font-display text-xl uppercase tracking-[0.24em] text-foreground/25"
                slow
              />
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
