<template>
  <v-app>
    <v-app-bar app color="#ff9800" flat>
      <v-container class="py-0 fill-height">
        <v-avatar class="mr-10" color="grey darken-1" size="32">
          <img src="./assets/profile_akari_square.png" />
        </v-avatar>

        <b>AkariSync</b>
        <v-spacer />
        <v-tooltip v-if="!$vuetify.theme.dark" bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" @click="darkMode" outlined fab small>
              <v-icon class="mr-1">mdi-moon-waxing-crescent</v-icon>
            </v-btn>
          </template>
          <span>Dark Mode On</span>
        </v-tooltip>

        <v-tooltip v-else bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" @click="darkMode" outlined fab small>
              <v-icon color="yellow">mdi-white-balance-sunny</v-icon>
            </v-btn>
          </template>
          <span>Dark Mode Off</span>
        </v-tooltip>
      </v-container>
    </v-app-bar>
    <v-main class="grey lighten-3">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class App extends Vue {
  $vuetify: any;

  darkMode() {
    this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
  }
}
</script>
