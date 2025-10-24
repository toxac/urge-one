import { createForm } from '@felte/solid';
import { validator } from '@felte/validator-zod';
import * as z from "zod";

// Define Zod schema for base fields
const baseSchema = z.object({
  title: z.string().max(100).optional(),
  content: z.string().min(1, "Content required"),
  category: z.string().min(1),
  type: z.string().min(1),
  urgency: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

type InitialData = {
    title?: string;
    content?: string;
    category?: string;
    type?: string;
    urgency?: string;
    tags?: string[];
  };

interface BaseDataFormProps {
  initialData: InitialData
  onNext: (data: InitialData) => void;
}

export default function BaseDataForm(props:BaseDataFormProps) {
  const { form, data, errors, isSubmitting } = createForm({
    initialValues: props.initialData,
    onSubmit: (values) => props.onNext(values),
    extend: validator({ schema: baseSchema }),
  });

  return (
    <form use:form>
      {/* Render form fields for title, content, category, type, urgency, tags */}
      {/* Include error messages for validation */}
      <button type="submit" disabled={isSubmitting()}>
        Next
      </button>
    </form>
  );
}
