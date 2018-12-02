<template>
<v-dialog v-model="dialog" persistent max-width="600px">
  <v-btn slot="activator" color="primary" dark>Add Canvasser</v-btn>
  <v-container>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="firstname"
      :rules="nameRules"
      label="First Name"
      required
    ></v-text-field><v-text-field
      v-model="lastname"
      :rules="nameRules"
      label="Last Name"
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
    <v-dialog ref="picker" v-model="picker" :return-value.sync="dates" min-width="290px" :rules="dateRules">
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
  </v-form>
  </v-container>
</v-dialog>
</template>

<script>
import SystemAdmin from '@/services/SystemAdmin'

  export default {
    data: () => ({
      valid: true,
      firstname: '',
      lastname: '',
      email: '',
      username: '',
      password: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      dates: [],
      picker: false
    }),

    methods: {
      submit() {
        this.dialog = false;
        var canvasser = {firstname: this.firstname, lastname: this.lastname, email: this.email, username: this.username, password: this.password, dates: this.dates};
      }
    }
  }
</script>