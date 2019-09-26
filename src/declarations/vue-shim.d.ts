// Ensures vue files can be read by TSC
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
