<template>
  <v-app>
    <v-container>
      <v-main>
        <v-row align="center">
          <v-col cols="12" class="text-center">
            <header>
              <h1>NOT Gemini</h1>
              <p>Gemini Real-time Demo, but with <b>GPT-4 Vision</b></p>
            </header>
          </v-col>
          <v-col cols="12" class="text-center">
            <SMTDWebcam ref="webcamComponent" :debug="debugImages" />

            <SMTDResponder
              :finalSpeechText="finalSpeechText"
              :compositeImageUrl="compositeImageUrl"
              :use-openai-tts="useOpenaiTTS"
              :api-key="apiKey"
              :lang="languageCode"
              @tts-finished="handleTtsFinished"
            />
            <p class="mt-4 text-subtitle-1" v-if="!isApiKeyValid()">
              Please first enter a valid OpenAI API Key below.
            </p>
            <div v-if="isApiKeyValid()">
              <SMTDSpeech
                @final-speech="handleFinalSpeech"
                :disabled="!started || requestInFlight"
                :lang="languageCode"
              />
              <v-btn
                @click="started = !started"
                prepend-icon
                :loading="requestInFlight"
                variant="outlined"
              >
                <v-icon :icon="started ? mdiStop : mdiPlay" />
                {{ started ? 'Stop' : 'Start' }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-main>
      <v-footer app class="align-end d-flex justify-center justify-sm-end">
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="apiKey"
              label="OpenAI API Key"
              variant="underlined"
              type="password"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <SMTDLanguageSelector @language-selected="handleLanguageSelected" />
          </v-col>
          <v-col cols="12" sm="4" class="d-block align-start">
            <v-switch
              color="primary"
              v-model="useOpenaiTTS"
              label="OpenAI TTS"
              class="mr-2 d-inline-block"
            ></v-switch>
            <v-switch
              color="primary"
              v-model="debugImages"
              label="Debug Images"
              class="d-inline-block"
            ></v-switch>
          </v-col>
        </v-row>
      </v-footer>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mdiPlay, mdiStop } from '@mdi/js'

import SMTDWebcam from '@/components/Webcam/SMTD-Webcam.vue'
import SMTDSpeech from '@/components/Speech/SMTD-Speech.vue'
import SMTDResponder from '@/components/Responder/SMTD-Responder.vue'
import SMTDLanguageSelector from '@/components/LanguageSelector/SMTD-LanguageSelector.vue'

const finalSpeechText = ref('')
const compositeImageUrl = ref('')
const webcamComponent = ref(null)
const requestInFlight = ref(false)
const started = ref(false)
const apiKey = ref('')
const useOpenaiTTS = ref(false)
const debugImages = ref(false)
const languageCode = ref('en')

const handleFinalSpeech = (text) => {
  requestInFlight.value = true
  finalSpeechText.value = text
  if (webcamComponent.value) {
    compositeImageUrl.value = webcamComponent.value.getCompositeImage()
  }
}

const handleLanguageSelected = ({ name, code }) => {
  languageCode.value = code
}

const handleTtsFinished = (e) => {
  requestInFlight.value = false
}

const isApiKeyValid = () => apiKey.value.length == 51 && apiKey.value.startsWith('sk-')
</script>

<style scoped>
header {
  line-height: 1.5;
  margin-bottom: 40px;
  text-align: center;
}
</style>
