<template>
  <q-layout>
    <div class="titlebar"></div>
    <q-page-container>
      <q-page class="bg-vblack q-pa-lg">
        <!-- TopBar -->
        <div class="row bg-vdark items-center q-mb-lg titilium">
          <div class="col q-py-sm q-px-md">
            <div class="text-h6 text-uppercase text-vgrey titilium">
              <span class="text-weight-bolder">vdexnode</span> dashboard
              <q-badge color="vpurple" class="q-mx-sm" text-color="vblack" align="top" transparent>{{ version }}</q-badge>
            </div>
          </div>
          <div class="col-5 q-py-sm q-px-sm">
            <div class="row justify-end">
              <q-btn outline rounded color="vgreen" class="q-mx-xs" label="Home" to="/" />
              <q-btn outline rounded color="vpurple" class="q-mx-xs" label="Logout" @click="$utils.logout()" />
            </div>
          </div>
        </div>
        <!-- Settings -->
        <q-banner dense inline-actions class="text-vdark bg-vpurple">Settings page is under development.</q-banner>
        <div class="row q-col-gutter-x-lg q-mb-lg titilium">
          <div class="col-5">
            <q-banner dense class="text-vgrey bg-vdark q-pa-md">
              <div class="text-subtitle2 text-uppercase">Settings</div>
            </q-banner>
            <q-list dense separator class="bg-vdark text-vgrey q-px-md">
              <q-item>
                <q-item-section>
                  <q-item-label>EOS endpoint</q-item-label>
                  <q-item-label caption class="code text-vgreen">test</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn rounded outline color="vgreen" label="Edit" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>vDexNode gateway</q-item-label>
                  <q-item-label caption class="code text-vgreen">test</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn rounded outline color="vgreen" label="Edit" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data () {
    return {
      version: ''
    }
  },
  mounted () {
    this.version = this.$utils.getVersion()
  },
  methods: {}
}
</script>
