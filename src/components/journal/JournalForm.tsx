// src/components/journal/JournalForm.tsx
import { createSignal, createEffect, For, Show, onMount } from "solid-js";
import { useStore } from "@nanostores/solid";
import { createForm } from '@felte/solid';
import * as z from "zod";
import { Icon } from "@iconify-icon/solid";
import { supabaseBrowserClient } from '../../lib/supabase/client';
import { validator } from '@felte/validator-zod';
import { notify } from '../../stores/notifications';
import { 
  journalsStoreLoading, 
  journalsStoreError, 
  createJournal, 
  updateJournal
} from '../../stores/userAssets/journals';
import {MOODS, CATEGORIES, URGENCIES} from "./options"
import type { Database } from "../../../database.types";

type Journal = Database['public']['Tables']['user_journals']['Row'];
type JournalInsert = Database['public']['Tables']['user_journals']['Insert'];
type JournalUpdate = Database['public']['Tables']['user_journals']['Update'];



const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  content: z.string().min(20, "Journal entry needs more detail").max(5000, "Content too long"),
  category: z.enum(['daily', 'business', 'product', 'customers', 'marketing', 'sales', 'finance', 'team', 'mindset', 'program', 'other']),
  mood: z.enum(['energised', 'neutral', 'stuck', 'anxious', 'breakthrough']).optional(),
  urgency: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  tags: z.string().optional(),
});

interface JournalFormProps {
  userId: string;
  defaultContentId?: string | null;
  initialData?: Partial<JournalInsert> | null;
  onSuccess?: (journal: Journal) => void;
  className?: string;
}

