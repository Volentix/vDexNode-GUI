<template>
  <q-layout>
    <div class="titlebar"></div>
    <q-page-container>
      <q-page class="bg-vblack q-pa-lg">
        <div class="row text-center items-center q-pa-xl">
          <div class="col">
            <div class="text-vgrey text-uppercase text-h1 q-pa-xl">Not found</div>
            <q-btn outline rounded color="vgreen" class="q-mx-xs" label="Go Home" to="/" />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
/**
 * Error handler
 */
export default {
  name: 'Error404'
}
</script>
