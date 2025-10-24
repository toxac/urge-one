import { createSignal, createEffect, Show } from "solid-js";
import { createForm } from '@felte/solid';
import { validator } from '@felte/validator-zod';
import * as z from "zod";
import { useStore } from "@nanostores/solid";
import { journalsStore, createJournal, updateJournal } from "../../../../stores/userAssets/journals";
import Build from "./categoryData/Build";
import Money from "./categoryData/Money";
import Reflection from "./categoryData/Reflection";
import Market from "./categoryData/Market";
import type { Database } from "../../../../../database.types";
import type { JournalReflectionEntryData, JournalBuildEntryData, JournalMarketEntryData, JournalMoneyEntryData } from "../../../../../types/urgeTypes";

type Journal = Database['public']['Tables']['user_journals']['Row'];

interface JournalFormProps {
  content_type?: string;
  content_id?: string;
  journal_id?: string;
  category?: string;
  userId: string;
}

export default function JournalForm(props: JournalFormProps) {
  // Track current category and loaded journal
  const [category, setCategory] = createSignal(props.category || "reflection");
  const [journal, setJournal] = createSignal<Journal | null>(null);
  const [loading, setLoading] = createSignal(false);

  // Load journal for editing
  createEffect(() => {
    if (props.journal_id) {
      setLoading(true);
      const found = journalsStore.get().find(j => j.id === props.journal_id);
      setJournal(found ?? null);
      setCategory(found?.category ?? category());
      setLoading(false);
    }
  });

  // Zod schemas per category (sample: expand as needed for all types)
  const reflectionSchema = z.object({
    title: z.string().max(100).optional(),
    content: z.string().min(1, "Content required"),
    type: z.string().min(1),
    urgency: z.string().min(1),
    category: z.literal("reflection"),
    entry_data: z.object({
      program_satisfaction: z.number().min(1).max(5).optional(),
      applied_learnings: z.array(z.string()).optional(),
      confidence_change: z.string().optional(),
      questions: z.array(z.string()).optional(),
    }),
  });
  // Add schemas for build, money, market...

  // Select schema based on category
  const schema = (() => {
    switch (category()) {
      case "reflection": return reflectionSchema;
      // case "build": return buildSchema;
      // case "market": return marketSchema;
      // case "money": return moneySchema;
      default: return reflectionSchema;
    }
  })();

  // Form initial values (edit or new)
  const initialValues = journal()
    ? {
        title: journal()!.title ?? '',
        content: journal()!.content ?? '',
        type: journal()!.type ?? '',
        urgency: journal()!.urgency ?? '',
        category: journal()!.category ?? category(),
        entry_data: journal()!.entry_data ?? {},
      }
    : {
        title: '',
        content: '',
        type: '',
        urgency: '',
        category: category(),
        entry_data: {},
      };

  // Felte form
  const { form, data, errors, isSubmitting, touched, setFields } = createForm({
    initialValues,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (props.journal_id && journal()) {
          // Edit: update journal
          await updateJournal(props.journal_id, {
            ...values,
            entry_data: values.entry_data,
            updated_at: new Date().toISOString(),
          });
        } else {
          // Create: add journal
          await createJournal({
            ...values,
            entry_data: values.entry_data,
            created_at: new Date().toISOString(),
            user_id: props.userId,
          });
        }
        // Handle post-submit: redirect, notify, etc.
      } catch (error) {
        // Handle error, notify
      } finally {
        setLoading(false);
      }
    },
    extend: validator({ schema }),
  });

  // Render dynamic entry_data form fields per category
  function renderEntryDataFields(current, setEntryData) {
    switch (category()) {
      case "reflection":
        return <Reflection data={current.entry_data} onChange={setEntryData} />;
      case "build":
        return <Build data={current.entry_data} onChange={setEntryData} />;
      case "market":
        return <Market data={current.entry_data} onChange={setEntryData} />;
      case "money":
        return <Money data={current.entry_data} onChange={setEntryData} />;
      default:
        return null;
    }
  }

  // Dynamic form render
  return (
    <form use:form class="space-y-8">
      <div>
        <label>Title</label>
        <input name="title" type="text" value={initialValues.title} />
        <Show when={errors().title && touched().title}>
          <span class="error">{errors().title}</span>
        </Show>
      </div>
      <div>
        <label>Content</label>
        <textarea name="content">{initialValues.content}</textarea>
        <Show when={errors().content && touched().content}>
          <span class="error">{errors().content}</span>
        </Show>
      </div>
      <div>
        {/* Add dropdowns for type, urgency, category etc. */}
      </div>
      {/* Category entry data fields */}
      {renderEntryDataFields(data(), (entryData) => setFields("entry_data", entryData))}
      <button type="submit" disabled={isSubmitting() || loading()}>
        {props.journal_id ? "Update Journal" : "Create Journal"}
      </button>
    </form>
  );
}
