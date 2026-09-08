export type CrosswordType = "daily" | "weekly" | "other";

export type CrosswordStatus =
  | "draft"
  | "review"
  | "approved"
  | "published"
  | "archived";

export type GuildRole = "member" | "creator" | "admin";

export interface GuildCreditsPayload {
  guildId: string;
  credits: number;
}

export interface CellUpdatePayload {
  sessionId: string;
  wordId: string;
  row: number;
  col: number;
  letter: string;
}

export interface PresenceFocusPayload {
  sessionId: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  wordId: string;
}

export interface WordSolvedPayload {
  sessionId: string;
  wordId: string;
  solvedByUserId: string;
}

// Eventos del canal Socket.IO por sesión de crucigrama.
// Se mantienen aquí para que api y activity no diverjan en los nombres.
export const SOCKET_EVENTS = {
  CELL_UPDATE: "cell:update",
  CELL_UPDATED: "cell:updated",
  WORD_SOLVED: "word:solved",
  WORD_INCORRECT: "word:incorrect",
  PRESENCE_FOCUS: "presence:focus",
  CREDITS_UPDATED: "credits:updated",
} as const;
