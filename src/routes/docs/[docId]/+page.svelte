<script lang="ts">
  import { onMount } from "svelte";
  import type { PageProps } from "./$types";

  import { api } from "$lib/client/state.svelte";

  let { data }: PageProps = $props();

  let value = $state<string>();
  api.onMessage((msg) => {
    value = msg;
  });

  onMount(() => {
    api.enterDocument({ id: data.docId });
    return () => {
      api.exitDocument({ id: data.docId });
    };
  });
</script>

<main class="flex h-full w-full flex-col gap-4 p-4">
  <header class="flex w-full flex-row items-center justify-center">
    <a
      href="../"
      class="bg-ctp-mantle flex w-24 items-center justify-center place-self-start rounded-md p-2"
      >Back</a
    >

    <h1>
      {data.docId}
    </h1>
  </header>

  <textarea
    class="focus:border-ctp-blue border-ctp-overlay0 h-full w-full resize-none rounded-xl border-2 p-2 outline-none"
    bind:value
    oninput={(e) => {
      api.updateDocument({ id: data.docId }, e.target?.value as string);
    }}
  ></textarea>
</main>
