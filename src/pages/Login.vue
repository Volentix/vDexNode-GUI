<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-vblack">
        <div class="row background-gradient window-height items-center">
          <div class="col-xs-12 col-sm-12 col-md col-lg text-center q-pa-xl">
            <img src="@/statics/icons/icon-512x512.png" style="height: 150px; max-width: 150px">
            <div class="text-h5 text-vdark"><span class="text-weight-bolder">vDexNode</span> dashboard </div>
            <q-badge color="vdark" class="" text-color="vgrey" align="middle" transparent>{{ version }}</q-badge>
            <div class="text-subtitle1 text-vdark">Rent your computer to earn VTX</div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md col-lg q-pa-xl">
            <div class="text-h5">Import private key</div>
            <div class="text-subtitle2">Please enter your private key below to start working with vDexNode Dashboard. We will never save or transmit your your key.</div>
            <q-form @submit="login()">
              <q-input dense v-model="privateKey" :type="isPwd ? 'password' : 'text'" counter color="vdark" ref="input" @keyup.enter="login" label="Your private key" :rules="[ val => val.length <= 51 || 'Wrong key']">
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                </template>
              </q-input>
              <q-btn color="vdark" :disabled="privateKey ? false: true" unelevated rounded :outline="privateKey ? false: true" class="full-width q-mt-md" label="Continue" type="submit" />
            </q-form>
            <q-btn flat round color="vdark" class="fixed-top-right q-ma-sm" icon="fas fa-link" @click="$utils.openExternal('https://volentix.io/')" />
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
      version: ''
    }
  },
  mounted () {
    this.version = this.$utils.getVersion()
    this.$refs.input.focus()
    this.updater()
  },
  methods: {
    login () {
      this.$utils.login(this.privateKey)
      this.privateKey = ''
    },
    async scatterLogin () {
      this.$utils.scatterLogin()
    },
    updater () {
      // TODO: Update
      // ipcRenderer.on('message', (event, data) => {
      //   this.$userResult(data)
      // })
    }
  }
}
</script>