export default function JournalForm(props: JournalFormProps) {
  // Audio recording state
  const [mediaRecorder, setMediaRecorder] = createSignal<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = createSignal<MediaStream | null>(null);
  const [audioState, setAudioState] = createSignal<{ url: string | null; path: string | null; duration: number }>({ url: null, path: null, duration: 0 });
  const [recordingTime, setRecordingTime] = createSignal(0);
  const [recordingInterval, setRecordingInterval] = createSignal<NodeJS.Timeout | null>(null);

  // Form state
  const [state, setState] = createSignal<'idle' | 'recording' | 'audio_ready' | 'text_only' | 'success'>('idle');
  const [isEditMode, setIsEditMode] = createSignal(false);
  const [savedJournal, setSavedJournal] = createSignal<Journal | null>(null);
  const [loading, setLoading] = createSignal(false);

  // Store subscriptions
  const $journalsLoading = useStore(journalsStoreLoading);
  const $journalsError = useStore(journalsStoreError);

  const { form, data, errors, isSubmitting, touched, reset } = createForm({
    initialValues: {
      title: props.initialData?.title || '',
      content: props.initialData?.content || '',
      category: (props.initialData?.category as any) || 'mindset',
      mood: (props.initialData?.mood as any) || '',
      urgency: (props.initialData?.urgency as any) || '',
      tags: (Array.isArray(props.initialData?.tags) ? props.initialData.tags.join(', ') : ''),
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const transformedValues = schema.parse({
          ...values,
          audio_note: audioState().path || (props.initialData as Journal)?.audio_note || null,
          content_id: props.defaultContentId || null,
        });

        const journalData: JournalInsert | JournalUpdate = {
          ...transformedValues,
          user_id: props.userId,
          additional_data: {
            next_action: values.tags || null, // Reuse tags field for now
          } as any,
        };

        const result = isEditMode() && props.initialData
          ? await updateJournal((props.initialData as Journal).id!, journalData as JournalUpdate)
          : await createJournal(journalData as JournalInsert);

        if (result.success && result.data) {
          setSavedJournal(result.data);
          notify.success(
            isEditMode() ? "Journal updated successfully!" : "Reflection saved! Your future self will thank you.",
            "Success!"
          );
          props.onSuccess?.(result.data);
          setState('success');
        } else {
          throw new Error(result.error?.message || 'Failed to save journal');
        }
      } catch (error: any) {
        console.error('Journal save error:', error);
        notify.error('Something went wrong. Please try saving again.', 'Failed');
      } finally {
        setLoading(false);
      }
    },
    extend: validator({ schema })
  });

  // Effects
  createEffect(() => {
    setIsEditMode(!!props.initialData);
    if (props.initialData?.audio_note) {
      setAudioState({
        url: props.initialData.audio_note,
        path: props.initialData.audio_note,
        duration: 0,
      });
      setState('audio_ready');
    }
  });

  // Audio functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioState(prev => ({ ...prev, url }));

        // Upload to Storage
        const timestamp = Date.now();
        const fileName = `${timestamp}_audio.webm`;
        const path = `user_journals/${props.userId}/${fileName}`;

        const { data, error } = await supabaseBrowserClient.storage
          .from('journals')
          .upload(path, blob, { contentType: 'audio/webm', upsert: true });

        if (!error && data?.path) {
          const { data: { publicUrl } } = supabaseBrowserClient.storage.from('journals').getPublicUrl(data.path);
          setAudioState({ url: publicUrl, path: data.path, duration: recordingTime() });
          setState('audio_ready');

          // Auto-fill form
          data('title').set(`Audio reflection • ${new Date().toLocaleTimeString()}`);
          data('content').set(`🎤 Audio reflection recorded ${Math.floor(recordingTime() / 60)}:${(recordingTime() % 60).toString().padStart(2, '0')}`);
        }

        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setState('recording');
      
      const interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
      setRecordingInterval(interval);
    } catch (error) {
      notify.error('Microphone access denied. Please allow and try again.', 'Recording Failed');
    }
  };

  const stopRecording = () => {
    mediaRecorder()?.stop();
    const interval = recordingInterval();
    if (interval) clearInterval(interval);
    setRecordingInterval(null);
  };

  const clearAudio = () => {
    const url = audioState().url;
    if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
    setAudioState({ url: null, path: null, duration: 0 });
    setState('idle');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetForm = () => {
    reset();
    setState('idle');
    setSavedJournal(null);
    clearAudio();
  };

  return (
    <section class={`w-full bg-white border-1 border-primary rounded-lg px-8 py-6 ${props.className || ''}`}>
      <Show when={state() === 'success'}>
        <div class="w-full text-center py-8">
          <div class="text-green-600 mb-4">
            <Icon icon="mdi:check-circle" width={64} height={64} />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
          <p class="text-gray-600 mb-4">
            {isEditMode() 
              ? "Your journal has been updated successfully." 
              : "Reflection captured! This is valuable data for your journey."}
          </p>
          <div class="flex flex-col gap-4 mb-8">
            <a href={`/assets/journals/${savedJournal()?.id}`} class="link link-primary">
              View journal: {savedJournal()?.title}
            </a>
            <a href={`/assets/journals`} class="link link-primary">All journals</a>
          </div>
          <div class="flex justify-center">
            <button class="btn btn-primary btn-outline" onClick={resetForm}>
              <Icon icon="mdi:plus" width={20} height={20} class="mr-2" />
              {isEditMode() ? 'Edit Another' : 'Add Another Reflection'}
            </button>
          </div>
        </div>
      </Show>

      <Show when={state() !== 'success'}>
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            {isEditMode() ? 'Edit Reflection' : 'New Journal Entry'}
          </h2>
          <p class="text-gray-600 text-sm">
            Capture your thoughts - audio or text. Mood is data, not a verdict.
          </p>
        </div>

        <form use:form class="space-y-8">
          {/* Recording State */}
          <Show when={state() === 'recording'}>
            <div class="text-center space-y-6 p-8 bg-gradient-to-br from-orange-50 to-pink-50 rounded-lg border-2 border-orange-200">
              <div class="w-24 h-24 mx-auto bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                <Icon icon="mdi:microphone" width={48} height={48} class="text-white" />
              </div>
              <div>
                <p class="text-3xl font-bold text-gray-900">{formatTime(recordingTime())}</p>
                <p class="text-sm text-gray-600">Recording... Speak freely</p>
              </div>
              <button
                type="button"
                onClick={stopRecording}
                class="btn btn-error btn-lg w-full max-w-sm mx-auto"
              >
                <Icon icon="mdi:stop" width={20} height={20} class="mr-2" />
                Stop Recording
              </button>
            </div>
          </Show>

          {/* Idle/Audio Ready States */}
          <Show when={state() === 'idle' || state() === 'audio_ready' || state() === 'text_only'}>
            {/* Audio Player */}
            <Show when={audioState().url && state() === 'audio_ready'}>
              <div class="form-control bg-blue-50 p-4 rounded-lg border border-blue-200">
                <label class="label">
                  <span class="label-text font-semibold">Audio Reflection ({formatTime(audioState().duration)})</span>
                </label>
                <audio controls class="w-full rounded-lg" src={audioState().url!} />
                <button
                  type="button"
                  onClick={clearAudio}
                  class="btn btn-ghost btn-sm mt-2"
                >
                  <Icon icon="mdi:delete" width={16} height={16} class="mr-2" />
                  Clear audio
                </button>
              </div>
            </Show>

            {/* Action Buttons */}
            <Show when={state() === 'idle'}>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={startRecording}
                  class="btn btn-primary btn-lg h-16 flex items-center gap-2"
                >
                  <Icon icon="mdi:microphone" width={24} height={24} />
                  Record reflection
                </button>
                <button
                  type="button"
                  onClick={() => setState('text_only')}
                  class="btn btn-outline btn-lg h-16"
                >
                  <Icon icon="mdi:keyboard" width={24} height={24} />
                  Write instead
                </button>
              </div>
            </Show>

            {/* Form Fields */}
            <Show when={state() === 'audio_ready' || state() === 'text_only'}>
              {/* Title */}
              <div class="form-control">
                <label class="input input-neutral flex w-full items-center gap-2">
                  <Icon icon="mdi:format-title" width={20} height={20} class="text-gray-400" />
                  <input
                    type="text"
                    name="title"
                    class="grow"
                    placeholder="What happened today?"
                  />
                </label>
                <Show when={errors().title && touched().title}>
                  <span class="text-sm text-red-600 mt-1">{errors().title}</span>
                </Show>
              </div>

              {/* Mood & Urgency */}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Mood</span>
                  </label>
                  <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <For each={MOODS}>
                      {({ value, label, icon }) => (
                        <label class="label cursor-pointer p-3 bg-base-100 rounded-lg hover:bg-base-200 transition-all flex items-center gap-2">
                          <input type="radio" name="mood" value={value} class="radio radio-sm" />
                          <Icon icon={icon} width={16} height={16} />
                          <span class="text-sm">{label}</span>
                        </label>
                      )}
                    </For>
                  </div>
                  <Show when={errors().mood && touched().mood}>
                    <span class="text-sm text-red-600 mt-1">{errors().mood}</span>
                  </Show>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Urgency</span>
                  </label>
                  <div class="flex flex-wrap gap-2">
                    <For each={URGENCIES}>
                      {({ value, label, icon }) => (
                        <label class="label cursor-pointer p-3 bg-base-100 rounded-lg hover:bg-base-200 transition-all flex items-center gap-2 badge badge-lg">
                          <input type="radio" name="urgency" value={value} class="radio radio-sm" />
                          <Icon icon={icon} width={16} height={16} />
                          <span class="text-sm font-medium">{label}</span>
                        </label>
                      )}
                    </For>
                  </div>
                  <Show when={errors().urgency && touched().urgency}>
                    <span class="text-sm text-red-600 mt-1">{errors().urgency}</span>
                  </Show>
                </div>
              </div>

              {/* Content */}
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Reflection</span>
                </label>
                <textarea
                  name="content"
                  class="textarea textarea-neutral w-full h-32"
                  placeholder="What moved forward? What felt stuck? What did you learn?"
                />
                <Show when={errors().content && touched().content}>
                  <span class="text-sm text-red-600 mt-1">{errors().content}</span>
                </Show>
              </div>

              {/* Category */}
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Category</span>
                </label>
                <select name="category" class="select select-neutral w-full">
                  <option disabled>Select category</option>
                  <For each={CATEGORIES}>
                    {cat => (
                      <option value={cat.value}>{cat.label}</option>
                    )}
                  </For>
                </select>
                <Show when={errors().category && touched().category}>
                  <span class="text-sm text-red-600 mt-1">{errors().category}</span>
                </Show>
              </div>

              {/* Submit */}
              <div class="flex justify-end pt-4">
                <button
                  type="submit"
                  class="btn btn-primary btn-outline"
                  disabled={$journalsLoading() || isSubmitting()}
                >
                  <Show 
                    when={$journalsLoading() || isSubmitting()} 
                    fallback={
                      <>
                        <Icon icon={isEditMode() ? "mdi:content-save-edit" : "mdi:content-save"} width={20} height={20} class="mr-2" />
                        {isEditMode() ? "Update Reflection" : "Save Reflection"}
                      </>
                    }
                  >
                    <span class="loading loading-spinner loading-sm mr-2"></span>
                    {isEditMode() ? "Updating..." : "Saving..."}
                  </Show>
                </button>
              </div>
            </Show>
          </Show>

          {/* Global Errors */}
          <Show when={$journalsError()}>
            <div class="alert alert-error mt-4">
              <Icon icon="mdi:alert-circle" width={20} height={20} />
              <span>{($journalsError() as any)?.message || 'Save failed'}</span>
            </div>
          </Show>
        </form>
      </Show>
    </section>
  );
}
