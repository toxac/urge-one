import { createSignal, Show } from "solid-js";
import BaseDataForm from "./formSteps/BaseDataForm";
import ReflectionForm from "./formSteps/ReflectionForm";
import BuildForm from "./formSteps/BuildForm";
import MarketForm from "./formSteps/MarketForm";
import MoneyForm from "./formSteps/MoneyForm";
import CTAForm from "./formSteps/CTAForm";
import type {ProgramReference} from "../../../../../types/urgeTypes"
import type { Database } from "../../../../../database.types";

type Journal = Database['public']['Tables']['user_journals']['Row']

type JournalStep = "base" | "entry" | "cta";

interface Props {
    userId: string;
    programRef: ProgramReference| undefined;
    journalId: string | undefined;
    category: string | undefined;
}

export default function JournalForm(props: Props) {
  // Step management
  const [step, setStep] = createSignal<JournalStep>("base");

    // Signal to hold entire form flow state
    const [journalDraft, setJournalDraft] = createSignal<Journal>({
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
            content_id: props.programRef?.content_id,
            content_type: props.programRef?.content_type
          },
          response_deadline: null,
          should_email_followers: false,
          tags: [],
          title: "",
          type: "",
          updated_at: "",
          urgency: "",
          user_id: props.userId
    });

  // Move to next step
  function nextStep() {
    if (step() === "base") setStep("entry");
    else if (step() === "entry") setStep("cta");
  }

  // Move to previous step
  function prevStep() {
    if (step() === "cta") setStep("entry");
    else if (step() === "entry") setStep("base");
  }

  // Handle each step's onNext
  function handleBaseNext(data) {
    setJournalDraft(j => ({ ...j, ...data }));
    nextStep();
  }
  function handleEntryNext(data) {
    setJournalDraft(j => ({ ...j, entry_data: data }));
    nextStep();
  }
  function handleCTANext(data) {
    setJournalDraft(j => ({ ...j, ...data }));
    // Submit logic goes here (call create or update journal store)
    // Optionally redirect, show success/error, etc.
  }

  // Render stepper UI
  return (
    <div class="max-w-2xl mx-auto p-4">
      <div class="mb-6 flex gap-3 items-center justify-center">
        <span class={step() === "base" ? "font-bold text-primary" : ""}>Basic Info</span>
        <span>→</span>
        <span class={step() === "entry" ? "font-bold text-primary" : ""}>Details</span>
        <span>→</span>
        <span class={step() === "cta" ? "font-bold text-primary" : ""}>Call to Action</span>
      </div>
      <Show when={step() === "base"}>
        <BaseDataForm initialData={journalDraft()} onNext={handleBaseNext} />
      </Show>
      <Show when={step() === "entry"}>
        <EntryDataForm
          category={journalDraft().category}
          entryData={journalDraft().entry_data}
          onNext={handleEntryNext}
        />
        <button class="btn btn-ghost mt-2" onClick={prevStep}>Back</button>
      </Show>
      <Show when={step() === "cta"}>
        <CTAForm
          initialData={{
            has_cta: journalDraft().has_cta,
            cta_type: journalDraft().cta_type,
            cta_title: journalDraft().cta_title,
            cta_description: journalDraft().cta_description,
            response_deadline: journalDraft().response_deadline,
            should_email_followers: journalDraft().should_email_followers,
          }}
          onNext={handleCTANext}
        />
        <button class="btn btn-ghost mt-2" onClick={prevStep}>Back</button>
      </Show>
    </div>
  );
}

// Helper for category rendering
function EntryDataForm({ category, entryData, onNext }) {
  switch (category) {
    case "reflection": return <ReflectionForm initialData={entryData} onNext={onNext} />;
    case "build": return <BuildForm initialData={entryData} onNext={onNext} />;
    case "market": return <MarketForm initialData={entryData} onNext={onNext} />;
    case "money": return <MoneyForm initialData={entryData} onNext={onNext} />;
    default: return <div>Select a category in the previous step</div>;
  }
}
