export interface Song {
  id: number;
  md5: string;
  artist: string | null;
  name: string | null;
  album: string | null;
  track: string | null;
  year: string | null;
  genre: string | null;
  difficulty: string | null;
  song_length: number | null;
  charter_refs: string[] | null;
  scores_count: number | null;
  last_update: string;
}

export const SONG_TABLE_HEADERS = {
  name: "Name",
  artist: "Artist",
  album: "Album",
  year: "Year",
  genre: "Genre",
  difficulty: "Difficulty",
  song_length: "Length",
  charter: "Charter",
  scores_count: "Scores",
  last_update: "Last Update",
};

export const msToTime = (duration: number) => {
  return new Date(duration).toISOString().substring(11, 19);
}

export const msToHourMinSec = (duration: number) => {
  const hours = Math.floor(duration / 3600000);
  const minutes = Math.floor((duration % 3600000) / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export const formatTimeDifference = (lastUpdate: string) => {
  const now = new Date();
  const updateTime = new Date(lastUpdate);
  const diff = now.getTime() - updateTime.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
};

export const formatExactTime = (lastUpdate: string) => {
  const date = new Date(lastUpdate);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

export const getSurroundingSongIds = (songs: Song[], currentSongId: string, pageSize: number) => {
  const currentIndex = songs.findIndex(song => song.id.toString() === currentSongId);
  if (currentIndex === -1) return { prevSongIds: [], nextSongIds: [] };
  const prevSongIds = songs.slice(Math.max(0, currentIndex - pageSize), currentIndex).map(song => song.id.toString());
  const nextSongIds = songs.slice(currentIndex + 1, currentIndex + pageSize).map(song => song.id.toString());
  return { prevSongIds, nextSongIds };
};