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

type FeaturedSize = "sm" | "md" | "lg";

const FEATURED_SIZE_BY_INDEX_6: FeaturedSize[] = [
  "sm",
  "md",
  "lg",
  "lg",
  "md",
  "sm",
];

function getFeaturedSize(index: number, total: number): FeaturedSize {
  if (total === 6) return FEATURED_SIZE_BY_INDEX_6[index] ?? "sm";

  const middle = (total - 1) / 2;
  const distance = Math.abs(index - middle);
  if (distance <= 0.5) return "lg";
  if (distance <= 1.5) return "md";
  return "sm";
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
      className={`relative z-10 flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#FFF7CC] text-gray-900 shadow-sm ${avatarClassName}`}
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
    <span className="inline-flex shrink-0 items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-500">
      {label}
    </span>
  );
}

function FeaturedMemberCard({
  member,
  onSelect,
  formerLabel,
  size = "md",
}: {
  member: TeamMemberCard;
  onSelect: (member: TeamMemberCard) => void;
  formerLabel: string;
  size?: FeaturedSize;
}) {
  const sizeStyles = {
    sm: {
      card: "min-h-[13.5rem] px-3 py-5 sm:min-h-[14.5rem] sm:px-4 sm:py-5",
      avatar: "h-14 w-14 sm:h-16 sm:w-16",
      icon: "h-6 w-6 sm:h-7 sm:w-7",
      name: "text-sm sm:text-base",
      summary: "text-xs sm:text-sm",
    },
    md: {
      card: "min-h-[16rem] px-4 py-6 sm:min-h-[17.5rem] sm:px-5 sm:py-7",
      avatar: "h-[4.5rem] w-[4.5rem] sm:h-[5.5rem] sm:w-[5.5rem]",
      icon: "h-8 w-8 sm:h-9 sm:w-9",
      name: "text-base sm:text-lg",
      summary: "text-xs sm:text-sm",
    },
    lg: {
      card: "min-h-[18.5rem] px-4 py-7 sm:min-h-[20.5rem] sm:px-6 sm:py-8",
      avatar: "h-20 w-20 sm:h-24 sm:w-24",
      icon: "h-9 w-9 sm:h-10 sm:w-10",
      name: "text-lg sm:text-xl",
      summary: "text-sm",
    },
  }[size];

  return (
    <button
      type="button"
      onClick={() => onSelect(member)}
      className={`group relative flex h-full w-full flex-col items-center overflow-hidden rounded-2xl border border-gray-200 bg-white/80 text-center shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl ${sizeStyles.card}`}
      data-cursor-hover
      aria-label={`${member.name}, ${member.role}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-yellow-50/50 to-orange-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <MemberAvatar
        member={member}
        avatarClassName={sizeStyles.avatar}
        iconClassName={sizeStyles.icon}
        interactive
      />
      <p
        className={`relative z-10 mt-4 font-semibold text-gray-900 ${sizeStyles.name}`}
      >
        {member.name}
      </p>
      {member.status === "former" ? (
        <div className="relative z-10 mt-2">
          <FormerBadge label={formerLabel} />
        </div>
      ) : null}
      <p
        className={`relative z-10 mt-2 line-clamp-2 leading-relaxed text-gray-600 ${sizeStyles.summary}`}
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
      className="group relative flex w-[min(88vw,22rem)] shrink-0 items-center gap-4 overflow-hidden rounded-2xl border border-gray-200 bg-white/80 px-4 py-3.5 text-left shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl sm:w-[24rem] sm:px-5 sm:py-4"
      data-cursor-hover
      aria-label={`${member.name}, ${member.role}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-yellow-50/50 to-orange-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
      className="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-[#FFD511] bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-[#FFF7CC] active:scale-[0.98]"
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
      <section className="relative overflow-hidden py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl sm:mb-12">
            <div className="border-l-2 border-[#FFD511] pl-4 sm:pl-5">
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
                {title}
              </h2>
              {featuredSubtitle ? (
                <p className="mt-3 text-base leading-relaxed text-gray-600 sm:text-lg">
                  {featuredSubtitle}
                </p>
              ) : null}
            </div>
          </div>

          {hasFeatured ? (
            <div className="flex flex-wrap items-end justify-center gap-3 sm:gap-3 lg:flex-nowrap lg:gap-4">
              {featured.map((member, index) => {
                const size = getFeaturedSize(index, featured.length);
                const widthClass =
                  size === "lg"
                    ? "lg:flex-[1.3]"
                    : size === "md"
                      ? "lg:flex-[1.05]"
                      : "lg:flex-[0.85]";

                return (
                  <div
                    key={member.id}
                    className={`w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.5rem)] lg:w-auto lg:min-w-0 ${widthClass}`}
                  >
                    <FeaturedMemberCard
                      member={member}
                      onSelect={setSelectedMember}
                      formerLabel={formerLabel}
                      size={size}
                    />
                  </div>
                );
              })}
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
