import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Globe, Linkedin, Mail, User, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type TeamMemberLinkType = "linkedin" | "portfolio" | "contact";

export type TeamMemberStatus = "active" | "former";

export type TeamMemberLink = {
  type: TeamMemberLinkType;
  href: string;
  label?: string;
};

export type TeamMemberCard = {
  id: string;
  name: string;
  role: string;
  bio: string;
  /** Short one-liner for featured cards. Falls back to role when omitted. */
  summary?: string;
  status?: TeamMemberStatus;
  avatarSrc?: string;
  links?: TeamMemberLink[];
};

type TeamMemberMarqueeProps = {
  title: string;
  featured?: TeamMemberCard[];
  featuredSubtitle?: string;
  rows: TeamMemberCard[][];
  closeLabel?: string;
  connectLabel?: string;
  linkedInLabel?: string;
  portfolioLabel?: string;
  contactLabel?: string;
  formerLabel?: string;
};

type ModalLabels = {
  closeLabel: string;
  connectLabel: string;
  linkedInLabel: string;
  portfolioLabel: string;
  contactLabel: string;
  formerLabel: string;
};

type MemberLink = {
  id: TeamMemberLinkType;
  label: string;
  href: string;
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

  return member.links
    .map((link) => {
      const definition = LINK_DEFINITIONS.find(({ id }) => id === link.type);
      if (!definition) return null;

      return {
        id: link.type,
        label: link.label ?? labels[definition.labelKey],
        href: link.href,
        icon: definition.icon,
      };
    })
    .filter((link): link is MemberLink => Boolean(link));
}

function MemberAvatar({
  member,
  avatarClassName,
  iconClassName,
  interactive = false,
}: {
  member: TeamMemberCard;
  avatarClassName: string;
  iconClassName: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={`relative z-10 flex shrink-0 items-center justify-center overflow-hidden rounded-full text-gray-900 shadow-sm ${avatarClassName}`}
      aria-hidden
    >
      {member.avatarSrc ? (
        <img
          src={member.avatarSrc}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
      ) : (
        <User className={iconClassName} strokeWidth={1.75} />
      )}
      <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-black/5" />
      {interactive ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <ArrowUpRight className={iconClassName} strokeWidth={2} />
        </div>
      ) : null}
    </div>
  );
}

function FormerBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
      {label}
    </span>
  );
}

function FeaturedMemberCard({
  member,
  onSelect,
  formerLabel,
}: {
  member: TeamMemberCard;
  onSelect: (member: TeamMemberCard) => void;
  formerLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(member)}
      className="group relative flex min-h-64 w-full flex-col items-center overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-white px-4 py-6 text-center shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(66,52,12,0.10)] sm:px-5 sm:py-7"
      data-cursor-hover
      aria-label={`${member.name}, ${member.role}`}
    >
      <MemberAvatar
        member={member}
        avatarClassName="h-20 w-20"
        iconClassName="h-8 w-8"
        interactive
      />
      <p className="relative z-10 mt-4 text-base font-semibold text-[#171714]">
        {member.name}
      </p>
      {member.status === "former" ? (
        <div className="relative z-10 mt-2">
          <FormerBadge label={formerLabel} />
        </div>
      ) : null}
      <p
        className="relative z-10 mt-2 line-clamp-2 text-sm leading-relaxed text-[#625f55]"
      >
        {member.summary ?? member.role}
      </p>
    </button>
  );
}

function MarqueeCard({
  member,
  onSelect,
  formerLabel,
}: {
  member: TeamMemberCard;
  onSelect: (member: TeamMemberCard) => void;
  formerLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(member)}
      className="group relative flex w-[min(88vw,22rem)] shrink-0 items-center gap-4 overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-white px-4 py-3.5 text-left shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(66,52,12,0.09)] sm:w-[24rem] sm:px-5 sm:py-4"
      data-cursor-hover
      aria-label={`${member.name}, ${member.role}`}
    >
      <MemberAvatar
        member={member}
        avatarClassName="h-14 w-14 sm:h-16 sm:w-16"
        iconClassName="h-6 w-6 sm:h-7 sm:w-7"
        interactive
      />
      <div className="relative z-10 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-sm font-semibold leading-snug text-gray-900 sm:text-base">
            {member.name}
          </p>
          {member.status === "former" ? <FormerBadge label={formerLabel} /> : null}
        </div>
        <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-gray-600">
          {member.role}
        </p>
      </div>
    </button>
  );
}

function MarqueeRow({
  members,
  onSelect,
  reverse = false,
  durationSeconds = 108,
  formerLabel,
}: {
  members: TeamMemberCard[];
  onSelect: (member: TeamMemberCard) => void;
  reverse?: boolean;
  durationSeconds?: number;
  formerLabel: string;
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
            formerLabel={formerLabel}
          />
        ))}
      </div>
    </div>
  );
}

function MemberLinkButton({
  label,
  href,
  icon: Icon,
}: {
  label: string;
  href: string;
  icon: LucideIcon;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-[#d6cfb7] bg-white px-4 py-2 text-sm font-semibold text-[#171714] shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#fffaf0] active:scale-[0.98]"
      data-cursor-hover
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      {label}
    </a>
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
        className="absolute inset-0 bg-[#171714]/45 backdrop-blur-sm"
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
        className="relative w-full max-w-md rounded-[16px] bg-white/95 p-6 shadow-[0_16px_48px_rgba(0,0,0,0.16)] sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-[10px] p-2 text-[#625f55] transition-colors hover:bg-[#f7f2df] hover:text-[#171714]"
          aria-label={labels.closeLabel}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <MemberAvatar
            member={member}
            avatarClassName="h-24 w-24"
            iconClassName="h-9 w-9"
          />
          <h3
            id="team-member-modal-title"
            className="mt-5 text-2xl font-bold text-gray-900"
          >
            {member.name}
          </h3>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <p className="text-sm font-medium text-gray-500">{member.role}</p>
            {member.status === "former" ? (
              <FormerBadge label={labels.formerLabel} />
            ) : null}
          </div>
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
                    href={link.href}
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
  featured = [],
  featuredSubtitle,
  rows,
  closeLabel = "Close",
  connectLabel = "Connect",
  linkedInLabel = "LinkedIn",
  portfolioLabel = "Portfolio",
  contactLabel = "Contact",
  formerLabel = "Former",
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
    formerLabel,
  };

  const visibleRows = rows.filter((row) => row.length > 0);
  const hasFeatured = featured.length > 0;

  return (
    <>
      <section className="relative overflow-hidden bg-[#fffaf0] pb-[clamp(5rem,9vw,8rem)]">
        <div className="section-shell team-roster-shell">
          <div className="section-heading-row mb-10 sm:mb-12">
            <h2>{title}</h2>
            {featuredSubtitle ? <p>{featuredSubtitle}</p> : null}
          </div>

          {hasFeatured ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
              {featured.map((member) => (
                <div key={member.id} className="min-w-0">
                  <FeaturedMemberCard
                    member={member}
                    onSelect={setSelectedMember}
                    formerLabel={formerLabel}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {visibleRows.length > 0 ? (
          <div className={hasFeatured ? "mt-14 sm:mt-16" : "mt-10 sm:mt-12"}>
            <div className="space-y-3 sm:space-y-4">
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
                  formerLabel={formerLabel}
                />
              ))}
            </div>
          </div>
        ) : null}
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
