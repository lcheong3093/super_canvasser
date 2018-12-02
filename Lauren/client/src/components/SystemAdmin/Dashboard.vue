<template>
  <v-layout row wrap>
    <v-flex xs12>
      <edit-parameters></edit-parameters>
      <v-data-table
        :headers="headers"
        :items="canvassers"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-right">{{ props.item.Name }}</td>
          <td class="text-xs-right">{{ props.item.Username }}</td>
          <td class="text-xs-right">{{ props.item.Email }}</td>
          <td class="text-xs-right">{{ props.item.Availability }}</td>
        </template>
      </v-data-table>
      
      <add-canvasser-form></add-canvasser-form>
    </v-flex>

    <v-flex xs12>
      <v-data-table
        :headers="headers"
        :items="managers"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-right">{{ props.item.Name }}</td>
          <td class="text-xs-right">{{ props.item.Username }}</td>
          <td class="text-xs-right">{{ props.item.Email }}</td>
        </template>
      </v-data-table>
      <add-manager-form></add-manager-form>
    </v-flex>
    
    <v-flex xs12>
      <v-data-table
        :headers="headers"
        :items="admins"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-right">{{ props.item.Name }}</td>
          <td class="text-xs-right">{{ props.item.Username }}</td>
          <td class="text-xs-right">{{ props.item.Email }}</td>
        </template>
      </v-data-table>
      <add-admin-form></add-admin-form>
    </v-flex>
  </v-layout>
</template>

<script>
import SystemAdmin from '@/services/SystemAdmin'
import AddCanvasserForm from '@/components/SystemAdmin/AddCanvasser'
import AddManagerForm from '@/components/SystemAdmin/AddManager'
import AddAdminForm from '@/components/SystemAdmin/AddAdmin'
import EditParameters from '@/components/SystemAdmin/EditParameters'

export default {
  components: {
    AddCanvasserForm,
    AddManagerForm,
    AddAdminForm,
    EditParameters
  },
  data () {
    return {
      headers: [
        { text: 'Name', value: 'Name' },
        { text: 'Username', value: 'Username' },
        { text: 'Email', value: 'Email' },
        { text: 'Availability', value: 'Availability' }
      ],
      canvassers: [],
      managers: [],
      admins: []
    }
  },
  async mounted () {
    var data = (await SystemAdmin.get_users()).data;
    this.canvassers = data.Canvasser;
    this.managers = data.Manager;
    this.admins = data.SystemAdmin;
  }
}
</script>