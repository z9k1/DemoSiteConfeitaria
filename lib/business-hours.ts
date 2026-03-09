const BUSINESS_TIME_ZONE = "America/Sao_Paulo";
const OPEN_HOUR = 9;
const CLOSE_HOUR = 18;
const OPEN_DAYS = new Set([1, 2, 3, 4, 5]);

type ZonedDateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number;
};

export type BusinessHoursStatus = {
  isOpen: boolean;
  opensAt: Date;
  closesAt: Date | null;
  nextTransitionAt: Date;
  statusLabel: string;
  detailLabel: string;
  nextOpenLabel: string;
  countdownLabel: string;
};

function getZonedDateParts(date: Date): ZonedDateParts {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    weekday: "short"
  });

  const parts = formatter.formatToParts(date);
  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6
  };

  return {
    year: Number(lookup.year),
    month: Number(lookup.month),
    day: Number(lookup.day),
    hour: Number(lookup.hour),
    minute: Number(lookup.minute),
    weekday: weekdayMap[lookup.weekday] ?? 0
  };
}

function zonedLocalToDate(year: number, month: number, day: number, hour: number, minute: number): Date {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute);
  const desiredAsUtc = Date.UTC(year, month - 1, day, hour, minute);
  const zonedGuess = getZonedDateParts(new Date(utcGuess));
  const zonedGuessAsUtc = Date.UTC(
    zonedGuess.year,
    zonedGuess.month - 1,
    zonedGuess.day,
    zonedGuess.hour,
    zonedGuess.minute
  );
  return new Date(utcGuess + (desiredAsUtc - zonedGuessAsUtc));
}

function addLocalDays(year: number, month: number, day: number, offset: number) {
  const base = new Date(Date.UTC(year, month - 1, day + offset, 12));
  return {
    year: base.getUTCFullYear(),
    month: base.getUTCMonth() + 1,
    day: base.getUTCDate(),
    weekday: base.getUTCDay()
  };
}

function formatOpenTimeLabel(opensAt: Date): string {
  const parts = getZonedDateParts(opensAt);
  // Prefer "9h" over "09h" for friendlier copy in UI.
  const hourLabel = `${parts.hour}h`;
  if (parts.minute === 0) return hourLabel;
  return `${hourLabel}${String(parts.minute).padStart(2, "0")}`;
}

function formatNextOpenShortLabel(opensAt: Date, now: Date): string {
  const openParts = getZonedDateParts(opensAt);
  const nowParts = getZonedDateParts(now);

  const isSameDay =
    openParts.year === nowParts.year && openParts.month === nowParts.month && openParts.day === nowParts.day;

  const tomorrow = addLocalDays(nowParts.year, nowParts.month, nowParts.day, 1);
  const isTomorrow =
    openParts.year === tomorrow.year && openParts.month === tomorrow.month && openParts.day === tomorrow.day;

  const weekdayShort: Record<number, string> = {
    0: "domingo",
    1: "segunda",
    2: "terÃ§a",
    3: "quarta",
    4: "quinta",
    5: "sexta",
    6: "sÃ¡bado"
  };

  const dayLabel = isSameDay ? "hoje" : isTomorrow ? "amanhÃ£" : weekdayShort[openParts.weekday] ?? "amanhÃ£";
  return `Abre ${dayLabel} Ã s ${formatOpenTimeLabel(opensAt)}`;
}

function getNextOpeningDate(date: Date): Date {
  const parts = getZonedDateParts(date);

  for (let offset = 0; offset <= 7; offset += 1) {
    const candidate = addLocalDays(parts.year, parts.month, parts.day, offset);
    const isOpenDay = OPEN_DAYS.has(candidate.weekday);
    if (!isOpenDay) continue;

    if (offset === 0 && parts.hour < OPEN_HOUR) {
      return zonedLocalToDate(candidate.year, candidate.month, candidate.day, OPEN_HOUR, 0);
    }

    if (offset > 0) {
      return zonedLocalToDate(candidate.year, candidate.month, candidate.day, OPEN_HOUR, 0);
    }
  }

  return zonedLocalToDate(parts.year, parts.month, parts.day, OPEN_HOUR, 0);
}

export function getBusinessHoursStatus(date = new Date()): BusinessHoursStatus {
  const parts = getZonedDateParts(date);
  const isOpenDay = OPEN_DAYS.has(parts.weekday);
  const currentMinutes = parts.hour * 60 + parts.minute;
  const openMinutes = OPEN_HOUR * 60;
  const closeMinutes = CLOSE_HOUR * 60;
  const isOpen = isOpenDay && currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  if (isOpen) {
    const closesAt = zonedLocalToDate(parts.year, parts.month, parts.day, CLOSE_HOUR, 0);

    return {
      isOpen: true,
      opensAt: zonedLocalToDate(parts.year, parts.month, parts.day, OPEN_HOUR, 0),
      closesAt,
      nextTransitionAt: closesAt,
      statusLabel: "Aberto agora",
      detailLabel: "Recebemos pedidos de segunda a sexta das 9h às 18h.",
      nextOpenLabel: "",
      countdownLabel: ""
    };
  }

  const opensAt = getNextOpeningDate(date);

  return {
    isOpen: false,
    opensAt,
    closesAt: null,
    nextTransitionAt: opensAt,
    statusLabel: "Fechado agora",
    detailLabel: "Atendimento pelo Whatsapp disponÃ­vel de segunda a sexta, das 9h Ã s 18h",
    nextOpenLabel: formatNextOpenShortLabel(opensAt, date),
    countdownLabel: ""
  };
}


