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
    is_admin: null,
  },
  methods: {
    handleSubmit(){
      if(this.password === this.confirm_password && this.password.length > 0)
      {
        let url = 'http://localhost:3000/register'
        if(this.is_admin != null || this.is_admin == 1) url ='http://localhost:3000/register-admin'
        this.$http.post(url,{
          name: this.name,
          email: this.email,
          password: this.password,
          is_admin: this.is_admin,
        })
        .then(response => {
          localStorage.setItem('user', JSON.stringify(response.data.user))
          localStorage.setItem('jwt', response.data.token)

          if(localStorage.getItem('jwt') != null){
            this.$emit('loggedIn')
            if(this.$route.params.nextUrl != null){
              this.$router.push(this.$route.params.nextUrl)
            } else {
              this.$router.push('/')
            }
          }
        })
        .catch(error =>{
          console.error(error)
        });
      } else {
        this.password = ''
        this.confirmPassword = ''
        return alert('passwords do not match')
      }
    }
  }
}
</script>

<style></style>

