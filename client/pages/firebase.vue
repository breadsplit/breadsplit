<template lang="pug">
.firebase
  v-card.pa-2.ma-2
    v-subheader Sign up
    v-text-field(v-model='email', label='Email', name='email')
    v-btn(@click='submitSignup') Sign Up
    v-btn(@click='submitLogin') Login
    v-btn(@click='submitLogout') Logout

  v-card.pa-2.ma-2
    v-subheader User
    span {{user.email}}

  v-card.pa-2.ma-2
    v-btn(@click='fetchGroups') Fetch
    v-btn(@click='addGroup') Add Group

    p {{groups}}

</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { auth, db } from '../plugins/firebase'
import randomstr from '../utils/randomstr'

@Component
export default class extends Vue {
  email = 'a@gmail.com'
  user = { uid: null }
  groups: any[] = []

  async submitSignup() {
    const email = this.email
    const password = `${email}:${email}`
    const cred = await auth.createUserWithEmailAndPassword(email, password)
    this.user = cred.user
    this.fetchGroups()
  }

  async submitLogin() {
    const email = this.email
    const password = `${email}:${email}`
    const cred = await auth.signInWithEmailAndPassword(email, password)
    this.user = cred.user
    this.fetchGroups()
  }

  async submitLogout() {
    await auth.signOut()
    this.user = { uid: null }
    this.groups = []
  }

  fetchGroups() {
    db
      .collection('groups')
      .where('members', 'array-contains', this.user.uid)
      .onSnapshot((snap) => {
        this.groups = snap.docs.map(d => ({ id: d.id, data: d.data() }))
      })
  }

  async addGroup() {
    await db.collection('groups').doc(randomstr(5)).set({
      members: [this.user.uid],
      memberAttrs: {
        [this.user.uid]: {
          level: 'owner',
        },
      },
    })
  }
}
</script>
