import { createSignal, createEffect, Show } from "solid-js";
import { createForm } from '@felte/solid';
import { validator } from '@felte/validator-zod';
import * as z from "zod";
import { Icon } from "@iconify-icon/solid";
import { notify } from '../../../stores/notifications';

const schema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Comment content is required").max(1000),
  comment_type: z.string().optional(),
});

interface CommentFormProps {
  opportunityId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CommentForm(props: CommentFormProps) {
  const [loading, setLoading] = createSignal(false);

  const { form, isSubmitting, errors } = createForm({
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // TODO: Implement comment creation
        // await createComment({ ...values, opportunity_id: props.opportunityId });
        notify.success("Comment added successfully!");
        props.onSuccess?.();
      } catch (error) {
        notify.error("Failed to add comment");
      } finally {
        setLoading(false);
      }
    },
    extend: validator({ schema })
  });

  return (
    <div class="w-full bg-white rounded-lg p-6">
      <h3 class="text-xl font-bold mb-4">Add Comment</h3>
      
      <form use:form class="space-y-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Comment Title</span>
          </label>
          <input 
            type="text" 
            name="title"
            class="input input-bordered w-full" 
            placeholder="Brief title for your comment"
          />
          <Show when={errors().title}>
            <span class="text-sm text-red-600 mt-1">{errors().title}</span>
          </Show>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Comment</span>
          </label>
          <textarea 
            name="content"
            class="textarea textarea-bordered w-full h-32" 
            placeholder="Add your observations or comments..."
          />
          <Show when={errors().content}>
            <span class="text-sm text-red-600 mt-1">{errors().content}</span>
          </Show>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Comment Type (Optional)</span>
          </label>
          <select name="comment_type" class="select select-bordered w-full">
            <option value="">Select type</option>
            <option value="observation">Observation</option>
            <option value="insight">Insight</option>
            <option value="question">Question</option>
            <option value="update">Update</option>
          </select>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button 
            type="button" 
            class="btn btn-outline"
            onClick={props.onCancel}
            disabled={isSubmitting()}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
            disabled={isSubmitting()}
          >
            <Show when={isSubmitting()} fallback={
              <>
                <Icon icon="mdi:comment-plus" class="mr-2" />
                Add Comment
              </>
            }>
              <span class="loading loading-spinner loading-sm"></span>
              Adding...
            </Show>
          </button>
        </div>
      </form>
    </div>
  );
}