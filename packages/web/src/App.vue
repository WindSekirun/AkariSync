<template>
  <v-app>
    <v-app-bar app color="orange" flat>
      <v-container class="py-0 fill-height">
        <v-avatar class="mr-10" color="grey darken-1" size="32">
          <img src="./assets/profile_akari_square.png" />
        </v-avatar>

        <b><font color="#ffffff">AkariSync</font></b>
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
    <v-main :class="mainClass">
      <v-container fluid>
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

  get mainClass() {
    if (this.$vuetify.theme.dark) {
      return "lighten-3";
    } else {
      return "grey lighten-3";
    }
  }

  mounted() {
    this.$vuetify.theme.dark = window.localStorage.darkMode == "true";
  }

  darkMode() {
    this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    window.localStorage.darkMode = this.$vuetify.theme.dark.toString();
  }
}
</script>
