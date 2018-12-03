<template>
  <v-dialog v-model="dialog" :close-on-content-click="false" persistent max-width="600px">
    <v-btn slot="activator" color="primary" dark>Add System Admin</v-btn>
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
        <v-spacer></v-spacer>
        <v-btn :disabled="!valid" @click="submit">submit</v-btn>
        <v-btn @click="clear">clear</v-btn>
        <v-btn @click="dialog = false">cancel</v-btn>
      </v-form>
    </v-container>
    <v-alert :value="error" type="error"> {{ err_msg }} </v-alert>
    <v-alert :value="success" type="success">System Admin was added</v-alert>
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
        var admin = {name: this.name, email: this.email, username: this.username, password: this.password, role: "SystemAdmin"};
        var resp = (await SystemAdmin.add_user(admin)).data;
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