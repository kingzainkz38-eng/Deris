import { SearchIcon, UsersIcon, ChatIcon, ArrowRightIcon } from "./icons";

const STEPS = [
  {
    number: "1",
    title: "Search",
    description: "Search for the service you need in your area.",
    icon: SearchIcon,
    bg: "bg-[var(--brand-green-50)]",
    iconBg: "bg-[var(--brand-green)]",
  },
  {
    number: "2",
    title: "Compare",
    description: "Compare providers, ratings and choose the best fit.",
    icon: UsersIcon,
    bg: "bg-[color-mix(in_srgb,var(--brand-gold)_14%,white)]",
    iconBg: "bg-[var(--brand-gold)]",
  },
  {
    number: "3",
    title: "Connect",
    description: "Contact the provider and get the job done.",
    icon: ChatIcon,
    bg: "bg-[var(--brand-green-50)]",
    iconBg: "bg-[var(--brand-green)]",
  },
] as const;

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-center text-2xl font-bold text-neutral-900 sm:text-3xl">How Deris Works</h2>

      <div className="mt-8 flex flex-col items-stretch gap-4 lg:flex-row lg:items-center">
        {STEPS.map((step, i) => (
          <div key={step.title} className="flex flex-1 items-center gap-4 lg:contents">
            <div className={`flex flex-1 items-center gap-4 rounded-2xl p-5 ${step.bg}`}>
              <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white ${step.iconBg}`}>
                <step.icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-bold text-neutral-900">
                  {step.number}. {step.title}
                </h3>
                <p className="mt-0.5 text-sm text-neutral-600">{step.description}</p>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <ArrowRightIcon className="hidden h-6 w-6 shrink-0 text-neutral-300 lg:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
