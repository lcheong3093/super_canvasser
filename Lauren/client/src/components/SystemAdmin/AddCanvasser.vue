<template>
  <v-dialog v-model="dialog" :close-on-content-click="false" persistent max-width="600px">
    <v-btn slot="activator" color="primary" dark>Add Canvasser</v-btn>
    <v-card>
    <v-container>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="name"
          :rules="nameRules"
          label="Name"
          required
        ></v-text-field>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email"
          required
        ></v-text-field>
        <v-text-field
          v-model="username"
          :rules="nameRules"
          label="Username"
          required
        ></v-text-field>
        <v-text-field
          v-model="password"
          :rules="[v => !!v || 'Password is required']"
          type="password"
          label="Password"
          required
        ></v-text-field>
        <v-dialog ref="picker" v-model="picker" :close-on-content-click="false" :return-value.sync="dates" min-width="290px">
          <v-combobox slot="activator" v-model="dates" multiple chips small-chips label="Available Dates" append-icon="event"></v-combobox>
          <v-date-picker v-model="dates" multiple no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="picker = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.picker.save(dates)">OK</v-btn>
          </v-date-picker>
        </v-dialog>
        <v-spacer></v-spacer>
        <v-btn :disabled="!valid" @click="submit">submit</v-btn>
        <v-btn @click="clear">clear</v-btn>
        <v-btn @click="dialog = false">cancel</v-btn>
      </v-form>
    </v-container>
    <v-alert :value="error" type="error"> {{ err_msg }} </v-alert>
    <v-alert :value="success" type="success">Canvasser was added</v-alert>
    </v-card>
  </v-dialog>
</template>

<script>
import SystemAdmin from '@/services/SystemAdmin'

  export default {
    data: () => ({
      valid: true,
      name: '',
      email: '',
      username: '',
      password: '',
      nameRules: [
        v => !!v || 'Name is required',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      dates: [],
      picker: false,
      dialog: false,
      error: false,
      err_msg: '',
      success: false
    }),

    methods: {
      async submit() {
        this.error = false;
        var canvasser = {name: this.name, email: this.email, username: this.username, password: this.password, dates: this.dates, role: "Canvasser"};
        var resp = (await SystemAdmin.add_user(canvasser)).data;
        console.log(resp);
        if(resp.error != ''){
          this.err_msg = resp.error;
          this.error = true;
        }else{
          this.success = true;
          this.dialog = false;
        }
      },
      clear() {
        this.$refs.form.reset();
        this.error = false;
      }
    }
  }
</script>