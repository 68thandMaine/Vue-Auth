<template>
  <div>
    <h4>Register</h4>
    <form>
      <label for'name'>Name</label>
      <div>
        <input id='name' type='text' v-model='name' required autofocus>
      </div>
      <label for='email'>Email</label>
      <div>
        <input id='email' type='email' v-model='email' required>
      </div>
      <label for='password'>Password</label>
      <div>
        <input id='password' type='password' v-model='password' required>
      </div>
      <label for='confirm-password'>Confirm Password</label>
      <div>
        <input id='confirm-password' type='password' v-model='confirm_password' required>
      </div>
      <div>
        <select v-model='is_admin'>
          <option value=1>Yes</option>
          <option value=0>No</option>
        </select>
      </div>

      <div>
        <button type='submit' @click.prevent='handleSubmit'>Register</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: ['nextURL'],
  data(){
    name: '',
    email: '',
    password: '',
    confirm_password: '',
  }
}
</script>

<style></style>
