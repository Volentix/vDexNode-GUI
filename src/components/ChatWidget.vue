<template>
  <div class="row">
    <div class="col-4 text-vgrey bg-vdark">
      <q-banner dense class="text-vgrey bg-vdark q-px-md q-pt-md">
        <div class="text-uppercase">Chat</div>
      </q-banner>
      <q-separator dark />
      <q-list>
        <q-item clickable>
          <q-item-section>
            <q-item-label>Item 1</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable>
          <q-item-section>
            <q-item-label>Item 2</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable>
          <q-item-section>
            <q-item-label>Item 3</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div class="col-8 bg-vdarker">
      <div class="column">
        <div class="col scroll q-px-md text-vgrey" style="min-height: 30vh; max-height: 30vh">
          <q-chat-message name="me" bg-color="vgreen" :text="['hey, how are you?']" sent />
          <q-chat-message name="Support" bg-color="vdark" text-color="white" :text="['doing fine, how r you?']" />
          <q-chat-message name="me" bg-color="vgreen" :text="['hey, how are you?']" sent />
          <q-chat-message name="Support" bg-color="vdark" text-color="white" :text="['doing fine, how r you?']" />
          <q-chat-message name="me" bg-color="vgreen" :text="['hey, how are you?']" sent />
          <q-chat-message name="Support" bg-color="vdark" text-color="white" :text="['doing fine, how r you?']" />
          <q-chat-message name="me" bg-color="vgreen" :text="['hey, how are you?']" sent />
          <q-chat-message name="Support" bg-color="vdark" text-color="white" :text="['doing fine, how r you?']" />
        </div>
        <div class="col q-px-md q-my-md">
          <q-input dense rounded outlined dark color="vgreen">
            <template v-slot:after>
              <q-btn round dense flat icon="send" />
            </template>
          </q-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatWidget',
  data () {
    return {}
  },
  mounted () {},
  watch: {},
  methods: {} // end of methods
}
</script>

<style scoped>
</style>
