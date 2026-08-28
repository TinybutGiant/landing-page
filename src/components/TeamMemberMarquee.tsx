import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Globe, Linkedin, Mail, User, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type TeamMemberLinkType = "linkedin" | "portfolio" | "contact";

export type TeamMemberCard = {
  id: string;
  name: string;
  role: string;
  bio: string;
  links?: TeamMemberLinkType[];
};

type TeamMemberMarqueeProps = {
  title: string;
  rows: TeamMemberCard[][];
  closeLabel?: string;
  connectLabel?: string;
  linkedInLabel?: string;
  portfolioLabel?: string;
  contactLabel?: string;
};

type ModalLabels = {
  closeLabel: string;
  connectLabel: string;
  linkedInLabel: string;
  portfolioLabel: string;
  contactLabel: string;
};

type MemberLink = {
  id: TeamMemberLinkType;
  label: string;
  icon: LucideIcon;
};

const LINK_DEFINITIONS: {
  id: TeamMemberLinkType;
  labelKey: keyof Pick<
    ModalLabels,
    "linkedInLabel" | "portfolioLabel" | "contactLabel"
  >;
  icon: LucideIcon;
}[] = [
  { id: "linkedin", labelKey: "linkedInLabel", icon: Linkedin },
  { id: "portfolio", labelKey: "portfolioLabel", icon: Globe },
  { id: "contact", labelKey: "contactLabel", icon: Mail },
];

function buildSeamlessLoop(members: TeamMemberCard[], minCards = 14) {
  if (members.length === 0) return [];

  const expanded: TeamMemberCard[] = [];
  while (expanded.length < minCards) {
    expanded.push(...members);
  }

  return [...expanded, ...expanded];
}

function getMemberLinks(
  member: TeamMemberCard,
  labels: ModalLabels
): MemberLink[] {
  if (!member.links?.length) return [];

  return LINK_DEFINITIONS.filter((definition) =>
    member.links?.includes(definition.id)
  ).map((definition) => ({
    id: definition.id,
    label: labels[definition.labelKey],
    icon: definition.icon,
  }));
}

function MarqueeCard({
  member,
  onSelect,
}: {
  member: TeamMemberCard;
  onSelect: (member: TeamMemberCard) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(member)}
      className="group flex w-[min(88vw,22rem)] shrink-0 items-center gap-4 rounded-2xl border border-gray-200 bg-white/80 px-4 py-3.5 text-left backdrop-blur-sm transition-colors hover:bg-white sm:w-[24rem] sm:px-5 sm:py-4"
      data-cursor-hover
      aria-label={`${member.name}, ${member.role}`}
    >
      <div
        className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e8e8e8] transition-colors duration-200 group-hover:bg-gray-900 sm:h-16 sm:w-16"
        aria-hidden
      >
        <User
          className="h-6 w-6 text-gray-600 transition-all duration-200 group-hover:scale-75 group-hover:opacity-0 sm:h-7 sm:w-7"
          strokeWidth={1.75}
        />
        <ArrowUpRight
          className="absolute h-6 w-6 scale-75 text-white opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 sm:h-7 sm:w-7"
          strokeWidth={2}
        />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-snug text-gray-900 sm:text-base">
          {member.name}
        </p>
        <p className="mt-0.5 text-sm leading-snug text-gray-600">{member.role}</p>
      </div>
    </button>
  );
}

function MarqueeRow({
  members,
  onSelect,
  reverse = false,
  durationSeconds = 108,
}: {
  members: TeamMemberCard[];
  onSelect: (member: TeamMemberCard) => void;
  reverse?: boolean;
  durationSeconds?: number;
}) {
  const [paused, setPaused] = useState(false);
  const loop = useMemo(() => buildSeamlessLoop(members), [members]);

  return (
    <div
      className="team-marquee-fade overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`team-marquee-track flex w-max gap-3 sm:gap-4 ${
          reverse ? "team-marquee-reverse" : ""
        } ${paused ? "team-marquee-paused" : ""}`}
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {loop.map((member, index) => (
          <MarqueeCard
            key={`${member.id}-${index}`}
            member={member}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

function MemberLinkButton({
  label,
  icon: Icon,
}: {
  label: string;
  icon: LucideIcon;
}) {
  return (
    <button
      type="button"
      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98]"
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      {label}
    </button>
  );
}

function TeamMemberModal({
  member,
  onClose,
  labels,
}: {
  member: TeamMemberCard;
  onClose: () => void;
  labels: ModalLabels;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const links = getMemberLinks(member, labels);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-label={labels.closeLabel}
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="team-member-modal-title"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-700"
          aria-label={labels.closeLabel}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f3f3f3] text-gray-600">
            <User className="h-9 w-9" strokeWidth={1.75} />
          </div>
          <h3
            id="team-member-modal-title"
            className="mt-5 text-2xl font-bold text-gray-900"
          >
            {member.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-gray-500">{member.role}</p>
          <p className="mt-5 text-left text-sm leading-relaxed text-gray-600 sm:text-base">
            {member.bio}
          </p>

          {links.length > 0 ? (
            <div className="mt-6 w-full border-t border-gray-100 pt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {labels.connectLabel}
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {links.map((link) => (
                  <MemberLinkButton
                    key={link.id}
                    label={link.label}
                    icon={link.icon}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}

const ROW_DURATIONS_SECONDS = [108, 128];

export default function TeamMemberMarquee({
  title,
  rows,
  closeLabel = "Close",
  connectLabel = "Connect",
  linkedInLabel = "LinkedIn",
  portfolioLabel = "Portfolio",
  contactLabel = "Contact",
}: TeamMemberMarqueeProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMemberCard | null>(
    null
  );

  const modalLabels: ModalLabels = {
    closeLabel,
    connectLabel,
    linkedInLabel,
    portfolioLabel,
    contactLabel,
  };

  const visibleRows = rows.filter((row) => row.length > 0);

  return (
    <>
      <section className="relative overflow-hidden py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
            {title}
          </h2>
        </div>

        <div className="mt-10 space-y-3 sm:mt-12 sm:space-y-4">
          {visibleRows.map((rowMembers, index) => (
            <MarqueeRow
              key={`marquee-row-${index}`}
              members={rowMembers}
              onSelect={setSelectedMember}
              reverse={index % 2 === 1}
              durationSeconds={
                ROW_DURATIONS_SECONDS[index] ??
                ROW_DURATIONS_SECONDS[ROW_DURATIONS_SECONDS.length - 1]
              }
            />
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedMember ? (
          <TeamMemberModal
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
            labels={modalLabels}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
