<template lang="pug">
p {{members}}
</template>

<script>
import MemberMixin from '~/mixins/member'

export default {
  mixins: [MemberMixin],
}
</script>
