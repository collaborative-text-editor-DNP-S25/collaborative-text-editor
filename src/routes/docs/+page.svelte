<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  import { api } from "$lib/client/state.svelte";
  import { type DocumentId } from "$lib/server/domain/entities/Document";

  // let text = $state("");

  let documentIds = $state<DocumentId[]>();

  api.onGetAllDocuments((newDocumentIds) => {
    documentIds = newDocumentIds;
  });

  onMount(() => {
    api.getAllDocuments();
  });
</script>

<!-- @typescript-eslint/no-confusing-void-expression -->
{#snippet btn(text: string, callback: () => void)}
  <button
    class="bg-ctp-surface0 hover:bg-ctp-surface1 active:bg-ctp-surface2 h-16 w-32 rounded-md hover:cursor-pointer"
    onclick={callback}
  >
    {text}
  </button>
{/snippet}

<main class="flex h-full w-full flex-col gap-4 p-4">
  <ul class="flex flex-row flex-wrap gap-4">
    {#if documentIds !== undefined}
      {@render btn("Create Document", () => {
        api.createDocument();
        api.getAllDocuments();
      })}

      {#each documentIds as docId, i (i)}
        {@render btn(docId.id, () => void goto(docId.id))}
      {/each}
    {/if}
  </ul>

  <!-- <span
    class="bg-ctp-surface0 h-32 truncate rounded-xl p-2 whitespace-pre-line"
  >
    {text}
  </span>

  <textarea
    class="focus:border-ctp-blue border-ctp-overlay0 h-full w-full resize-none rounded-xl border-2 p-2 outline-none"
    bind:value={text}
  ></textarea> -->
</main>
