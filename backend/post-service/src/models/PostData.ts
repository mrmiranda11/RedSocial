import { ComentData } from "./ComentData";

export interface PostData { 
    id?: string | null;
    usuario?: string | null;
    content?: string | null;
    image?: string | null;
    likes?: string | null;
    comments?: string | null;
    liked?: string | null;
    showcomments?: boolean | null;
    creado_at?: string | null;
    commentslist?: ComentData[];
  }