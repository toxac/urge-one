import type { Session, User } from "@supabase/supabase-js";
import { type Database } from "../database.types";
import "solid-js";
import { JSX as JSXOrig } from "solid-js";

type UserRole = Database['public']['Tables']['user_roles']['Row']


interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace App {
    interface Locals {
      session: Session | null;
      user: User | null;
      userRoles: UserRole[];
    }
  }
}

type TForm = JSXOrig.FormHTMLAttributes<HTMLFormElement> & {
  'use:form'?: any;
  onFelteSuccess?: (e: CustomEvent) => void;
  onFelteError?: (e:CustomEvent) => void;
}


declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      form: TForm;
    }
  }
}