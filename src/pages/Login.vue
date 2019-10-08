<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-vblack">
        <div class="row background-gradient window-height items-center">
          <div class="col text-center q-pa-xl">
            <q-img src="statics/icons/icon-512x512.png" spinner-color="vdark" style="height: 150px; max-width: 150px" />
            <div class="text-h5 text-vdark"><span class="text-weight-bolder">vDexNode</span> dashboard</div>
            <div class="text-subtitle1 text-vdark">Rent your computer to earn VTX</div>
          </div>
          <div class="col q-pa-xl">
            <div class="text-h5">Import private key</div>
            <div class="text-subtitle2">Please enter your private key below to start working with vDexNode Dashboard. We will never save or transmit your your key.</div>
            <q-form @submit="login()">
              <q-input dense v-model="privateKey" :type="isPwd ? 'password' : 'text'" counter color="vdark" ref="input" @keyup.enter="login" label="Your private key" :rules="[ val => val.length <= 51 || 'Wrong key']">
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                </template>
              </q-input>
              <q-btn color="black" :disabled="privateKey ? false: true" unelevated rounded outline class="full-width q-mt-md" label="Continue" type="submit" />
            </q-form>
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
