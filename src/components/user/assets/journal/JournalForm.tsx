import { createSignal, createEffect, Show } from "solid-js";
import BaseDataForm from "./formSteps/BaseDataForm";
import ReflectionForm from "./formSteps/ReflectionForm";
import BuildForm from "./formSteps/BuildForm";
import MarketForm from "./formSteps/MarketForm";
import MoneyForm from "./formSteps/MoneyForm";
import CTAForm from "./formSteps/CTAForm";
import { useStore } from "@nanostores/solid";
import { notify } from "../../../../stores/notifications";
import { journalsStore, journalsStoreLoading, updateJournal, createJournal } from "../../../../stores/userAssets/journals";
import type { ProgramReference } from "../../../../../types/urgeTypes";
import type { Database } from "../../../../../database.types";

type Journal = Database['public']['Tables']['user_journals']['Row'];
type JournalStep = "base" | "entry" | "cta";

interface Props {
  userId: string;
  programRef: ProgramReference | null;
  journalId: string | null;
  category: string | null;
}

export default function JournalForm(props: Props) {
  const [step, setStep] = createSignal<JournalStep>("base");

  const $journals = useStore(journalsStore);
  const $loading = useStore(journalsStoreLoading);

  const emptyJournal: Journal = {
    category: props.category || "",
    content: "",
    created_at: "",
    cross_post_to_blog: false,
    cross_post_to_social: [],
    cta_description: "",
    cta_title: "",
    cta_type: "",
    entry_data: null,
    has_cta: false,
    id: "",
    is_public: false,
    program_ref: {
      content_id: props.programRef?.content_id ?? "",
      content_type: props.programRef?.content_type ?? "module",
    },
    response_deadline: null,
    should_email_followers: false,
    tags: [],
    title: "",
    type: "",
    updated_at: "",
    urgency: "",
    user_id: props.userId,
  };

  const [journalDraft, setJournalDraft] = createSignal<Journal>(emptyJournal);

  // Load journal data if editing
  createEffect(() => {
    if (!$loading() && props.journalId) {
      const found = $journals().find(j => j.id === props.journalId);
      if (found) {
        setJournalDraft(found);
      }
    }
  });

  // Step navigation helpers
  const nextStep = () => {
    if (step() === "base") setStep("entry");
    else if (step() === "entry") setStep("cta");
  };

  const prevStep = () => {
    if (step() === "cta") setStep("entry");
    else if (step() === "entry") setStep("base");
  };

  // Step form handlers
  const handleBaseNext = (data: Partial<Journal>) => {
    setJournalDraft(j => ({ ...j, ...data }));
    nextStep();
  };

  const handleEntryNext = (data: any) => {
    setJournalDraft(j => ({ ...j, entry_data: data }));
    nextStep();
  };

  const handleCTANext = async (data: Partial<Journal>) => {
    const finalJournal = { ...journalDraft(), ...data };

    // Clear out CTA fields if has_cta is false to avoid stale data
    if (!finalJournal.has_cta) {
      finalJournal.cta_type = "";
      finalJournal.cta_title = "";
      finalJournal.cta_description = "";
      finalJournal.response_deadline = null;
      finalJournal.should_email_followers = false;
    }

    setJournalDraft(finalJournal);
    const payload = {
      category: finalJournal.category,
      content: finalJournal.content,
      cross_post_to_blog: finalJournal.cross_post_to_blog,
      cross_post_to_social: finalJournal.cross_post_to_social,
      cta_description: finalJournal.cta_description,
      cta_title: finalJournal.cta_title,
      cta_type: finalJournal.cta_type,
      entry_data: finalJournal.entry_data,
      has_cta: finalJournal.has_cta,
      is_public: finalJournal.is_public,
      program_ref: finalJournal.program_ref,
      response_deadline: finalJournal.response_deadline,
      should_email_followers: finalJournal.should_email_followers,
      tags: finalJournal.tags,
      title: finalJournal.title,
      type: finalJournal.type,
      urgency: finalJournal.urgency,
      user_id: finalJournal.user_id,
      updated_at: new Date().toISOString(),
    }

    try {
      // handle update
      if (finalJournal.id) {
        const { error } = await updateJournal(finalJournal.id, payload);
        if (error) throw error;
      } else {
        const { error } = await createJournal(payload);
        if (error) throw error;
      }
      notify.success(
        finalJournal.id ? "Journal Updated." : "Journal Created.",
        "Success!"
      );

    } catch (error) {
      // TODO: show error toast/notification
      console.error("Failed to save journal:", error);
      notify.error("Journal could not be saved", "Failed")
    }
  };

  // Entry Data Form selector
  const EntryDataForm = () => {
    switch (journalDraft().category) {
      case "reflection": return <ReflectionForm initialData={journalDraft().entry_data ?? {}} onNext={handleEntryNext} />;
      case "build": return <BuildForm initialData={journalDraft().entry_data ?? {}} onNext={handleEntryNext} />;
      case "market": return <MarketForm initialData={journalDraft().entry_data ?? {}} onNext={handleEntryNext} />;
      case "money": return <MoneyForm initialData={journalDraft().entry_data ?? {}} onNext={handleEntryNext} />;
      default: return <div>Please select a category in the base step.</div>;
    }
  };

  return (
    <div class="max-w-2xl mx-auto p-4">
      <div class="mb-6 flex justify-center gap-6 font-semibold text-lg">
        <span class={step() === "base" ? "text-primary" : "opacity-60"}>Basic Info</span>
        <span>→</span>
        <span class={step() === "entry" ? "text-primary" : "opacity-60"}>Entry Data</span>
        <span>→</span>
        <span class={step() === "cta" ? "text-primary" : "opacity-60"}>CTA</span>
      </div>

      <Show when={step() === "base"}>
        <BaseDataForm
          initialData={{
            title: journalDraft().title || undefined,
            content: journalDraft().content || undefined,
            category: journalDraft().category || undefined,
            type: journalDraft().type || undefined,
            urgency: journalDraft().urgency || undefined,
            tags: journalDraft().tags || undefined,
          }}
          onNext={handleBaseNext}
        />
      </Show>

      <Show when={step() === "entry"}>
        <EntryDataForm />
        <button class="btn btn-ghost mt-2" onClick={prevStep}>Back</button>
      </Show>

      <Show when={step() === "cta"}>
        <CTAForm
          initialData={{
            has_cta: journalDraft().has_cta || false,
            cta_type: journalDraft().cta_type || undefined,
            cta_title: journalDraft().cta_title || undefined,
            cta_description: journalDraft().cta_description || undefined,
            response_deadline: journalDraft().response_deadline ?? undefined,
            should_email_followers: journalDraft().should_email_followers || undefined,
          }}
          onNext={handleCTANext}
        />
        <button class="btn btn-ghost mt-2" onClick={prevStep}>Back</button>
      </Show>
    </div>
  );
}
