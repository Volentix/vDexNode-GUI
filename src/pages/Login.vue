<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-vblack">
        <q-icon name="fas fa-angle-right" class="text-vgreen fixed-center" style="font-size: 5rem;" />
        <div class="row">
          <div class="col bg-vblack window-height q-pa-xl text-center">
            <q-img src="statics/icons/icon-512x512.png" spinner-color="vgrey" style="height: 150px; max-width: 150px" />
            <div class="text-h5 text-vgrey"><span class="text-weight-bolder">vDexNode</span> dashboard</div>
            <div class="text-subtitle1 text-vgrey">Rent your computer to earn VTX</div>
          </div>
          <div class="col bg-vgrey window-height q-pa-xl">
            <div class="text-h5">Import private key</div>
            <div class="text-subtitle2">Please enter your private key below to start working with vDexNode Dashboard. We will never save or transmit your your key.</div>
            <q-input dense v-model="privateKey" :type="isPwd ? 'password' : 'text'" counter color="vdark" ref="input" @keyup.enter="updatePrivate" >
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
              </template>
            </q-input>
            <q-btn color="black" unelevated rounded outline class="full-width q-mt-md" label="Continue" @click="login" />
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
      privateKey: '',
      isPwd: true
    }
  },
  mounted () {
    this.$refs.input.focus()
  },
  methods: {
    login () {
      this.$utils.login(this.privateKey)
      this.privateKey = ''
    }
  }
}
</script>
