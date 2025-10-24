import { createForm } from '@felte/solid';
import { validator } from '@felte/validator-zod';
import * as z from "zod";

const ctaSchema = z.object({
  cta_type: z.string().optional(),
  cta_title: z.string().optional(),
  cta_description: z.string().optional(),
  response_deadline: z.string().optional(),
  should_email_followers: z.boolean().optional(),
});

type InitialData = {
    title?: string;
    content?: string;
    category?: string;
    type?: string;
    urgency?: string;
    tags?: string[];
  };

interface CTAFormProps {
  initialData: InitialData;
  onNext: (data: InitialData) => void;
}

export default function CTAForm(props: CTAFormProps) {
  const { form, data, errors, isSubmitting } = createForm({
    initialValues: props.initialData,
    onSubmit: (values) => props.onNext(values),
    extend: validator({ schema: ctaSchema }),
  });

  return (
    <form use:form>
      {/* Render CTA fields */}
      <button type="submit" disabled={isSubmitting()}>
        Next
      </button>
    </form>
  );
}
