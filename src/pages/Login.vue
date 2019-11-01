<template>
  <q-layout>
    <div class="titlebar"></div>
    <q-page-container>
      <q-page class="bg-vdark text-vgrey titilium">
        <div class="fixed-top-right q-pa-xl">
          <q-btn flat round color="vgrey" class="q-mx-xs" icon="fas fa-sliders-h" to="/settings" />
          <q-btn flat round color="vgrey" class="q-mx-xs" icon="fas fa-link" @click="$utils.openExternal('https://volentix.io/')" />
        </div>
        <div class="fixed-top-left row q-pa-xl">
          <img src="@/statics/icons/logo.png" style="height: 32px; max-width: 32px" />
          <div class="text-weight-bolder text-uppercase q-px-sm text-h6">Volentix Node</div>
        </div>
        <div class="row window-height items-center q-pa-xl">
          <div class="col-5 text-center q-pa-xl">
            <img src="@/statics/icons/icon-512x512.png" style="height: 250px; max-width: 250px" />
            <div class="text-h5 text-vgrey">
              <span class="text-weight-bolder">Volentix Node</span> Control Panel
              <q-badge color="vgold" class text-color="vdark" align="top" transparent>{{ version }}</q-badge>
            </div>
            <div class="q-mt-lg" v-show="progress > 0 && progress < 1">
              <q-linear-progress :value="progress" rounded color="vgold" track-color="vdarkgrey" style="height: 20px" />
              <div class="text-subtitle1 text-vgrey">Update downloading: {{ Math.round(progress*100) }} %</div>
            </div>
          </div>
          <div class="col-7 q-pa-xl">
            <div class="text-h5">Import private key</div>
            <div class="text-subtitle2">Please enter your private key below to start working with vDexNode Dashboard. We will never save or transmit your your key.</div>
            <q-form @submit="login()">
              <q-input dark dense v-model="privateKey" :type="isPwd ? 'password' : 'text'" counter color="vgold" ref="input" @keyup.enter="login" label="Your private key" :rules="[ val => val.length <= 51 || 'Wrong key']">
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                </template>
              </q-input>
              <q-btn color="vgrey" :disabled="privateKey ? false: true" rounded class="full-width q-mt-md text-vdark" label="Continue" type="submit" />
            </q-form>
            <!-- <q-btn outline rounded unelevated color="vdark" class="" label="Scatter" @click="scatterLogin()" /> -->
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
const ipcRenderer = require('electron').ipcRenderer

export default {
  data () {
    return {
      privateKey: '',
      isPwd: true,
      version: '',
      progress: 0
    }
  },
  mounted () {
    this.version = this.$utils.getVersion()
    this.$refs.input.focus()
    this.updater()
  },
  methods: {
    login () {
      this.$configManager.login(this.privateKey)
      this.privateKey = ''
    },
    async scatterLogin () {
      this.$configManager.scatterLogin()
    },
    updater () {
      // TODO: Update
      ipcRenderer.on('error', (event, data) => {
        this.$userError(data, 'Auto updater')
      })
      ipcRenderer.on('notification', (event, data) => {
        this.$userResult(data)
      })
      ipcRenderer.on('message', (event, data) => {
        this.progress = data / 100
      })
    }
  }
}
</script>
