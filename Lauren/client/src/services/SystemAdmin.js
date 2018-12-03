import Api from '@/services/Api'

export default {
    get_users() {
        return Api().get('users');
    },

    add_user(user) {
        return Api().post('add_user', user);
    },

    edit_parameters(parameter) {
        return Api().post('edit_parameters', parameter);
    }
  }