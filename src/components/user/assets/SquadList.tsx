import { createEffect, For, Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { squadStore } from '../../../stores/userAssets';

const SquadList = () => {
    const $squad = useStore(squadStore);

    return (
        <section class="w-full my-8 ">
            <h3>Your Squad</h3>
            <ul class="list bg-base-100 rounded-box shadow-md">
                <For each={$squad()}>
                    {(squad) => (
                        <li class="list-row">
                            <div>
                                <div>{squad.name || 'No Name'}</div>
                                <div class="text-xs opacity-60">{squad.email}</div>
                            </div>
                            <div class="text-xs uppercase font-semibold opacity-60">
                                {squad.relationship || 'No relationship specified'}
                            </div>
                            <div>
                                <span class={`badge badge-sm ${squad.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                                    {squad.status || 'pending'}
                                </span>
                            </div>
                            <button class="btn btn-square btn-ghost">
                                <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor">
                                        <path d="M6 3L20 12 6 21 6 3z"></path>
                                    </g>
                                </svg>
                            </button>
                            <button class="btn btn-square btn-ghost">
                                <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor">
                                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                                    </g>
                                </svg>
                            </button>
                        </li>
                    )}
                </For>
            </ul>

            <Show when={$squad().length === 0}>
                <div class="flex justify-center items-center text-sm opacity-60">
                    No squad members found
                </div>
            </Show>

        </section>
    );
};

export default SquadList;