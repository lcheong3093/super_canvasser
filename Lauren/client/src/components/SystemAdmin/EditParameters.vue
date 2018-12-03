<template>
  <v-dialog v-model="dialog" :close-on-content-click="false" persistent max-width="600px">
    <v-btn slot="activator" color="primary" dark>Edit Parameters</v-btn>
    <v-card>
    <v-container>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="duration"
          :rules="numberRules"
          label="Duration"
          required
        ></v-text-field>
        <v-text-field
          v-model="speed"
          :rules="numberRules"
          label="Speed"
          required
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn :disabled="!valid" @click="submit">submit</v-btn>
        <v-btn @click="clear">clear</v-btn>
        <v-btn @click="dialog = false">cancel</v-btn>
      </v-form>
    </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import SystemAdmin from '@/services/SystemAdmin'

  export default {
    data: () => ({
      valid: true,
      duration: '',
      speed: '',
      numberRules: [
        v => !!v || 'Please enter desired amount'
      ],
      dialog: false
    }),

    methods: {
      async submit() {
        this.dialog = false;
        var parameter = {duration: this.duration, speed: this.speed};
        console.log(parameter);
        var resp = (await SystemAdmin.edit_parameters(parameter)).data;
        console.log(resp);
      },
      clear() {
        this.$refs.form.reset();
        this.error = false;
      }
    }
  }
</script>